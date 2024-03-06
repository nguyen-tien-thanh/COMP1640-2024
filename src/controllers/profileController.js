const User = require("../models/User");
const Contribution = require("../models/Contribution");
const Comment = require("../models/Comment");

const { jsonToObject, multipleJsonToObject } = require("../utils/jsonToObject");

class ProfileController {
  async index(req, res, next) {
    const userId = req.query.userId;

    try {
      if (userId) {
        const user = await User.findOne({ _id: userId }).populate("role");
        const contributions = await Contribution.find({ user: userId });
        const comments = await Comment.find({ user: userId });

        return res.render("profile", {
          title: "Profile",
          noHeader: true,
          noFooter: true,
          contributions: multipleJsonToObject(contributions),
          comments: multipleJsonToObject(comments),
          profile: jsonToObject(user),
        });
      } else {
        const contributions = await Contribution.find({ user: req.user._id });
        const comments = await Comment.find({ user: req.user._id });

        return res.render("profile", {
          title: "Profile",
          noHeader: true,
          noFooter: true,
          contributions: multipleJsonToObject(contributions),
          comments: multipleJsonToObject(comments),
          profile: jsonToObject(req.user),
        });
      }
    } catch (err) {
      console.error(err.message, err);
      return res.render("error", {
        noHeader: true,
        statusCode: 404,
        message: "User not found",
      });
    }
  }

  async update(req, res, next) {
    try {
      const userId = req.params.id;
      const owner = await User.find({ _id: userId });

      if (
        req.user.role.name !== "Administrator" ||
        owner._id !== req.user._id
      ) {
        return res.render("error", {
          noHeader: true,
          statusCode: 403,
          message: "Forbidden. You are not allowed.",
        });
      }

      await User.updateOne({ _id: userId }, { ...req.body });

      req.flash("success", "Update successfully");
      return res.status(200).send({ message: "Update successfully" });
    } catch (err) {
      req.flash("error", "Can't update right now");
      console.error(`Error updating: `, err);
      return res.status(404).send({ message: "Update failed" });
    }
  }
}

module.exports = new ProfileController();
