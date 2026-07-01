const TaskModel = require("../models/taskModel");

exports.getTasks = async (req, res) => {
  try {
    const { userId } = req.params;

    const tasks = await TaskModel.findByUserId(userId);

    return res.json({
      success: true,
      tasks
    });
  } catch (error) {
    console.error("Get tasks error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while loading tasks."
    });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { userId, title, course, due } = req.body;

    if (!userId || !title || !course || !due) {
      return res.status(400).json({
        success: false,
        message: "User ID, task title, course, and due date are required."
      });
    }

    const taskId = await TaskModel.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Task added successfully.",
      taskId
    });
  } catch (error) {
    console.error("Create task error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while adding task."
    });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const affectedRows = await TaskModel.update(taskId, req.body);

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found."
      });
    }

    return res.json({
      success: true,
      message: "Task updated successfully."
    });
  } catch (error) {
    console.error("Update task error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating task."
    });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    if (!["Pending", "Overdue", "Completed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task status."
      });
    }

    const affectedRows = await TaskModel.updateStatus(taskId, status);

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found."
      });
    }

    return res.json({
      success: true,
      message: "Task status updated successfully."
    });
  } catch (error) {
    console.error("Update task status error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating task status."
    });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const affectedRows = await TaskModel.remove(taskId);

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Task not found."
      });
    }

    return res.json({
      success: true,
      message: "Task deleted successfully."
    });
  } catch (error) {
    console.error("Delete task error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while deleting task."
    });
  }
};