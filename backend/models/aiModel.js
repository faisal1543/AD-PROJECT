const aiData = {
  resources: [
    {
      id: 1,
      title: "Application Development UI Notes",
      type: "notes",
      subject: "Application Development",
      duration: "20 min",
      priority: "Urgent"
    },
    {
      id: 2,
      title: "Linked List Weak Area Revision",
      type: "weak",
      subject: "Data Structures",
      duration: "35 min",
      priority: "Weak Area"
    },
    {
      id: 3,
      title: "DSA Practice Questions",
      type: "practice",
      subject: "Data Structures",
      duration: "45 min",
      priority: "Practice"
    },
    {
      id: 4,
      title: "Computer Security Revision Video",
      type: "video",
      subject: "Computer Security",
      duration: "25 min",
      priority: "Video"
    }
  ],

  suggestions: [
    {
      id: 1,
      title: "Focus on Data Structures today",
      reason: "Lowest subject progress detected",
      confidence: 89
    },
    {
      id: 2,
      title: "Complete overdue tasks",
      reason: "Overdue tasks increase academic risk",
      confidence: 82
    }
  ]
};

module.exports = aiData;