const express = require("express");
const router = express.Router();

const FacultyController = require("../controllers/facultyController");

router.post("/store", FacultyController.store);
router.use("/", FacultyController.index);

module.exports = router;
