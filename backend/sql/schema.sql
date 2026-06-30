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

INSERT INTO subject_progress (student_id, subject, progress) VALUES
  (1, 'Application Development', 82),
  (1, 'Data Structures', 46),
  (1, 'Computer Security', 67),
  (1, 'Requirements Engineering', 74);

INSERT INTO study_time (student_id, subject, hours) VALUES
  (1, 'App Dev', 7),
  (1, 'DSA', 4),
  (1, 'Security', 3),
  (1, 'Req Eng', 4);

INSERT INTO task_completion (student_id, completed, pending, overdue) VALUES
  (1, 14, 4, 2)
  ON DUPLICATE KEY UPDATE completed = VALUES(completed), pending = VALUES(pending), overdue = VALUES(overdue);

INSERT INTO ai_resources (student_id, title, type, subject, duration, priority) VALUES
  (1, 'Application Development UI Notes', 'notes', 'Application Development', '20 min', 'Urgent'),
  (1, 'Linked List Weak Area Revision', 'weak', 'Data Structures', '35 min', 'Weak Area'),
  (1, 'DSA Practice Questions', 'practice', 'Data Structures', '45 min', 'Practice'),
  (1, 'Computer Security Revision Video', 'video', 'Computer Security', '25 min', 'Video');

INSERT INTO ai_suggestions (student_id, title, reason, confidence) VALUES
  (1, 'Focus on Data Structures today', 'Lowest subject progress detected', 89),
  (1, 'Complete overdue tasks', 'Overdue tasks increase academic risk', 82);
  