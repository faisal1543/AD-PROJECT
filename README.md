# Sifu - UTM Study Planner Frontend

This repository contains the frontend implementation for the Sifu - UTM Study Planner project.

## Frontend Index Table

| Member      | Module Name                        | Frontend Script                                               |
| ----------- | ---------------------------------- | ------------------------------------------------------------- |
| Alfaisal    | AI Hub / Main AI Navigation        | [ai-hub.html](sifu-alfaisal-ui/ai-hub.html)                   |
| Alfaisal    | AI Study Planner                   | [study-planner.html](sifu-alfaisal-ui/study-planner.html)     |
| Alfaisal    | Academic Risk Prediction           | [risk-prediction.html](sifu-alfaisal-ui/risk-prediction.html) |
| Alfaisal    | Study Resource Recommendation      | [resources.html](sifu-alfaisal-ui/resources.html)             |
| Alfaisal    | Analytics & Insights Dashboard     | [analytics.html](sifu-alfaisal-ui/analytics.html)             |
| Alfaisal    | Shared Styling                     | [style.css](sifu-alfaisal-ui/css/style.css)                   |
| Alfaisal    | JavaScript Interactions            | [alfaisal.js](sifu-alfaisal-ui/js/alfaisal.js)                |
| Alfaisal    | Project Logo                       | [logo.jpg](sifu-alfaisal-ui/assets/logo.jpg)                  |
| Abdulrahman | Welcome / Splash Page              | [index.html](sifu-abdulrahman-ui/index.html)                  |
| Abdulrahman | User Login Page                    | [login.html](sifu-abdulrahman-ui/login.html)                  |
| Abdulrahman | User Registration Page             | [signup.html](sifu-abdulrahman-ui/signup.html)                |
| Abdulrahman | Home Dashboard / Academic Overview | [calendar.html](sifu-abdulrahman-ui/calendar.html)            |
| Abdulrahman | Profile and Settings Page          | [profile.html](sifu-abdulrahman-ui/profile.html)              |
| Abdulrahman | Course Management Module           | [courses.html](sifu-abdulrahman-ui/courses.html)              |
| Abdulrahman | Academic Task Management Module    | [tasks.html](sifu-abdulrahman-ui/tasks.html)                  |
| Abdulrahman | Generated Study Schedule Page      | [schedule.html](sifu-abdulrahman-ui/schedule.html)            |
| Abdulrahman | Shared Styling                     | [style.css](sifu-abdulrahman-ui/css/style.css)                |
| Abdulrahman | JavaScript Interactions            | [app.js](sifu-abdulrahman-ui/js/app.js)                       |
| Abdulrahman | Project Logo                       | [logo.jpeg](sifu-abdulrahman-ui/assets/logo.jpeg)             |
| Maged       | AI Chatbot Assistant               | [chatbot.html](sifu-maged-ui/chatbot.html)                    |
| Maged       | Notification & Reminder Module     | [notifications.html](sifu-maged-ui/notifications.html)        |
| Maged       | Help & Support Page                | [support.html](sifu-maged-ui/support.html)                    |
| Maged       | Feedback & Support Module          | [feedback.html](sifu-maged-ui/feedback.html)                  |
| Maged       | Help Center Page                   | [help.html](sifu-maged-ui/help.html)                          |
| Maged       | Shared Styling                     | [style.css](sifu-maged-ui/style.css)                          |
| Maged       | JavaScript Interactions            | [app.js](sifu-maged-ui/app.js)                                |

## Technologies Used

* HTML
* CSS
* JavaScript
* Bootstrap 5
* Bootstrap Icons
* Chart.js
* LocalStorage

## Notes

The frontend uses prototype data to demonstrate AI recommendation, academic risk prediction, study resource filtering, analytics dashboard features, user management, course management, academic task tracking, home dashboard summaries, generated study schedule features, chatbot assistance, notifications, reminders, support pages, and feedback submission features.

Alfaisal's part focuses on the AI Recommendation & Intelligence subsystem and the Analytics & Insights subsystem. The implemented pages allow students to access the AI Hub, generate personalized study plans, check academic risk prediction, receive study resource recommendations, and view analytics dashboards. These pages demonstrate AI-based academic support using prototype data, including study suggestions, risk score displays, recommended resources, progress indicators, charts, and dashboard summaries.

Abdulrahman's part focuses on the User Management subsystem and the Academic Tracking subsystem. The implemented pages allow students to access the welcome page, log in, sign up, view their profile, manage courses, manage academic tasks, view the home dashboard, and view a generated study schedule. The course and task pages use LocalStorage to support adding, editing, deleting, filtering, and updating prototype academic data.

Maged's part focuses on the Communication & Support subsystem. The implemented pages allow students to use the AI chatbot assistant, view study reminders and deadline notifications, manage notification settings, access help and support categories, read frequently asked questions, submit feedback, and use the help center page. The chatbot page includes smart prototype replies using JavaScript, while the notification page includes toggle switches and toast messages. The feedback page includes form validation and a success message to demonstrate user support interaction.

In the complete system, these frontend pages will be connected to the backend database so that user accounts, courses, tasks, schedules, academic progress, notifications, chatbot records, feedback reports, and AI-generated outputs are based on each student's actual data.
