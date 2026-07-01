const CourseModel = require("../models/courseModel");

exports.getCourses = async (req, res) => {
  try {
    const { userId } = req.params;

    const courses = await CourseModel.findByUserId(userId);

    return res.json({
      success: true,
      courses
    });
  } catch (error) {
    console.error("Get courses error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while loading courses."
    });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const { userId, code, name } = req.body;

    if (!userId || !code || !name) {
      return res.status(400).json({
        success: false,
        message: "User ID, course code, and course name are required."
      });
    }

    const courseId = await CourseModel.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Course added successfully.",
      courseId
    });
  } catch (error) {
    console.error("Create course error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while adding course."
    });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const affectedRows = await CourseModel.update(courseId, req.body);

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Course not found."
      });
    }

    return res.json({
      success: true,
      message: "Course updated successfully."
    });
  } catch (error) {
    console.error("Update course error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating course."
    });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const affectedRows = await CourseModel.remove(courseId);

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Course not found."
      });
    }

    return res.json({
      success: true,
      message: "Course deleted successfully."
    });
  } catch (error) {
    console.error("Delete course error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while deleting course."
    });
  }
};