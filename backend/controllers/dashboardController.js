const CourseModel = require("../models/courseModel");
const TaskModel = require("../models/taskModel");

exports.getDashboard = async (req, res) => {
  try {
    const { userId } = req.params;

    const courses = await CourseModel.findByUserId(userId);
    const tasks = await TaskModel.findByUserId(userId);

    const courseProgress = calculateAverageProgress(courses);

    const highPriority = tasks.filter(task => task.priority === "High").length;
    const mediumPriority = tasks.filter(task => task.priority === "Medium").length;
    const lowPriority = tasks.filter(task => task.priority === "Low").length;

    const upcomingDeadlines = tasks
      .filter(task => task.status !== "Completed")
      .sort((a, b) => String(a.due).localeCompare(String(b.due)))
      .slice(0, 3);

    return res.json({
      success: true,
      dashboard: {
        courseProgress,
        activeCourses: courses.length,
        availableTime: "24h",
        productivityScore: 85,
        highPriority,
        mediumPriority,
        lowPriority,
        upcomingDeadlines
      }
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while loading dashboard."
    });
  }
};

function calculateAverageProgress(courses) {
  if (!Array.isArray(courses) || courses.length === 0) return 0;

  const total = courses.reduce((sum, course) => {
    return sum + Number(course.progress || 0);
  }, 0);

  return Math.round(total / courses.length);
}