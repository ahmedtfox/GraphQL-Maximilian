const User = require("../model/user");
const { isEmail, isEmpty, isLength } = require("validator");

const createUser = async (args, req) => {
  const userInput = args.userInput;
  const email = userInput.email;
  const password = userInput.password;
  const name = userInput.name;

  let errors = [];
  if (!isEmail(email)) {
    errors.push("Email is invalid");
  }

  if (!isEmpty(password)) {
    errors.push("please input a password");
  }

  if (!isLength(password, { min: 5 })) {
    errors.push("Email is too short!");
  }
  try {
    if (errors.length > 0) {
      const error = new Error("Invalid Input.");
      console.log(errors);
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
  } catch (error) {
    console.log(error);
  }
};
module.exports = { createUser };
