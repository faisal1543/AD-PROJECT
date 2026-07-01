const TaskModel = require("../models/taskModel");

exports.getSchedule = async (req, res) => {
  try {
    const { userId } = req.params;

    const tasks = await TaskModel.findActiveByUserId(userId);
    const selectedTasks = tasks.slice(0, 4);

    const times = [
      "2:00 PM - 4:30 PM",
      "7:00 PM - 8:30 PM",
      "3:00 PM - 5:00 PM",
      "8:00 PM - 9:00 PM"
    ];

    const notes = [
      "Recommended because the deadline is near.",
      "Suggested based on weak subject progress.",
      "Optimal time based on your productivity patterns.",
      "Light session scheduled for evening revision."
    ];

    const days = [
      "Monday, May 19",
      "Monday, May 19",
      "Tuesday, May 20",
      "Tuesday, May 20"
    ];

    const schedule = selectedTasks.map((task, index) => ({
      scheduleId: index + 1,
      taskId: task.id,
      title: task.title,
      course: task.course,
      priority: task.priority,
      day: days[index],
      time: times[index],
      note: notes[index]
    }));

    return res.json({
      success: true,
      schedule
    });
  } catch (error) {
    console.error("Schedule error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while generating schedule."
    });
  }
};