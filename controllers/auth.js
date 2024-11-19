const User = require("../model/user");
const jwt = require("jsonwebtoken");
const asyncWrapper = require("../middlewares/asyncWrapper");

exports.signup = (req, res, next) => {
  asyncWrapper(next, async () => {
    const email = req.body.email;
    const passwordText = req.body.password;
    const name = req.body.name;

    const checkEmail = await User.findOne({ email });
    if (checkEmail) {
      const err = new Error("this email already exist");
      err.statusCode = 422;
      throw err;
    }
    // const password = await bcrypt.hash(passwordText, 12);
    password = passwordText;
    const newUser = new User({
      email,
      password,
      name,
    });

    const result = await newUser.save();
    res.status(201).json({
      message: "user created successfully!",
      post: result,
    });
  });
};

exports.login = (req, res, next) => {
  asyncWrapper(next, async () => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({ email });
    if (!user) {
      const err = new Error("user not exist");
      err.statusCode = 401;
      throw err;
    }
    checkPassword = await user.comparePassword(password);
    if (!checkPassword) {
      const err = new Error("password not correct");
      err.statusCode = 401;
      throw err;
    }

    const userId = user._id.toString();
    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
    const EXPIRE_TOKEN = process.env.EXPIRE_TOKEN;

    const token = jwt.sign({ email, userId: userId }, JWT_SECRET_KEY, {
      expiresIn: EXPIRE_TOKEN,
    });

    res.status(200).json({
      message: "logged in  successfully!",
      token,
      userId,
    });
  });
};
