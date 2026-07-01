const express = require("express");
const router = express.Router();

const scheduleController = require("../controllers/scheduleController");

router.get("/:userId", scheduleController.getSchedule);

module.exports = router;