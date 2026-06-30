const pool = require("../config/db");

async function getSubjectProgress(studentId) {
  const [rows] = await pool.query(
    "SELECT subject, progress FROM subject_progress WHERE student_id = ?",
    [studentId]
  );
  return rows;
}

async function getStudyTime(studentId) {
  const [rows] = await pool.query(
    "SELECT subject, hours FROM study_time WHERE student_id = ?",
    [studentId]
  );
  return rows;
}

async function getTaskCompletion(studentId) {
  const [rows] = await pool.query(
    "SELECT completed, pending, overdue FROM task_completion WHERE student_id = ?",
    [studentId]
  );
  return rows[0] || { completed: 0, pending: 0, overdue: 0 };
}

async function getStudentGpa(studentId) {
  const [rows] = await pool.query(
    "SELECT gpa FROM students WHERE id = ?",
    [studentId]
  );
  return rows[0] ? rows[0].gpa : null;
}

async function getWeakestSubject(studentId) {
  const [rows] = await pool.query(
    "SELECT subject, progress FROM subject_progress WHERE student_id = ? ORDER BY progress ASC LIMIT 1",
    [studentId]
  );
  return rows[0] || null;
}

module.exports = {
  getSubjectProgress,
  getStudyTime,
  getTaskCompletion,
  getStudentGpa,
  getWeakestSubject
};