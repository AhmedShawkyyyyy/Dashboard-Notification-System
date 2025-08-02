let notificationCount = 0;
let searchCount = 0;
let errorCount = 0;
let notificationHistory = JSON.parse(
  localStorage.getItem("notificationHistory") || "[]"
);

document.addEventListener("DOMContentLoaded", function () {
  loadNotificationHistory();
  updateStats();
  setupEventListeners();
});

// =======================================================
// 1. Notification Trigger
function triggerNotification() {
  const messages = [
    "UI components loaded successfully.",
    "React state updated.",
    "Element positioned correctly on screen.",
    "Assets loaded from CDN.",
    "Component re-rendered.",
    "Dark mode activated.",
    "User settings saved locally.",
    "Visibility toggled.",
    "Form input validated.",
    "Animation completed.",
    "New record inserted into the database.",
    "Background job finished running.",
    "Data synced with external system.",
    "User session started.",
    "Middleware passed request.",
    "Business logic executed.",
    "Package dependency updated.",
    "Data exported successfully.",
    "Calculation completed server-side.",
    "Configuration file reloaded.",
    "API request sent.",
    "API responded with status 200.",
    "API rate limit warning.",
    "API call failed (500 error).",
    "API returned empty response.",
    "Token refreshed successfully.",
    "Fetching data from endpoint...",
    "Retrying failed request...",
    "Endpoint updated.",
    "API response parsed.",
    "Server restarted.",
    "CPU usage normal.",
    "Temporary downtime detected.",
    "Server connected to network.",
    "Backup created successfully.",
    "High memory usage warning.",
    "Maintenance mode activated.",
    "Crash recovered automatically.",
    "Log file updated.",
    "Health check passed.",
  ];

  const randomMessage = messages[Math.floor(Math.random() * messages.length)];
  const currentTime = new Date().toLocaleString();

  const notificationEvent = new CustomEvent("newNotification", {
    detail: {
      message: randomMessage,
      time: currentTime,
      id: Date.now(),
    },
  });

  document.dispatchEvent(notificationEvent);
}

document.addEventListener("newNotification", function (event) {
  const { message, time, id } = event.detail;
  notificationCount++;
  notificationHistory.unshift({ message, time, id });
  if (notificationHistory.length > 50) {
    notificationHistory = notificationHistory.slice(0, 50);
  }
  localStorage.setItem(
    "notificationHistory",
    JSON.stringify(notificationHistory)
  );
  updateNotificationsList();
  updateStats();
});
function loadNotificationHistory() {
  notificationCount = notificationHistory.length;
  updateNotificationsList();
}
function updateStats() {
  document.getElementById("totalNotifications").textContent = notificationCount;
  document.getElementById("searchCount").textContent = searchCount;
  document.getElementById("errorCount").textContent = errorCount;
}
function setupEventListeners() {
  document
    .getElementById("searchInput")
    .addEventListener("input", function (e) {
      debouncedSearch(e.target.value);
    });
  window.addEventListener("scroll", throttledScrollLogger);
}
function updateNotificationsList() {
  const listContainer = document.getElementById("notificationsList");
  if (notificationHistory.length === 0) {
    listContainer.innerHTML = `
      <p style="
        color: var(--text-secondary);
        text-align: center;
        padding: 40px;
      ">
        No notifications yet. Click "Launch Notification" to get started!
      </p>
    `;
    return;
  }

  listContainer.innerHTML = notificationHistory
    .map(
      (notification) => ` <div class="notification-item">
        <div class="notification-header">
          <strong>${notification.message}</strong>
          <span class="notification-time">${notification.time}</span>
        </div>
      </div>
    `
    )
    .join("");
}
// =======================================================
// 2. Debounce Implementation
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

const debouncedSearch = debounce(function (query) {
  if (query.trim()) {
    searchCount++;
    updateStats();

    const searchStatus = document.getElementById("searchStatus");
    searchStatus.textContent = "🔍 Searching...";
    searchStatus.className = "search-status show searching";
    setTimeout(() => {
      console.log("🔍 API Call:", query);
      searchStatus.textContent = `✅ Found ${Math.floor(
        Math.random() * 100
      )} results for "${query}"`;
      searchStatus.className = "search-status show completed";

      setTimeout(() => {
        searchStatus.className = "search-status";
      }, 3000);
    }, 300);
  }
}, 500);

// =======================================================
// 3. Throttle Implementation
function throttle(func, wait) {
  let inThrottle;
  return function name(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, wait);
    }
  };
}

const throttledScrollLogger = throttle(function () {
  const scrollY = window.scrollY;
  const scrollDisplay = document.getElementById("scrollPosition");
  if (scrollDisplay) {
    scrollDisplay.textContent = `Y: ${Math.floor(scrollY)}px`;
  }
}, 1000);

// =======================================================
// 4. Async Error Handling
async function getData() {
  const shouldFails = Math.random() < 0.7;
  if (shouldFails) {
    throw new Error("Network request failed: Server unreachable");
  }
  return { data: "Success!" };
}
async function simulateAsyncError() {
  try {
    const res = await getData();
    console.log("Success:", res);
    logError("No error occurred - operation completed successfully", "success");
  } catch (error) {
    console.error("Async Error caught:", error.message);
    logError(`Async Error: ${error.message}`, "error");
  }
}

function simulateSyncError() {
  try {
    throw new Error("Synchronous operation failed: Invalid data format");
  } catch (error) {
    console.error("Sync Error caught:", error.message);
    logError(`Sync Error: ${error.message}`, "error");
  }
}
window.onerror = function (message, source, lineno, colno, error) {
  const errorMsg = `Global Error: ${message} at line ${lineno}`;
  console.error("🌐 Global error caught:", errorMsg);
  logError(`🌐 ${errorMsg}`, "error");
  return true;
};

window.addEventListener("unhandledrejection", function (e) {
  const errorMsg = `Unhandled Promise Rejection:${e.reason}`;
  console.error("Unhandled promise rejection:", errorMsg);
  logError(` ${errorMsg}`);
});

function logError(message, type = "error") {
  const errorLog = document.getElementById("errorLog");
  const timestamp = new Date().toLocaleTimeString();
  const logEntry = `[${timestamp}] ${message}<br>`;

  if (errorLog.innerHTML === "") {
    errorLog.innerHTML = logEntry;
  } else {
    errorLog.innerHTML = logEntry + errorLog.innerHTML;
  }
  if (type === "error") {
    errorCount++;
    updateStats();
  }
}

function clearErrorLog() {
  document.getElementById("errorLog").innerHTML = "";
  errorCount = 0;
  updateStats();
}

// =======================================================
// 4. Theme Toggle
function toggleTheme() {
  const body = document.body;
  const themeToggle = document.querySelector(".theme-toggle");
  const currentTheme = body.getAttribute("data-theme");

  if (currentTheme === "dark") {
    body.setAttribute("data-theme", "light");
    themeToggle.textContent = "🌙 Switch to Dark";
    localStorage.setItem("theme", "light");
  } else {
    body.setAttribute("data-theme", "dark");
    themeToggle.textContent = "☀️ Switch to Light";
    localStorage.setItem("theme", "dark");
  }
}
document.addEventListener("DOMContentLoaded", function () {
  const savedTheme = localStorage.getItem("theme") || "dark";
  document.body.setAttribute("data-theme", savedTheme);
  const themeToggle = document.querySelector(".theme-toggle");
  if (themeToggle) {
    themeToggle.textContent =
      savedTheme === "dark" ? "☀️ Switch to Light" : "🌙 Switch to Dark";
    themeToggle.addEventListener("click", toggleTheme);
  }
});
