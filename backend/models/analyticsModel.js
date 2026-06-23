const analyticsData = {
  overview: {
    studentId: 1,
    gpa: 3.45,
    tasksDone: 14,
    totalTasks: 20,
    studyHours: 18,
    weakSubject: "Data Structures"
  },

  subjectProgress: [
    {
      subject: "Application Development",
      progress: 82
    },
    {
      subject: "Data Structures",
      progress: 46
    },
    {
      subject: "Computer Security",
      progress: 67
    },
    {
      subject: "Requirements Engineering",
      progress: 74
    }
  ],

  studyTime: [
    {
      subject: "App Dev",
      hours: 7
    },
    {
      subject: "DSA",
      hours: 4
    },
    {
      subject: "Security",
      hours: 3
    },
    {
      subject: "Req Eng",
      hours: 4
    }
  ],

  taskCompletion: {
    completed: 14,
    pending: 4,
    overdue: 2
  },

  weakAreas: [
    {
      subject: "Data Structures",
      topic: "Linked List and Stack Operations",
      progress: 46,
      aiConfidence: 89,
      recommendation:
        "Complete one weak-area revision resource and one practice set today."
    }
  ]
};

module.exports = analyticsData;