function navigateTo(view) {
    const homeView = document.getElementById('home-view');
    const newRoutineView = document.getElementById('new-routine-view');

    if (view === 'new-routine') {
        homeView.classList.add('hidden');
        newRoutineView.classList.remove('hidden');
    } else if (view === 'home') {
        newRoutineView.classList.add('hidden');
        homeView.classList.remove('hidden');
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
        <input type="color" value="${task.color}" class="task-color-input" />
        <input type="text" value="${task.duration}" class="task-duration-input" placeholder="HH:MM:SS" />
        <button class="delete-task-btn">X</button>
    `;

    // Bind inputs to task properties
    taskRow.querySelector('.task-name-input').addEventListener('input', (e) => {
        task.name = e.target.value;
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


class Routine {
    constructor(name, emoji, tasks) {
      this.name = name;
      this.emoji = emoji;
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
  
