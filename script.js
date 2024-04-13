setTimeout(function() {
  var loader = document.querySelector('.container');
  loader.classList.add('hidden');
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'index.html', true);
  xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
          document.open();
          document.write(xhr.responseText);
          document.close();
      }
  };
  xhr.send();
}, 10000);

document.addEventListener("DOMContentLoaded", function () {
  const calendarBody = document.getElementById("calendarBody");
  const monthAndYear = document.getElementById("monthAndYear");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  let currentDate = new Date();

  function renderCalendar() {
    calendarBody.innerHTML = "";

    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDay = firstDayOfMonth.getDay();

    monthAndYear.textContent = `${getMonthName(currentDate.getMonth())} ${currentDate.getFullYear()}`;

    let date = 1;

    for (let i = 0; i < 6; i++) {
      const row = document.createElement("tr");

      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < startingDay) {
          row.appendChild(document.createElement("td"));
        } else if (date > daysInMonth) {
          break;
        } else {
          const cell = document.createElement("td");
          cell.textContent = date;
          if (
            currentDate.getFullYear() === new Date().getFullYear() &&
            currentDate.getMonth() === new Date().getMonth() &&
            date === new Date().getDate()
          ) {
            cell.classList.add("today-date");
          }
          row.appendChild(cell);
          date++;
        }
      }

      calendarBody.appendChild(row);
    }
  }

  function getMonthName(monthIndex) {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
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
  const saveButton = document.querySelector(".save-button");
  const closeButton = document.querySelector(".close");
  const createTaskButton = document.getElementById("createTaskButton");
  const calendarSection = document.getElementById("calendarSection");
  const viewTasksSection = document.getElementById("viewTasksSection");
  const calendarButton = document.getElementById("calendarButton");
  const tasksButton = document.getElementById("tasksButton");

  saveButton.addEventListener("click", saveTask);
  closeButton.addEventListener("click", closeModal);
  createTaskButton.addEventListener("click", () => {
    document.getElementById("taskLightbox").style.display = "block";
  });

  calendarButton.addEventListener("click", () => {
    calendarSection.style.display = "block";
    viewTasksSection.style.display = "none";
  });

  tasksButton.addEventListener("click", () => {
    calendarSection.style.display = "none";
    viewTasksSection.style.display = "block";
  });

  calendarSection.style.display = "none";
  viewTasksSection.style.display = "block";

  loadTasks();
});

function closeModal() {
  document.getElementById("taskLightbox").style.display = "none";
}

function saveTask() {
  const taskName = document.getElementById("taskName").value.trim();
  const date = document.getElementById("date").value.trim();
  const startTime = document.getElementById("startTime").value.trim();
  const endTime = document.getElementById("endTime").value.trim();

  if (!taskName || !date || !startTime || !endTime) {
    alert("Please fill in all fields");
    return;
  }

  const taskToEdit = document.getElementById("taskToEdit").value;
  if (taskToEdit) {
    const editedTask = JSON.parse(taskToEdit);
    editedTask.name = taskName;
    editedTask.date = date;
    editedTask.startTime = startTime;
    editedTask.endTime = endTime;

    const taskElements = document.querySelectorAll(".task");
    taskElements.forEach((taskElement) => {
      const taskData = JSON.parse(taskElement.querySelector(".task-data").value);
      if (isEqual(taskData, editedTask)) {
        taskElement.querySelector(".task-name").textContent = taskName;
        taskElement.querySelector(".task-date").textContent = formatDate(date);
        taskElement.querySelector(".task-time").textContent = formatTime(date, startTime);
      }
    });

    saveTaskToStorage(editedTask);
  } else {
    const task = {
      name: taskName,
      date: date,
      startTime: startTime,
      endTime: endTime,
    };

    displayTask(task, "today");
    closeModal();
    alert("Task has been added");
    saveTaskToStorage(task);
  }

  document.getElementById("taskName").value = "";
  document.getElementById("date").value = "";
  document.getElementById("startTime").value = "";
  document.getElementById("endTime").value = "";
}

function saveTaskToStorage(task) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  tasks.forEach((task) => {
    task.status = task.status || "pending";
    const category = getCategory(task.date, task.status);
    displayTask(task, category);
  });
}

function displayTask(task, category) {
  const taskElement = document.createElement("div");
  const status = task.status ? task.status.toLowerCase() : "pending";
  const statusClass = status === "completed" ? "completed-task" : "pending-task";

  taskElement.innerHTML = `
        <div class="task ${statusClass} ${category}">
            <div class="task-action">${
    status === "completed"
      ? '<img src="../images/mark_5290058.png" alt="Done">'
      : ""
    }</div>
            <div class="task-name">${task.name}</div>
            <div class="task-status">${status}</div>
            <div class="task-date">${formatDate(task.date)}</div>
            <div class="task-time">${formatTime(task.date, task.startTime)}</div>
            <div class="task-actions">
            ${status !== "completed" ? '<button class="edit-button"><img src="../images/edit_5046292.png" alt="Edit"></button>' : ""}
            <button class="delete-button"><img src="../images/delete_6861362.png" alt="Delete"></button>
            ${
    status !== "completed"
      ? '<button class="done-button"><img src="../images/mark_5290058.png" alt="Done"></button>'
      : ""
    }
        </div>
        </div>
    `;

  const taskContainer =
    category === "today"
      ? document.getElementById("todayTasks")
      : category === "upcoming"
        ? document.getElementById("upcomingTasks")
        : document.getElementById("completedTasks");

  taskContainer.appendChild(taskElement);

  const editButton = taskElement.querySelector(".edit-button");
  const deleteButton = taskElement.querySelector(".delete-button");
  const doneButton = taskElement.querySelector(".done-button");
  editButton.addEventListener("click", () => {
    const taskName = task.name;
    const taskDate = task.date;
    const taskStartTime = task.startTime;
    const taskEndTime = task.endTime;

    document.getElementById("taskName").value = taskName;
    document.getElementById("date").value = taskDate;
    document.getElementById("startTime").value = taskStartTime;
    document.getElementById("endTime").value = taskEndTime;
    document.getElementById("taskLightbox").style.display = "block";
    document.getElementById("taskToEdit").value = JSON.stringify(task);
  });

  deleteButton.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete this task?")) {
      taskElement.remove();
      removeTaskFromStorage(task);
    }
  });

  doneButton && doneButton.addEventListener("click", () => {
    document.getElementById("completedTasks").appendChild(taskElement);
    taskElement.querySelector(".task-status").textContent = "completed";
    taskElement.querySelector(".task-action").innerHTML =
      '<img src="../images/mark_5290058.png" alt="Done">';
    doneButton.remove();
    editButton.remove();
    updateTaskStatus(task, "completed");
  });
}

function removeTaskFromStorage(taskToRemove) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const updatedTasks = tasks.filter((task) => !isEqual(task, taskToRemove));
  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
}

function isEqual(task1, task2) {
  return (
    task1.name === task2.name &&
    task1.date === task2.date &&
    task1.startTime === task2.startTime &&
    task1.endTime === task2.endTime
  );
}

function updateTaskStatus(taskToUpdate, newStatus) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const updatedTasks = tasks.map((task) => {
    if (isEqual(task, taskToUpdate)) {
      return { ...task, status: newStatus };
    } else {
      return task;
    }
  });
  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
}

function getCategory(date, status) {
  const today = new Date();
  const taskDate = new Date(date);

  if (status === "completed") {
    return "completed";
  } else if (
    taskDate.getFullYear() === today.getFullYear() &&
    taskDate.getMonth() === today.getMonth() &&
    taskDate.getDate() === today.getDate()
  ) {
    return "today";
  } else if (taskDate > today) {
    return "upcoming";
  } else {
    return "completed";
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(dateString, timeString) {
  const date = new Date(dateString + "T" + timeString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
  });
}


