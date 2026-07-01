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

  plannerForm.addEventListener("submit", async function (event) {
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

    const submitBtn = plannerForm.querySelector("button[type=submit]");
    if (submitBtn) submitBtn.disabled = true;

    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/generate-plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, hours, priority, deadline, studentId: 1 })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to generate study plan.");
      }

      renderPlannerSummary(result.data.subject, result.data.hours, result.data.priority, result.data.deadline, result.data.aiMessage);
      generatedTimeline.innerHTML = renderTimelineFromSchedule(result.data.schedule);

      showToast("Sifu AI generated your study plan successfully.", "success");
    } catch (error) {
      console.error(error);
      // Fall back to local generation so the page still works if the API/server is unreachable
      renderPlannerSummary(subject, hours, priority, deadline);
      generatedTimeline.innerHTML = generateTimeline(subject, hours, priority);
      showToast("Couldn't reach Sifu AI server — showing a locally generated plan instead.", "warning");
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

function renderPlannerSummary(subject, hours, priority, deadline, aiMessage) {
  const plannerSummary = document.getElementById("plannerSummary");
  const message =
    aiMessage ||
    `Sifu created a ${hours}-hour study plan for ${subject} with ${priority} priority before your deadline on ${formatDate(deadline)}.`;

  plannerSummary.innerHTML = `
    <div class="card-row">
      <div class="card-icon">
        <i class="bi bi-lightning-charge"></i>
      </div>

      <div>
        <h3 class="card-title">AI Plan Generated</h3>
        <p class="card-text">${message}</p>
      </div>
    </div>
  `;
}

function renderTimelineFromSchedule(schedule) {
  return schedule
    .map(
      (item) => `
    <div class="timeline-item">
      <div class="timeline-time">${item.time}</div>
      <div class="timeline-content">
        <h4>${item.activity}</h4>
      </div>
    </div>
  `
    )
    .join("");
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
  const riskFactorsList = document.getElementById("riskFactorsList");
  const subjectRiskBreakdown = document.getElementById("subjectRiskBreakdown");

  if (!riskScore || !riskBar) return;

  function renderFactors(factors) {
    if (!riskFactorsList || !Array.isArray(factors)) return;

    riskFactorsList.innerHTML = factors
      .map((f, index) => {
        const icon = f.factor.includes("Overdue")
          ? "bi-clock-history"
          : f.factor.includes("Study Hours")
          ? "bi-hourglass-split"
          : "bi-graph-down-arrow";

        const divider = index < factors.length - 1 ? '<div class="divider"></div>' : "";

        return `
          <div class="card-row${index < factors.length - 1 ? " mb-3" : ""}">
            <div class="card-icon">
              <i class="bi ${icon}"></i>
            </div>
            <div>
              <h3 class="card-title">${f.factor}</h3>
            </div>
            <span class="badge-soft badge-${f.severity === "High" ? "danger" : f.severity === "Medium" ? "warning" : "success"}">${f.severity}</span>
          </div>
          ${divider}
        `;
      })
      .join("");
  }

  function renderSubjectBreakdown(subjects) {
    if (!subjectRiskBreakdown || !Array.isArray(subjects)) return;

    subjectRiskBreakdown.innerHTML = subjects
      .map((s) => {
        const textClass = s.progress < 50 ? "text-danger" : s.progress < 70 ? "text-warning" : "text-success";
        const barColor = s.progress < 50 ? "var(--danger)" : s.progress < 70 ? "var(--warning)" : "var(--success)";

        return `
          <div class="progress-wrap">
            <div class="progress-label">
              <span>${s.subject}</span>
              <strong class="${textClass}">${s.progress}%</strong>
            </div>
            <div class="progress">
              <div class="progress-bar" style="width: ${s.progress}%; background: ${barColor};"></div>
            </div>
          </div>
        `;
      })
      .join("");
  }

  function applyRisk(data) {
    riskScore.textContent = `${data.riskScore}%`;
    riskBar.style.width = `${data.riskScore}%`;
    riskBar.style.background =
      data.riskScore >= 70 ? "var(--danger)" : data.riskScore >= 40 ? "var(--warning)" : "var(--success)";

    if (riskTitle) riskTitle.textContent = data.riskLevel;
    if (riskDescription) riskDescription.textContent = data.recommendation;

    renderFactors(data.factors);
  }

  async function loadRisk() {
    try {
      const [riskResponse, subjectResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/ai/risk/1`),
        fetch(`${API_BASE_URL}/api/analytics/subject-progress/1`)
      ]);

      const riskResult = await riskResponse.json();
      const subjectResult = await subjectResponse.json();

      if (!riskResponse.ok || !riskResult.success) {
        throw new Error(riskResult.message || "Failed to load risk prediction.");
      }

      applyRisk(riskResult.data);

      if (subjectResponse.ok && subjectResult.success) {
        renderSubjectBreakdown(subjectResult.data);
      }
    } catch (error) {
      console.error(error);
      riskBar.style.width = "0%";
      setTimeout(() => {
        riskBar.style.width = "62%";
      }, 250);
      showToast("Couldn't reach Sifu AI server — showing demo risk data instead.", "warning");
    }
  }

  loadRisk();

  if (!recheckBtn) return;

  recheckBtn.addEventListener("click", function () {
    showToast("Recalculating risk score...", "success");
    loadRisk();
  });
}

/* ---------- Resource Filters ---------- */
const resourceIcons = {
  notes: "bi-file-earmark-text",
  weak: "bi-exclamation-triangle",
  practice: "bi-pencil-square",
  video: "bi-play-circle"
};

const resourceBadgeClass = {
  Urgent: "badge-danger",
  "Weak Area": "badge-warning",
  Practice: "badge-info",
  Video: "badge-success",
  Notes: "badge-info"
};

function setupResourceFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const resourceList = document.getElementById("resourceList");
  const emptyState = document.getElementById("resourceEmpty");

  if (!filterButtons.length || !resourceList) return;

  function applyFilter(selectedFilter) {
    const resourceCards = resourceList.querySelectorAll(".resource-card");
    let visibleCount = 0;

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
      emptyState.classList.toggle("d-none", visibleCount !== 0);
    }
  }

  function renderResources(resources) {
    resourceList.innerHTML = resources
      .map(
        (r) => `
      <article class="sifu-card resource-card" data-type="${r.type}">
        <div class="card-row">
          <div class="card-icon">
            <i class="bi ${resourceIcons[r.type] || "bi-file-earmark-text"}"></i>
          </div>

          <div>
            <h3 class="card-title">${r.title}</h3>
          </div>

          <span class="badge-soft ${resourceBadgeClass[r.priority] || "badge-info"}">${r.priority}</span>
        </div>

        <div class="divider"></div>

        <div class="resource-meta">
          <span><i class="bi bi-book"></i> ${r.subject}</span>
          <span><i class="bi bi-clock"></i> ${r.duration}</span>
        </div>
      </article>
    `
      )
      .join("");

    const activeFilter = document.querySelector(".filter-btn.active");
    applyFilter(activeFilter ? activeFilter.getAttribute("data-filter") : "all");
  }

  async function loadResources() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/resources/1`);
      const result = await response.json();

      if (!response.ok || !result.success || !result.data.length) {
        throw new Error(result.message || "No resources found.");
      }

      renderResources(result.data);
    } catch (error) {
      console.error(error);
      // Keep the static prototype resources already in the page as a fallback
      applyFilter("all");
      showToast("Couldn't reach Sifu AI server — showing demo resources instead.", "warning");
    }
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const selectedFilter = button.getAttribute("data-filter");

      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      applyFilter(selectedFilter);
      showToast(`Showing ${selectedFilter} resources.`, "success");
    });
  });

  loadResources();
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
