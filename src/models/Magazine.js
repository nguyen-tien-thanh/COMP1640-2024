const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
const mongooseDelete = require("mongoose-delete");

const Magazine = new mongoose.Schema(
  {
    faculty_id: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" },
    name: { type: String, maxLength: 255, required: true },
    description: { type: String, maxLength: 255 },
    closureDate: { type: Date, required: true },
    slug: { type: String, slug: "name", unique: true },
  },
  {
    timestamps: true,
  }
);

Magazine.plugin(mongooseDelete, {
  overrideMethods: "all",
  deletedAt: true,
});

mongoose.plugin(slug);

module.exports = mongoose.model("Magazine", Magazine);
