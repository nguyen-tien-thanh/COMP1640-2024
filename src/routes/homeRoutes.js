const express = require("express");
const router = express.Router();
const passport = require("passport");

const HomeController = require("../controllers/homeController");

router.get("/logout", HomeController.logout);
router.get("/login", HomeController.login);
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);
router.get("/register", HomeController.register);
router.post("/register", HomeController.store);
router.use("/privacy", HomeController.privacy);
router.use("/terms", HomeController.terms);
router.use("/", HomeController.index);

module.exports = router;
