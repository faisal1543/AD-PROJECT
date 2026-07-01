# Sifu - UTM Study Planner Frontend & Backend

This repository contains the frontend and backend implementation for the **Sifu - UTM Study Planner** project.

Sifu is a student-focused academic support system designed to help UTM students manage courses, tasks, study schedules, academic progress, AI recommendations, notifications, chatbot support, and feedback interactions through a responsive web-based interface.

---

## Repository Structure

```text
AD-PROJECT/
├── backend/
├── sifu-abdulrahman-ui/
├── sifu-alfaisal-ui/
├── sifu-maged-ui/
├── .gitignore
└── README.md
```

---

## Frontend Index Table

### Subsystem 1: AI Recommendation & Analytics

**Developer:** Alfaisal

| Module Name | Frontend Script |
|---|---|
| AI Hub / Main AI Navigation | [ai-hub.html](sifu-alfaisal-ui/ai-hub.html) |
| AI Study Planner | [study-planner.html](sifu-alfaisal-ui/study-planner.html) |
| Academic Risk Prediction | [risk-prediction.html](sifu-alfaisal-ui/risk-prediction.html) |
| Study Resource Recommendation | [resources.html](sifu-alfaisal-ui/resources.html) |
| Analytics & Insights Dashboard | [analytics.html](sifu-alfaisal-ui/analytics.html) |
| Shared Styling | [style.css](sifu-alfaisal-ui/css/style.css) |
| JavaScript Interactions | [alfaisal.js](sifu-alfaisal-ui/js/alfaisal.js) |
| Project Logo | [logo.jpg](sifu-alfaisal-ui/assets/logo.jpg) |

---

### Subsystem 2: User Management & Academic Tracking

**Developer:** Abdulrahman

| Module Name | Frontend Script |
|---|---|
| Welcome / Splash Page | [index.html](sifu-abdulrahman-ui/index.html) |
| User Login Page | [login.html](sifu-abdulrahman-ui/login.html) |
| User Registration Page | [signup.html](sifu-abdulrahman-ui/signup.html) |
| Home Dashboard / Academic Overview | [calendar.html](sifu-abdulrahman-ui/calendar.html) |
| Profile and Settings Page | [profile.html](sifu-abdulrahman-ui/profile.html) |
| Course Management Module | [courses.html](sifu-abdulrahman-ui/courses.html) |
| Academic Task Management Module | [tasks.html](sifu-abdulrahman-ui/tasks.html) |
| Generated Study Schedule Page | [schedule.html](sifu-abdulrahman-ui/schedule.html) |
| Shared Styling | [style.css](sifu-abdulrahman-ui/css/style.css) |
| JavaScript Interactions | [app.js](sifu-abdulrahman-ui/js/app.js) |
| Project Logo | [logo.jpeg](sifu-abdulrahman-ui/assets/logo.jpeg) |

---

### Subsystem 3: Communication & Support

**Developer:** Maged

| Module Name | Frontend Script |
|---|---|
| AI Chatbot Assistant | [chatbot.html](sifu-maged-ui/chatbot.html) |
| Notification & Reminder Module | [notifications.html](sifu-maged-ui/notifications.html) |
| Help & Support Page | [support.html](sifu-maged-ui/support.html) |
| Feedback & Support Module | [feedback.html](sifu-maged-ui/feedback.html) |
| Help Center Page | [help.html](sifu-maged-ui/help.html) |
| Shared Styling | [style.css](sifu-maged-ui/css/style.css) |
| JavaScript Interactions | [app.js](sifu-maged-ui/app.js) |

---

## Alfaisal Backend API Index

| Backend Module | Backend Script |
|---|---|
| Backend Server Setup | [server.js](backend/server.js) |
| Backend Package Configuration | [package.json](backend/package.json) |
| Backend Environment Example | [.env.example](backend/.env.example) |
| Backend Documentation | [README.md](backend/README.md) |
| Database Connection Pool (MySQL) | [db.js](backend/config/db.js) |
| Database Schema | [schema.sql](backend/sql/schema.sql) |
| AI Recommendation Routes | [aiRoutes.js](backend/routes/aiRoutes.js) |
| Analytics Routes | [analyticsRoutes.js](backend/routes/analyticsRoutes.js) |
| AI Recommendation Controller | [aiController.js](backend/controllers/aiController.js) |
| Analytics Controller | [analyticsController.js](backend/controllers/analyticsController.js) |
| AI Recommendation Model | [aiModel.js](backend/models/aiModel.js) |
| Analytics Model | [analyticsModel.js](backend/models/analyticsModel.js) |

---

## Abdulrahman Backend API Index

| Backend Module | Backend Script |
|---|---|
| Authentication Routes | [authRoutes.js](backend/routes/authRoutes.js) |
| User Routes | [userRoutes.js](backend/routes/userRoutes.js) |
| Course Routes | [courseRoutes.js](backend/routes/courseRoutes.js) |
| Task Routes | [taskRoutes.js](backend/routes/taskRoutes.js) |
| Dashboard Routes | [dashboardRoutes.js](backend/routes/dashboardRoutes.js) |
| Schedule Routes | [scheduleRoutes.js](backend/routes/scheduleRoutes.js) |
| Authentication Controller | [authController.js](backend/controllers/authController.js) |
| User Controller | [userController.js](backend/controllers/userController.js) |
| Course Controller | [courseController.js](backend/controllers/courseController.js) |
| Task Controller | [taskController.js](backend/controllers/taskController.js) |
| Dashboard Controller | [dashboardController.js](backend/controllers/dashboardController.js) |
| Schedule Controller | [scheduleController.js](backend/controllers/scheduleController.js) |
| User Model | [userModel.js](backend/models/userModel.js) |
| Course Model | [courseModel.js](backend/models/courseModel.js) |
| Task Model | [taskModel.js](backend/models/taskModel.js) |

---

## Maged Backend API Index

| Backend Module | Backend Script |
|---|---|
| Support Routes (chat, notifications, feedback, help) | [supportRoutes.js](backend/routes/supportRoutes.js) |
| Support Controller | [supportController.js](backend/controllers/supportController.js) |
| Support Model | [supportModel.js](backend/models/supportModel.js) |

---

## Alfaisal Backend API Summary

The backend API supports the **AI Recommendation & Intelligence subsystem** and the **Analytics & Insights subsystem**, backed by a real **MySQL database** (`sifu_db`).

It provides endpoints for:

- Analytics overview
- Subject progress
- Study time distribution
- Task completion
- Weak area analysis
- Academic risk prediction
- Study resource recommendation
- AI suggestions
- Study plan generation

The Analytics dashboard frontend is connected to the backend API using JavaScript `fetch()`. When the backend server is running, the dashboard loads GPA, task completion, study hours, weak subject, study time chart data, and task completion chart data directly from MySQL via the API.

---

## How to Run the Backend

**1. Create the database and load the schema:**

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS sifu_db"
mysql -u root -p sifu_db < backend/sql/schema.sql
```

**2. Set up environment variables:**

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your local MySQL credentials.

**3. Install dependencies and run:**

```bash
npm install
npm start
```

The backend server runs on:

```text
http://localhost:5000
```

You should see `MySQL connected successfully.` in the console if the database connection works.

---

## Backend API Endpoints

### Health Check

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Check if the backend server is running |

---

### Analytics & Insights APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/analytics/overview/1` | Get GPA, completed tasks, study hours, and weak subject |
| GET | `/api/analytics/subject-progress/1` | Get subject progress percentages |
| GET | `/api/analytics/study-time/1` | Get weekly study time distribution |
| GET | `/api/analytics/task-completion/1` | Get completed, pending, and overdue task counts |
| GET | `/api/analytics/weak-areas/1` | Get weak academic areas and AI recommendations |

---

### AI Recommendation & Intelligence APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/ai/risk/1` | Get academic risk prediction (calculated from real DB data: overdue tasks, study hours, weakest subject) |
| GET | `/api/ai/resources/1` | Get recommended study resources |
| GET | `/api/ai/suggestions/1` | Get AI suggestions |
| POST | `/api/ai/generate-plan` | Generate a personalized study plan |

---

### Authentication APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register a new student account |
| POST | `/api/auth/login` | Log in with email and password |

---

### User Management APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users/:userId` | Get a student's profile details |
| PUT | `/api/users/:userId` | Update a student's profile details |

---

### Course Management APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/courses/:userId` | Get all courses for a student |
| POST | `/api/courses` | Add a new course |
| PUT | `/api/courses/:courseId` | Update an existing course |
| DELETE | `/api/courses/:courseId` | Delete a course |

---

### Task Management APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks/:userId` | Get all academic tasks for a student |
| POST | `/api/tasks` | Add a new task |
| PUT | `/api/tasks/:taskId` | Update an existing task |
| PATCH | `/api/tasks/:taskId/status` | Update a task's completion status |
| DELETE | `/api/tasks/:taskId` | Delete a task |

---

### Dashboard APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard/:userId` | Get home dashboard summary (priority task counts, course progress, upcoming deadlines) |

---

### Schedule APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/schedule/:userId` | Get the generated study schedule for a student |

---

### Communication & Support APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/support/chat/messages/:studentId` | Get chatbot message history |
| POST | `/api/support/chat/messages` | Send a message to the chatbot and receive a reply |
| GET | `/api/support/notifications/:studentId` | Get a student's notification feed |
| PATCH | `/api/support/notifications/:notificationId/read` | Mark a notification as read |
| GET | `/api/support/notification-settings/:studentId` | Get a student's notification preferences |
| PUT | `/api/support/notification-settings/:studentId` | Update a student's notification preferences |
| POST | `/api/support/feedback` | Submit feedback |
| GET | `/api/support/feedback/:studentId` | Get feedback submitted by a student |
| GET | `/api/support/faqs` | Get frequently asked questions |
| GET | `/api/support/help-topics` | Get help center topics |

---

## POST Study Plan Example

Endpoint:

```text
POST /api/ai/generate-plan
```

Request body:

```json
{
  "subject": "Data Structures",
  "hours": 3,
  "priority": "High",
  "deadline": "2026-06-22",
  "studentId": 1
}
```

`studentId` is optional — if provided, the generated plan is saved to the database (`generated_study_plans` table). If omitted, the plan is returned without being persisted.

---

## Technologies Used

- HTML
- CSS
- JavaScript
- Bootstrap 5
- Bootstrap Icons
- Chart.js
- Node.js
- Express.js
- MySQL (mysql2)
- CORS
- dotenv
- LocalStorage

---

## Project Notes

The frontend uses prototype data to demonstrate the main functions of the Sifu - UTM Study Planner system. These functions include AI recommendation, academic risk prediction, study resource filtering, analytics dashboard features, user management, course management, academic task tracking, home dashboard summaries, generated study schedule features, chatbot assistance, notifications, reminders, support pages, and feedback submission.

Alfaisal's part focuses on the **AI Recommendation & Intelligence subsystem** and the **Analytics & Insights subsystem**. The implemented pages allow students to access the AI Hub, generate personalized study plans, check academic risk prediction, receive study resource recommendations, and view academic analytics dashboards.

Alfaisal also implemented a full backend API using **Node.js and Express.js**, connected to a **MySQL database**. The backend provides API routes for analytics overview, subject progress, study time distribution, task completion, weak areas, academic risk prediction, study resources, AI suggestions, and study plan generation, with all data read from and written to real database tables (see [schema.sql](backend/sql/schema.sql)).

The Analytics dashboard frontend is connected to the backend API using JavaScript `fetch()`. This allows dashboard values and chart data to load live from the database when the server is running.

The backend analytics controller calculates the weakest subject dynamically using a SQL query (`ORDER BY progress ASC LIMIT 1`) rather than reading from a fixed value. The risk prediction score is also calculated dynamically, combining overdue task count, total study hours, and weakest subject progress into a rule-based risk score, rather than being hardcoded.

Abdulrahman's part focuses on the **User Management subsystem** and the **Academic Tracking subsystem**. The implemented pages allow students to access the welcome page, log in, sign up, view their profile, manage courses, manage academic tasks, view the home dashboard, and view a generated study schedule. Login, signup, profile, courses, tasks, the home dashboard, and the study schedule are all connected to live backend endpoints (`/api/auth`, `/api/users`, `/api/courses`, `/api/tasks`, `/api/dashboard`, `/api/schedule`) backed by MySQL. LocalStorage is used only as an offline fallback if the API request fails, so the pages keep working even if the backend server is temporarily unreachable.

Maged's part focuses on the **Communication & Support subsystem**. The implemented pages allow students to use the AI chatbot assistant, view and manage notification settings, access help and support categories, read frequently asked questions, submit feedback, and use the help center page. The chatbot, notification settings, and feedback pages are connected to live backend endpoints (`/api/support/chat/messages`, `/api/support/notification-settings`, `/api/support/feedback`) backed by MySQL — chatbot replies, saved notification preferences, and submitted feedback are all persisted to real database tables. The help and support pages currently display static content; backend routes for FAQs and help topics (`/api/support/faqs`, `/api/support/help-topics`) exist but are not yet wired to those pages.

In the complete system, these frontend pages and backend APIs are connected to a real MySQL database so that user accounts, courses, tasks, schedules, chatbot records, and feedback reports are based on each student's actual data. Remaining gaps: academic risk prediction and study resource recommendations have working backend endpoints (`/api/ai/risk`, `/api/ai/resources`) that aren't yet called from `risk-prediction.html` and `resources.html` (both still show static/demo values), and the three subsystems don't yet share a single logged-in student ID — analytics, AI, and support pages currently use a hardcoded `studentId = 1` rather than the ID from Abdulrahman's login session.

---

## Final Submission Checklist

- Frontend pages are organized by subsystem.
- Backend API files are organized using routes, controllers, and models.
- README includes an index table with clickable links.
- `.env.example` is included.
- `.env` is not uploaded.
- `node_modules/` is not uploaded.
- Analytics dashboard is connected to the backend API.
- Backend is connected to a real MySQL database (`schema.sql` included).
- Dynamic weak-subject logic is implemented in the backend (SQL-based).
- Academic risk prediction is calculated dynamically, not hardcoded.
