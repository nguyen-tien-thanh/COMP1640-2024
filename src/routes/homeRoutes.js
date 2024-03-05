const express = require("express");
const router = express.Router();

const HomeController = require("../controllers/homeController");

router.get("/logout", HomeController.logout);
router.get("/login", HomeController.login);
router.post("/login", HomeController.validate);
router.get("/register", HomeController.register);
router.post("/register", HomeController.store);
router.use("/privacy", HomeController.privacy);
router.use("/terms", HomeController.terms);
router.use("/", HomeController.index);

module.exports = router;
