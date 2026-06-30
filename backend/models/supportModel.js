const pool = require("../config/db");

async function getChatMessages(studentId) {
  const [rows] = await pool.query(
    `
    SELECT message_id, sender, message_text, created_at
    FROM chatbot_messages
    WHERE student_id = ?
    ORDER BY created_at ASC
    LIMIT 100
    `,
    [studentId]
  );

  return rows;
}

async function saveChatConversation(studentId, userMessage, botReply) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [userResult] = await connection.query(
      `
      INSERT INTO chatbot_messages (student_id, sender, message_text)
      VALUES (?, 'user', ?)
      `,
      [studentId, userMessage]
    );

    const [botResult] = await connection.query(
      `
      INSERT INTO chatbot_messages (student_id, sender, message_text)
      VALUES (?, 'bot', ?)
      `,
      [studentId, botReply]
    );

    await connection.commit();

    return {
      userMessage: {
        message_id: userResult.insertId,
        sender: "user",
        message_text: userMessage
      },
      botMessage: {
        message_id: botResult.insertId,
        sender: "bot",
        message_text: botReply
      }
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function getNotifications(studentId) {
  const [rows] = await pool.query(
    `
    SELECT notification_id, title, message, notification_type, priority, status, created_at
    FROM notifications
    WHERE student_id = ?
    ORDER BY created_at DESC
    `,
    [studentId]
  );

  return rows;
}

async function markNotificationRead(notificationId) {
  await pool.query(
    `
    UPDATE notifications
    SET status = 'read'
    WHERE notification_id = ?
    `,
    [notificationId]
  );
}

async function getNotificationSettings(studentId) {
  await pool.query(
    `
    INSERT IGNORE INTO notification_settings
    (student_id, study_reminders, deadline_reminders, ai_suggestions, email_notifications)
    VALUES (?, TRUE, TRUE, TRUE, FALSE)
    `,
    [studentId]
  );

  const [rows] = await pool.query(
    `
    SELECT 
      setting_id,
      student_id,
      study_reminders,
      deadline_reminders,
      ai_suggestions,
      email_notifications,
      updated_at
    FROM notification_settings
    WHERE student_id = ?
    `,
    [studentId]
  );

  return rows[0];
}

async function updateNotificationSettings(studentId, settings) {
  await pool.query(
    `
    INSERT INTO notification_settings
    (student_id, study_reminders, deadline_reminders, ai_suggestions, email_notifications)
    VALUES (?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      study_reminders = VALUES(study_reminders),
      deadline_reminders = VALUES(deadline_reminders),
      ai_suggestions = VALUES(ai_suggestions),
      email_notifications = VALUES(email_notifications)
    `,
    [
      studentId,
      settings.study_reminders,
      settings.deadline_reminders,
      settings.ai_suggestions,
      settings.email_notifications
    ]
  );
}

async function saveFeedback(studentId, category, rating, subject, message) {
  const [result] = await pool.query(
    `
    INSERT INTO feedback (student_id, category, rating, subject, message)
    VALUES (?, ?, ?, ?, ?)
    `,
    [studentId, category, rating, subject, message]
  );

  return result.insertId;
}

async function getFeedback(studentId) {
  const [rows] = await pool.query(
    `
    SELECT feedback_id, category, rating, subject, message, status, submitted_at
    FROM feedback
    WHERE student_id = ?
    ORDER BY submitted_at DESC
    `,
    [studentId]
  );

  return rows;
}

async function getFaqs() {
  const [rows] = await pool.query(
    `
    SELECT faq_id, question, answer
    FROM support_faqs
    ORDER BY faq_id ASC
    `
  );

  return rows;
}

async function getHelpTopics() {
  const [rows] = await pool.query(
    `
    SELECT topic_id, title, description, icon
    FROM help_topics
    ORDER BY topic_id ASC
    `
  );

  return rows;
}

module.exports = {
  getChatMessages,
  saveChatConversation,
  getNotifications,
  markNotificationRead,
  getNotificationSettings,
  updateNotificationSettings,
  saveFeedback,
  getFeedback,
  getFaqs,
  getHelpTopics
};