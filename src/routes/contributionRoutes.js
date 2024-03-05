const express = require("express");
const router = express.Router();

const ContributionController = require("../controllers/contributionController");
const { handleFileUpload } = require("../middlewares/updateMulter");

router.post("/update/:id", ContributionController.update);
router.get("/unPublic/:id", ContributionController.unPublic);
router.get("/public/:id", ContributionController.public);
router.use("/force/:id", ContributionController.force);
router.use("/delete/:id", ContributionController.delete);
router.post("/store", handleFileUpload, ContributionController.store);
router.use("/", ContributionController.index);

module.exports = router;
