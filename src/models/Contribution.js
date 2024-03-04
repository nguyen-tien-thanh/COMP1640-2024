const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const Contribution = new mongoose.Schema(
  {
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, maxLength: 255, required: true },
    files: [{ type: String }],
    isPublished: { type: Boolean, default: false, require: true },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  {
    timestamps: true,
  }
);

Contribution.plugin(mongooseDelete, {
  overrideMethods: "all",
  deletedAt: true,
});

module.exports = mongoose.model("Contribution", Contribution);
