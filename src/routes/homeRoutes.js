const express = require("express");
const router = express.Router();

const HomeController = require("../controllers/homeController");

router.use("/privacy", HomeController.privacy);
router.use("/terms", HomeController.terms);
router.use("/", HomeController.index);

module.exports = router;
