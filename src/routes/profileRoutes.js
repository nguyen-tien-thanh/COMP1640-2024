const express = require("express");
const router = express.Router();

const ProfileController = require("../controllers/profileController");

// TODO: Update user
router.get("/", ProfileController.index);

module.exports = router;
