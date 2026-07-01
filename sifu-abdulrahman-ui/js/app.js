/* =========================================================
   SIFU - Abdulrahman UI Backend-Connected App
   Safe scope:
   - Only affects pages that load sifu-abdulrahman-ui/js/app.js
   - Does NOT call Faisal routes: /api/ai or /api/analytics
   - Does NOT call Majid routes: /api/support
   - Keeps the same HTML/CSS classes, so the frontend look stays the same
   ========================================================= */

(function () {
  "use strict";

  const API_BASE = "http://localhost:5000";

  const STORE = {
    user: "sifu_user",
    courses: "sifu_courses",
    tasks: "sifu_tasks",
    loggedIn: "sifu_logged_in"
  };

  const fallbackUser = {
    userId: 1,
    fullName: "UTM Student",
    email: "student@graduate.utm.my",
    faculty: "Faculty of Computing",
    programme: "Software Engineering",
    yearOfStudy: "Year 2",
    currentSemester: "Semester 4",
    totalCredits: "72 / 120",
    currentGpa: "3.45",
    semester: "Semester 4",
    credits: "72 / 120",
    gpa: "3.45"
  };

  const fallbackCourses = [
    {
      id: "1",
      code: "SCSE2243",
      name: "Software Design & Architecture",
      lecturer: "Dr. Ahmad Fadzil",
      credits: 3,
      progress: 72,
      color: "red"
    },
    {
      id: "2",
      code: "SECJ2013",
      name: "Software Engineering",
      lecturer: "Prof. Norhayati Mohd",
      credits: 3,
      progress: 58,
      color: "green"
    },
    {
      id: "3",
      code: "SCSJ2203",
      name: "Data Structures & Algorithms",
      lecturer: "Dr. Lim Boon Yian",
      credits: 3,
      progress: 45,
      color: "salmon"
    },
    {
      id: "4",
      code: "SCST1223",
      name: "Statistics for Computing",
      lecturer: "Dr. Roslan Johari",
      credits: 2,
      progress: 85,
      color: "dark"
    }
  ];

  const fallbackTasks = [
    {
      id: "1",
      title: "Software Design Report",
      course: "SCSE2243",
      status: "Pending",
      priority: "High",
      due: "2026-05-24"
    },
    {
      id: "2",
      title: "Lab Exercise 4 – Linked Lists",
      course: "SCSJ2203",
      status: "Overdue",
      priority: "High",
      due: "2026-05-22"
    },
    {
      id: "3",
      title: "UML Diagram Assignment",
      course: "SECJ2013",
      status: "Pending",
      priority: "Medium",
      due: "2026-05-28"
    },
    {
      id: "4",
      title: "Statistics Quiz 2",
      course: "SCST1223",
      status: "Pending",
      priority: "Medium",
      due: "2026-05-26"
    },
    {
      id: "5",
      title: "Requirements Specification Doc",
      course: "SECJ2013",
      status: "Completed",
      priority: "High",
      due: "2026-05-15"
    },
    {
      id: "6",
      title: "Probability Problem Set 1",
      course: "SCST1223",
      status: "Completed",
      priority: "Low",
      due: "2026-05-18"
    }
  ];

  document.addEventListener("DOMContentLoaded", function () {
    setupLogoFallback();
    setupPasswordToggles();
    setupInfoLinks();
    setupLogin();
    setupSignup();
    setupProfile();
    setupCoursesPage();
    setupTasksPage();
    setupCalendarDashboardPage();
    setupStudySchedulePage();
  });

  /* ============================= */
  /* HELPERS */
  /* ============================= */

  function $(selector, parent = document) {
    return parent.querySelector(selector);
  }

  function $all(selector, parent = document) {
    return Array.from(parent.querySelectorAll(selector));
  }

  function read(key, fallback = null) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  }

  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function isUtmEmail(email) {
    return /^[^\s@]+@[^\s@]*utm\.my$/i.test(String(email || "").trim());
  }

  function getCurrentUser() {
    return read(STORE.user, fallbackUser);
  }

  function getCurrentUserId() {
    const user = getCurrentUser();
    return user?.userId || user?.id || localStorage.getItem("sifu_user_id") || "1";
  }

  function normalizeUser(user) {
    const normalized = {
      userId: user?.userId || user?.user_id || user?.id || "1",
      fullName: user?.fullName || user?.full_name || "UTM Student",
      email: user?.email || "student@graduate.utm.my",
      role: user?.role || "student",
      accountStatus: user?.accountStatus || user?.account_status || "active",
      faculty: user?.faculty || "Faculty of Computing",
      programme: user?.programme || "Software Engineering",
      yearOfStudy: user?.yearOfStudy || user?.year_of_study || "Year 2",
      currentSemester: user?.currentSemester || user?.current_semester || user?.semester || "Semester 4",
      totalCredits: user?.totalCredits || user?.total_credits || user?.credits || "72 / 120",
      currentGpa: user?.currentGpa || user?.current_gpa || user?.gpa || "3.45"
    };

    normalized.semester = normalized.currentSemester;
    normalized.credits = normalized.totalCredits;
    normalized.gpa = normalized.currentGpa;

    return normalized;
  }

  function saveSessionUser(user) {
    const normalized = normalizeUser(user);
    write(STORE.user, normalized);
    localStorage.setItem("sifu_user_id", normalized.userId);
    write(STORE.loggedIn, true);
  }

  async function api(path, options = {}) {
    const response = await fetch(API_BASE + path, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    });

    let data = null;

    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok || data?.success === false) {
      throw new Error(data?.message || `Backend request failed: ${response.status}`);
    }

    return data;
  }

  function showToast(message, type = "success") {
    const toast = document.getElementById("sifuToast");
    const toastMessage = document.getElementById("toastMessage");

    if (toast && toastMessage) {
      toastMessage.textContent = message;
      toast.classList.add("show");

      setTimeout(() => {
        toast.classList.remove("show");
      }, 1800);

      return;
    }

    console.log(message);
  }

  function setButtonLoading(button, isLoading, loadingText) {
    if (!button) return;

    if (isLoading) {
      button.dataset.originalText = button.innerHTML;
      button.disabled = true;
      button.innerHTML = loadingText;
    } else {
      button.disabled = false;
      if (button.dataset.originalText) button.innerHTML = button.dataset.originalText;
    }
  }

  function setText(idOrSelector, value) {
    const element = idOrSelector.startsWith("#")
      ? document.querySelector(idOrSelector)
      : document.getElementById(idOrSelector);

    if (element) element.textContent = value;
  }

  function escapeHTML(text) {
    return String(text || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function setupLogoFallback() {
    $all(".brand-logo").forEach((img) => {
      img.addEventListener("error", () => {
        img.style.display = "none";
        const fallback = img.nextElementSibling;
        if (fallback) fallback.style.display = "grid";
      });
    });
  }

  function setupPasswordToggles() {
    [
      ["#toggleLoginPassword", "#loginPassword"],
      ["#toggleSignupPassword", "#signupPassword"],
      ["#toggleConfirmPassword", "#confirmPassword"]
    ].forEach(([buttonSelector, inputSelector]) => {
      const button = $(buttonSelector);
      const input = $(inputSelector);

      if (!button || !input) return;

      button.addEventListener("click", () => {
        input.type = input.type === "password" ? "text" : "password";

        const icon = $("i", button);
        if (icon) icon.className = input.type === "password" ? "bi bi-eye" : "bi bi-eye-slash";
      });
    });
  }

  function setupInfoLinks() {
    $all("[data-info]").forEach((link) => {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        showToast(link.dataset.info || "This feature will be connected after merge.", "warning");
      });
    });
  }

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
  }

  /* ============================= */
  /* AUTH */
  /* ============================= */

  function setupLogin() {
    const form = $("#loginForm");
    if (!form) return;

    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      const email = $("#loginEmail");
      const password = $("#loginPassword");
      const submitButton = form.querySelector("[type='submit']");
      let valid = true;

      if (!email.value.trim() || !isUtmEmail(email.value)) {
        email.classList.add("is-invalid");
        valid = false;
      } else {
        email.classList.remove("is-invalid");
      }

      if (!password.value.trim()) {
        password.classList.add("is-invalid");
        valid = false;
      } else {
        password.classList.remove("is-invalid");
      }

      if (!valid) {
        showToast("Please enter a valid UTM email and password.", "danger");
        return;
      }

      try {
        setButtonLoading(submitButton, true, "Logging in...");

        const data = await api("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({
            email: email.value.trim(),
            password: password.value
          })
        });

        saveSessionUser(data.user);
        showToast("Login successful. Opening dashboard...");

        setTimeout(() => {
          location.href = "calendar.html";
        }, 700);
      } catch (error) {
        showToast(error.message || "Login failed. Please check your backend.", "danger");
      } finally {
        setButtonLoading(submitButton, false);
      }
    });
  }

  function setupSignup() {
    const form = $("#signupForm");
    if (!form) return;

    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      const fullName = $("#fullName");
      const email = $("#signupEmail");
      const faculty = $("#faculty");
      const programme = $("#programme");
      const year = $("#yearOfStudy");
      const password = $("#signupPassword");
      const confirm = $("#confirmPassword");
      const submitButton = form.querySelector("[type='submit']");

      const fields = [fullName, faculty, programme, year, password, confirm];
      let valid = true;

      fields.forEach((field) => {
        if (!field || !field.value.trim()) {
          field?.classList.add("is-invalid");
          valid = false;
        } else {
          field.classList.remove("is-invalid");
        }
      });

      if (!email.value.trim() || !isUtmEmail(email.value)) {
        email.classList.add("is-invalid");
        valid = false;
      } else {
        email.classList.remove("is-invalid");
      }

      if (password.value !== confirm.value || !confirm.value.trim()) {
        confirm.classList.add("is-invalid");
        valid = false;
      } else {
        confirm.classList.remove("is-invalid");
      }

      if (!valid) {
        showToast("Check the form fields before signing up.", "danger");
        return;
      }

      try {
        setButtonLoading(submitButton, true, "Creating account...");

        const data = await api("/api/auth/signup", {
          method: "POST",
          body: JSON.stringify({
            fullName: fullName.value.trim(),
            email: email.value.trim(),
            password: password.value,
            faculty: faculty.value,
            programme: programme.value.trim(),
            yearOfStudy: year.value
          })
        });

        saveSessionUser(data.user);
        showToast("Account created. Opening dashboard...");

        setTimeout(() => {
          location.href = "calendar.html";
        }, 800);
      } catch (error) {
        showToast(error.message || "Signup failed. Please check your backend.", "danger");
      } finally {
        setButtonLoading(submitButton, false);
      }
    });
  }

  /* ============================= */
  /* PROFILE */
  /* ============================= */

  async function setupProfile() {
    if (!$("#profileName")) return;

    $all("[data-logout]").forEach((button) => {
      button.addEventListener("click", function () {
        localStorage.removeItem(STORE.user);
        localStorage.removeItem("sifu_user_id");
        write(STORE.loggedIn, false);
        showToast("Logged out successfully.");

        setTimeout(() => {
          location.href = "login.html";
        }, 700);
      });
    });

    try {
      const userId = getCurrentUserId();

      const [profileData, coursesData, tasksData] = await Promise.all([
        api(`/api/users/${userId}`),
        api(`/api/courses/${userId}`),
        api(`/api/tasks/${userId}`)
      ]);

      const user = normalizeUser(profileData.user);
      const courses = coursesData.courses || [];
      const tasks = tasksData.tasks || [];

      saveSessionUser(user);
      write(STORE.courses, courses);
      write(STORE.tasks, tasks);

      renderProfile(user, courses, tasks);
    } catch (error) {
      const user = getCurrentUser();
      const courses = read(STORE.courses, fallbackCourses);
      const tasks = read(STORE.tasks, fallbackTasks);

      renderProfile(user, courses, tasks);
      showToast("Profile loaded from saved data. Backend not reachable.", "warning");
    }
  }

  function renderProfile(user, courses, tasks) {
    const normalized = normalizeUser(user);

    setText("#profileName", normalized.fullName);
    setText("#profileProgrammeYear", `${normalized.programme}, ${normalized.yearOfStudy}`);
    setText("#profileEmail", normalized.email);
    setText("#currentSemester", normalized.currentSemester);
    setText("#totalCredits", normalized.totalCredits);
    setText("#currentGpa", String(normalized.currentGpa));
    setText("#activeCourses", String(courses.length));
    setText("#activeTasks", String(tasks.filter((task) => task.status !== "Completed").length));
  }

  /* ============================= */
  /* COURSES PAGE */
  /* ============================= */

  async function setupCoursesPage() {
    const list = document.getElementById("courseCards");
    const form = document.getElementById("courseForm");
    const modal = document.getElementById("courseModal");

    if (!list || !form || !modal) return;

    let courses = [];

    await loadCourses();

    const openButton = document.getElementById("openCourseModal");
    const closeButton = document.getElementById("closeCourseModal");

    if (openButton) {
      openButton.addEventListener("click", function () {
        form.reset();
        document.getElementById("courseId").value = "";
        document.getElementById("courseModalTitle").textContent = "Add Course";
        openModal(modal);
      });
    }

    if (closeButton) {
      closeButton.addEventListener("click", function () {
        closeModal(modal);
      });
    }

    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      const id = document.getElementById("courseId").value;

      const courseData = {
        id,
        code: document.getElementById("courseCode").value.trim().toUpperCase(),
        name: document.getElementById("courseName").value.trim(),
        lecturer: document.getElementById("courseLecturer").value.trim(),
        credits: Number(document.getElementById("courseCredits").value),
        progress: Number(document.getElementById("courseProgress").value),
        color: document.getElementById("courseColor").value
      };

      if (!courseData.code || !courseData.name || !courseData.lecturer || !courseData.credits) {
        showToast("Please fill in all course fields.", "danger");
        return;
      }

      try {
        if (id) {
          await api(`/api/courses/${id}`, {
            method: "PUT",
            body: JSON.stringify(courseData)
          });

          showToast("Course updated.");
        } else {
          await api("/api/courses", {
            method: "POST",
            body: JSON.stringify({
              ...courseData,
              userId: getCurrentUserId()
            })
          });

          showToast("Course added.");
        }

        closeModal(modal);
        form.reset();
        document.getElementById("courseId").value = "";
        await loadCourses();
      } catch (error) {
        showToast(error.message || "Course request failed.", "danger");
      }
    });

    list.addEventListener("click", async function (event) {
      const editBtn = event.target.closest("[data-course-edit]");
      const deleteBtn = event.target.closest("[data-course-delete]");

      if (editBtn) {
        const course = courses.find((item) => String(item.id) === String(editBtn.dataset.courseEdit));
        if (!course) return;

        document.getElementById("courseId").value = course.id;
        document.getElementById("courseCode").value = course.code || "";
        document.getElementById("courseName").value = course.name || "";
        document.getElementById("courseLecturer").value = course.lecturer || "";
        document.getElementById("courseCredits").value = course.credits || 3;
        document.getElementById("courseProgress").value = course.progress || 0;
        document.getElementById("courseColor").value = course.color || "red";
        document.getElementById("courseModalTitle").textContent = "Edit Course";

        openModal(modal);
      }

      if (deleteBtn) {
        const id = deleteBtn.dataset.courseDelete;

        try {
          await api(`/api/courses/${id}`, {
            method: "DELETE"
          });

          showToast("Course deleted.");
          await loadCourses();
        } catch (error) {
          showToast(error.message || "Could not delete course.", "danger");
        }
      }
    });

    async function loadCourses() {
      try {
        const data = await api(`/api/courses/${getCurrentUserId()}`);
        courses = data.courses || [];
        write(STORE.courses, courses);
      } catch (error) {
        courses = read(STORE.courses, fallbackCourses);
        showToast("Courses loaded from saved data. Backend not reachable.", "warning");
      }

      renderCourses(courses);
    }
  }

  function renderCourses(courses) {
    const list = document.getElementById("courseCards");
    const summary = document.getElementById("courseSummary");

    if (!list) return;

    const totalCredits = courses.reduce((sum, course) => sum + Number(course.credits || 0), 0);

    if (summary) {
      summary.textContent = `Semester 4 • ${courses.length} registered courses • ${totalCredits} credits`;
    }

    if (courses.length === 0) {
      list.innerHTML = `<div class="empty-tracking">No courses yet. Add your first course.</div>`;
      return;
    }

    list.innerHTML = courses.map((course) => {
      const progress = Math.min(100, Math.max(0, Number(course.progress || 0)));
      const color = course.color || "red";

      return `
        <article class="course-card-ui course-${escapeHTML(color)}">
          <div class="course-card-top">
            <div>
              <div class="course-tags">
                <span class="course-code-badge">${escapeHTML(course.code)}</span>
                <span class="course-credit">${Number(course.credits || 0)} credits</span>
              </div>

              <h2>${escapeHTML(course.name)}</h2>
              <p>${escapeHTML(course.lecturer || "Lecturer not set")}</p>
            </div>

            <div class="course-actions">
              <button class="mini-action-btn" type="button" data-course-edit="${course.id}">
                <i class="bi bi-pencil"></i>
              </button>

              <button class="mini-action-btn delete" type="button" data-course-delete="${course.id}">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>

          <div class="progress-label-row">
            <span>Course Progress</span>
            <strong class="progress-value">${progress}%</strong>
          </div>

          <div class="course-progress-track">
            <div class="course-progress-fill" style="width:${progress}%"></div>
          </div>
        </article>
      `;
    }).join("");
  }

  /* ============================= */
  /* TASKS PAGE */
  /* ============================= */

  async function setupTasksPage() {
    const list = document.getElementById("taskCards");
    const form = document.getElementById("taskForm");
    const modal = document.getElementById("taskModal");

    if (!list || !form || !modal) return;

    let tasks = [];
    let currentFilter = "All";

    await loadTasks();

    const openButton = document.getElementById("openTaskModal");
    const closeButton = document.getElementById("closeTaskModal");

    if (openButton) {
      openButton.addEventListener("click", function () {
        form.reset();
        document.getElementById("taskId").value = "";
        document.getElementById("taskModalTitle").textContent = "Add Task";
        openModal(modal);
      });
    }

    if (closeButton) {
      closeButton.addEventListener("click", function () {
        closeModal(modal);
      });
    }

    document.querySelectorAll(".task-filter").forEach((button) => {
      button.addEventListener("click", function () {
        document.querySelectorAll(".task-filter").forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        currentFilter = button.dataset.filter;
        renderTasks(tasks, currentFilter);
      });
    });

    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      const id = document.getElementById("taskId").value;

      const taskData = {
        id,
        title: document.getElementById("taskTitle").value.trim(),
        course: document.getElementById("taskCourse").value.trim().toUpperCase(),
        status: document.getElementById("taskStatus").value,
        priority: document.getElementById("taskPriority").value,
        due: document.getElementById("taskDue").value
      };

      if (!taskData.title || !taskData.course || !taskData.due) {
        showToast("Please fill in all task fields.", "danger");
        return;
      }

      try {
        if (id) {
          await api(`/api/tasks/${id}`, {
            method: "PUT",
            body: JSON.stringify(taskData)
          });

          showToast("Task updated.");
        } else {
          await api("/api/tasks", {
            method: "POST",
            body: JSON.stringify({
              ...taskData,
              userId: getCurrentUserId()
            })
          });

          showToast("Task added.");
        }

        closeModal(modal);
        form.reset();
        document.getElementById("taskId").value = "";
        await loadTasks();
      } catch (error) {
        showToast(error.message || "Task request failed.", "danger");
      }
    });

    list.addEventListener("click", async function (event) {
      const editBtn = event.target.closest("[data-task-edit]");
      const deleteBtn = event.target.closest("[data-task-delete]");
      const checkBtn = event.target.closest("[data-task-check]");

      if (checkBtn) {
        const task = tasks.find((item) => String(item.id) === String(checkBtn.dataset.taskCheck));
        if (!task) return;

        const nextStatus = task.status === "Completed" ? "Pending" : "Completed";

        try {
          await api(`/api/tasks/${task.id}/status`, {
            method: "PATCH",
            body: JSON.stringify({
              status: nextStatus
            })
          });

          showToast("Task status updated.");
          await loadTasks();
        } catch (error) {
          showToast(error.message || "Could not update task status.", "danger");
        }
      }

      if (editBtn) {
        const task = tasks.find((item) => String(item.id) === String(editBtn.dataset.taskEdit));
        if (!task) return;

        document.getElementById("taskId").value = task.id;
        document.getElementById("taskTitle").value = task.title || "";
        document.getElementById("taskCourse").value = task.course || "";
        document.getElementById("taskStatus").value = task.status || "Pending";
        document.getElementById("taskPriority").value = task.priority || "Medium";
        document.getElementById("taskDue").value = task.due || "";
        document.getElementById("taskModalTitle").textContent = "Edit Task";

        openModal(modal);
      }

      if (deleteBtn) {
        const id = deleteBtn.dataset.taskDelete;

        try {
          await api(`/api/tasks/${id}`, {
            method: "DELETE"
          });

          showToast("Task deleted.");
          await loadTasks();
        } catch (error) {
          showToast(error.message || "Could not delete task.", "danger");
        }
      }
    });

    async function loadTasks() {
      try {
        const data = await api(`/api/tasks/${getCurrentUserId()}`);
        tasks = data.tasks || [];
        write(STORE.tasks, tasks);
      } catch (error) {
        tasks = read(STORE.tasks, fallbackTasks);
        showToast("Tasks loaded from saved data. Backend not reachable.", "warning");
      }

      renderTasks(tasks, currentFilter);
    }
  }

  function renderTasks(tasks, filter) {
    const list = document.getElementById("taskCards");
    const summary = document.getElementById("taskSummary");

    if (!list) return;

    const pending = tasks.filter((task) => task.status === "Pending").length;
    const overdue = tasks.filter((task) => task.status === "Overdue").length;
    const done = tasks.filter((task) => task.status === "Completed").length;

    if (summary) {
      summary.textContent = `${pending} pending • ${overdue} overdue • ${done} done`;
    }

    const visibleTasks = filter === "All"
      ? tasks
      : tasks.filter((task) => task.status === filter);

    if (visibleTasks.length === 0) {
      list.innerHTML = `<div class="empty-tracking">No ${String(filter).toLowerCase()} tasks found.</div>`;
      return;
    }

    list.innerHTML = visibleTasks.map((task) => {
      const statusClass = String(task.status || "Pending").toLowerCase();
      const isDone = task.status === "Completed";
      const priorityClass = task.priority === "Low" ? "low" : "priority";

      return `
        <article class="task-card-ui ${isDone ? "done" : ""}">
          <button class="task-check ${isDone ? "done" : ""}" type="button" data-task-check="${task.id}">
            ${isDone ? `<i class="bi bi-check-lg"></i>` : ""}
          </button>

          <div class="task-main">
            <div class="task-badges">
              <span class="task-badge ${escapeHTML(statusClass)}">${escapeHTML(task.status || "Pending")}</span>
              <span class="task-badge ${priorityClass}">
                <i class="bi bi-flag"></i>
                ${escapeHTML(task.priority || "Medium")}
              </span>
            </div>

            <h2>${escapeHTML(task.title)}</h2>

            <div class="task-meta">
              <strong>${escapeHTML(task.course)}</strong>
              <span>
                <i class="bi bi-clock"></i>
                ${formatDate(task.due)}
              </span>
            </div>
          </div>

          <div class="task-actions">
            <button class="mini-action-btn" type="button" data-task-edit="${task.id}">
              <i class="bi bi-pencil"></i>
            </button>

            <button class="mini-action-btn delete" type="button" data-task-delete="${task.id}">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </article>
      `;
    }).join("");
  }

  /* ============================= */
  /* CALENDAR DASHBOARD */
  /* ============================= */

  async function setupCalendarDashboardPage() {
    const deadlineList = document.getElementById("upcomingDeadlineList");
    if (!deadlineList) return;

    try {
      const data = await api(`/api/dashboard/${getCurrentUserId()}`);
      const dashboard = data.dashboard || {};

      setText("highPriorityCount", `${dashboard.highPriority || 0} tasks`);
      setText("mediumPriorityCount", `${dashboard.mediumPriority || 0} tasks`);
      setText("lowPriorityCount", `${dashboard.lowPriority || 0} tasks`);
      setText("calendarCourseProgress", `${dashboard.courseProgress || 0}%`);
      setText("calendarCourseCount", `${dashboard.activeCourses || 0} courses active`);

      renderDashboardDeadlines(dashboard.upcomingDeadlines || []);
    } catch (error) {
      const tasks = read(STORE.tasks, fallbackTasks);
      const courses = read(STORE.courses, fallbackCourses);

      const high = tasks.filter((task) => task.priority === "High").length;
      const medium = tasks.filter((task) => task.priority === "Medium").length;
      const low = tasks.filter((task) => task.priority === "Low").length;

      setText("highPriorityCount", `${high} tasks`);
      setText("mediumPriorityCount", `${medium} tasks`);
      setText("lowPriorityCount", `${low} tasks`);

      const progressAverage = calculateCourseProgress(courses);
      setText("calendarCourseProgress", `${progressAverage}%`);
      setText("calendarCourseCount", `${courses.length} courses active`);

      renderDashboardDeadlines(tasks);
      showToast("Dashboard loaded from saved data. Backend not reachable.", "warning");
    }
  }

  function renderDashboardDeadlines(tasks) {
    const deadlineList = document.getElementById("upcomingDeadlineList");
    if (!deadlineList) return;

    const activeTasks = tasks
      .filter((task) => task.status !== "Completed")
      .sort((a, b) => String(a.due || "").localeCompare(String(b.due || "")))
      .slice(0, 3);

    if (activeTasks.length === 0) {
      deadlineList.innerHTML = `<div class="empty-study">No upcoming deadlines.</div>`;
      return;
    }

    deadlineList.innerHTML = activeTasks.map((task, index) => {
      const date = parseDate(task.due);
      const course = task.course || task.courseCode || "SCSE2243";
      const dueText = index === 0 ? "Due soon" : `Due in ${index * 2 + 2} days`;

      return `
        <div class="deadline-summary-item">
          <div class="deadline-date">
            <span>${date.month}</span>
            <strong>${date.day}</strong>
          </div>

          <div class="deadline-info">
            <h3>${escapeHTML(task.title)}</h3>
            <p>${escapeHTML(course)} - ${dueText}</p>
          </div>
        </div>
      `;
    }).join("");
  }

  /* ============================= */
  /* GENERATED STUDY SCHEDULE */
  /* ============================= */

  async function setupStudySchedulePage() {
    const list = document.getElementById("generatedScheduleList");
    if (!list) return;

    try {
      const data = await api(`/api/schedule/${getCurrentUserId()}`);
      renderStudySchedule(data.schedule || []);
    } catch (error) {
      const tasks = read(STORE.tasks, fallbackTasks)
        .filter((task) => task.status !== "Completed")
        .slice(0, 4);

      const fallbackSchedule = tasks.map((task, index) => ({
        title: task.title,
        course: task.course || task.courseCode || "SCSE2243",
        priority: task.priority || "Medium",
        day: index < 2 ? "Monday, May 19" : "Tuesday, May 20",
        time: ["2:00 PM - 4:30 PM", "7:00 PM - 8:30 PM", "3:00 PM - 5:00 PM", "8:00 PM - 9:00 PM"][index],
        note: [
          "Recommended because the deadline is near",
          "Suggested based on weak subject progress",
          "Optimal time based on your productivity patterns",
          "Light session scheduled for evening"
        ][index]
      }));

      renderStudySchedule(fallbackSchedule);
      showToast("Schedule loaded from saved data. Backend not reachable.", "warning");
    }
  }

  function renderStudySchedule(schedule) {
    const list = document.getElementById("generatedScheduleList");
    if (!list) return;

    if (!schedule.length) {
      list.innerHTML = `<div class="empty-study">No active tasks found. Add tasks first to generate a study schedule.</div>`;
      return;
    }

    let html = "";

    schedule.forEach((item, index) => {
      if (index === 0) {
        html += `<h2 class="schedule-day-title">${escapeHTML(item.day || "Monday, May 19")}</h2>`;
      }

      if (index > 0 && item.day && item.day !== schedule[index - 1].day) {
        html += `<h2 class="schedule-day-title">${escapeHTML(item.day)}</h2>`;
      }

      const priority = item.priority || "Medium";

      html += `
        <article class="generated-card">
          <div class="generated-top">
            <span class="generated-priority ${escapeHTML(priority.toLowerCase())}">${escapeHTML(priority)}</span>
            <span class="generated-course">${escapeHTML(item.course || "SCSE2243")}</span>
          </div>

          <h2>${escapeHTML(item.title)}</h2>

          <div class="generated-time">
            <i class="bi bi-clock"></i>
            ${escapeHTML(item.time || "8:00 PM - 9:00 PM")}
          </div>

          <div class="generated-note">
            ${escapeHTML(item.note || "AI recommended session based on your tasks")}
          </div>
        </article>
      `;
    });

    list.innerHTML = html;
  }

  /* ============================= */
  /* DATE / CALC HELPERS */
  /* ============================= */

  function calculateCourseProgress(courses) {
    if (!Array.isArray(courses) || courses.length === 0) return 68;

    const total = courses.reduce((sum, course) => {
      return sum + Number(course.progress || 68);
    }, 0);

    return Math.round(total / courses.length);
  }

  function formatDate(dateString) {
    if (!dateString) return "No date";

    const date = new Date(dateString + "T00:00:00");

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  }

  function parseDate(dateString) {
    if (!dateString) return { month: "May", day: "20" };

    const date = new Date(dateString + "T00:00:00");

    if (Number.isNaN(date.getTime())) {
      return { month: "May", day: "20" };
    }

    return {
      month: date.toLocaleDateString("en-US", { month: "short" }),
      day: date.toLocaleDateString("en-US", { day: "2-digit" })
    };
  }
})();
