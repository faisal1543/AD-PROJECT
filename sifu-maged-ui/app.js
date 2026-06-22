document.addEventListener("DOMContentLoaded", function () {
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

  function addMessage(text, sender) {
    if (!chatMessages) return;

    const row = document.createElement("div");
    row.className = `message-row ${sender}`;

    const bubble = document.createElement("div");
    bubble.className = "message-bubble";
    bubble.textContent = text;

    row.appendChild(bubble);
    chatMessages.appendChild(row);

    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

 function getFakeReply(message) {
  const lowerMessage = message.toLowerCase();

  if (
    lowerMessage === "hi" ||
    lowerMessage === "hello" ||
    lowerMessage === "hey" ||
    lowerMessage.includes("hi ")
  ) {
    return "Hi Majid! How can I help you today? You can ask me about study planning, task priority, deadlines, or revision.";
  }

  if (lowerMessage.includes("how are you")) {
    return "I am ready to help you with your studies. Tell me what subject or task you want to work on.";
  }

  if (lowerMessage.includes("thank")) {
    return "You are welcome! Keep going, and try to finish the most urgent task first.";
  }

  if (lowerMessage.includes("dsa") || lowerMessage.includes("data structure")) {
    return "For DSA, I suggest starting with the topic you find hardest. Spend 45 minutes reviewing the concept, then solve 3 practice questions.";
  }

  if (lowerMessage.includes("application development") || lowerMessage.includes("ad project")) {
    return "For Application Development, focus on finishing the frontend pages first. After that, test navigation, buttons, forms, and page consistency.";
  }

  if (lowerMessage.includes("task") || lowerMessage.includes("first") || lowerMessage.includes("priority")) {
    return "Start with the task that has the closest deadline or highest marks. After that, move to revision or smaller tasks.";
  }

  if (lowerMessage.includes("revision") || lowerMessage.includes("revise")) {
    return "A good revision plan is: review notes for 30 minutes, practice questions for 45 minutes, then summarize the weak points in your own words.";
  }

  if (lowerMessage.includes("plan") || lowerMessage.includes("schedule")) {
    return "Here is a simple plan: finish urgent assignments first, take a short break, then revise one weak subject before the end of the day.";
  }

  if (lowerMessage.includes("deadline") || lowerMessage.includes("due")) {
    return "Check the nearest deadline first. If it is due soon, focus only on completing and testing that task before starting anything new.";
  }

  if (lowerMessage.includes("exam") || lowerMessage.includes("quiz")) {
    return "For exams or quizzes, focus on past questions, key definitions, and weak topics. Do short revision sessions instead of one long session.";
  }

  if (lowerMessage.includes("stress") || lowerMessage.includes("tired") || lowerMessage.includes("overwhelmed")) {
    return "Take a short break first. Then choose only one small task to complete. Finishing one task will help reduce the pressure.";
  }

  const defaultReplies = [
    "I understand. Can you tell me which subject or task you are working on?",
    "That sounds important. Do you want help with planning, revision, or task priority?",
    "Okay. I recommend checking your closest deadline first, then choosing the task with the highest priority.",
    "Can you give me the subject name? I can suggest a better study plan based on it.",
    "Let’s make it simple: choose one urgent task, work on it for 45 minutes, then take a short break."
  ];

  const randomIndex = Math.floor(Math.random() * defaultReplies.length);
  return defaultReplies[randomIndex];
}

  function sendMessage(message) {
    if (!message || message.trim() === "") {
      return;
    }

    addMessage(message, "user");

    if (chatInput) {
      chatInput.value = "";
    }

    setTimeout(function () {
      const reply = getFakeReply(message);
      addMessage(reply, "ai");
    }, 700);
  }

  if (chatForm) {
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

  function showToast() {
    if (!toastMessage) return;

    toastMessage.classList.add("show");

    setTimeout(function () {
      toastMessage.classList.remove("show");
    }, 1800);
  }

  toggleInputs.forEach(function (toggle) {
    toggle.addEventListener("change", function () {
      showToast();
    });
  });

  if (feedbackForm) {
    feedbackForm.addEventListener("submit", function (event) {
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

      feedbackSuccess.classList.add("show");
      feedbackForm.reset();

      setTimeout(function () {
        feedbackSuccess.classList.remove("show");
      }, 3000);
    });
  }
});