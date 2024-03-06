const Contribution = require("../models/Contribution");
const { multipleJsonToObject } = require("../utils/jsonToObject");

class PublicationController {
  async index(req, res, next) {
    try {
      const cons = await Contribution.find({ isPublished: true })
        .sort({ createdAt: -1 })
        .populate({
          path: "user",
          select: "name avatar",
          populate: {
            path: "role",
            select: "name",
          },
        })
        .populate("faculty");
      return res.render("publication", {
        title: "Publication",
        noBanner: true,
        contributions: multipleJsonToObject(cons),
      });
    } catch (err) {
      console.error(err);
      return res.render("error", {
        noHeader: true,
        statusCode: 500,
        message: err.message,
      });
    }
  }
}

module.exports = new PublicationController();
