const mongoose = require("mongoose");

const Comment = moongose.Schema(
  {
    contribution_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contribution",
    },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: { type: String, maxLength: 255, required: true },
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
