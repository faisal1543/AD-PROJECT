const supportModel = require("../models/supportModel");

function generateBotReply(message) {
  const lowerMessage = message.toLowerCase();

  if (
    lowerMessage === "hi" ||
    lowerMessage === "hello" ||
    lowerMessage === "hey" ||
    lowerMessage.includes("hi ")
  ) {
    return "Hi Maged! How can I help you today? You can ask me about study planning, task priority, deadlines, or revision.";
  }

  if (lowerMessage.includes("how are you")) {
    return "I am ready to help you with your studies. Tell me what subject or task you want to work on.";
  }

  if (lowerMessage.includes("thank")) {
    return "You are welcome! Keep going, and try to finish the most urgent task first.";
  }

  if (lowerMessage.includes("dsa") || lowerMessage.includes("data structure")) {
    return "For DSA, start with the topic you find hardest. Spend 45 minutes reviewing the concept, then solve 3 practice questions.";
  }

  if (lowerMessage.includes("application development") || lowerMessage.includes("ad project")) {
    return "For Application Development, focus on finishing the frontend pages first. After that, test navigation, buttons, forms, and page consistency.";
  }

  if (lowerMessage.includes("task") || lowerMessage.includes("first") || lowerMessage.includes("priority")) {
    return "Start with the task that has the closest deadline or highest marks. After that, move to revision or smaller tasks.";
  }

  if (lowerMessage.includes("revision") || lowerMessage.includes("revise")) {
    return "A good revision plan is: review notes for 30 minutes, practice questions for 45 minutes, then summarize weak points in your own words.";
  }

  if (lowerMessage.includes("plan") || lowerMessage.includes("schedule")) {
    return "Here is a simple plan: finish urgent assignments first, take a short break, then revise one weak subject before the end of the day.";
  }

  if (lowerMessage.includes("deadline") || lowerMessage.includes("due")) {
    return "Check the nearest deadline first. If it is due soon, focus only on completing and testing that task before starting anything new.";
  }

  if (lowerMessage.includes("exam") || lowerMessage.includes("quiz")) {
    return "For exams or quizzes, focus on past questions, key definitions, and weak topics. Use short revision sessions instead of one long session.";
  }

  if (lowerMessage.includes("stress") || lowerMessage.includes("tired") || lowerMessage.includes("overwhelmed")) {
    return "Take a short break first. Then choose only one small task to complete. Finishing one task will help reduce the pressure.";
  }

  const defaultReplies = [
    "Can you tell me which subject or task you are working on?",
    "Do you want help with planning, revision, or task priority?",
    "I recommend checking your closest deadline first, then choosing the highest priority task.",
    "Can you give me the subject name? I can suggest a better study plan based on it.",
    "Let’s make it simple: choose one urgent task, work on it for 45 minutes, then take a short break."
  ];

  const randomIndex = Math.floor(Math.random() * defaultReplies.length);
  return defaultReplies[randomIndex];
}

exports.getChatMessages = async (req, res) => {
  try {
    const studentId = Number(req.params.studentId);
    const data = await supportModel.getChatMessages(studentId);

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error("getChatMessages error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load chatbot messages."
    });
  }
};

exports.sendChatMessage = async (req, res) => {
  try {
    const { studentId, message } = req.body;

    if (!studentId || !message || message.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "studentId and message are required."
      });
    }

    const botReply = generateBotReply(message);

    const data = await supportModel.saveChatConversation(
      Number(studentId),
      message.trim(),
      botReply
    );

    res.status(201).json({
      success: true,
      data
    });
  } catch (error) {
    console.error("sendChatMessage error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send chatbot message."
    });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const studentId = Number(req.params.studentId);
    const data = await supportModel.getNotifications(studentId);

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error("getNotifications error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load notifications."
    });
  }
};

exports.markNotificationRead = async (req, res) => {
  try {
    const notificationId = Number(req.params.notificationId);

    await supportModel.markNotificationRead(notificationId);

    res.json({
      success: true,
      message: "Notification marked as read."
    });
  } catch (error) {
    console.error("markNotificationRead error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update notification."
    });
  }
};

exports.getNotificationSettings = async (req, res) => {
  try {
    const studentId = Number(req.params.studentId);
    const data = await supportModel.getNotificationSettings(studentId);

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error("getNotificationSettings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load notification settings."
    });
  }
};

exports.updateNotificationSettings = async (req, res) => {
  try {
    const studentId = Number(req.params.studentId);

    const settings = {
      study_reminders: req.body.study_reminders ? 1 : 0,
      deadline_reminders: req.body.deadline_reminders ? 1 : 0,
      ai_suggestions: req.body.ai_suggestions ? 1 : 0,
      email_notifications: req.body.email_notifications ? 1 : 0
    };

    await supportModel.updateNotificationSettings(studentId, settings);

    res.json({
      success: true,
      message: "Notification settings updated successfully."
    });
  } catch (error) {
    console.error("updateNotificationSettings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update notification settings."
    });
  }
};

exports.submitFeedback = async (req, res) => {
  try {
    const { studentId, category, rating, subject, message } = req.body;

    if (!studentId || !category || !rating || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All feedback fields are required."
      });
    }

    if (Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5."
      });
    }

    const feedbackId = await supportModel.saveFeedback(
      Number(studentId),
      category,
      Number(rating),
      subject.trim(),
      message.trim()
    );

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully.",
      feedbackId
    });
  } catch (error) {
    console.error("submitFeedback error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit feedback."
    });
  }
};

exports.getFeedback = async (req, res) => {
  try {
    const studentId = Number(req.params.studentId);
    const data = await supportModel.getFeedback(studentId);

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error("getFeedback error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load feedback."
    });
  }
};

exports.getFaqs = async (req, res) => {
  try {
    const data = await supportModel.getFaqs();

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error("getFaqs error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load support FAQs."
    });
  }
};

exports.getHelpTopics = async (req, res) => {
  try {
    const data = await supportModel.getHelpTopics();

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error("getHelpTopics error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load help topics."
    });
  }
};