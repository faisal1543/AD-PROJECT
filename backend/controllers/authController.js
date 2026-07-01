const bcrypt = require("bcryptjs");
const UserModel = require("../models/userModel");
const CourseModel = require("../models/courseModel");
const TaskModel = require("../models/taskModel");

exports.signup = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      faculty,
      programme,
      yearOfStudy
    } = req.body;

    if (!fullName || !email || !password || !faculty || !programme || !yearOfStudy) {
      return res.status(400).json({
        success: false,
        message: "All fields are required."
      });
    }

    if (!email.endsWith("utm.my")) {
      return res.status(400).json({
        success: false,
        message: "Please use a valid UTM email."
      });
    }

    const existingUser = await UserModel.findByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "This email is already registered."
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const userId = await UserModel.create({
      fullName,
      email,
      passwordHash,
      faculty,
      programme,
      yearOfStudy
    });

    await db.query(
      `INSERT INTO students (id, name, gpa)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
      name = VALUES(name),
      gpa = VALUES(gpa)`,
      [userId, fullName, 3.45]
    );

    await CourseModel.seedDefaults(userId);
    await TaskModel.seedDefaults(userId);

    const createdUser = await UserModel.findById(userId);

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      user: UserModel.format(createdUser)
    });
  } catch (error) {
    console.error("Signup error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during signup."
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required."
      });
    }

    const user = await UserModel.findByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    if (user.account_status !== "active") {
      return res.status(403).json({
        success: false,
        message: "This account is inactive."
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    return res.json({
      success: true,
      message: "Login successful.",
      user: UserModel.format(user)
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during login."
    });
  }
};