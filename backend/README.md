# Sifu Backend API - Alfaisal

This backend provides API endpoints for Alfaisal's assigned modules in the Sifu - UTM Study Planner project:

* AI Recommendation & Intelligence
* Analytics & Insights

## Technologies Used

* Node.js
* Express.js
* CORS
* dotenv

## How to Run

Open a terminal inside the project and run:

```bash
cd backend
npm install
npm start
```

The backend server will run on:

```text
http://localhost:5000
```

## API Endpoints

### Health Check

| Method | Endpoint | Description                            |
| ------ | -------- | -------------------------------------- |
| GET    | `/`      | Check if the backend server is running |

### Analytics & Insights

| Method | Endpoint                            | Description                                             |
| ------ | ----------------------------------- | ------------------------------------------------------- |
| GET    | `/api/analytics/overview/1`         | Get GPA, completed tasks, study hours, and weak subject |
| GET    | `/api/analytics/subject-progress/1` | Get subject progress percentages                        |
| GET    | `/api/analytics/study-time/1`       | Get weekly study time distribution                      |
| GET    | `/api/analytics/task-completion/1`  | Get completed, pending, and overdue task counts         |
| GET    | `/api/analytics/weak-areas/1`       | Get weak academic areas and AI recommendations          |

### AI Recommendation & Intelligence

| Method | Endpoint                | Description                        |
| ------ | ----------------------- | ---------------------------------- |
| GET    | `/api/ai/risk/1`        | Get academic risk prediction       |
| GET    | `/api/ai/resources/1`   | Get recommended study resources    |
| GET    | `/api/ai/suggestions/1` | Get AI suggestions                 |
| POST   | `/api/ai/generate-plan` | Generate a personalized study plan |

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

## Notes

This backend version uses prototype API data to demonstrate the AI Recommendation & Intelligence and Analytics & Insights modules. In the complete system, these endpoints can be connected to MySQL tables for students, courses, tasks, study sessions, progress records, analytics data, and AI recommendations.
