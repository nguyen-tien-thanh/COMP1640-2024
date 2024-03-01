const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
const mongooseDelete = require("mongoose-delete");

const User = new mongoose.Schema(
  {
    role_id: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
    faculty_id: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" },
    name: { type: String, maxLength: 255, required: true },
    email: { type: String, required: true },
    address: { type: String, maxLength: 255, default: null },
    gender: { type: Number, default: 2 },
    avatar: { type: String, default: null },
    phone: { type: String, maxLength: 12, default: "0987654321" },
    birthday: { type: Date, default: null },
    slug: { type: String, slug: "name", unique: true },
  },
  {
    timestamps: true,
  }
);

User.plugin(mongooseDelete, {
  overrideMethods: "all",
});

mongoose.plugin(slug);

module.exports = mongoose.model("User", User);
