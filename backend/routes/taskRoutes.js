const express = require("express");
const router = express.Router();

const taskController = require("../controllers/taskController");

router.get("/:userId", taskController.getTasks);
router.post("/", taskController.createTask);
router.put("/:taskId", taskController.updateTask);
router.patch("/:taskId/status", taskController.updateTaskStatus);
router.delete("/:taskId", taskController.deleteTask);

module.exports = router;