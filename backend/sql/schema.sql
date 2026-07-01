-- ============================================================
-- Sifu UTM Study Planner — Alfaisal modules (AI + Analytics)
-- ============================================================
-- Run this against your sifu_db database (or whatever DB_NAME you set).
-- mysql -u root -p sifu_db < schema.sql

CREATE DATABASE IF NOT EXISTS sifu_db;
USE sifu_db;

-- ----------------------------------------------------------
-- students (minimal, just enough to satisfy FKs + studentId param)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS students (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  gpa DECIMAL(3,2) NOT NULL DEFAULT 0.00
);

-- ----------------------------------------------------------
-- subject_progress  ->  /api/analytics/subject-progress/:studentId
-- also feeds weakest-subject logic in overview + weak-areas
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS subject_progress (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  subject VARCHAR(100) NOT NULL,
  progress INT NOT NULL,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------
-- study_time  ->  /api/analytics/study-time/:studentId
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS study_time (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  subject VARCHAR(100) NOT NULL,
  hours INT NOT NULL,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------
-- task_completion  ->  /api/analytics/task-completion/:studentId
-- one row per student (completed/pending/overdue counts)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS task_completion (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL UNIQUE,
  completed INT NOT NULL DEFAULT 0,
  pending INT NOT NULL DEFAULT 0,
  overdue INT NOT NULL DEFAULT 0,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------
-- ai_resources  ->  /api/ai/resources/:studentId
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS ai_resources (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  title VARCHAR(150) NOT NULL,
  type VARCHAR(50) NOT NULL,        -- notes | weak | practice | video
  subject VARCHAR(100) NOT NULL,
  duration VARCHAR(20) NOT NULL,    -- e.g. "20 min"
  priority VARCHAR(50) NOT NULL,    -- e.g. "Urgent", "Weak Area"
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------
-- ai_suggestions  ->  /api/ai/suggestions/:studentId
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS ai_suggestions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  title VARCHAR(150) NOT NULL,
  reason VARCHAR(255) NOT NULL,
  confidence INT NOT NULL,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- ----------------------------------------------------------
-- generated_study_plans + items  ->  POST /api/ai/generate-plan
-- persists what the planner page generates instead of losing it on refresh
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS generated_study_plans (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  subject VARCHAR(100) NOT NULL,
  hours INT NOT NULL,
  priority VARCHAR(20) NOT NULL,
  deadline DATE NOT NULL,
  ai_message VARCHAR(255) NOT NULL,
  confidence INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS generated_study_plan_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  plan_id INT NOT NULL,
  time VARCHAR(10) NOT NULL,        -- e.g. "09:00"
  activity VARCHAR(255) NOT NULL,
  FOREIGN KEY (plan_id) REFERENCES generated_study_plans(id) ON DELETE CASCADE
);

-- ============================================================
-- SEED DATA — mirrors current in-memory prototype values
-- so behavior is identical right after migration
-- ============================================================

INSERT INTO students (id, name, gpa) VALUES (1, 'Demo Student', 3.45)
  ON DUPLICATE KEY UPDATE gpa = VALUES(gpa);

INSERT INTO subject_progress (student_id, subject, progress)
SELECT * FROM (SELECT 1, 'Application Development', 82) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM subject_progress WHERE student_id = 1 AND subject = 'Application Development');

INSERT INTO subject_progress (student_id, subject, progress)
SELECT * FROM (SELECT 1, 'Data Structures', 46) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM subject_progress WHERE student_id = 1 AND subject = 'Data Structures');

INSERT INTO subject_progress (student_id, subject, progress)
SELECT * FROM (SELECT 1, 'Computer Security', 67) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM subject_progress WHERE student_id = 1 AND subject = 'Computer Security');

INSERT INTO subject_progress (student_id, subject, progress)
SELECT * FROM (SELECT 1, 'Requirements Engineering', 74) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM subject_progress WHERE student_id = 1 AND subject = 'Requirements Engineering');

INSERT INTO study_time (student_id, subject, hours)
SELECT * FROM (SELECT 1, 'App Dev', 7) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM study_time WHERE student_id = 1 AND subject = 'App Dev');

INSERT INTO study_time (student_id, subject, hours)
SELECT * FROM (SELECT 1, 'DSA', 4) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM study_time WHERE student_id = 1 AND subject = 'DSA');

INSERT INTO study_time (student_id, subject, hours)
SELECT * FROM (SELECT 1, 'Security', 3) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM study_time WHERE student_id = 1 AND subject = 'Security');

INSERT INTO study_time (student_id, subject, hours)
SELECT * FROM (SELECT 1, 'Req Eng', 4) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM study_time WHERE student_id = 1 AND subject = 'Req Eng');

INSERT INTO task_completion (student_id, completed, pending, overdue) VALUES
  (1, 14, 4, 2)
  ON DUPLICATE KEY UPDATE completed = VALUES(completed), pending = VALUES(pending), overdue = VALUES(overdue);

INSERT INTO ai_resources (student_id, title, type, subject, duration, priority)
SELECT * FROM (SELECT 1, 'Application Development UI Notes', 'notes', 'Application Development', '20 min', 'Urgent') AS tmp
WHERE NOT EXISTS (SELECT 1 FROM ai_resources WHERE student_id = 1 AND title = 'Application Development UI Notes');

INSERT INTO ai_resources (student_id, title, type, subject, duration, priority)
SELECT * FROM (SELECT 1, 'Linked List Weak Area Revision', 'weak', 'Data Structures', '35 min', 'Weak Area') AS tmp
WHERE NOT EXISTS (SELECT 1 FROM ai_resources WHERE student_id = 1 AND title = 'Linked List Weak Area Revision');

INSERT INTO ai_resources (student_id, title, type, subject, duration, priority)
SELECT * FROM (SELECT 1, 'DSA Practice Questions', 'practice', 'Data Structures', '45 min', 'Practice') AS tmp
WHERE NOT EXISTS (SELECT 1 FROM ai_resources WHERE student_id = 1 AND title = 'DSA Practice Questions');

INSERT INTO ai_resources (student_id, title, type, subject, duration, priority)
SELECT * FROM (SELECT 1, 'Computer Security Revision Video', 'video', 'Computer Security', '25 min', 'Video') AS tmp
WHERE NOT EXISTS (SELECT 1 FROM ai_resources WHERE student_id = 1 AND title = 'Computer Security Revision Video');

INSERT INTO ai_suggestions (student_id, title, reason, confidence)
SELECT * FROM (SELECT 1, 'Focus on Data Structures today', 'Lowest subject progress detected', 89) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM ai_suggestions WHERE student_id = 1 AND title = 'Focus on Data Structures today');

INSERT INTO ai_suggestions (student_id, title, reason, confidence)
SELECT * FROM (SELECT 1, 'Complete overdue tasks', 'Overdue tasks increase academic risk', 82) AS tmp
WHERE NOT EXISTS (SELECT 1 FROM ai_suggestions WHERE student_id = 1 AND title = 'Complete overdue tasks');
  
  -- ============================================================
-- Maged Communication & Support Module
-- ============================================================

CREATE TABLE IF NOT EXISTS chatbot_messages (
    message_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    sender ENUM('user', 'bot') NOT NULL,
    message_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    notification_type ENUM('deadline', 'study_reminder', 'ai_suggestion', 'system') NOT NULL,
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    status ENUM('unread', 'read') DEFAULT 'unread',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notification_settings (
    setting_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL UNIQUE,
    study_reminders BOOLEAN DEFAULT TRUE,
    deadline_reminders BOOLEAN DEFAULT TRUE,
    ai_suggestions BOOLEAN DEFAULT TRUE,
    email_notifications BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS feedback (
    feedback_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    category ENUM(
        'Chatbot issue',
        'Notification issue',
        'Study planner issue',
        'Account problem',
        'General feedback'
    ) NOT NULL,
    rating TINYINT NOT NULL,
    subject VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('pending', 'reviewed', 'resolved') DEFAULT 'pending',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS support_faqs (
    faq_id INT PRIMARY KEY AUTO_INCREMENT,
    question VARCHAR(255) NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS help_topics (
    topic_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO notification_settings (
    student_id,
    study_reminders,
    deadline_reminders,
    ai_suggestions,
    email_notifications
)
SELECT
    1,
    TRUE,
    TRUE,
    TRUE,
    FALSE
WHERE EXISTS (
    SELECT 1 FROM students WHERE id = 1
)
ON DUPLICATE KEY UPDATE
    study_reminders = VALUES(study_reminders),
    deadline_reminders = VALUES(deadline_reminders),
    ai_suggestions = VALUES(ai_suggestions),
    email_notifications = VALUES(email_notifications);

INSERT INTO notifications (
    student_id,
    title,
    message,
    notification_type,
    priority,
    status
)
SELECT
    1,
    'Application Development Deadline',
    'Project submission is due tomorrow. Complete your frontend part today.',
    'deadline',
    'high',
    'unread'
WHERE EXISTS (
    SELECT 1 FROM students WHERE id = 1
)
AND NOT EXISTS (
    SELECT 1 FROM notifications
    WHERE student_id = 1
    AND title = 'Application Development Deadline'
);

INSERT INTO notifications (
    student_id,
    title,
    message,
    notification_type,
    priority,
    status
)
SELECT
    1,
    'DSA Revision Reminder',
    'Revise stacks and linked lists tonight at 8:00 PM.',
    'study_reminder',
    'medium',
    'unread'
WHERE EXISTS (
    SELECT 1 FROM students WHERE id = 1
)
AND NOT EXISTS (
    SELECT 1 FROM notifications
    WHERE student_id = 1
    AND title = 'DSA Revision Reminder'
);

INSERT INTO notifications (
    student_id,
    title,
    message,
    notification_type,
    priority,
    status
)
SELECT
    1,
    'AI Study Suggestion',
    'Add one more study session for your weak subject this week.',
    'ai_suggestion',
    'low',
    'read'
WHERE EXISTS (
    SELECT 1 FROM students WHERE id = 1
)
AND NOT EXISTS (
    SELECT 1 FROM notifications
    WHERE student_id = 1
    AND title = 'AI Study Suggestion'
);

INSERT INTO support_faqs (question, answer)
SELECT
    'How do I reset my password?',
    'Go to the login page and click Forgot Password. Then follow the reset steps using your UTM email.'
WHERE NOT EXISTS (
    SELECT 1 FROM support_faqs
    WHERE question = 'How do I reset my password?'
);

INSERT INTO support_faqs (question, answer)
SELECT
    'Why am I not receiving reminders?',
    'Check whether deadline reminders and study reminders are enabled in your notification settings.'
WHERE NOT EXISTS (
    SELECT 1 FROM support_faqs
    WHERE question = 'Why am I not receiving reminders?'
);

INSERT INTO support_faqs (question, answer)
SELECT
    'How does the chatbot help me?',
    'The chatbot gives study guidance, task priority suggestions, revision plans, and support for weak subjects.'
WHERE NOT EXISTS (
    SELECT 1 FROM support_faqs
    WHERE question = 'How does the chatbot help me?'
);

INSERT INTO support_faqs (question, answer)
SELECT
    'How do I contact support?',
    'Use the feedback page to submit your issue. The support team can review your message and respond later.'
WHERE NOT EXISTS (
    SELECT 1 FROM support_faqs
    WHERE question = 'How do I contact support?'
);

INSERT INTO help_topics (title, description, icon)
SELECT
    'Getting Started',
    'Use the bottom navigation to move between chatbot, alerts, support, and feedback pages.',
    'rocket'
WHERE NOT EXISTS (
    SELECT 1 FROM help_topics
    WHERE title = 'Getting Started'
);

INSERT INTO help_topics (title, description, icon)
SELECT
    'Using Sifu Chatbot',
    'Ask study-related questions such as what task to do first or how to revise weak subjects.',
    'chat'
WHERE NOT EXISTS (
    SELECT 1 FROM help_topics
    WHERE title = 'Using Sifu Chatbot'
);

INSERT INTO help_topics (title, description, icon)
SELECT
    'Managing Notifications',
    'Turn study reminders, deadline alerts, AI suggestions, and email notifications on or off.',
    'bell'
WHERE NOT EXISTS (
    SELECT 1 FROM help_topics
    WHERE title = 'Managing Notifications'
);

INSERT INTO help_topics (title, description, icon)
SELECT
    'Sending Feedback',
    'Use the feedback form to report issues about chatbot, reminders, account, or study planner.',
    'pencil'
WHERE NOT EXISTS (
    SELECT 1 FROM help_topics
    WHERE title = 'Sending Feedback'
);

-- ============================================================
-- Abdulrahman User Management + Academic Tracking Module
-- Safe append-only schema
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('student', 'admin') DEFAULT 'student',
  account_status ENUM('active', 'inactive') DEFAULT 'active',
  faculty VARCHAR(100),
  programme VARCHAR(100),
  year_of_study VARCHAR(30),
  current_semester VARCHAR(30) DEFAULT 'Semester 4',
  total_credits VARCHAR(30) DEFAULT '72 / 120',
  current_gpa DECIMAL(3,2) DEFAULT 3.45,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  token_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token_hash VARCHAR(255) NOT NULL,
  expires_at DATETIME NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS courses (
  course_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  course_code VARCHAR(30) NOT NULL,
  course_name VARCHAR(150) NOT NULL,
  lecturer VARCHAR(100),
  credits INT DEFAULT 3,
  progress INT DEFAULT 0,
  color VARCHAR(30) DEFAULT 'red',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS academic_tasks (
  task_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  course_id INT,
  course_code VARCHAR(30) NOT NULL,
  task_title VARCHAR(150) NOT NULL,
  status ENUM('Pending', 'Overdue', 'Completed') DEFAULT 'Pending',
  priority ENUM('High', 'Medium', 'Low') DEFAULT 'Medium',
  due_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS study_schedules (
  schedule_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  task_id INT,
  study_day VARCHAR(50),
  study_time VARCHAR(50),
  ai_note VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (task_id) REFERENCES academic_tasks(task_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS study_sessions (
  session_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  course_id INT,
  session_title VARCHAR(150),
  session_date DATE,
  start_time TIME,
  end_time TIME,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE SET NULL
);
