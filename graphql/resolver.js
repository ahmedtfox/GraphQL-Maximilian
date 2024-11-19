const User = require("../model/user");
const createUser = async (args, req) => {
  const userInput = args.userInput;
  const email = userInput.email;
  const password = userInput.password;
  const name = userInput.name;
  try {
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
