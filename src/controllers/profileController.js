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
        statusCode: 404,
        message: "User not found",
      });
    }
  }
}

module.exports = new ProfileController();
