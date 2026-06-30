const pool = require("../config/db");

async function getResources(studentId) {
  const [rows] = await pool.query(
    "SELECT id, title, type, subject, duration, priority FROM ai_resources WHERE student_id = ?",
    [studentId]
  );
  return rows;
}

async function getSuggestions(studentId) {
  const [rows] = await pool.query(
    "SELECT id, title, reason, confidence FROM ai_suggestions WHERE student_id = ?",
    [studentId]
  );
  return rows;
}

async function saveGeneratedPlan(studentId, subject, hours, priority, deadline, aiMessage, confidence, schedule) {
  const [planResult] = await pool.query(
    `INSERT INTO generated_study_plans
      (student_id, subject, hours, priority, deadline, ai_message, confidence)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [studentId, subject, hours, priority, deadline, aiMessage, confidence]
  );

  const planId = planResult.insertId;

  const itemValues = schedule.map((item) => [planId, item.time, item.activity]);
  if (itemValues.length > 0) {
    await pool.query(
      "INSERT INTO generated_study_plan_items (plan_id, time, activity) VALUES ?",
      [itemValues]
    );
  }

  return planId;
}

module.exports = {
  getResources,
  getSuggestions,
  saveGeneratedPlan
};