const express = require("express");
const router = express.Router();

const ProfileController = require("../controllers/profileController");

router.post("/update/:id", ProfileController.update);
router.get("/", ProfileController.index);

module.exports = router;
