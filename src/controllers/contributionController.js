const fs = require("fs");

const Faculty = require("../models/Faculty");
const Contribution = require("../models/Contribution");
const { multipleJsonToObject, jsonToObject } = require("../utils/jsonToObject");

class ContributionController {
  async public(req, res, next) {
    try {
      await Contribution.updateOne(
        { _id: req.params.id },
        { isPublished: true }
      );
    } catch (err) {
      console.error(err);
    }
    return res.redirect("back");
  }

  async unPublic(req, res, next) {
    try {
      await Contribution.updateOne(
        { _id: req.params.id },
        { isPublished: false }
      );
    } catch (err) {
      console.error(err);
    }
    return res.redirect("back");
  }

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
            req.flash("error", `Error deleting file ${fileName}`);
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
        .populate({
          path: "users",
          select: "name avatar",
          populate: {
            path: "role",
          },
        })
        .populate({
          path: "coordinator",
          select: "name avatar",
          populate: {
            path: "role",
            select: "name",
          },
        }),
      Faculty.findOne({ _id: facultyId })
        .populate({
          path: "users",
          select: "name avatar",
        })
        .populate({
          path: "coordinator",
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
      var filterFacs = facs.filter((f) => {
        return !f._id.equals(fac._id);
      });

      if (
        req.user &&
        (req.user.role.name === "Student" ||
          req.user.role.name === "Marketing Coordinator") &&
        fac.users.some((user) => user._id.equals(req.user._id))
      ) {
        canContribute = true;
      }

      return res.render("contribution", {
        title: fac.name,
        noBanner: true,
        canContribute,
        isExpired: fac.closureDate - new Date() < 0,
        faculties: multipleJsonToObject(filterFacs),
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
