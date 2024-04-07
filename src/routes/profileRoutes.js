const express = require("express");
const router = express.Router();
const { isAdmin } = require("../middlewares/checkRole");

const ProfileController = require("../controllers/profileController");

router.get("/delete/:id", isAdmin, ProfileController.delete);
router.post("/update/:id", ProfileController.update);
router.post("/create", isAdmin, ProfileController.create);
router.get("/", ProfileController.index);

module.exports = router;
