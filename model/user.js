const mongoose = require("mongoose");
const schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const userSchema = new schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    status: {
      type: Object,
      default: "i am new",
    },
    posts: [{ type: schema.Types.ObjectId, ref: "Post" }],
  },
  {
    timestamps: false,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  const result = await bcrypt.compare(candidatePassword, this.password);
  if (result === true) {
    return "password correct";
  } else {
    return "password incorrect";
  }
};

//Create Token
userSchema.methods.generateToken = function (tokenPayload) {
  const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
  const EXPIRE_TOKEN = process.env.EXPIRE_TOKEN;
  const token = jwt.sign(tokenPayload, JWT_SECRET_KEY, {
    expiresIn: EXPIRE_TOKEN,
  });

  return token;
};

const Model = mongoose.model("User", userSchema);
module.exports = Model;
