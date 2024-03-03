const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const User = new mongoose.Schema(
  {
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      default: "65e21312729a968a44048cbd", // Guest
    },
    faculty: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" },
    name: { type: String, maxLength: 255, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    address: { type: String, maxLength: 255, default: null },
    gender: { type: Number, default: 2 },
    avatar: { type: String, default: "avatar-default.jpg" },
    phone: { type: String, maxLength: 12, default: null },
    birthday: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

User.plugin(mongooseDelete, {
  overrideMethods: "all",
});

module.exports = mongoose.model("User", User);
