const express = require("express");
const router = express.Router();

const AdminController = require("../controllers/adminController");

router.get("/", AdminController.index);

module.exports = router;
