/* ================================
   SIFU - Alfaisal Frontend JS
   AI Recommendation & Analytics
================================ */
const API_BASE_URL = "http://localhost:5000";

document.addEventListener("DOMContentLoaded", function () {
  setupStudyPlanner();
  setupRiskPrediction();
  setupResourceFilters();
  setupAnalyticsDashboard();
});

/* ---------- Study Planner ---------- */
function setupStudyPlanner() {
  const plannerForm = document.getElementById("plannerForm");
  const subjectInput = document.getElementById("subject");
  const hoursInput = document.getElementById("hours");
  const priorityInput = document.getElementById("priority");
  const deadlineInput = document.getElementById("deadline");
  const plannerSummary = document.getElementById("plannerSummary");
  const generatedTimeline = document.getElementById("generatedTimeline");

  if (!plannerForm) return;

  plannerForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const subject = subjectInput.value;
    const hours = hoursInput.value;
    const priority = priorityInput.value;
    const deadline = deadlineInput.value;

    if (!deadline) {
      showToast("Please select your nearest deadline first.", "warning");
      deadlineInput.focus();
      return;
    }

    plannerSummary.innerHTML = `
      <div class="card-row">
        <div class="card-icon">
          <i class="bi bi-lightning-charge"></i>
        </div>

        <div>
          <h3 class="card-title">AI Plan Generated</h3>
          <p class="card-text">
            Sifu created a ${hours}-hour study plan for <strong>${subject}</strong>
            with <strong>${priority}</strong> priority before your deadline on
            <strong>${formatDate(deadline)}</strong>.
          </p>
        </div>
      </div>
    `;

    generatedTimeline.innerHTML = generateTimeline(subject, hours, priority);

    showToast("Sifu AI generated your study plan successfully.", "success");
  });
}

function generateTimeline(subject, hours, priority) {
  const focusText =
    priority === "High"
      ? "Focus deeply on the most urgent task first."
      : priority === "Medium"
      ? "Balance revision and task completion."
      : "Use a lighter review plan with short practice.";

  return `
    <div class="timeline-item">
      <div class="timeline-time">09:00</div>
      <div class="timeline-content">
        <h4>${subject} requirement review</h4>
        <p>${focusText}</p>
      </div>
    </div>

    <div class="timeline-item">
      <div class="timeline-time">11:00</div>
      <div class="timeline-content">
        <h4>Focused study session</h4>
        <p>Work on important concepts, tasks, or notes related to ${subject}.</p>
      </div>
    </div>

    <div class="timeline-item">
      <div class="timeline-time">14:00</div>
      <div class="timeline-content">
        <h4>Practice and improvement</h4>
        <p>Complete practice questions or improve unfinished academic work.</p>
      </div>
    </div>

    <div class="timeline-item">
      <div class="timeline-time">20:00</div>
      <div class="timeline-content">
        <h4>Final review</h4>
        <p>Summarize what you completed and prepare your next study goal.</p>
      </div>
    </div>
  `;
}

/* ---------- Risk Prediction ---------- */
function setupRiskPrediction() {
  const recheckBtn = document.getElementById("recheckRiskBtn");
  const riskScore = document.getElementById("riskScore");
  const riskBar = document.getElementById("riskBar");
  const riskTitle = document.querySelector(".risk-hero h2");
  const riskDescription = document.querySelector(".risk-hero p");

  if (!riskScore || !riskBar) return;

  riskBar.style.width = "0%";

  setTimeout(() => {
    riskBar.style.width = "62%";
  }, 250);

  if (!recheckBtn) return;

  recheckBtn.addEventListener("click", function () {
    riskScore.textContent = "48%";
    riskBar.style.width = "48%";
    riskBar.style.background = "var(--success)";

    if (riskTitle) {
      riskTitle.textContent = "Improving Risk";
    }

    if (riskDescription) {
      riskDescription.textContent =
        "Your risk level improved after recalculating recent study progress. Continue focusing on Data Structures and complete overdue work.";
    }

    showToast("Risk score recalculated successfully.", "success");
  });
}

/* ---------- Resource Filters ---------- */
function setupResourceFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const resourceCards = document.querySelectorAll(".resource-card");
  const emptyState = document.getElementById("resourceEmpty");

  if (!filterButtons.length || !resourceCards.length) return;

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const selectedFilter = button.getAttribute("data-filter");
      let visibleCount = 0;

      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      resourceCards.forEach((card) => {
        const cardType = card.getAttribute("data-type");

        if (selectedFilter === "all" || selectedFilter === cardType) {
          card.classList.remove("hide");
          visibleCount++;
        } else {
          card.classList.add("hide");
        }
      });

      if (emptyState) {
        if (visibleCount === 0) {
          emptyState.classList.remove("d-none");
        } else {
          emptyState.classList.add("d-none");
        }
      }

      showToast(`Showing ${selectedFilter} resources.`, "success");
    });
  });
}

/* ---------- Analytics Dashboard ---------- */
function setupAnalyticsDashboard() {
  const studyChartElement = document.getElementById("studyTimeChart");
  const taskChartElement = document.getElementById("taskCompletionChart");

  if (!studyChartElement || typeof Chart === "undefined") return;

  const chartTextColor = "#7a716a";
  const chartGridColor = "rgba(122, 113, 106, 0.16)";

  const studyTimeChart = new Chart(studyChartElement, {
    type: "bar",
    data: {
      labels: ["App Dev", "DSA", "Security", "Req Eng"],
      datasets: [
        {
          label: "Study Hours",
          data: [7, 4, 3, 4],
          backgroundColor: [
            "rgba(143, 47, 47, 0.85)",
            "rgba(217, 140, 40, 0.85)",
            "rgba(75, 118, 184, 0.85)",
            "rgba(78, 159, 110, 0.85)"
          ],
          borderRadius: 12
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          ticks: {
            color: chartTextColor,
            font: {
              weight: "bold"
            }
          },
          grid: {
            display: false
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: chartTextColor
          },
          grid: {
            color: chartGridColor
          }
        }
      }
    }
  });

  if (!taskChartElement) return;

  const taskCompletionChart = new Chart(taskChartElement, {
    type: "doughnut",
    data: {
      labels: ["Completed", "Pending", "Overdue"],
      datasets: [
        {
          data: [14, 4, 2],
          backgroundColor: [
            "rgba(78, 159, 110, 0.9)",
            "rgba(217, 140, 40, 0.9)",
            "rgba(201, 71, 71, 0.9)"
          ],
          borderWidth: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "68%",
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: chartTextColor,
            font: {
              weight: "bold"
            },
            usePointStyle: true,
            padding: 16
          }
        }
      }
    }
  });

  const refreshBtn = document.getElementById("refreshAnalyticsBtn");

  if (refreshBtn) {
    refreshBtn.addEventListener("click", function () {
      loadAnalyticsFromBackend(studyTimeChart, taskCompletionChart);
    });
  }

  loadAnalyticsFromBackend(studyTimeChart, taskCompletionChart);
}


async function loadAnalyticsFromBackend(studyTimeChart, taskCompletionChart) {
  try {
    const overviewResponse = await fetch(`${API_BASE_URL}/api/analytics/overview/1`);
    const overviewResult = await overviewResponse.json();

    if (overviewResult.success) {
      const data = overviewResult.data;

      const gpaValue = document.getElementById("gpaValue");
      const tasksValue = document.getElementById("tasksValue");
      const hoursValue = document.getElementById("hoursValue");
      const weakValue = document.getElementById("weakValue");

      if (gpaValue) gpaValue.textContent = data.gpa;
      if (tasksValue) tasksValue.textContent = `${data.tasksDone}/${data.totalTasks}`;
      if (hoursValue) hoursValue.textContent = `${data.studyHours}h`;
      if (weakValue) weakValue.textContent = data.weakSubject;
    }

    const studyTimeResponse = await fetch(`${API_BASE_URL}/api/analytics/study-time/1`);
    const studyTimeResult = await studyTimeResponse.json();

    if (studyTimeResult.success && studyTimeChart) {
      studyTimeChart.data.labels = studyTimeResult.data.map((item) => item.subject);
      studyTimeChart.data.datasets[0].data = studyTimeResult.data.map((item) => item.hours);
      studyTimeChart.update();
    }

    const taskResponse = await fetch(`${API_BASE_URL}/api/analytics/task-completion/1`);
    const taskResult = await taskResponse.json();

    if (taskResult.success && taskCompletionChart) {
      taskCompletionChart.data.datasets[0].data = [
        taskResult.data.completed,
        taskResult.data.pending,
        taskResult.data.overdue
      ];
      taskCompletionChart.update();
    }

    showToast("Analytics data loaded from backend API.", "success");
  } catch (error) {
    console.log("Backend is not running. Using frontend prototype data.");
  }
}

/* ---------- Helper Functions ---------- */
function formatDate(dateValue) {
  const date = new Date(dateValue);
  return date.toLocaleDateString("en-MY", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

function showToast(message, type = "success") {
  let toast = document.querySelector(".sifu-toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.className = "sifu-toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.className = `sifu-toast show ${type}`;

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}
