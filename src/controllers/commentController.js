const Comment = require("../models/Comment");
const Contribution = require("../models/Contribution");
const { multipleJsonToObject } = require("../utils/jsonToObject");

class CommentController {
  async store(req, res, next) {
    const contributionId = req.params.id;
    if (!req.body.content) {
      req.flash("error", "Missing information");
      return res.redirect("back");
    }

    try {
      const comment = new Comment({
        ...req.body,
        user: req.user._id,
        contribution: contributionId,
      });

      await comment.save();

      await Contribution.findByIdAndUpdate(contributionId, {
        $push: { comments: comment._id },
      });

      req.flash("success", "Comment saved successfully");
      return res.redirect("back");
    } catch (err) {
      console.error(err);
      req.flash("error", "An error occurred. Try again later");
      return res.redirect("back");
    }
  }
}

module.exports = new CommentController();
