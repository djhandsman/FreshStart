// Array to store routines
const routines = [];

// Navigation function
function navigateTo(view) {
    const homeView = document.getElementById('home-view');
    const newRoutineView = document.getElementById('new-routine-view');
    const playingView = document.getElementById('playing-view');

    // Hide all views first
    homeView.classList.add('hidden');
    newRoutineView.classList.add('hidden');
    playingView.classList.add('hidden');

    // Show the selected view
    if (view === 'new-routine') {
        newRoutineView.classList.remove('hidden');
    } else if (view === 'home') {
        homeView.classList.remove('hidden');
    } else if (view === 'playing') {
        playingView.classList.remove('hidden');
    }
}

// References to the task sheet
const taskSheet = document.getElementById('task-sheet');

// Show the task sheet when the Add Task button is clicked
document.getElementById('add-task-btn').addEventListener('click', () => {
    console.log('Add Task button clicked'); // Log to confirm event is triggered
    taskSheet.classList.remove('hidden');
    taskSheet.classList.add('show');
});

// Hide the task sheet and reset fields
function hideTaskSheet() {
    taskSheet.classList.remove('show');
    taskSheet.classList.add('hidden');
}

// Routine name input field interactions
const routineNameInput = document.getElementById('routine-name');

routineNameInput.addEventListener('focus', () => {
    if (routineNameInput.value === '') {
        routineNameInput.placeholder = '';
    }
});

routineNameInput.addEventListener('blur', () => {
    if (routineNameInput.value === '') {
        routineNameInput.placeholder = 'Routine name';
    }
});

// Routine and Task classes
class Routine {
    constructor(name, tasks) {
        this.name = name;
        this.tasks = tasks;
    }
}

class Task {
    constructor(name, emoji, color, duration) {
        this.name = name; // Name of the task
        this.emoji = emoji; // Emoji representing the task
        this.color = color; // Color of the task
        this.duration = duration; // Duration in seconds
    }
}

// Adding functionality for "Add" button in task sheet
document.getElementById('add-task-to-list').addEventListener('click', () => {
    // Get user input from the task sheet
    const taskName = document.getElementById('task-name').value.trim();
    const emoji = document.getElementById('emoji-selector').value;
    const color = document.getElementById('color-selector').value;
    const duration = document.getElementById('duration-selector').value.trim();

    // Validate inputs
    if (!taskName || !duration) {
        alert('Please provide a task name and duration.');
        return;
    }

    // Create a new Task object
    const newTask = new Task(taskName, emoji, color, duration);

    // Add a visual representation of the task to the task container
    const tasksContainer = document.getElementById('tasks-container');
    const taskRow = document.createElement('div');
    taskRow.classList.add('task-row');

    taskRow.innerHTML = `
        <div>
            <span style="font-size: 24px; margin-right: 10px;">${newTask.emoji}</span>
            <span>${newTask.name}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 20px; height: 20px; border-radius: 50%; background-color: ${newTask.color};"></div>
            <span>${formatDuration(newTask.duration)}</span>
            <button class="delete-task-btn">X</button>
        </div>
    `;

    // Add delete functionality to the task row
    taskRow.querySelector('.delete-task-btn').addEventListener('click', () => {
        taskRow.remove();
    });

    // Append the task row to the tasks container
    tasksContainer.appendChild(taskRow);

    // Clear task sheet fields
    document.getElementById('task-name').value = '';
    document.getElementById('color-selector').value = '#e0e0e0';
    document.getElementById('duration-selector').value = '';

    // Hide the task sheet
    hideTaskSheet();
});

// Function to format duration as "Xh Ym"
function formatDuration(duration) {
    const [hours, minutes, seconds] = duration.split(':').map(Number);
    let formattedDuration = '';
    if (hours > 0) formattedDuration += `${hours}h `;
    if (minutes > 0) formattedDuration += `${minutes}m`;
    return formattedDuration.trim();
}

// Functionality for creating a new routine remains untouched
document.getElementById('create-routine-btn').addEventListener('click', () => {
    const routineName = document.getElementById('routine-name').value.trim();
    const tasksContainer = document.getElementById('tasks-container');
    const taskRows = tasksContainer.querySelectorAll('.task-row');

    if (!routineName) {
        alert('Please enter a routine name.');
        return;
    }

    const tasks = [];
    taskRows.forEach((row) => {
        const name = row.querySelector('.task-name-input')?.value.trim();
        const emoji = row.querySelector('.task-emoji-input')?.value;
        const color = row.querySelector('.task-color-input')?.value;
        const duration = row.querySelector('.task-duration-input')?.value.trim();

        if (name && duration) {
            tasks.push(new Task(name, emoji, color, duration));
        }
    });

    if (tasks.length === 0) {
        alert('Please add at least one task to the routine.');
        return;
    }

    const newRoutine = new Routine(routineName, tasks);
    routines.push(newRoutine);

    // Display the routine on the home screen
    const routinesContainer = document.getElementById('routines-container');
    const routineButton = document.createElement('button');
    routineButton.classList.add('btn', 'routine-btn');
    routineButton.textContent = newRoutine.name;
    routineButton.addEventListener('click', () => {
        playRoutine(newRoutine.name);
    });
    routinesContainer.appendChild(routineButton);

    console.log('Routine Created:', newRoutine);
    alert(`Routine "${newRoutine.name}" created with ${newRoutine.tasks.length} tasks!`);

    // Clear the form
    document.getElementById('routine-name').value = '';
    tasksContainer.innerHTML = '';
    navigateTo('home');
});

// Function to play a routine
function playRoutine(routineName) {
    const routine = routines.find(r => r.name === routineName);
    if (!routine) {
        console.error(`Routine "${routineName}" not found.`);
        return;
    }

    const playingView = document.getElementById('playing-view');
    const playingMessage = document.getElementById('playing-message');

    // Ensure the screen is cleared before starting
    playingMessage.innerHTML = '';
    navigateTo('playing');

    let currentTaskIndex = 0;
    let countdownInterval;

    function visualizeTask(task, durationInMilliseconds) {
        // Change the background color
        playingView.style.backgroundColor = task.color;

        // Parse duration into seconds
        const totalSeconds = Math.floor(durationInMilliseconds / 1000);
        let remainingSeconds = totalSeconds;

        // Display the task emoji, name, and initial countdown
        playingMessage.innerHTML = `
            <div style="font-size: 100px; margin-bottom: 20px;">${task.emoji}</div>
            <div style="font-size: 24px; margin-bottom: 10px;">${task.name}</div>
            <div id="countdown" style="font-size: 32px;">${formatTime(remainingSeconds)}</div>
        `;

        // Update the countdown every second
        countdownInterval = setInterval(() => {
            remainingSeconds--;
            document.getElementById('countdown').textContent = formatTime(remainingSeconds);

            if (remainingSeconds <= 0) {
                clearInterval(countdownInterval);
            }
        }, 1000);
    }

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    }

    function playNextTask() {
        if (currentTaskIndex < routine.tasks.length) {
            const task = routine.tasks[currentTaskIndex];
            const [hours, minutes, seconds] = task.duration.split(':').map(Number);
            const durationInMilliseconds = (hours * 3600 + minutes * 60 + seconds) * 1000;

            visualizeTask(task, durationInMilliseconds);

            setTimeout(() => {
                clearInterval(countdownInterval); // Ensure countdown stops before the next task
                currentTaskIndex++;
                playNextTask();
            }, durationInMilliseconds);
        } else {
            // All tasks are complete, return to the home screen
            clearInterval(countdownInterval); // Ensure no leftover intervals
            navigateTo('home');
        }
    }

    playNextTask(); // Start playing the first task
}
