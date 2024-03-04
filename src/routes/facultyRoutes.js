const express = require("express");
const router = express.Router();

const checkLogin = require("../middlewares/checkLogin");

const FacultyController = require("../controllers/facultyController");

router.post("/store", FacultyController.store);
router.use("/", checkLogin, FacultyController.index);

module.exports = router;
