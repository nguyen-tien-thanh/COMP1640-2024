const express = require("express");
const router = express.Router();

const PublicationController = require("../controllers/publicationController");

router.get("/", PublicationController.index);

module.exports = router;
