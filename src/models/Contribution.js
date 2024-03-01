const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const Contribution = new mongoose.Schema(
  {
    magazine_id: { type: mongoose.Schema.Types.ObjectId, ref: "Magazine" },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: { type: String, maxLength: 255 },
    content: { type: String, maxLength: 255 },
    files: [{ type: String }],
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
