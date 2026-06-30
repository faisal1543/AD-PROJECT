const express = require("express");
const router = express.Router();

const supportController = require("../controllers/supportController");

// Chatbot routes
router.get("/chat/messages/:studentId", supportController.getChatMessages);
router.post("/chat/messages", supportController.sendChatMessage);

// Notification routes
router.get("/notifications/:studentId", supportController.getNotifications);
router.patch("/notifications/:notificationId/read", supportController.markNotificationRead);

// Notification settings routes
router.get("/notification-settings/:studentId", supportController.getNotificationSettings);
router.put("/notification-settings/:studentId", supportController.updateNotificationSettings);

// Feedback routes
router.post("/feedback", supportController.submitFeedback);
router.get("/feedback/:studentId", supportController.getFeedback);

// Support and help routes
router.get("/faqs", supportController.getFaqs);
router.get("/help-topics", supportController.getHelpTopics);

module.exports = router;