# Sifu - UTM Study Planner Frontend

This repository contains the frontend implementation for the **Sifu - UTM Study Planner** project.

Sifu is a student-focused academic support system designed to help UTM students manage their courses, tasks, study schedules, academic progress, AI recommendations, notifications, chatbot support, and feedback interactions through a responsive web-based interface.

---

## Frontend Index Table

### Subsystem 1: AI Recommendation & Analytics

**Developer: Alfaisal**

| Sprint | Module Name                    | Frontend Script                                               |
| ------ | ------------------------------ | ------------------------------------------------------------- |
| 1      | AI Hub / Main AI Navigation    | [ai-hub.html](sifu-alfaisal-ui/ai-hub.html)                   |
| 1      | AI Study Planner               | [study-planner.html](sifu-alfaisal-ui/study-planner.html)     |
| 1      | Academic Risk Prediction       | [risk-prediction.html](sifu-alfaisal-ui/risk-prediction.html) |
| 1      | Study Resource Recommendation  | [resources.html](sifu-alfaisal-ui/resources.html)             |
| 1      | Analytics & Insights Dashboard | [analytics.html](sifu-alfaisal-ui/analytics.html)             |
| 1      | Shared Styling                 | [style.css](sifu-alfaisal-ui/css/style.css)                   |
| 1      | JavaScript Interactions        | [alfaisal.js](sifu-alfaisal-ui/js/alfaisal.js)                |
| 1      | Project Logo                   | [logo.jpg](sifu-alfaisal-ui/assets/logo.jpg)                  |

---

### Subsystem 2: User Management & Academic Tracking

**Developer: Abdulrahman**

| Sprint | Module Name                        | Frontend Script                                    |
| ------ | ---------------------------------- | -------------------------------------------------- |
| 1      | Welcome / Splash Page              | [index.html](sifu-abdulrahman-ui/index.html)       |
| 1      | User Login Page                    | [login.html](sifu-abdulrahman-ui/login.html)       |
| 1      | User Registration Page             | [signup.html](sifu-abdulrahman-ui/signup.html)     |
| 1      | Home Dashboard / Academic Overview | [calendar.html](sifu-abdulrahman-ui/calendar.html) |
| 1      | Profile and Settings Page          | [profile.html](sifu-abdulrahman-ui/profile.html)   |
| 1      | Course Management Module           | [courses.html](sifu-abdulrahman-ui/courses.html)   |
| 1      | Academic Task Management Module    | [tasks.html](sifu-abdulrahman-ui/tasks.html)       |
| 1      | Generated Study Schedule Page      | [schedule.html](sifu-abdulrahman-ui/schedule.html) |
| 1      | Shared Styling                     | [style.css](sifu-abdulrahman-ui/css/style.css)     |
| 1      | JavaScript Interactions            | [app.js](sifu-abdulrahman-ui/js/app.js)            |
| 1      | Project Logo                       | [logo.jpeg](sifu-abdulrahman-ui/assets/logo.jpeg)  |

---

### Subsystem 3: Communication & Support

**Developer: Maged**

| Sprint | Module Name                    | Frontend Script                                        |
| ------ | ------------------------------ | ------------------------------------------------------ |
| 1      | AI Chatbot Assistant           | [chatbot.html](sifu-maged-ui/chatbot.html)             |
| 1      | Notification & Reminder Module | [notifications.html](sifu-maged-ui/notifications.html) |
| 1      | Help & Support Page            | [support.html](sifu-maged-ui/support.html)             |
| 1      | Feedback & Support Module      | [feedback.html](sifu-maged-ui/feedback.html)           |
| 1      | Help Center Page               | [help.html](sifu-maged-ui/help.html)                   |
| 1      | Shared Styling                 | [style.css](sifu-maged-ui/style.css)                   |
| 1      | JavaScript Interactions        | [app.js](sifu-maged-ui/app.js)                         |

---

## Technologies Used

* HTML
* CSS
* JavaScript
* Bootstrap 5
* Bootstrap Icons
* Chart.js
* LocalStorage

---

## Notes

The frontend uses prototype data to demonstrate the main functions of the Sifu - UTM Study Planner system. These functions include AI recommendation, academic risk prediction, study resource filtering, analytics dashboard features, user management, course management, academic task tracking, home dashboard summaries, generated study schedule features, chatbot assistance, notifications, reminders, support pages, and feedback submission.

Alfaisal's part focuses on the **AI Recommendation & Intelligence** subsystem and the **Analytics & Insights** subsystem. The implemented pages allow students to access the AI Hub, generate personalized study plans, check academic risk prediction, receive study resource recommendations, and view academic analytics dashboards. These pages demonstrate AI-based academic support using prototype data, including study suggestions, risk score displays, recommended resources, progress indicators, charts, and dashboard summaries.

Abdulrahman's part focuses on the **User Management** subsystem and the **Academic Tracking** subsystem. The implemented pages allow students to access the welcome page, log in, sign up, view their profile, manage courses, manage academic tasks, view the home dashboard, and view a generated study schedule. The course and task pages use LocalStorage to support adding, editing, deleting, filtering, and updating prototype academic data.

Maged's part focuses on the **Communication & Support** subsystem. The implemented pages allow students to use the AI chatbot assistant, view study reminders and deadline notifications, manage notification settings, access help and support categories, read frequently asked questions, submit feedback, and use the help center page. The chatbot page includes smart prototype replies using JavaScript, while the notification page includes toggle switches and toast messages. The feedback page includes form validation and a success message to demonstrate user support interaction.

In the complete system, these frontend pages will be connected to the backend database so that user accounts, courses, tasks, schedules, academic progress, notifications, chatbot records, feedback reports, and AI-generated outputs are based on each student's actual data.
