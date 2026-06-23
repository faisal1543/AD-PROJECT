const express = require("express");
const router = express.Router();

const aiController = require("../controllers/aiController");

router.post("/generate-plan", aiController.generateStudyPlan);
router.get("/risk/:studentId", aiController.getRiskPrediction);
router.get("/resources/:studentId", aiController.getResources);
router.get("/suggestions/:studentId", aiController.getSuggestions);

module.exports = router;