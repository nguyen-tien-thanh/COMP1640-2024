const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const Faculty = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String, maxLength: 255, required: true },
    image: { type: String, default: null },
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

Faculty.pre("save", async function (next) {
  try {
    const roleId = "65e21288729a968a44048cbb"; // Marketing Coordinator

    // Check if the user has the required role
    const user = await this.model("User").findOne({ _id: this.user });
    if (!user || user.role != roleId) {
      return next(new Error("User should be Marketing Coordinator"));
    }

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Faculty", Faculty);
