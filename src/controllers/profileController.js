const User = require("../models/User");
const Contribution = require("../models/Contribution");
const Comment = require("../models/Comment");
const bcrypt = require("bcrypt");
const Role = require("../models/Role");
const { jsonToObject, multipleJsonToObject } = require("../utils/jsonToObject");
const { sendMailWithPassword } = require("../utils/sendMail");
const generatePassword = require("../utils/generatePassword");

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
        req.user.role.name !== "Administrator" &&
        req.user.role.name !== "Marketing Coordinator" &&
        owner._id !== req.user._id
      ) {
        req.flash("error", "Can't update right now");
        return res.redirect("back");
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

  async delete(req, res) {
    try {
      const userId = req.params.id;
      await User.deleteOne({ _id: userId });
      await Comment.deleteMany({ user: userId });
      await Contribution.deleteMany({ user: userId });

      req.flash("success", "Delete successfully");
      return res.redirect("back");
    } catch (err) {
      req.flash("error", "Can't delete right now");
      console.error(`Error updating: `, err);
      return res.redirect("back");
    }
  }

  async create(req, res, next) {
    const { name, email } = req.body;
    const password = generatePassword();

    if (!name || !email || !password) {
      req.flash("error", "Missing information");
      return res.redirect("back");
    }

    try {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        req.flash("error", "Email already registered");
        return res.redirect("back");
      }

      const hash = await bcrypt.hashSync(password, 10);

      const user = new User({
        ...req.body,
        password: hash,
      });

      await user.save();

      sendMailWithPassword({
        email: user.email,
        password,
      });

      req.flash("success", "Successfully registered");
      req.flash("email", email);

      return res.redirect("back");
    } catch (error) {
      req.flash("error", "An error occurred. Try again later");
      return res.redirect("back");
    }
  }
}

module.exports = new ProfileController();
