const Faculty = require("../models/Faculty");
const { multipleJsonToObject } = require("../utils/jsonToObject");

class FacultyController {
  index(req, res, next) {
    try {
      Faculty.find({})
        .sort()
        .populate("users")
        .populate("coordinator")
        .then((fal) => {
          return res.render("faculty", {
            noBanner: true,
            title: "Faculty",
            faculties: multipleJsonToObject(fal),
          });
        });
    } catch (err) {
      console.error(err);
      return res.render("error", {
        noHeader: true,
        statusCode: 404,
        message: "Page not found",
      });
    }
  }

  async store(req, res, next) {
    const { name, date, time, coordinator } = req.body;

    if (!name || !date || !time || !coordinator) {
      req.flash("error", "Missing information");
      return res.redirect("back");
    }

    if (!req.file) {
      req.flash("error", "Image can not be null.");
      return res.redirect("back");
    }

    try {
      const falcuty = new Faculty({
        ...req.body,
        image: req.file.filename,
        closureDate: new Date(`${date}T${time}`),
      });

      await falcuty.save();

      req.flash("success", "Faculty saved successfully");
      return res.redirect("back");
    } catch (err) {
      console.error(err);
      req.flash("error", "An error occurred. Try again later");
      return res.redirect("back");
    }
  }

  async update(req, res, next) {
    try {
      const facultyId = req.params.id;
      await Faculty.updateOne({ _id: facultyId }, { ...req.body });

      req.flash("success", "Update successfully");
      return res.redirect("back");
    } catch (err) {
      req.flash("error", "Can't update right now");
      console.error(`Error updating: `, err);
      return res.redirect("back");
    }
  }

  async delete(req, res, next) {
    try {
      const facultyId = req.params.id;
      await Faculty.deleteOne({ _id: facultyId });

      req.flash("success", "Delete successfully");
      return res.redirect("back");
    } catch (err) {
      req.flash("error", "Can't delete right now");
      console.error(`Error updating: `, err);
      return res.redirect("back");
    }
  }
}

module.exports = new FacultyController();
