(function () {
  "use strict";

  const STORE = {
    user: "sifu_user",
    courses: "sifu_courses",
    tasks: "sifu_tasks",
    loggedIn: "sifu_logged_in"
  };

  const defaultUser = {
    fullName: "UTM Student",
    email: "student@utm.my",
    faculty: "Faculty of Computing",
    programme: "Software Engineering",
    yearOfStudy: "Year 2",
    semester: "Semester 4",
    credits: "72 / 120",
    gpa: "3.45"
  };

  const defaultCourses = [
    { id: cryptoId(), code: "SCSE2243", name: "Application Development", lecturer: "Dr. Farhana", credits: 3, schedule: "Sun & Tue, 10:00 AM" },
    { id: cryptoId(), code: "SCSJ2013", name: "Data Structures and Algorithms", lecturer: "Dr. Hanafi", credits: 3, schedule: "Mon & Wed, 2:00 PM" },
    { id: cryptoId(), code: "SECJ2253", name: "Requirement Engineering", lecturer: "Dr. Aina", credits: 3, schedule: "Thu, 9:00 AM" },
    { id: cryptoId(), code: "SCSR2043", name: "Computer Security", lecturer: "Dr. Hakim", credits: 3, schedule: "Tue, 8:00 PM" }
  ];

  const defaultTasks = [
    { id: cryptoId(), title: "Complete UI coding", course: "SCSE2243", type: "Project", priority: "High", due: "2026-06-22", status: "Pending" },
    { id: cryptoId(), title: "DSA linked list revision", course: "SCSJ2013", type: "Study", priority: "Medium", due: "2026-06-24", status: "Pending" },
    { id: cryptoId(), title: "Architecture diagram check", course: "SECJ2253", type: "Assignment", priority: "High", due: "2026-06-25", status: "Completed" },
    { id: cryptoId(), title: "Security notes summary", course: "SCSR2043", type: "Study", priority: "Low", due: "2026-06-27", status: "Pending" }
  ];

  document.addEventListener("DOMContentLoaded", function () {
    ensureDefaults();
    activateCurrentNav();
    setupLogoFallback();
    setupPasswordToggles();
    setupInfoLinks();
    setupLogin();
    setupSignup();
    setupProfile();
    setupCourses();
    setupTasks();
    setupCalendar();
    setupSchedule();
  });

  function cryptoId() {
    return "id_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  }

  function $(selector, parent = document) {
    return parent.querySelector(selector);
  }

  function $all(selector, parent = document) {
    return Array.from(parent.querySelectorAll(selector));
  }

  function read(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function ensureDefaults() {
    if (!localStorage.getItem(STORE.user)) write(STORE.user, defaultUser);
    if (!localStorage.getItem(STORE.courses)) write(STORE.courses, defaultCourses);
    if (!localStorage.getItem(STORE.tasks)) write(STORE.tasks, defaultTasks);
  }

  function isUtmEmail(email) {
    return /^[^\s@]+@[^\s@]*utm\.my$/i.test(email.trim());
  }

  function showToast(message, type = "success") {
    const toastEl = $("#sifuToast");
    if (!toastEl) return;

    const body = $(".toast-body", toastEl);
    const icon = $(".toast-icon", toastEl);
    if (body) body.lastChild ? body.lastChild.textContent = message : body.append(message);
    if (icon) {
      icon.className = "toast-icon bi me-2 " + (type === "danger" ? "bi-exclamation-circle-fill" : type === "warning" ? "bi-exclamation-triangle-fill" : "bi-check-circle-fill");
    }

    toastEl.classList.remove("text-bg-success", "text-bg-danger", "text-bg-warning");
    toastEl.classList.add(type === "danger" ? "text-bg-danger" : type === "warning" ? "text-bg-warning" : "text-bg-success");

    if (window.bootstrap && bootstrap.Toast) {
      bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 2200 }).show();
    }
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

  function activateCurrentNav() {
    const file = location.pathname.split("/").pop() || "index.html";
    $all(".nav-item-sifu").forEach((link) => {
      const linkFile = link.getAttribute("href");
      if (linkFile === file) link.classList.add("active");
    });
  }

  function setupPasswordToggles() {
    const toggles = [
      ["#toggleLoginPassword", "#loginPassword"],
      ["#toggleSignupPassword", "#signupPassword"],
      ["#toggleConfirmPassword", "#confirmPassword"]
    ];

    toggles.forEach(([buttonSelector, inputSelector]) => {
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
    $all("[data-info]").forEach((item) => {
      item.addEventListener("click", (event) => {
        event.preventDefault();
        showToast(item.dataset.info || "This section is ready for the next subsystem.", "warning");
      });
    });
  }

  function setupLogin() {
    const form = $("#loginForm");
    if (!form) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const email = $("#loginEmail");
      const password = $("#loginPassword");
      let valid = true;

      if (!email.value.trim() || !isUtmEmail(email.value)) {
        email.classList.add("is-invalid");
        valid = false;
      } else email.classList.remove("is-invalid");

      if (!password.value.trim()) {
        password.classList.add("is-invalid");
        valid = false;
      } else password.classList.remove("is-invalid");

      if (!valid) {
        showToast("Please enter a valid UTM email and password.", "danger");
        return;
      }

      const user = read(STORE.user, defaultUser);
      user.email = email.value.trim();
      write(STORE.user, user);
      write(STORE.loggedIn, true);
      showToast("Login successful. Opening profile...");
      setTimeout(() => location.href = "calendar.html", 700);
    });
  }

  function setupSignup() {
    const form = $("#signupForm");
    if (!form) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const fullName = $("#fullName");
      const email = $("#signupEmail");
      const faculty = $("#faculty");
      const programme = $("#programme");
      const year = $("#yearOfStudy");
      const password = $("#signupPassword");
      const confirm = $("#confirmPassword");

      const fields = [fullName, faculty, programme, year, password, confirm];
      let valid = true;

      fields.forEach((field) => {
        if (!field.value.trim()) {
          field.classList.add("is-invalid");
          valid = false;
        } else field.classList.remove("is-invalid");
      });

      if (!email.value.trim() || !isUtmEmail(email.value)) {
        email.classList.add("is-invalid");
        valid = false;
      } else email.classList.remove("is-invalid");

      if (password.value !== confirm.value || !confirm.value.trim()) {
        confirm.classList.add("is-invalid");
        valid = false;
      } else confirm.classList.remove("is-invalid");

      if (!valid) {
        showToast("Check the form fields before signing up.", "danger");
        return;
      }

      write(STORE.user, {
        fullName: fullName.value.trim(),
        email: email.value.trim(),
        faculty: faculty.value,
        programme: programme.value.trim(),
        yearOfStudy: year.value,
        semester: "Semester 4",
        credits: "72 / 120",
        gpa: "3.45"
      });
      write(STORE.loggedIn, true);
      showToast("Account created. Opening profile...");
      setTimeout(() => location.href = "calendar.html", 800);
    });
  }

  function setupProfile() {
    if (!$("#profileName")) return;

    const user = read(STORE.user, defaultUser);
    const courses = read(STORE.courses, defaultCourses);
    const tasks = read(STORE.tasks, defaultTasks);

    setText("#profileName", user.fullName);
    setText("#profileProgrammeYear", `${user.programme}, ${user.yearOfStudy}`);
    setText("#profileEmail", user.email);
    setText("#currentSemester", user.semester);
    setText("#totalCredits", user.credits);
    setText("#currentGpa", user.gpa);
    setText("#activeCourses", courses.length.toString());
    setText("#activeTasks", tasks.filter((task) => task.status !== "Completed").length.toString());

    $all("[data-logout]").forEach((button) => {
      button.addEventListener("click", () => {
        write(STORE.loggedIn, false);
        showToast("Logged out successfully.");
        setTimeout(() => location.href = "login.html", 700);
      });
    });
  }

  function setText(selector, text) {
    const element = $(selector);
    if (element) element.textContent = text;
  }

  function setupCourses() {
    const list = $("#courseList");
    if (!list) return;

    const form = $("#courseForm");
    const search = $("#courseSearch");
    const modalEl = $("#courseModal");
    const modalTitle = $("#courseModalLabel");

    renderCourses();

    $all("[data-course-new]").forEach((button) => {
      button.addEventListener("click", () => {
        form.reset();
        delete form.dataset.editingId;
        if (modalTitle) modalTitle.textContent = "Add Course";
      });
    });

    if (search) search.addEventListener("input", renderCourses);

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.classList.add("was-validated");
        showToast("Please complete all course fields.", "danger");
        return;
      }

      const courses = read(STORE.courses, defaultCourses);
      const newCourse = {
        id: form.dataset.editingId || cryptoId(),
        code: $("#courseCode").value.trim().toUpperCase(),
        name: $("#courseName").value.trim(),
        lecturer: $("#lecturerName").value.trim(),
        credits: Number($("#creditHours").value),
        schedule: $("#classSchedule").value.trim()
      };

      const index = courses.findIndex((course) => course.id === newCourse.id);
      if (index >= 0) {
        courses[index] = newCourse;
        showToast("Course updated successfully.");
      } else {
        courses.push(newCourse);
        showToast("Course added successfully.");
      }

      write(STORE.courses, courses);
      form.classList.remove("was-validated");
      form.reset();
      delete form.dataset.editingId;
      if (modalTitle) modalTitle.textContent = "Add Course";
      closeModal(modalEl);
      renderCourses();
    });

    list.addEventListener("click", (event) => {
      const editButton = event.target.closest("[data-edit-course]");
      const deleteButton = event.target.closest("[data-delete-course]");

      if (editButton) {
        const courses = read(STORE.courses, defaultCourses);
        const course = courses.find((item) => item.id === editButton.dataset.editCourse);
        if (!course) return;
        $("#courseCode").value = course.code;
        $("#courseName").value = course.name;
        $("#lecturerName").value = course.lecturer;
        $("#creditHours").value = course.credits;
        $("#classSchedule").value = course.schedule;
        form.dataset.editingId = course.id;
        if (modalTitle) modalTitle.textContent = "Edit Course";
        openModal(modalEl);
      }

      if (deleteButton) {
        const id = deleteButton.dataset.deleteCourse;
        const courses = read(STORE.courses, defaultCourses).filter((course) => course.id !== id);
        write(STORE.courses, courses);
        showToast("Course deleted.", "warning");
        renderCourses();
      }
    });

    function renderCourses() {
      const courses = read(STORE.courses, defaultCourses);
      const term = (search?.value || "").trim().toLowerCase();
      const filtered = courses.filter((course) => {
        return [course.code, course.name, course.lecturer, course.schedule].join(" ").toLowerCase().includes(term);
      });

      if (!filtered.length) {
        list.innerHTML = `<div class="empty-state"><i class="bi bi-search"></i><p class="mb-0 mt-2">No courses found. Add a new course or clear the search.</p></div>`;
        return;
      }

      list.innerHTML = filtered.map((course) => `
        <article class="course-card">
          <div class="d-flex justify-content-between align-items-start gap-3">
            <div>
              <span class="status-badge badge-primary mb-2">${escapeHtml(course.code)}</span>
              <h3 class="h5 fw-bold mb-1">${escapeHtml(course.name)}</h3>
              <p class="small muted-text mb-1"><i class="bi bi-person-video3 me-1"></i>${escapeHtml(course.lecturer)}</p>
              <p class="small muted-text mb-0"><i class="bi bi-clock me-1"></i>${escapeHtml(course.schedule)} · ${course.credits} credits</p>
            </div>
          </div>
          <div class="card-actions">
            <button class="action-btn" type="button" data-edit-course="${course.id}"><i class="bi bi-pencil-square me-1"></i>Edit</button>
            <button class="action-btn" type="button" data-delete-course="${course.id}"><i class="bi bi-trash me-1"></i>Delete</button>
          </div>
        </article>
      `).join("");
    }
  }

  function setupTasks() {
    const list = $("#taskList");
    if (!list) return;

    const form = $("#taskForm");
    const modalEl = $("#taskModal");
    const modalTitle = $("#taskModalLabel");
    let activeFilter = "All";

    renderTasks();

    $all("[data-task-new]").forEach((button) => {
      button.addEventListener("click", () => {
        form.reset();
        delete form.dataset.editingId;
        if (modalTitle) modalTitle.textContent = "Add Academic Task";
      });
    });

    $all("[data-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        $all("[data-filter]").forEach((pill) => pill.classList.remove("active"));
        button.classList.add("active");
        activeFilter = button.dataset.filter;
        renderTasks();
      });
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.classList.add("was-validated");
        showToast("Please complete all task fields.", "danger");
        return;
      }

      const tasks = read(STORE.tasks, defaultTasks);
      const task = {
        id: form.dataset.editingId || cryptoId(),
        title: $("#taskTitle").value.trim(),
        course: $("#taskCourse").value.trim().toUpperCase(),
        type: $("#taskType").value,
        priority: $("#taskPriority").value,
        due: $("#taskDue").value,
        status: form.dataset.editingId ? (tasks.find((item) => item.id === form.dataset.editingId)?.status || "Pending") : "Pending"
      };

      const index = tasks.findIndex((item) => item.id === task.id);
      if (index >= 0) {
        tasks[index] = task;
        showToast("Task updated successfully.");
      } else {
        tasks.push(task);
        showToast("Task added successfully.");
      }

      write(STORE.tasks, tasks);
      form.classList.remove("was-validated");
      form.reset();
      delete form.dataset.editingId;
      if (modalTitle) modalTitle.textContent = "Add Academic Task";
      closeModal(modalEl);
      renderTasks();
    });

    list.addEventListener("click", (event) => {
      const completeButton = event.target.closest("[data-complete-task]");
      const editButton = event.target.closest("[data-edit-task]");
      const deleteButton = event.target.closest("[data-delete-task]");
      const tasks = read(STORE.tasks, defaultTasks);

      if (completeButton) {
        const task = tasks.find((item) => item.id === completeButton.dataset.completeTask);
        if (!task) return;
        task.status = task.status === "Completed" ? "Pending" : "Completed";
        write(STORE.tasks, tasks);
        showToast(task.status === "Completed" ? "Task marked as completed." : "Task moved back to pending.");
        renderTasks();
      }

      if (editButton) {
        const task = tasks.find((item) => item.id === editButton.dataset.editTask);
        if (!task) return;
        $("#taskTitle").value = task.title;
        $("#taskCourse").value = task.course;
        $("#taskType").value = task.type;
        $("#taskPriority").value = task.priority;
        $("#taskDue").value = task.due;
        form.dataset.editingId = task.id;
        if (modalTitle) modalTitle.textContent = "Edit Academic Task";
        openModal(modalEl);
      }

      if (deleteButton) {
        const updatedTasks = tasks.filter((item) => item.id !== deleteButton.dataset.deleteTask);
        write(STORE.tasks, updatedTasks);
        showToast("Task deleted.", "warning");
        renderTasks();
      }
    });

    function renderTasks() {
      const tasks = read(STORE.tasks, defaultTasks);
      const sorted = tasks.slice().sort((a, b) => new Date(a.due) - new Date(b.due));
      const filtered = sorted.filter((task) => {
        if (activeFilter === "All") return true;
        if (activeFilter === "High") return task.priority === "High";
        return task.status === activeFilter;
      });

      if (!filtered.length) {
        list.innerHTML = `<div class="empty-state"><i class="bi bi-check2-circle"></i><p class="mb-0 mt-2">No tasks in this filter.</p></div>`;
        return;
      }

      list.innerHTML = filtered.map((task) => {
        const priorityClass = task.priority === "High" ? "badge-danger" : task.priority === "Medium" ? "badge-warning" : "badge-success";
        const statusClass = task.status === "Completed" ? "badge-success" : isOverdue(task.due) ? "badge-danger" : "badge-primary";
        const statusText = task.status === "Completed" ? "Completed" : isOverdue(task.due) ? "Overdue" : "Pending";
        return `
          <article class="task-card">
            <div class="d-flex justify-content-between align-items-start gap-3">
              <div>
                <div class="d-flex flex-wrap gap-2 mb-2">
                  <span class="status-badge ${priorityClass}">${escapeHtml(task.priority)}</span>
                  <span class="status-badge ${statusClass}">${statusText}</span>
                </div>
                <h3 class="h5 fw-bold mb-1">${escapeHtml(task.title)}</h3>
                <p class="small muted-text mb-0"><i class="bi bi-journal-text me-1"></i>${escapeHtml(task.course)} · ${escapeHtml(task.type)} · Due ${formatDate(task.due)}</p>
              </div>
            </div>
            <div class="card-actions">
              <button class="action-btn" type="button" data-complete-task="${task.id}"><i class="bi bi-check2-circle me-1"></i>${task.status === "Completed" ? "Undo" : "Complete"}</button>
              <button class="action-btn" type="button" data-edit-task="${task.id}"><i class="bi bi-pencil-square me-1"></i>Edit</button>
              <button class="action-btn" type="button" data-delete-task="${task.id}"><i class="bi bi-trash me-1"></i>Delete</button>
            </div>
          </article>
        `;
      }).join("");
    }
  }

  function setupCalendar() {
    const list = $("#deadlineList");
    if (!list) return;

    const tasks = read(STORE.tasks, defaultTasks)
      .slice()
      .sort((a, b) => new Date(a.due) - new Date(b.due))
      .slice(0, 5);

    if (!tasks.length) {
      list.innerHTML = `<div class="empty-state">No deadlines yet. Add tasks to populate the calendar.</div>`;
      return;
    }

    list.innerHTML = tasks.map((task) => {
      const badge = task.status === "Completed" ? "badge-success" : task.priority === "High" ? "badge-danger" : "badge-warning";
      return `
        <article class="deadline-card">
          <div class="d-flex justify-content-between align-items-start gap-2">
            <div>
              <strong>${escapeHtml(task.title)}</strong>
              <p class="small muted-text mb-0 mt-1">${escapeHtml(task.course)} · ${escapeHtml(task.type)}</p>
            </div>
            <span class="status-badge ${badge}">${formatDate(task.due)}</span>
          </div>
        </article>
      `;
    }).join("");
  }

  function setupSchedule() {
    const list = $("#scheduleList");
    if (!list) return;

    const refreshButton = $("#refreshSchedule");
    if (refreshButton) {
      refreshButton.addEventListener("click", () => {
        renderSchedule(true);
        showToast("Schedule refreshed from current tasks.");
      });
    }

    renderSchedule(false);

    function renderSchedule(force) {
      const tasks = read(STORE.tasks, defaultTasks)
        .filter((task) => task.status !== "Completed")
        .sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority) || new Date(a.due) - new Date(b.due))
        .slice(0, 4);

      if (!tasks.length) {
        list.innerHTML = `<div class="empty-state">All tasks are completed. Add a new task to generate today's schedule.</div>`;
        return;
      }

      const times = ["9:00 AM", "11:00 AM", "2:00 PM", "8:00 PM"];
      list.innerHTML = tasks.map((task, index) => {
        const statusClass = index === 0 ? "badge-primary" : index === 1 ? "badge-warning" : "badge-success";
        const label = index === 0 ? "Planned" : index === 1 ? "Next" : "Later";
        return `
          <article class="schedule-item">
            <span class="timeline-point"></span>
            <div class="d-flex justify-content-between align-items-start gap-3">
              <div>
                <h3 class="h6 fw-bold mb-1">${escapeHtml(task.course)}: ${escapeHtml(task.title)}</h3>
                <p class="small muted-text mb-2">Focus on this ${escapeHtml(task.type.toLowerCase())} before ${formatDate(task.due)}.</p>
                <span class="status-badge ${statusClass}"><i class="bi bi-clock"></i>${label}</span>
              </div>
              <strong class="small">${times[index]}</strong>
            </div>
          </article>
        `;
      }).join("");
    }
  }

  function openModal(modalEl) {
    if (!modalEl) return;
    if (window.bootstrap && bootstrap.Modal) {
      bootstrap.Modal.getOrCreateInstance(modalEl).show();
    }
  }

  function closeModal(modalEl) {
    if (!modalEl) return;
    if (window.bootstrap && bootstrap.Modal) {
      bootstrap.Modal.getOrCreateInstance(modalEl).hide();
    }
  }

  function priorityRank(priority) {
    return priority === "High" ? 1 : priority === "Medium" ? 2 : 3;
  }

  function isOverdue(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(date) < today;
  }

  function formatDate(date) {
    if (!date) return "No date";
    return new Date(date + "T00:00:00").toLocaleDateString("en-MY", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
})();
/* ============================= */
/* COURSES + TASKS FUNCTIONALITY */
/* ============================= */

(function () {
  const COURSE_KEY = "sifu_courses";
  const TASK_KEY = "sifu_tasks";

  const defaultCoursesUI = [
    {
      id: makeId(),
      code: "SCSE2243",
      name: "Software Design & Architecture",
      lecturer: "Dr. Ahmad Fadzil",
      credits: 3,
      progress: 72,
      color: "red"
    },
    {
      id: makeId(),
      code: "SECJ2013",
      name: "Software Engineering",
      lecturer: "Prof. Norhayati Mohd",
      credits: 3,
      progress: 58,
      color: "green"
    },
    {
      id: makeId(),
      code: "SCSJ2203",
      name: "Data Structures & Algorithms",
      lecturer: "Dr. Lim Boon Yian",
      credits: 3,
      progress: 45,
      color: "salmon"
    },
    {
      id: makeId(),
      code: "SCST1223",
      name: "Statistics for Computing",
      lecturer: "Dr. Roslan Johari",
      credits: 2,
      progress: 85,
      color: "dark"
    }
  ];

  const defaultTasksUI = [
    {
      id: makeId(),
      title: "Software Design Report",
      course: "SCSE2243",
      status: "Pending",
      priority: "High",
      due: "2026-05-24"
    },
    {
      id: makeId(),
      title: "Lab Exercise 4 – Linked Lists",
      course: "SCSJ2203",
      status: "Overdue",
      priority: "High",
      due: "2026-05-22"
    },
    {
      id: makeId(),
      title: "UML Diagram Assignment",
      course: "SECJ2013",
      status: "Pending",
      priority: "Medium",
      due: "2026-05-28"
    },
    {
      id: makeId(),
      title: "Statistics Quiz 2",
      course: "SCST1223",
      status: "Pending",
      priority: "Medium",
      due: "2026-05-26"
    },
    {
      id: makeId(),
      title: "Requirements Specification Doc",
      course: "SECJ2013",
      status: "Completed",
      priority: "High",
      due: "2026-05-15"
    },
    {
      id: makeId(),
      title: "Probability Problem Set 1",
      course: "SCST1223",
      status: "Completed",
      priority: "Low",
      due: "2026-05-18"
    }
  ];

  document.addEventListener("DOMContentLoaded", function () {
    setupTrackingInfoLinks();
    setupCoursesPage();
    setupTasksPage();
  });

  function makeId() {
    return "id_" + Math.random().toString(36).slice(2, 10);
  }

  function readData(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  }

  function writeData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function showSimpleToast(message) {
    const toast = document.getElementById("sifuToast");
    const toastMessage = document.getElementById("toastMessage");

    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 1800);
  }

  function setupTrackingInfoLinks() {
    document.querySelectorAll("[data-info]").forEach((link) => {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        showSimpleToast(link.dataset.info || "This feature will be connected after merge.");
      });
    });
  }

  /* ---------- COURSES PAGE ---------- */

  function setupCoursesPage() {
    const list = document.getElementById("courseCards");
    const form = document.getElementById("courseForm");
    const modal = document.getElementById("courseModal");

    if (!list || !form || !modal) return;

    let courses = readData(COURSE_KEY, null);

    if (!Array.isArray(courses) || courses.length === 0) {
      courses = defaultCoursesUI;
      writeData(COURSE_KEY, courses);
    }

    renderCourses(courses);

    document.getElementById("openCourseModal").addEventListener("click", function () {
      form.reset();
      document.getElementById("courseId").value = "";
      document.getElementById("courseModalTitle").textContent = "Add Course";
      openModal(modal);
    });

    document.getElementById("closeCourseModal").addEventListener("click", function () {
      closeModal(modal);
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const id = document.getElementById("courseId").value;

      const courseData = {
        id: id || makeId(),
        code: document.getElementById("courseCode").value.trim(),
        name: document.getElementById("courseName").value.trim(),
        lecturer: document.getElementById("courseLecturer").value.trim(),
        credits: Number(document.getElementById("courseCredits").value),
        progress: Number(document.getElementById("courseProgress").value),
        color: document.getElementById("courseColor").value
      };

      if (!courseData.code || !courseData.name || !courseData.lecturer || !courseData.credits) {
        showSimpleToast("Please fill in all course fields.");
        return;
      }

      if (id) {
        courses = courses.map((course) => course.id === id ? courseData : course);
        showSimpleToast("Course updated.");
      } else {
        courses.unshift(courseData);
        showSimpleToast("Course added.");
      }

      writeData(COURSE_KEY, courses);
      renderCourses(courses);
      closeModal(modal);
    });

    list.addEventListener("click", function (event) {
      const editBtn = event.target.closest("[data-course-edit]");
      const deleteBtn = event.target.closest("[data-course-delete]");

      if (editBtn) {
        const course = courses.find((item) => item.id === editBtn.dataset.courseEdit);
        if (!course) return;

        document.getElementById("courseId").value = course.id;
        document.getElementById("courseCode").value = course.code;
        document.getElementById("courseName").value = course.name;
        document.getElementById("courseLecturer").value = course.lecturer || "";
        document.getElementById("courseCredits").value = course.credits || 3;
        document.getElementById("courseProgress").value = course.progress || 0;
        document.getElementById("courseColor").value = course.color || "red";
        document.getElementById("courseModalTitle").textContent = "Edit Course";

        openModal(modal);
      }

      if (deleteBtn) {
        courses = courses.filter((item) => item.id !== deleteBtn.dataset.courseDelete);
        writeData(COURSE_KEY, courses);
        renderCourses(courses);
        showSimpleToast("Course deleted.");
      }
    });
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
        <article class="course-card-ui course-${color}">
          <div class="course-card-top">
            <div>
              <div class="course-tags">
                <span class="course-code-badge">${escapeHTML(course.code)}</span>
                <span class="course-credit">${course.credits} credits</span>
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

  /* ---------- TASKS PAGE ---------- */

  function setupTasksPage() {
    const list = document.getElementById("taskCards");
    const form = document.getElementById("taskForm");
    const modal = document.getElementById("taskModal");

    if (!list || !form || !modal) return;

    let tasks = readData(TASK_KEY, null);

    if (!Array.isArray(tasks) || tasks.length === 0) {
      tasks = defaultTasksUI;
      writeData(TASK_KEY, tasks);
    }

    let currentFilter = "All";

    renderTasks(tasks, currentFilter);

    document.getElementById("openTaskModal").addEventListener("click", function () {
      form.reset();
      document.getElementById("taskId").value = "";
      document.getElementById("taskModalTitle").textContent = "Add Task";
      openModal(modal);
    });

    document.getElementById("closeTaskModal").addEventListener("click", function () {
      closeModal(modal);
    });

    document.querySelectorAll(".task-filter").forEach((button) => {
      button.addEventListener("click", function () {
        document.querySelectorAll(".task-filter").forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        currentFilter = button.dataset.filter;
        renderTasks(tasks, currentFilter);
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const id = document.getElementById("taskId").value;

      const taskData = {
        id: id || makeId(),
        title: document.getElementById("taskTitle").value.trim(),
        course: document.getElementById("taskCourse").value.trim(),
        status: document.getElementById("taskStatus").value,
        priority: document.getElementById("taskPriority").value,
        due: document.getElementById("taskDue").value
      };

      if (!taskData.title || !taskData.course || !taskData.due) {
        showSimpleToast("Please fill in all task fields.");
        return;
      }

      if (id) {
        tasks = tasks.map((task) => task.id === id ? taskData : task);
        showSimpleToast("Task updated.");
      } else {
        tasks.unshift(taskData);
        showSimpleToast("Task added.");
      }

      writeData(TASK_KEY, tasks);
      renderTasks(tasks, currentFilter);
      closeModal(modal);
    });

    list.addEventListener("click", function (event) {
      const editBtn = event.target.closest("[data-task-edit]");
      const deleteBtn = event.target.closest("[data-task-delete]");
      const checkBtn = event.target.closest("[data-task-check]");

      if (checkBtn) {
        tasks = tasks.map((task) => {
          if (task.id !== checkBtn.dataset.taskCheck) return task;
          return {
            ...task,
            status: task.status === "Completed" ? "Pending" : "Completed"
          };
        });

        writeData(TASK_KEY, tasks);
        renderTasks(tasks, currentFilter);
        showSimpleToast("Task status updated.");
      }

      if (editBtn) {
        const task = tasks.find((item) => item.id === editBtn.dataset.taskEdit);
        if (!task) return;

        document.getElementById("taskId").value = task.id;
        document.getElementById("taskTitle").value = task.title;
        document.getElementById("taskCourse").value = task.course;
        document.getElementById("taskStatus").value = task.status;
        document.getElementById("taskPriority").value = task.priority;
        document.getElementById("taskDue").value = task.due;
        document.getElementById("taskModalTitle").textContent = "Edit Task";

        openModal(modal);
      }

      if (deleteBtn) {
        tasks = tasks.filter((item) => item.id !== deleteBtn.dataset.taskDelete);
        writeData(TASK_KEY, tasks);
        renderTasks(tasks, currentFilter);
        showSimpleToast("Task deleted.");
      }
    });
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
      list.innerHTML = `<div class="empty-tracking">No ${filter.toLowerCase()} tasks found.</div>`;
      return;
    }

    list.innerHTML = visibleTasks.map((task) => {
      const statusClass = task.status.toLowerCase();
      const isDone = task.status === "Completed";
      const priorityClass = task.priority === "Low" ? "low" : "priority";

      return `
        <article class="task-card-ui ${isDone ? "done" : ""}">
          <button class="task-check ${isDone ? "done" : ""}" type="button" data-task-check="${task.id}">
            ${isDone ? `<i class="bi bi-check-lg"></i>` : ""}
          </button>

          <div class="task-main">
            <div class="task-badges">
              <span class="task-badge ${statusClass}">${task.status}</span>
              <span class="task-badge ${priorityClass}">
                <i class="bi bi-flag"></i>
                ${task.priority}
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

  function openModal(modal) {
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeModal(modal) {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
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

  function escapeHTML(text) {
    return String(text || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
})();
/* ============================= */
/* CALENDAR + SCHEDULE FUNCTIONALITY */
/* ============================= */

(function () {
  const COURSE_KEY = "sifu_courses";
  const TASK_KEY = "sifu_tasks";

  document.addEventListener("DOMContentLoaded", function () {
    setupStudySchedulePage();
    setupCalendarDashboardPage();
    setupStudyInfoLinks();
  });

  function readData(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  }

  function setupStudyInfoLinks() {
    document.querySelectorAll("[data-info]").forEach((link) => {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        showStudyToast(link.dataset.info || "This page will connect after merge.");
      });
    });
  }

  function showStudyToast(message) {
    const toast = document.getElementById("sifuToast");
    const toastMessage = document.getElementById("toastMessage");

    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 1800);
  }

  function setupStudySchedulePage() {
    const list = document.getElementById("generatedScheduleList");
    if (!list) return;

    const tasks = readData(TASK_KEY, getFallbackTasks());

    const activeTasks = tasks
      .filter((task) => task.status !== "Completed")
      .slice(0, 4);

    if (activeTasks.length === 0) {
      list.innerHTML = `<div class="empty-study">No active tasks found. Add tasks first to generate a study schedule.</div>`;
      return;
    }

    const times = [
      "2:00 PM - 4:30 PM",
      "7:00 PM - 8:30 PM",
      "3:00 PM - 5:00 PM",
      "8:00 PM - 9:00 PM"
    ];

    const notes = [
      "Recommended because the deadline is near",
      "Suggested based on weak subject progress",
      "Optimal time based on your productivity patterns",
      "Light session scheduled for evening"
    ];

    const days = ["Monday, May 19", "Tuesday, May 20"];

    let html = "";

    activeTasks.forEach((task, index) => {
      if (index === 0) html += `<h2 class="schedule-day-title">${days[0]}</h2>`;
      if (index === 2) html += `<h2 class="schedule-day-title">${days[1]}</h2>`;

      const priority = normalizePriority(task.priority);
      const course = task.course || task.courseCode || "SCSE2243";

      html += `
        <article class="generated-card">
          <div class="generated-top">
            <span class="generated-priority ${priority.toLowerCase()}">${priority}</span>
            <span class="generated-course">${escapeHTML(course)}</span>
          </div>

          <h2>${escapeHTML(task.title)}</h2>

          <div class="generated-time">
            <i class="bi bi-clock"></i>
            ${times[index] || "8:00 PM - 9:00 PM"}
          </div>

          <div class="generated-note">
            ${notes[index] || "AI recommended session based on your tasks"}
          </div>
        </article>
      `;
    });

    list.innerHTML = html;
  }

  function setupCalendarDashboardPage() {
    const deadlineList = document.getElementById("upcomingDeadlineList");
    if (!deadlineList) return;

    const tasks = readData(TASK_KEY, getFallbackTasks());
    const courses = readData(COURSE_KEY, getFallbackCourses());

    const high = tasks.filter((task) => task.priority === "High").length;
    const medium = tasks.filter((task) => task.priority === "Medium").length;
    const low = tasks.filter((task) => task.priority === "Low").length;

    setText("highPriorityCount", `${high} tasks`);
    setText("mediumPriorityCount", `${medium} tasks`);
    setText("lowPriorityCount", `${low} tasks`);

    const progressAverage = calculateCourseProgress(courses);
    setText("calendarCourseProgress", `${progressAverage}%`);
    setText("calendarCourseCount", `${courses.length} courses active`);

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

      return `
        <div class="deadline-summary-item">
          <div class="deadline-date">
            <span>${date.month}</span>
            <strong>${date.day}</strong>
          </div>

          <div class="deadline-info">
            <h3>${escapeHTML(task.title)}</h3>
            <p>${escapeHTML(course)} - Due in ${index * 2 + 2} days</p>
          </div>
        </div>
      `;
    }).join("");
  }

  function calculateCourseProgress(courses) {
    if (!Array.isArray(courses) || courses.length === 0) return 68;

    const total = courses.reduce((sum, course) => {
      return sum + Number(course.progress || 68);
    }, 0);

    return Math.round(total / courses.length);
  }

  function normalizePriority(priority) {
    if (priority === "High") return "High";
    if (priority === "Medium") return "Medium";
    return "Low";
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

  function setText(id, value) {
    const element = document.getElementById(id);
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

  function getFallbackCourses() {
    return [
      { code: "SCSE2243", progress: 72 },
      { code: "SECJ2013", progress: 58 },
      { code: "SCSJ2203", progress: 45 },
      { code: "SCST1223", progress: 85 }
    ];
  }

  function getFallbackTasks() {
    return [
      {
        title: "Software Design Report",
        course: "SCSE2243",
        status: "Pending",
        priority: "High",
        due: "2026-05-20"
      },
      {
        title: "Database ERD Submission",
        course: "SECJ2013",
        status: "Pending",
        priority: "Medium",
        due: "2026-05-22"
      },
      {
        title: "Quiz 2",
        course: "SCSJ2203",
        status: "Pending",
        priority: "High",
        due: "2026-05-25"
      },
      {
        title: "Assignment 3 Planning",
        course: "SCST1223",
        status: "Pending",
        priority: "Low",
        due: "2026-05-25"
      }
    ];
  }
})();