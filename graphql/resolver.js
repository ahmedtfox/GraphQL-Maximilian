const User = require("../model/user");
const { isEmail, isEmpty, isLength } = require("validator");

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

module.exports = { createUser, login };
