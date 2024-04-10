document.addEventListener("DOMContentLoaded", function () {
  const calendarBody = document.getElementById("calendarBody");
  const monthAndYear = document.getElementById("monthAndYear");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  let currentDate = new Date();

  function renderCalendar() {
    calendarBody.innerHTML = "";

    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const lastDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDay = firstDayOfMonth.getDay();

    monthAndYear.innerHTML = `${getMonthName(
      currentDate.getMonth()
    )} ${currentDate.getFullYear()}`;

    let date = 1;

    for (let i = 0; i < 6; i++) {
      const row = document.createElement("tr");

      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < startingDay) {
          const cell = document.createElement("td");
          row.appendChild(cell);
        } else if (date > daysInMonth) {
          break;
        } else {
          const cell = document.createElement("td");
          cell.textContent = date;
          row.appendChild(cell);
          if (
            currentDate.getFullYear() === new Date().getFullYear() &&
            currentDate.getMonth() === new Date().getMonth() &&
            date === new Date().getDate()
          ) {
            cell.classList.add("today-date");
          }
          date++;
        }
      }

      calendarBody.appendChild(row);
    }
  }

  function getMonthName(monthIndex) {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[monthIndex];
  }

  prevBtn.addEventListener("click", function () {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  });

  nextBtn.addEventListener("click", function () {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  });

  renderCalendar();
});

document.addEventListener("DOMContentLoaded", function () {
  var saveButton = document.querySelector(".save-button");
  var closeButton = document.querySelector(".close");

  saveButton.addEventListener("click", saveTask);
  closeButton.addEventListener("click", closeModal);

  var createTaskButton = document.getElementById("createTaskButton");
  createTaskButton.addEventListener("click", function () {
    document.getElementById("taskLightbox").style.display = "block";
  });
});

function closeModal() {
  document.getElementById("taskLightbox").style.display = "none";
}

function saveTaskToStorage(task) {
  console.log("Task saved:", task);
}

document.addEventListener("DOMContentLoaded", function () {
  const calendarSection = document.getElementById("calendarSection");
  const viewTasksSection = document.getElementById("viewTasksSection");

  calendarSection.style.display = "none";
  viewTasksSection.style.display = "block";

  const calendarButton = document.getElementById("calendarButton");
  const tasksButton = document.getElementById("tasksButton");

  calendarButton.addEventListener("click", function () {
    calendarSection.style.display = "block";
    viewTasksSection.style.display = "none";
  });

  tasksButton.addEventListener("click", function () {
    calendarSection.style.display = "none";
    viewTasksSection.style.display = "block";
  });
});

function saveTask() {
  var taskName = document.getElementById("taskName").value;
  var date = document.getElementById("date").value;
  var startTime = document.getElementById("startTime").value;
  var endTime = document.getElementById("endTime").value;
  var task = {
    name: taskName,
    date: date,
    startTime: startTime,
    endTime: endTime,
  };

  displayTask(task);
  closeModal();
  alert("Task has been added");
  saveTaskToStorage(task);
}

function saveTaskToStorage(task) {
  console.log("Task saved:", task);
}

function displayTask(task) {
  var taskElement = document.createElement("div");
  var status = task.status ? task.status.toLowerCase() : "pending";
  var category = getCategory(task.date);
  var statusClass = status === "completed" ? "completed-task" : "pending-task";

  taskElement.innerHTML = `
        <div class="task ${statusClass} ${category}">
            <div class="task-action">${
              status === "completed" ? "Done" : ""
            }</div>
            <div class="task-name">${task.name}<div>
            <div class="task-status">${status}</div>
            <div class="task-date">${formatDate(task.date)}</div>
            <div class="task-time">${formatTime(
              task.date,
              task.startTime
            )}</div>
            <div class="task-actions">
            <button class="edit-button"><img src="../images/edit_5046292.png" alt="Edit"></button>
            <button class="delete-button"><img src="../images/delete_6861362.png" alt="Delete"></button>
            ${
              status !== "completed"
                ? '<button class="done-button"><img src="../images/mark_5290058.png" alt="Done"></button>'
                : ""
            }
        </div>
        </div>
    `;

  var taskContainer;
  if (category === "today") {
    taskContainer = document.getElementById("todayTasks");
  } else if (category === "upcoming") {
    taskContainer = document.getElementById("upcomingTasks");
  } else if (category === "completed") {
    taskContainer = document.getElementById("completedTasks");
  }

  taskContainer.appendChild(taskElement);

  const editButton = taskElement.querySelector(".edit-button");
  const deleteButton = taskElement.querySelector(".delete-button");
  const doneButton = taskElement.querySelector(".done-button");
  editButton.addEventListener("click", () => {
    const taskName = taskElement.querySelector(".task-name").textContent;
    const taskDate = taskElement.querySelector(".task-date").textContent;
    const taskStartTime = taskElement
      .querySelector(".task-time")
      .textContent.split(" ")[0];

    document.getElementById("taskName").value = taskName;
    document.getElementById("date").value = taskDate;
    document.getElementById("startTime").value = taskStartTime;
    document.getElementById("taskLightbox").style.display = "block";
  });

  deleteButton.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete this task?")) {
      taskElement.remove();
    }
  });

  doneButton.addEventListener("click", () => {
    document.getElementById("completedTasks").appendChild(taskElement);
    taskElement.querySelector(".task-status").textContent = "completed";
    taskElement.querySelector(".task-action").innerHTML =
      '<img src="../images/mark_5290058.png" alt="Done">';
    doneButton.remove();
    editButton.remove();
  });
}

function getCategory(date) {
  var today = new Date();
  var taskDate = new Date(date);
  if (taskDate.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0)) {
    return "today";
  } else if (taskDate > today) {
    return "upcoming";
  } else {
    return "completed";
  }
}

function formatDate(dateString) {
  var date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}


function formatTime(dateString, timeString) {
  var date = new Date(dateString + "T" + timeString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
  });
}
