const express = require("express");
const router = express.Router();

const CommentController = require("../controllers/commentController");

router.post("/store/:id", CommentController.store);

module.exports = router;
