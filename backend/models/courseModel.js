const db = require("../config/db");

exports.findByUserId = async (userId) => {
  const [rows] = await db.query(
    "SELECT * FROM courses WHERE user_id = ? ORDER BY course_id DESC",
    [userId]
  );

  return rows.map(formatCourse);
};

exports.create = async (courseData) => {
  const {
    userId,
    code,
    name,
    lecturer,
    credits,
    progress,
    color
  } = courseData;

  const [result] = await db.query(
    `INSERT INTO courses
    (user_id, course_code, course_name, lecturer, credits, progress, color)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      code,
      name,
      lecturer || "",
      credits || 3,
      progress || 0,
      color || "red"
    ]
  );

  return result.insertId;
};

exports.update = async (courseId, courseData) => {
  const {
    code,
    name,
    lecturer,
    credits,
    progress,
    color
  } = courseData;

  const [result] = await db.query(
    `UPDATE courses
     SET course_code = ?,
         course_name = ?,
         lecturer = ?,
         credits = ?,
         progress = ?,
         color = ?
     WHERE course_id = ?`,
    [
      code,
      name,
      lecturer || "",
      credits || 3,
      progress || 0,
      color || "red",
      courseId
    ]
  );

  return result.affectedRows;
};

exports.remove = async (courseId) => {
  const [result] = await db.query(
    "DELETE FROM courses WHERE course_id = ?",
    [courseId]
  );

  return result.affectedRows;
};

exports.seedDefaults = async (userId) => {
  const courses = [
    ["SCSE2243", "Software Design & Architecture", "Dr. Ahmad Fadzil", 3, 72, "red"],
    ["SECJ2013", "Software Engineering", "Prof. Norhayati Mohd", 3, 58, "green"],
    ["SCSJ2203", "Data Structures & Algorithms", "Dr. Lim Boon Yian", 3, 45, "salmon"],
    ["SCST1223", "Statistics for Computing", "Dr. Roslan Johari", 2, 85, "dark"]
  ];

  for (const course of courses) {
    await db.query(
      `INSERT INTO courses
      (user_id, course_code, course_name, lecturer, credits, progress, color)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, ...course]
    );
  }
};

function formatCourse(course) {
  return {
    id: String(course.course_id),
    userId: course.user_id,
    code: course.course_code,
    name: course.course_name,
    lecturer: course.lecturer,
    credits: course.credits,
    progress: course.progress,
    color: course.color
  };
}