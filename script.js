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

    if (view !== 'playing') {
        clearInterval(countdownInterval); // Stop countdowns on exit
    }
}

// References to the task sheet
const taskSheet = document.getElementById('task-sheet');
let currentRoutineTasks = []; // Array to store tasks for the current routine
let countdownInterval; // Store the interval globally for clearing

// Show the task sheet when the Add Task button is clicked
document.getElementById('add-task-btn').addEventListener('click', () => {
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
    constructor(name, emoji, color, minutes, seconds) {
        this.name = name;
        this.emoji = emoji;
        this.color = color;
        this.minutes = minutes;
        this.seconds = seconds;
    }
}

// Adding functionality for "Add" button in task sheet
document.getElementById('add-task-to-list').addEventListener('click', () => {
    const taskName = document.getElementById('task-name').value.trim();
    const emoji = document.getElementById('emoji-selector').value;
    const color = document.getElementById('color-selector').value;
    const minutes = parseInt(document.getElementById('minutes-selector').value.trim(), 10) || 0;
    const seconds = parseInt(document.getElementById('seconds-selector').value.trim(), 10) || 0;

    if (!taskName || (minutes === 0 && seconds === 0) || isNaN(minutes) || isNaN(seconds)) {
        alert('Please provide a task name and a valid duration.');
        return;
    }

    const newTask = new Task(taskName, emoji, color, minutes, seconds);
    currentRoutineTasks.push(newTask);

    const tasksContainer = document.getElementById('tasks-container');
    const taskRow = document.createElement('div');
    taskRow.classList.add('task-row');

    taskRow.innerHTML = `
    <div class="task-name">${newTask.name}</div>
    <div style="display: flex; align-items: center; gap: 10px;">
        <span style="font-size: 24px;">${newTask.emoji}</span>
        <div style="width: 20px; height: 20px; border-radius: 50%; background-color: ${newTask.color};"></div>
        <span class="task-duration">${newTask.minutes}m ${newTask.seconds}s</span>
        <button class="delete-task-btn">X</button>
    </div>
`;


    taskRow.querySelector('.delete-task-btn').addEventListener('click', () => {
        currentRoutineTasks = currentRoutineTasks.filter(task => task !== newTask);
        taskRow.remove();
    });

    tasksContainer.appendChild(taskRow);

    document.getElementById('task-name').value = '';
    document.getElementById('minutes-selector').value = '';
    document.getElementById('seconds-selector').value = '';
    document.getElementById('color-selector').value = '#e0e0e0';

    hideTaskSheet();
});

// Format duration as "Xm Ys"
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
}

document.getElementById('create-routine-btn').addEventListener('click', () => {
    const routineName = document.getElementById('routine-name').value.trim();

    if (!routineName) {
        alert('Please enter a routine name.');
        return;
    }

    if (currentRoutineTasks.length === 0) {
        alert('Please add at least one task to the routine.');
        return;
    }

    const newRoutine = new Routine(routineName, currentRoutineTasks);
    routines.push(newRoutine);

    const routinesContainer = document.getElementById('routines-container');
    const routineButton = document.createElement('button');
    routineButton.classList.add('btn', 'routine-btn');
    routineButton.textContent = newRoutine.name;
    routineButton.addEventListener('click', () => {
        playRoutine(newRoutine.name);
    });
    routinesContainer.appendChild(routineButton);

    alert(`Routine "${newRoutine.name}" created with ${newRoutine.tasks.length} tasks!`);
    document.getElementById('routine-name').value = '';
    document.getElementById('tasks-container').innerHTML = '';
    currentRoutineTasks = [];
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

    playingMessage.innerHTML = '';
    navigateTo('playing');

    let currentTaskIndex = 0;

    function visualizeTask(task, durationInMilliseconds) {
        playingView.style.backgroundColor = task.color || 'var(--bg)';
        const totalSeconds = Math.floor(durationInMilliseconds / 1000);
        let remainingSeconds = totalSeconds;

        playingMessage.innerHTML = `
            <div style="font-size: 100px; margin-bottom: 20px;">${task.emoji}</div>
            <div style="font-size: 24px; margin-bottom: 10px;">${task.name}</div>
            <div id="countdown" style="font-size: 32px;">${formatTime(remainingSeconds)}</div>
        `;

        clearInterval(countdownInterval);
        countdownInterval = setInterval(() => {
            remainingSeconds--;
            document.getElementById('countdown').textContent = formatTime(remainingSeconds);

            if (remainingSeconds <= 0) {
                clearInterval(countdownInterval);
            }
        }, 1000);
    }

    function playNextTask() {
        if (currentTaskIndex < routine.tasks.length) {
            const task = routine.tasks[currentTaskIndex];
            const durationInMilliseconds = (task.minutes * 60 + task.seconds) * 1000;

            visualizeTask(task, durationInMilliseconds);

            setTimeout(() => {
                clearInterval(countdownInterval);
                currentTaskIndex++;
                playNextTask();
            }, durationInMilliseconds);
        } else {
            clearInterval(countdownInterval);
            playingView.style.backgroundColor = 'var(--bg)';
            navigateTo('home');
        }
    }

    playNextTask();
}
