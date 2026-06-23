const aiData = require("../models/aiModel");

exports.generateStudyPlan = (req, res) => {
  const { subject, hours, priority, deadline } = req.body;

  if (!subject || !hours || !priority || !deadline) {
    return res.status(400).json({
      success: false,
      message: "Subject, hours, priority, and deadline are required."
    });
  }

  const plan = {
    subject,
    hours,
    priority,
    deadline,
    schedule: [
      {
        time: "09:00",
        activity: `${subject} requirement review`
      },
      {
        time: "11:00",
        activity: "Focused study session"
      },
      {
        time: "14:00",
        activity: "Practice and improvement"
      },
      {
        time: "20:00",
        activity: "Final review"
      }
    ],
    aiMessage: `Sifu created a ${hours}-hour study plan for ${subject} with ${priority} priority.`,
    confidence: 91
  };

  res.json({
    success: true,
    data: plan
  });
};

exports.getRiskPrediction = (req, res) => {
  const risk = {
    studentId: req.params.studentId,
    riskScore: 62,
    riskLevel: "Medium Risk",
    factors: [
      {
        factor: "2 Overdue Tasks",
        severity: "High"
      },
      {
        factor: "Low Study Hours",
        severity: "Medium"
      },
      {
        factor: "Weak Subject Detected",
        severity: "Medium"
      }
    ],
    recommendation:
      "Focus on Data Structures and complete overdue tasks to reduce academic risk."
  };

  res.json({
    success: true,
    data: risk
  });
};

exports.getResources = (req, res) => {
  res.json({
    success: true,
    data: aiData.resources
  });
};

exports.getSuggestions = (req, res) => {
  res.json({
    success: true,
    data: aiData.suggestions
  });
};