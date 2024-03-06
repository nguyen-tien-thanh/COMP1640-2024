const express = require("express");
const router = express.Router();

const AdminController = require("../controllers/adminController");

router.get("/download", AdminController.download);
router.get("/manage-contribution", AdminController.manageContribution);
router.get("/manage-faculty", AdminController.manageFaculty);
router.get("/manage-user", AdminController.manageUser);
router.get("/", AdminController.index);

module.exports = router;
