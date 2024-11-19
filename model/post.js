const mongoose = require("mongoose");
const moment = require("moment");
const schema = mongoose.Schema;
const postSchema = new schema(
  {
    title: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    creator: {
      type: schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Or with Moment.js
postSchema.virtual("formattedCreatedAt").get(function () {
  return moment(this.createdAt).format("YYYY-MM-DD HH:mm:ss");
});

postSchema.virtual("formattedUpdatedAt").get(function () {
  return moment(this.updatedAt).format("YYYY-MM-DD HH:mm:ss");
});

const Model = mongoose.model("Post", postSchema);
module.exports = Model;
