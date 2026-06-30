const aiModel = require("../models/aiModel");
const analyticsModel = require("../models/analyticsModel");

exports.generateStudyPlan = async (req, res) => {
  try {
    const { subject, hours, priority, deadline, studentId } = req.body;

    if (!subject || !hours || !priority || !deadline) {
      return res.status(400).json({
        success: false,
        message: "Subject, hours, priority, and deadline are required."
      });
    }

    const focusText =
      priority === "High"
        ? "Focus deeply on the most urgent task first."
        : priority === "Medium"
        ? "Balance revision and task completion."
        : "Use a lighter review plan with short practice.";

    const aiMessage = `Sifu created a ${hours}-hour study plan for ${subject} with ${priority} priority before your deadline on ${deadline}.`;
    const confidence = 91;

    const schedule = [
      { time: "09:00", activity: `${subject} requirement review — ${focusText}` },
      { time: "11:00", activity: `Focused study session on ${subject}.` },
      { time: "14:00", activity: "Practice and improvement on unfinished work." },
      { time: "20:00", activity: "Final review and summary of today's progress." }
    ];

    if (studentId) {
      await aiModel.saveGeneratedPlan(
        studentId,
        subject,
        hours,
        priority,
        deadline,
        aiMessage,
        confidence,
        schedule
      );
    }

    res.json({
      success: true,
      data: { subject, hours, priority, deadline, schedule, aiMessage, confidence }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to generate study plan." });
  }
};

exports.getRiskPrediction = async (req, res) => {
  try {
    const studentId = Number(req.params.studentId);

    const [taskCompletion, weakestSubject, studyTime] = await Promise.all([
      analyticsModel.getTaskCompletion(studentId),
      analyticsModel.getWeakestSubject(studentId),
      analyticsModel.getStudyTime(studentId)
    ]);

    const totalHours = studyTime.reduce((total, item) => total + item.hours, 0);

    let riskScore = 20;
    riskScore += taskCompletion.overdue * 10;
    riskScore += totalHours < 15 ? 15 : 0;
    riskScore += weakestSubject && weakestSubject.progress < 50 ? 15 : 0;
    riskScore = Math.min(riskScore, 100);

    const riskLevel = riskScore >= 70 ? "High Risk" : riskScore >= 40 ? "Medium Risk" : "Low Risk";

    const factors = [
      {
        factor: `${taskCompletion.overdue} Overdue Tasks`,
        severity: taskCompletion.overdue >= 2 ? "High" : "Low"
      },
      {
        factor: "Low Study Hours",
        severity: totalHours < 15 ? "Medium" : "Low"
      },
      {
        factor: "Weak Subject Detected",
        severity: weakestSubject && weakestSubject.progress < 50 ? "Medium" : "Low"
      }
    ];

    res.json({
      success: true,
      data: {
        studentId,
        riskScore,
        riskLevel,
        factors,
        recommendation: weakestSubject
          ? `Focus on ${weakestSubject.subject} and complete overdue tasks to reduce academic risk.`
          : "Complete overdue tasks to reduce academic risk."
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to load risk prediction." });
  }
};

exports.getResources = async (req, res) => {
  try {
    const studentId = Number(req.params.studentId);
    const data = await aiModel.getResources(studentId);
    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to load resources." });
  }
};

exports.getSuggestions = async (req, res) => {
  try {
    const studentId = Number(req.params.studentId);
    const data = await aiModel.getSuggestions(studentId);
    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to load suggestions." });
  }
};