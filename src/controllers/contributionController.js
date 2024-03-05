const fs = require("fs");

const Faculty = require("../models/Faculty");
const Contribution = require("../models/Contribution");

const { multipleJsonToObject, jsonToObject } = require("../utils/jsonToObject");
const sendMail = require("../utils/sendMail");

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

  async index(req, res, next) {
    const facultyId = req.query.facultyId;

    if (facultyId === undefined || facultyId === null) {
      return res.redirect("/faculty");
    }

    const checkAuthority =
      req.user.role.name === "Administrator"
        ? true
        : await Faculty.findOne({
            $and: [{ _id: facultyId }, { users: { $in: [req.user._id] } }],
          });
    if (!checkAuthority) {
      return res.render("error", {
        noHeader: true,
        statusCode: 409,
        message: "You are not allowed",
      });
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
          options: { sort: { createdAt: -1 } },
        }),
    ]).then(([facs, fac, cons]) => {
      var canContribute = false;
      var filterFacs = facs
        .sort(() => Math.random() - 0.5)
        .filter((f) => {
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
        faculties: multipleJsonToObject(filterFacs),
        contributions: multipleJsonToObject(cons),
        faculty: jsonToObject(fac),
      });
    });
  }

  async store(req, res, next) {
    const { content } = req.body;

    const currentFaculty = await Faculty.findOne({ _id: req.query.facultyId });
    if (
      currentFaculty.coordinator.equals(req.user._id) &&
      currentFaculty.closureDate - new Date() <= 14
    ) {
      req.flash("error", "Expired closure date");
      return res.redirect("back");
    } else if (currentFaculty.closureDate - new Date() <= 0) {
      req.flash("error", "Expired closure date");
      return res.redirect("back");
    }

    if (!content) {
      req.flash("error", "Missing information");
      return res.redirect("back");
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

      const faculty = await Faculty.findOne({
        _id: req.query.facultyId,
      }).populate("coordinator");

      if (req.user.role.name !== "Marketing Coordinator")
        sendMail(faculty.coordinator.email, faculty, contribution);

      req.flash("success", "Contribution saved successfully");
    } catch (err) {
      console.error(err);
      req.flash("error", "An error occurred. Try again later");
    }

    return res.redirect("back");
  }

  async update(req, res, next) {
    const conId = req.params.id;
    const { deletedFiles, content } = req.body;

    try {
      const con = await Contribution.findOne({ _id: conId });
      var newFiles = con.files.filter((f) => {
        return !deletedFiles.includes(f);
      });

      await deletedFiles.forEach((fileName) => {
        const filePath = "src/resources/public/uploads/" + fileName;

        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(`Error deleting file ${fileName}:`, err);
            req.flash("error", `Error deleting file ${fileName}`);
          }
        });
      });

      await Contribution.updateOne(
        { _id: conId },
        {
          files: newFiles,
          content: content,
        }
      );
      req.flash("success", "Update successfully");
      return res.status(200).send({ message: "Update successfully" });
    } catch (err) {
      req.flash("error", "Can't update right now");
      console.error(`Error updating: `, err);
      return res.status(404).send({ message: "Update failed" });
    }
  }
}

module.exports = new ContributionController();
