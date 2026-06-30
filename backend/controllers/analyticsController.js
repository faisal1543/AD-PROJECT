const analyticsModel = require("../models/analyticsModel");

exports.getOverview = async (req, res) => {
  try {
    const studentId = Number(req.params.studentId);

    const [studyTime, taskCompletion, weakestSubject, gpa] = await Promise.all([
      analyticsModel.getStudyTime(studentId),
      analyticsModel.getTaskCompletion(studentId),
      analyticsModel.getWeakestSubject(studentId),
      analyticsModel.getStudentGpa(studentId)
    ]);

    const studyHours = studyTime.reduce((total, item) => total + item.hours, 0);

    const overview = {
      studentId,
      gpa,
      tasksDone: taskCompletion.completed,
      totalTasks: taskCompletion.completed + taskCompletion.pending + taskCompletion.overdue,
      studyHours,
      weakSubject: weakestSubject ? weakestSubject.subject : null
    };

    res.json({ success: true, data: overview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to load analytics overview." });
  }
};

exports.getSubjectProgress = async (req, res) => {
  try {
    const studentId = Number(req.params.studentId);
    const data = await analyticsModel.getSubjectProgress(studentId);
    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to load subject progress." });
  }
};

exports.getStudyTime = async (req, res) => {
  try {
    const studentId = Number(req.params.studentId);
    const data = await analyticsModel.getStudyTime(studentId);
    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to load study time." });
  }
};

exports.getTaskCompletion = async (req, res) => {
  try {
    const studentId = Number(req.params.studentId);
    const data = await analyticsModel.getTaskCompletion(studentId);
    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to load task completion." });
  }
};

exports.getWeakAreas = async (req, res) => {
  try {
    const studentId = Number(req.params.studentId);
    const weakestSubject = await analyticsModel.getWeakestSubject(studentId);

    if (!weakestSubject) {
      return res.json({ success: true, data: [] });
    }

    const weakArea = {
      subject: weakestSubject.subject,
      topic:
        weakestSubject.subject === "Data Structures"
          ? "Linked List and Stack Operations"
          : "Core topic revision required",
      progress: weakestSubject.progress,
      aiConfidence: 89,
      recommendation: `Focus on ${weakestSubject.subject} because it has the lowest progress score. Complete one revision resource and one practice set today.`
    };

    res.json({ success: true, data: [weakArea] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to load weak areas." });
  }
};