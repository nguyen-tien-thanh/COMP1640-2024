const express = require("express");
const router = express.Router();

const AcademicYearController = require("../controllers/academicYearController");

router.get("/delete/:id", AcademicYearController.delete);
router.post("/create", AcademicYearController.create);

module.exports = router;
