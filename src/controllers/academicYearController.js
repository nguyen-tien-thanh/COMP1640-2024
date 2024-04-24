const AcademicYear = require("../models/AcademicYear");
const Faculty = require("../models/Faculty");

class AcademicYearController {
  async delete(req, res) {
    try {
      const academicYearId = req.params.id;
      await AcademicYear.deleteOne({ _id: academicYearId });
      await Faculty.deleteMany({ academicYear: academicYearId });

      req.flash("success", "Delete successfully");
      return res.redirect("back");
    } catch (err) {
      req.flash("error", "Can't delete right now");
      console.error(`Error updating: `, err);
      return res.redirect("back");
    }
  }

  async create(req, res, next) {
    const { year, startDate, endDate } = req.body;

    if (!year || !startDate || !endDate) {
      req.flash("error", "Missing information");
      return res.redirect("back");
    }

    if (new Date(endDate) < new Date(startDate)) {
      req.flash("error", "End date must be after start date");
      return res.redirect("back");
    }

    try {
      const existingYear = await AcademicYear.findOne({ year: Number(year) });

      if (existingYear) {
        req.flash("error", "Year already created");
        return res.redirect("back");
      }

      const newAcademicYear = new AcademicYear({
        ...req.body,
      });

      await newAcademicYear.save();

      req.flash("success", "Successfully created");

      return res.redirect("back");
    } catch (error) {
      req.flash("error", "An error occurred. Try again later");
      return res.redirect("back");
    }
  }
}

module.exports = new AcademicYearController();
