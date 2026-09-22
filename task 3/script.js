// ============================================
// FOCUSBOARD - TASK MANAGER
// ============================================


// ================================
// GET HTML ELEMENTS
// ================================

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");

const taskList = document.getElementById("taskList");

const taskCount = document.getElementById("taskCount");

const totalTasks = document.getElementById("totalTasks");
const activeTasks = document.getElementById("activeTasks");
const completedTasks = document.getElementById("completedTasks");

const progressPercent =
    document.getElementById("progressPercent");

const circle =
    document.querySelector(".circle");

const filters =
    document.querySelector(".filters");

const emptyState =
    document.getElementById("emptyState");


// ================================
// TASK DATA
// ================================

let tasks =
    JSON.parse(localStorage.getItem("focusTasks")) || [];

let currentFilter = "all";


// ================================
// SAVE TASKS
// ================================

function saveTasks() {

    localStorage.setItem(
        "focusTasks",
        JSON.stringify(tasks)
    );

}


// ================================
// ADD TASK
// ================================

function addTask() {

    const text =
        taskInput.value.trim();


    if (text === "") {

        alert("Please enter a task.");

        taskInput.focus();

        return;
    }


    const newTask = {

        id: Date.now(),

        text: text,

        completed: false

    };


    tasks.push(newTask);


    saveTasks();


    taskInput.value = "";


    taskInput.focus();


    displayTasks();

}


// ================================
// DISPLAY TASKS
// ================================

function displayTasks() {

    taskList.innerHTML = "";


    let filteredTasks = tasks;


    if (currentFilter === "active") {

        filteredTasks =
            tasks.filter(function(task) {

                return !task.completed;

            });

    }


    if (currentFilter === "completed") {

        filteredTasks =
            tasks.filter(function(task) {

                return task.completed;

            });

    }


    // Show empty state

    if (filteredTasks.length === 0) {

        emptyState.style.display = "block";

    } else {

        emptyState.style.display = "none";

    }


    // Create tasks

    filteredTasks.forEach(function(task) {

        const li =
            document.createElement("li");


        li.className = "task";


        if (task.completed) {

            li.classList.add("completed");

        }


        li.dataset.id = task.id;


        li.innerHTML = `

            <input
                type="checkbox"
                class="complete-btn"
                ${task.completed ? "checked" : ""}
            >

            <span class="task-text">
                ${escapeHTML(task.text)}
            </span>

            <button class="edit-btn">
                Edit
            </button>

            <button class="delete-btn">
                Delete
            </button>

        `;


        taskList.appendChild(li);

    });


    updateDashboard();

}


// ================================
// UPDATE DASHBOARD
// ================================

function updateDashboard() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(function(task) {

            return task.completed;

        }).length;


    const active =
        tasks.filter(function(task) {

            return !task.completed;

        }).length;


    // Statistics

    totalTasks.textContent = total;

    activeTasks.textContent = active;

    completedTasks.textContent = completed;


    // Progress

    let percentage = 0;


    if (total > 0) {

        percentage =
            Math.round(
                (completed / total) * 100
            );

    }


    progressPercent.textContent =
        percentage + "%";


    // Circular progress

    const degrees =
        percentage * 3.6;


    circle.style.background = `
        conic-gradient(
            #8b5cf6 ${degrees}deg,
            #29243d ${degrees}deg
        )
    `;


    // Task count

    if (active === 0 && total > 0) {

        taskCount.textContent =
            "All tasks completed ✦ Great work!";

    } else {

        taskCount.textContent =
            active +
            " active task" +
            (active !== 1 ? "s" : "");

    }

}


// ================================
// DELETE TASK
// ================================

function deleteTask(id) {

    tasks =
        tasks.filter(function(task) {

            return task.id !== id;

        });


    saveTasks();

    displayTasks();

}


// ================================
// EDIT TASK
// ================================

function editTask(id) {

    const task =
        tasks.find(function(task) {

            return task.id === id;

        });


    if (!task) {

        return;

    }


    const newText =
        prompt(
            "Edit your task:",
            task.text
        );


    if (
        newText !== null &&
        newText.trim() !== ""
    ) {

        task.text =
            newText.trim();


        saveTasks();

        displayTasks();

    }

}


// ================================
// COMPLETE TASK
// ================================

function toggleTask(id, completed) {

    const task =
        tasks.find(function(task) {

            return task.id === id;

        });


    if (!task) {

        return;

    }


    task.completed =
        completed;


    saveTasks();

    displayTasks();

}


// ================================
// TASK BUTTON EVENTS
// ================================

taskList.addEventListener(
    "click",
    function(event) {

        const taskElement =
            event.target.closest(".task");


        if (!taskElement) {

            return;

        }


        const id =
            Number(taskElement.dataset.id);


        // Delete

        if (
            event.target.classList.contains(
                "delete-btn"
            )
        ) {

            deleteTask(id);

        }


        // Edit

        if (
            event.target.classList.contains(
                "edit-btn"
            )
        ) {

            editTask(id);

        }

    }
);


// ================================
// CHECKBOX EVENT
// ================================

taskList.addEventListener(
    "change",
    function(event) {

        if (
            !event.target.classList.contains(
                "complete-btn"
            )
        ) {

            return;

        }


        const taskElement =
            event.target.closest(".task");


        const id =
            Number(taskElement.dataset.id);


        toggleTask(
            id,
            event.target.checked
        );

    }
);


// ================================
// FILTER BUTTONS
// ================================

filters.addEventListener(
    "click",
    function(event) {

        if (
            !event.target.classList.contains(
                "filter"
            )
        ) {

            return;

        }


        document
            .querySelectorAll(".filter")
            .forEach(function(button) {

                button.classList.remove(
                    "active"
                );

            });


        event.target.classList.add(
            "active"
        );


        currentFilter =
            event.target.dataset.filter;


        displayTasks();

    }
);


// ================================
// ADD BUTTON
// ================================

addBtn.addEventListener(
    "click",
    addTask
);


// ================================
// ENTER KEY
// ================================

taskInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            addTask();

        }

    }
);


// ================================
// TODAY'S DATE
// ================================

function showDate() {

    const today =
        new Date();


    const date =
        today.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );


    document.getElementById(
        "today"
    ).textContent = date;

}


// ================================
// SECURITY
// ================================

function escapeHTML(text) {

    const div =
        document.createElement("div");


    div.textContent = text;


    return div.innerHTML;

}


// ================================
// START APPLICATION
// ================================

showDate();

displayTasks();