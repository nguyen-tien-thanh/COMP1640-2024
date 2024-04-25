const express = require("express");
const router = express.Router();

const AdminController = require("../controllers/adminController");
const {
  isAdmin,
  isManager,
  isStaff,
  isCoordinator,
} = require("../middlewares/checkRole");

router.get("/download", isManager, AdminController.download);
router.get("/manage-contribution", isStaff, AdminController.manageContribution);
router.get("/manage-faculty", isCoordinator, AdminController.manageFaculty);
router.get("/manage-user", isCoordinator, AdminController.manageUser);
router.get(
  "/manage-academic-year",
  isAdmin,
  AdminController.manageAcademicYear
);
router.get("/", isStaff, AdminController.index);

module.exports = router;
