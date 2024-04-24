const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const AcademicYear = new mongoose.Schema(
  {
    year: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  { timestamps: true }
);

AcademicYear.plugin(mongooseDelete, {
  overrideMethods: "all",
  deletedAt: true,
});

module.exports = mongoose.model("AcademicYear", AcademicYear);
