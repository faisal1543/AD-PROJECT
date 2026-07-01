const db = require("../config/db");

exports.findByUserId = async (userId) => {
  const [rows] = await db.query(
    "SELECT * FROM academic_tasks WHERE user_id = ? ORDER BY due_date ASC",
    [userId]
  );

  return rows.map(formatTask);
};

exports.findActiveByUserId = async (userId) => {
  const [rows] = await db.query(
    `SELECT * FROM academic_tasks
     WHERE user_id = ? AND status != 'Completed'
     ORDER BY
      CASE
        WHEN priority = 'High' THEN 1
        WHEN priority = 'Medium' THEN 2
        ELSE 3
      END,
      due_date ASC`,
    [userId]
  );

  return rows.map(formatTask);
};

exports.create = async (taskData) => {
  const {
    userId,
    title,
    course,
    status,
    priority,
    due
  } = taskData;

  const [result] = await db.query(
    `INSERT INTO academic_tasks
    (user_id, course_code, task_title, status, priority, due_date)
    VALUES (?, ?, ?, ?, ?, ?)`,
    [
      userId,
      course,
      title,
      status || "Pending",
      priority || "Medium",
      due
    ]
  );

  return result.insertId;
};

exports.update = async (taskId, taskData) => {
  const {
    title,
    course,
    status,
    priority,
    due
  } = taskData;

  const [result] = await db.query(
    `UPDATE academic_tasks
     SET task_title = ?,
         course_code = ?,
         status = ?,
         priority = ?,
         due_date = ?
     WHERE task_id = ?`,
    [
      title,
      course,
      status || "Pending",
      priority || "Medium",
      due,
      taskId
    ]
  );

  return result.affectedRows;
};

exports.updateStatus = async (taskId, status) => {
  const [result] = await db.query(
    "UPDATE academic_tasks SET status = ? WHERE task_id = ?",
    [status, taskId]
  );

  return result.affectedRows;
};

exports.remove = async (taskId) => {
  const [result] = await db.query(
    "DELETE FROM academic_tasks WHERE task_id = ?",
    [taskId]
  );

  return result.affectedRows;
};

exports.seedDefaults = async (userId) => {
  const tasks = [
    ["SCSE2243", "Software Design Report", "Pending", "High", "2026-05-24"],
    ["SCSJ2203", "Lab Exercise 4 - Linked Lists", "Overdue", "High", "2026-05-22"],
    ["SECJ2013", "UML Diagram Assignment", "Pending", "Medium", "2026-05-28"],
    ["SCST1223", "Statistics Quiz 2", "Pending", "Medium", "2026-05-26"],
    ["SECJ2013", "Requirements Specification Doc", "Completed", "High", "2026-05-15"],
    ["SCST1223", "Probability Problem Set 1", "Completed", "Low", "2026-05-18"]
  ];

  for (const task of tasks) {
    await db.query(
      `INSERT INTO academic_tasks
      (user_id, course_code, task_title, status, priority, due_date)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, ...task]
    );
  }
};

function formatTask(task) {
  return {
    id: String(task.task_id),
    userId: task.user_id,
    title: task.task_title,
    course: task.course_code,
    status: task.status,
    priority: task.priority,
    due: formatDateOnly(task.due_date)
  };
}

function formatDateOnly(dateValue) {
  if (!dateValue) return "";

  const date = new Date(dateValue);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}