const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const Comment = new mongoose.Schema(
  {
    // contribution: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Contribution",
    // },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, maxLength: 255, required: true },
  },
  {
    timestamps: true,
  }
);

Comment.plugin(mongooseDelete, {
  overrideMethods: "all",
  deletedAt: true,
});

module.exports = mongoose.model("Comment", Comment);
