document.addEventListener("DOMContentLoaded", function () {
  const API_BASE_URL = "http://localhost:5000/api/support";
  const DEMO_STUDENT_ID = 1;

  const chatForm = document.getElementById("chatForm");
  const chatInput = document.getElementById("chatInput");
  const chatMessages = document.getElementById("chatMessages");
  const suggestionButtons = document.querySelectorAll(".suggestion-btn");

  const toggleInputs = document.querySelectorAll(".switch input");
  const toastMessage = document.getElementById("toastMessage");

  const feedbackForm = document.getElementById("feedbackForm");
  const feedbackCategory = document.getElementById("feedbackCategory");
  const feedbackRating = document.getElementById("feedbackRating");
  const feedbackSubject = document.getElementById("feedbackSubject");
  const feedbackMessage = document.getElementById("feedbackMessage");
  const feedbackSuccess = document.getElementById("feedbackSuccess");

  const settingKeys = [
    "study_reminders",
    "deadline_reminders",
    "ai_suggestions",
    "email_notifications"
  ];

  function addMessage(text, sender) {
    if (!chatMessages) return;

    const row = document.createElement("div");

    if (sender === "bot") {
      row.className = "message-row ai";
    } else if (sender === "ai") {
      row.className = "message-row ai";
    } else {
      row.className = "message-row user";
    }

    const bubble = document.createElement("div");
    bubble.className = "message-bubble";
    bubble.textContent = text;

    row.appendChild(bubble);
    chatMessages.appendChild(row);

    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  async function loadChatHistory() {
    if (!chatMessages) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/chat/messages/${DEMO_STUDENT_ID}`
      );

      const result = await response.json();

      chatMessages.innerHTML = "";

      if (!result.success || !result.data || result.data.length === 0) {
        addMessage(
          "Hi Maged! I am Sifu Assistant. Ask me anything about your study plan, deadlines, or revision strategy.",
          "ai"
        );
        return;
      }

      result.data.forEach(function (message) {
        addMessage(message.message_text, message.sender);
      });
    } catch (error) {
      console.error("Chat history error:", error);

      chatMessages.innerHTML = "";

      addMessage(
        "Backend connection failed. Please make sure the shared backend is running on port 5000.",
        "ai"
      );
    }
  }

  async function sendMessage(message) {
    if (!message || message.trim() === "") {
      return;
    }

    addMessage(message, "user");

    if (chatInput) {
      chatInput.value = "";
    }

    try {
      const response = await fetch(`${API_BASE_URL}/chat/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          studentId: DEMO_STUDENT_ID,
          message: message
        })
      });

      const result = await response.json();

      if (!result.success) {
        addMessage(
          result.message || "Sorry, I could not send your message. Please try again.",
          "ai"
        );
        return;
      }

      addMessage(result.data.botMessage.message_text, "ai");
    } catch (error) {
      console.error("Send message error:", error);

      addMessage(
        "Backend connection failed. Please start the shared backend server.",
        "ai"
      );
    }
  }

  if (chatForm) {
    loadChatHistory();

    chatForm.addEventListener("submit", function (event) {
      event.preventDefault();
      sendMessage(chatInput.value);
    });
  }

  suggestionButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      sendMessage(button.textContent);
    });
  });

  function showToast(message) {
    if (!toastMessage) return;

    toastMessage.textContent = message || "Notification setting updated successfully.";
    toastMessage.classList.add("show");

    setTimeout(function () {
      toastMessage.classList.remove("show");
    }, 1800);
  }

  async function loadNotificationSettings() {
    if (toggleInputs.length === 0) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/notification-settings/${DEMO_STUDENT_ID}`
      );

      const result = await response.json();

      if (!result.success || !result.data) {
        return;
      }

      toggleInputs.forEach(function (toggle, index) {
        const key = settingKeys[index];
        toggle.checked = Boolean(result.data[key]);
      });
    } catch (error) {
      console.error("Load notification settings error:", error);
      showToast("Could not load notification settings.");
    }
  }

  async function saveNotificationSettings() {
    if (toggleInputs.length === 0) return;

    const settings = {};

    toggleInputs.forEach(function (toggle, index) {
      const key = settingKeys[index];
      settings[key] = toggle.checked;
    });

    try {
      const response = await fetch(
        `${API_BASE_URL}/notification-settings/${DEMO_STUDENT_ID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(settings)
        }
      );

      const result = await response.json();

      if (result.success) {
        showToast("Notification setting updated successfully.");
      } else {
        showToast(result.message || "Could not update notification setting.");
      }
    } catch (error) {
      console.error("Save notification settings error:", error);
      showToast("Backend connection failed.");
    }
  }

  if (toggleInputs.length > 0) {
    loadNotificationSettings();

    toggleInputs.forEach(function (toggle) {
      toggle.addEventListener("change", function () {
        saveNotificationSettings();
      });
    });
  }

  if (feedbackForm) {
    feedbackForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const categoryValue = feedbackCategory.value.trim();
      const ratingValue = feedbackRating.value.trim();
      const subjectValue = feedbackSubject.value.trim();
      const messageValue = feedbackMessage.value.trim();

      if (
        categoryValue === "" ||
        ratingValue === "" ||
        subjectValue === "" ||
        messageValue === ""
      ) {
        alert("Please complete all feedback fields before submitting.");
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/feedback`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            studentId: DEMO_STUDENT_ID,
            category: categoryValue,
            rating: ratingValue,
            subject: subjectValue,
            message: messageValue
          })
        });

        const result = await response.json();

        if (!result.success) {
          alert(result.message || "Feedback could not be submitted.");
          return;
        }

        if (feedbackSuccess) {
          feedbackSuccess.classList.add("show");
        }

        feedbackForm.reset();

        setTimeout(function () {
          if (feedbackSuccess) {
            feedbackSuccess.classList.remove("show");
          }
        }, 3000);
      } catch (error) {
        console.error("Feedback submit error:", error);
        alert("Backend connection failed. Please start the shared backend server.");
      }
    });
  }
});