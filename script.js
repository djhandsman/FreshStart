const routines = [];


function navigateTo(view) {
    const homeView = document.getElementById('home-view');
    const newRoutineView = document.getElementById('new-routine-view');
    const playingView = document.getElementById('playing-view');

    homeView.classList.add('hidden');
    newRoutineView.classList.add('hidden');
    playingView.classList.add('hidden');

    if (view === 'new-routine') {
        newRoutineView.classList.remove('hidden');
    } else if (view === 'home') {
        homeView.classList.remove('hidden');
    } else if (view === 'playing') {
        playingView.classList.remove('hidden');
    }
}


document.getElementById('add-task-btn').addEventListener('click', () => {
    const tasksContainer = document.getElementById('tasks-container');

    // Create a new task object
    const task = new Task(`Task ${tasksContainer.children.length + 1}`, '😊', '#e0e0e0', '00:00:00');

    // Create a row for the task
    const taskRow = document.createElement('div');
    taskRow.classList.add('task-row');
    taskRow.innerHTML = `
        <input type="text" value="${task.name}" class="task-name-input" />
        <select class="task-emoji-input">
            <option value="😊" ${task.emoji === '😊' ? 'selected' : ''}>😊 Happy</option>
            <option value="💪" ${task.emoji === '💪' ? 'selected' : ''}>💪 Strength</option>
            <option value="🧘" ${task.emoji === '🧘' ? 'selected' : ''}>🧘 Relax</option>
            <option value="🎶" ${task.emoji === '🎶' ? 'selected' : ''}>🎶 Music</option>
            <option value="🍎" ${task.emoji === '🍎' ? 'selected' : ''}>🍎 Health</option>
            <option value="🚴" ${task.emoji === '🚴' ? 'selected' : ''}>🚴 Exercise</option>
            <option value="☕" ${task.emoji === '☕' ? 'selected' : ''}>☕ Coffee</option>
        </select>
        <input type="color" value="${task.color}" class="task-color-input" />
        <input type="text" value="${task.duration}" class="task-duration-input" placeholder="HH:MM:SS" />
        <button class="delete-task-btn">X</button>
    `;

    // Bind inputs to task properties
    taskRow.querySelector('.task-name-input').addEventListener('input', (e) => {
        task.name = e.target.value;
    });

    taskRow.querySelector('.task-emoji-input').addEventListener('change', (e) => {
        task.emoji = e.target.value;
    });

    taskRow.querySelector('.task-color-input').addEventListener('input', (e) => {
        task.color = e.target.value;
    });

    taskRow.querySelector('.task-duration-input').addEventListener('input', (e) => {
        task.duration = e.target.value;
    });

    // Handle task deletion
    taskRow.querySelector('.delete-task-btn').addEventListener('click', () => {
        tasksContainer.removeChild(taskRow);
        // Optionally handle removal from an array of tasks
    });

    tasksContainer.appendChild(taskRow);
});

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
        const name = row.querySelector('.task-name-input').value.trim();
        const emoji = row.querySelector('.task-emoji-input').value;
        const color = row.querySelector('.task-color-input').value;
        const duration = row.querySelector('.task-duration-input').value.trim();

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

function playRoutine(routineName) {
    const playingMessage = document.getElementById('playing-message');
    playingMessage.textContent = `Playing "${routineName}"`;
    navigateTo('playing');
}






class Routine {
    constructor(name, tasks) {
      this.name = name;
      this.tasks = tasks;
    }
}

class Task {
    constructor(name, emoji, color, duration,) {
      this.name = name; // Name of the task
      this.emoji = emoji; // Emoji representing the task
      this.color = color; // Color of the task
      this.duration = duration; // Duration in seconds
    }
  }
  
