const analyticsData = require("../models/analyticsModel");

function getWeakestSubject() {
  const weakestSubject = analyticsData.subjectProgress.reduce((lowest, current) => {
    return current.progress < lowest.progress ? current : lowest;
  });

  return weakestSubject;
}

function getTotalStudyHours() {
  return analyticsData.studyTime.reduce((total, item) => {
    return total + item.hours;
  }, 0);
}

exports.getOverview = (req, res) => {
  const weakestSubject = getWeakestSubject();

  const overview = {
    studentId: Number(req.params.studentId),
    gpa: analyticsData.overview.gpa,
    tasksDone: analyticsData.taskCompletion.completed,
    totalTasks:
      analyticsData.taskCompletion.completed +
      analyticsData.taskCompletion.pending +
      analyticsData.taskCompletion.overdue,
    studyHours: getTotalStudyHours(),
    weakSubject: weakestSubject.subject
  };

  res.json({
    success: true,
    data: overview
  });
};

exports.getSubjectProgress = (req, res) => {
  res.json({
    success: true,
    data: analyticsData.subjectProgress
  });
};

exports.getStudyTime = (req, res) => {
  res.json({
    success: true,
    data: analyticsData.studyTime
  });
};

exports.getTaskCompletion = (req, res) => {
  res.json({
    success: true,
    data: analyticsData.taskCompletion
  });
};

exports.getWeakAreas = (req, res) => {
  const weakestSubject = getWeakestSubject();

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

  res.json({
    success: true,
    data: [weakArea]
  });
};
