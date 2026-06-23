const express = require("express");
const router = express.Router();

const analyticsController = require("../controllers/analyticsController");

router.get("/overview/:studentId", analyticsController.getOverview);
router.get("/subject-progress/:studentId", analyticsController.getSubjectProgress);
router.get("/study-time/:studentId", analyticsController.getStudyTime);
router.get("/task-completion/:studentId", analyticsController.getTaskCompletion);
router.get("/weak-areas/:studentId", analyticsController.getWeakAreas);

module.exports = router;