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
| JavaScript Interactions | [app.js](sifu-maged-ui/js/app.js) |

---

## Alfaisal Backend API Index

| Backend Module | Backend Script |
|---|---|
| Backend Server Setup | [server.js](backend/server.js) |
| Backend Package Configuration | [package.json](backend/package.json) |
| Backend Environment Example | [.env.example](backend/.env.example) |
| Backend Documentation | [README.md](backend/README.md) |
| Database Config Placeholder | [db.js](backend/config/db.js) |
| AI Recommendation Routes | [aiRoutes.js](backend/routes/aiRoutes.js) |
| Analytics Routes | [analyticsRoutes.js](backend/routes/analyticsRoutes.js) |
| AI Recommendation Controller | [aiController.js](backend/controllers/aiController.js) |
| Analytics Controller | [analyticsController.js](backend/controllers/analyticsController.js) |
| AI Recommendation Model | [aiModel.js](backend/models/aiModel.js) |
| Analytics Model | [analyticsModel.js](backend/models/analyticsModel.js) |

---

## Alfaisal Backend API Summary

The backend API supports the **AI Recommendation & Intelligence subsystem** and the **Analytics & Insights subsystem**.

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

The Analytics dashboard frontend is connected to the backend API using JavaScript `fetch()`. When the backend server is running, the dashboard loads GPA, task completion, study hours, weak subject, study time chart data, and task completion chart data from the backend API.

---

## How to Run the Backend

Open a terminal inside the project folder and run:

```bash
cd backend
npm install
npm start
```

The backend server runs on:

```text
http://localhost:5000
```

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
| GET | `/api/ai/risk/1` | Get academic risk prediction |
| GET | `/api/ai/resources/1` | Get recommended study resources |
| GET | `/api/ai/suggestions/1` | Get AI suggestions |
| POST | `/api/ai/generate-plan` | Generate a personalized study plan |

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
  "deadline": "2026-06-22"
}
```

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
- CORS
- dotenv
- LocalStorage

---

## Project Notes

The frontend uses prototype data to demonstrate the main functions of the Sifu - UTM Study Planner system. These functions include AI recommendation, academic risk prediction, study resource filtering, analytics dashboard features, user management, course management, academic task tracking, home dashboard summaries, generated study schedule features, chatbot assistance, notifications, reminders, support pages, and feedback submission.

Alfaisal's part focuses on the **AI Recommendation & Intelligence subsystem** and the **Analytics & Insights subsystem**. The implemented pages allow students to access the AI Hub, generate personalized study plans, check academic risk prediction, receive study resource recommendations, and view academic analytics dashboards.

Alfaisal also implemented a backend API prototype using **Node.js and Express.js**. The backend provides API routes for analytics overview, subject progress, study time distribution, task completion, weak areas, academic risk prediction, study resources, AI suggestions, and study plan generation.

The Analytics dashboard frontend is connected to the backend API using JavaScript `fetch()`. This allows dashboard values and chart data to load from the backend when the server is running.

The backend analytics controller calculates the weakest subject dynamically by selecting the subject with the lowest progress percentage from the prototype analytics data. Therefore, the weak subject is not only manually displayed on the frontend.

Abdulrahman's part focuses on the **User Management subsystem** and the **Academic Tracking subsystem**. The implemented pages allow students to access the welcome page, log in, sign up, view their profile, manage courses, manage academic tasks, view the home dashboard, and view a generated study schedule. The course and task pages use LocalStorage to support adding, editing, deleting, filtering, and updating prototype academic data.

Maged's part focuses on the **Communication & Support subsystem**. The implemented pages allow students to use the AI chatbot assistant, view study reminders and deadline notifications, manage notification settings, access help and support categories, read frequently asked questions, submit feedback, and use the help center page. The chatbot page includes smart prototype replies using JavaScript, while the notification page includes toggle switches and toast messages. The feedback page includes form validation and a success message to demonstrate user support interaction.

In the complete system, these frontend pages and backend APIs can be connected to a database so that user accounts, courses, tasks, schedules, academic progress, notifications, chatbot records, feedback reports, analytics insights, and AI-generated outputs are based on each student's actual data.

---

## Final Submission Checklist

- Frontend pages are organized by subsystem.
- Backend API files are organized using routes, controllers, and models.
- README includes an index table with clickable links.
- `.env.example` is included.
- `.env` is not uploaded.
- `node_modules/` is not uploaded.
- Analytics dashboard is connected to the backend API.
- Dynamic weak-subject logic is implemented in the backend.
