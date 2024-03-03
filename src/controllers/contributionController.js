const fs = require("fs");

const Faculty = require("../models/Faculty");
const Comment = require("../models/Comment");
const Contribution = require("../models/Contribution");
const { multipleJsonToObject, jsonToObject } = require("../utils/jsonToObject");

class ContributionController {
  async delete(req, res, next) {
    try {
      await Contribution.delete({ _id: req.params.id });
      return res.redirect("back");
    } catch (e) {
      console.error(e);
      return res.redirect("back");
    }
  }

  async force(req, res, next) {
    try {
      const contribution = await Contribution.findById(req.params.id);

      if (!contribution) {
        return res.status(404).send("Contribution not found");
      }

      await Contribution.deleteOne({ _id: req.params.id });

      contribution.files.forEach((fileName) => {
        const filePath = "src/resources/public/uploads/" + fileName;
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(`Error deleting file ${fileName}:`, err);
          } else {
            console.log(`File ${fileName} deleted successfully`);
          }
        });
      });

      return res.redirect("back");
    } catch (e) {
      console.error(e);
      return res.redirect("back");
    }
  }

  index(req, res, next) {
    const facultyId = req.query.facultyId;

    if (facultyId === undefined || facultyId === null) {
      return res.redirect("/faculty");
    }

    Promise.all([
      Faculty.find()
        .limit(4)
        .populate({
          path: "user",
          select: "name avatar",
          populate: {
            path: "role",
          },
        }),
      Faculty.findOne({ _id: facultyId }).populate({
        path: "user",
        select: "name avatar",
        populate: {
          path: "role",
          select: "name",
        },
      }),
      Contribution.find({ faculty: facultyId })
        .sort({ createdAt: -1 })
        .populate({
          path: "user",
          select: "name avatar",
        })
        .populate({
          path: "comments",
          populate: {
            path: "user",
            select: "name avatar",
          },
        }),
    ]).then(([facs, fac, cons]) => {
      var canContribute = false;

      if (
        req.user &&
        (req.user.role.name === "Student" || req.user._id.equals(fac.user._id))
      ) {
        canContribute = true;
      }

      console.log(canContribute);

      return res.render("contribution", {
        title: fac.name,
        noBanner: true,
        canContribute,
        isExpired: fac.closureDate - new Date() < 0,
        faculties: multipleJsonToObject(facs),
        contributions: multipleJsonToObject(cons),
        faculty: jsonToObject(fac),
      });
    });
  }

  async store(req, res, next) {
    const { content, files } = req.body;

    if (!content) {
      req.flash("error", "Missing information");
    }

    const filesName = req.files.map((file) => file.filename);

    try {
      const contribution = new Contribution({
        ...req.body,
        faculty: req.query.facultyId,
        user: req.user._id,
        files: filesName,
      });

      await contribution.save();

      req.flash("success", "Contribution saved successfully");
    } catch (err) {
      console.error(err);
      req.flash("error", "An error occurred. Try again later");
    }

    return res.redirect("back");
  }
}

module.exports = new ContributionController();
