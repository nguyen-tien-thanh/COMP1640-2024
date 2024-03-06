const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const Faculty = new mongoose.Schema(
  {
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    coordinator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String, maxLength: 255, required: true },
    image: { type: String, default: "icon-image.png" },
    description: { type: String, maxLength: 255 },
    closureDate: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

Faculty.plugin(mongooseDelete, {
  overrideMethods: "all",
  deletedAt: true,
});

module.exports = mongoose.model("Faculty", Faculty);
