const express = require("express");
const router = express.Router();

const AdminController = require("../controllers/adminController");
const { isAdmin, isManager } = require("../middlewares/checkRole");

router.get("/download", isManager, AdminController.download);
router.get(
  "/manage-contribution",
  isManager,
  AdminController.manageContribution
);
router.get("/manage-faculty", isAdmin, AdminController.manageFaculty);
router.get("/manage-user", isAdmin, AdminController.manageUser);
router.get("/", isManager, AdminController.index);

module.exports = router;
