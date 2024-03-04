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
    const { name, image, description, date, time } = req.body;

    if (!name || !date || !time) {
      req.flash("error", "Missing information");
    }

    try {
      const falcuty = new Faculty({
        ...req.body,
        closureDate: new Date(`${date}T${time}`),
      });

      await falcuty.save();

      req.flash("success", "Faculty saved successfully");
    } catch (err) {
      console.error(err);
      req.flash("error", "An error occurred. Try again later");
    }

    return res.redirect("back");
  }
}

module.exports = new FacultyController();
