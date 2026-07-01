const db = require("../config/db");

exports.findByEmail = async (email) => {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  return rows[0];
};

exports.findById = async (userId) => {
  const [rows] = await db.query(
    `SELECT 
      user_id,
      full_name,
      email,
      role,
      account_status,
      faculty,
      programme,
      year_of_study,
      current_semester,
      total_credits,
      current_gpa
    FROM users
    WHERE user_id = ?`,
    [userId]
  );

  return rows[0];
};

exports.create = async (userData) => {
  const {
    fullName,
    email,
    passwordHash,
    faculty,
    programme,
    yearOfStudy
  } = userData;

  const [result] = await db.query(
    `INSERT INTO users
    (full_name, email, password_hash, faculty, programme, year_of_study)
    VALUES (?, ?, ?, ?, ?, ?)`,
    [fullName, email, passwordHash, faculty, programme, yearOfStudy]
  );

  return result.insertId;
};

exports.format = (user) => {
  if (!user) return null;

  return {
    userId: user.user_id,
    fullName: user.full_name,
    email: user.email,
    role: user.role,
    accountStatus: user.account_status,
    faculty: user.faculty,
    programme: user.programme,
    yearOfStudy: user.year_of_study,
    currentSemester: user.current_semester,
    totalCredits: user.total_credits,
    currentGpa: Number(user.current_gpa)
  };
};