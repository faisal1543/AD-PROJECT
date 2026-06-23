const analyticsData = require("../models/analyticsModel");

exports.getOverview = (req, res) => {
  res.json({
    success: true,
    data: analyticsData.overview
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
  res.json({
    success: true,
    data: analyticsData.weakAreas
  });
};