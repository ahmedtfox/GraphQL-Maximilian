const User = require("../model/user");
const Post = require("../model/post");
const { isEmail, isEmpty, isLength } = require("validator");
const removeFile = require("../middlewares/removeFile");
const createUser = async (args, req) => {
  const userInput = args.userInput;
  const email = userInput.email;
  const password = userInput.password;
  const name = userInput.name;
  let validatorErrors = [];
  if (!isEmail(email)) {
    validatorErrors.push("Email is invalid");
  }

  if (isEmpty(password)) {
    validatorErrors.push("please input a password");
  }

  if (!isLength(password, { min: 5 })) {
    validatorErrors.push("Password is too short!");
  }
  if (validatorErrors.length > 0) {
    const error = new Error("Invalid Input.");
    error.data = validatorErrors;
    error.code = 422;
    throw error;
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error("User exists already!");
    throw error;
  }
  const newUser = new User({ email, name, password });
  const result = await newUser.save();
  return { ...result._doc, _id: result._id.toString() };
};

const login = async (args, req) => {
  const email = args.email;
  const password = args.password;
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("User not found.");
    error.code = 401;
    throw error;
  }
  const checkPassword = await user.comparePassword(password);
  if (checkPassword === "password incorrect") {
    const err = new Error("password not correct");
    err.code = 401;
    throw err;
  }
  const token = user.generateToken({
    userId: user._id.toString(),
    email: user.email,
  });
  return { token, userId: user._id.toString() };
};

const createPost = async (args, context) => {
  const isAuth = context.req.raw.isAuth || false;
  const userId = context.req.raw.userId || "";
  if (isAuth === false) {
    const error = new Error("Not Authenticated!");
    error.code = 401;
    throw error;
  }
  const postInput = args.postInput;
  const title = postInput.title || "";
  const content = postInput.content || "";
  const imageUrl = postInput.imageUrl || "";
  let validatorErrors = [];
  if (!isLength(content, { min: 5 }) || isEmpty(content)) {
    validatorErrors.push("Content is invalid!");
  }
  if (!isLength(title, { min: 5 }) || isEmpty(title)) {
    validatorErrors.push("Title is invalid!");
  }
  if (validatorErrors.length > 0) {
    const error = new Error("Invalid Input.");
    error.data = validatorErrors;
    error.code = 422;
    throw error;
  }
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("Invalid user.");
    error.code = 401;
    throw error;
  }
  const newPost = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: user,
  });
  const result = await newPost.save();
  user.posts.push(result);
  await user.save();
  return {
    ...result._doc,
    _id: result._id.toString(),
    createdAt: result.createdAt.toISOString(),
    updatedAt: result.updatedAt.toISOString(),
  };
};

const posts = async (args, context) => {
  const isAuth = context.req.raw.isAuth || false;
  const userId = context.req.raw.userId || "";
  if (isAuth === false) {
    const error = new Error("Not Authenticated!");
    error.code = 401;
    throw error;
  }
  // pagination
  const page = args.page || 1;
  const perPage = 2;
  const skip = (page - 1) * perPage;
  const totalPosts = await Post.find().countDocuments();
  const rowPosts = await Post.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(perPage)
    .populate("creator");
  const posts = rowPosts.map((post) => {
    return {
      ...post._doc,
      _id: post._id.toString(),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };
  });
  return {
    posts: posts,
    totalPosts: totalPosts,
  };
};

const post = async (args, context) => {
  const isAuth = context.req.raw.isAuth || false;
  const userId = context.req.raw.userId || "";
  if (isAuth === false) {
    const error = new Error("Not Authenticated!");
    error.code = 401;
    throw error;
  }
  const postId = args.id;
  const post = await Post.findById(postId).populate("creator");
  if (!post) {
    const error = new Error("Post not found!");
    error.code = 404;
    throw error;
  }
  return {
    ...post._doc,
    _id: post._id.toString(),
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  };
};

const updatePost = async (args, context) => {
  const isAuth = context.req.raw.isAuth || false;
  const userId = context.req.raw.userId || "";
  if (isAuth === false) {
    const error = new Error("Not Authenticated!");
    error.code = 401;
    throw error;
  }
  const postId = args.id;
  const postInput = args.postInput;
  const title = postInput.title || undefined;
  const content = postInput.content || undefined;
  const imageUrl = postInput.imageUrl || undefined;
  let validatorErrors = [];
  if (content) {
    if (!isLength(content, { min: 5 }) || isEmpty(content)) {
      validatorErrors.push("Content is invalid!");
    }
  }
  if (title) {
    if (!isLength(title, { min: 5 }) || isEmpty(title)) {
      validatorErrors.push("Title is invalid!");
    }
  }
  if (validatorErrors.length > 0) {
    const error = new Error("Invalid Input.");
    error.data = validatorErrors;
    error.code = 422;
    throw error;
  }
  let post = await Post.findById(postId).populate("creator");
  if (!post) {
    const error = new Error("Post not found!");
    error.code = 404;
    throw error;
  }
  if (post.creator._id.toString() !== userId.toString()) {
    const error = new Error("Not authorized!");
    error.code = 404;
    throw error;
  }
  post = await Post.findByIdAndUpdate(
    postId,
    {
      title,
      content,
      imageUrl,
    },
    { new: true }
  );
  return {
    ...post._doc,
    _id: post._id.toString(),
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  };
};

const deletePost = async (args, context) => {
  const isAuth = context.req.raw.isAuth || false;
  const userId = context.req.raw.userId || "";
  if (isAuth === false) {
    const error = new Error("Not Authenticated!");
    error.code = 401;
    throw error;
  }
  const postId = args.id;

  let post = await Post.findById(postId).populate("creator");
  if (!post) {
    const error = new Error("Post not found!");
    error.code = 404;
    throw error;
  }
  if (post.creator._id.toString() !== userId.toString()) {
    const error = new Error("Not authorized!");
    error.code = 404;
    throw error;
  }
  console.log(post.imageUrl);
  removeFile({ filePath: post.imageUrl });
  post = await Post.findByIdAndDelete(postId);
  const user = await User.findById(userId);
  user.posts.pull(postId);
  await user.save();
  return true;
};

const user = async (args, context) => {
  const isAuth = context.req.raw.isAuth || false;
  const userId = context.req.raw.userId || "";
  if (isAuth === false) {
    const error = new Error("Not Authenticated!");
    error.code = 401;
    throw error;
  }
  const user = await User.findById(userId).populate("posts");
  if (!user) {
    const error = new Error("User not found!");
    error.code = 404;
    throw error;
  }
  return {
    ...user._doc,
    _id: user._id.toString(),
  };
};

const updateStatus = async (args, context) => {
  const isAuth = context.req.raw.isAuth || false;
  const userId = context.req.raw.userId || "";
  if (isAuth === false) {
    const error = new Error("Not Authenticated!");
    error.code = 401;
    throw error;
  }
  let user = await User.findById(userId).populate("posts");
  if (!user) {
    const error = new Error("User not found!");
    error.code = 404;
    throw error;
  }
  const newStatus = args.status;
  user.status = newStatus;
  const updatedUser = await user.save();
  return {
    ...updatedUser._doc,
    _id: updatedUser._id.toString(),
  };
};

module.exports = {
  createUser,
  login,
  createPost,
  posts,
  post,
  updatePost,
  deletePost,
  user,
  updateStatus,
};
