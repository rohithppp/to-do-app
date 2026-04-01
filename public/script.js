// Wait for page to fully load before running anything
document.addEventListener('DOMContentLoaded', () => {

  // Get username from localStorage
  const username = localStorage.getItem('username');
  if (!username) {
    window.location.href = '/';
    return;
  }

  // Show greeting
  document.getElementById('greeting').textContent = `Hi ${username} 👋`;

  // Load tasks
  loadTasks();

  // Allow Enter key to add task
  document.getElementById('taskInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
  });

});

// Change name button
function changeName() {
  localStorage.removeItem('username');
  window.location.href = '/';
}

async function loadTasks() {
  try {
    const res = await fetch('/tasks');
    const tasks = await res.json();

    const list = document.getElementById('taskList');
    list.innerHTML = '';

    if (tasks.length === 0) {
      list.innerHTML = '<p class="empty">No tasks yet! Add one above ✨</p>';
      return;
    }

    tasks.forEach(task => {
      const li = document.createElement('li');
      if (task.done) li.classList.add('done');

      const today = new Date().toISOString().split('T')[0];
      const isOverdue = task.due_date && task.due_date < today && !task.done;

      li.innerHTML = `
        <div class="task-info">
          <span class="task-title">${task.title}</span>
          ${task.due_date ? `
            <span class="task-due ${isOverdue ? 'overdue' : ''}">
              📅 ${isOverdue ? '⚠️ Overdue · ' : ''}${task.due_date}
            </span>` : ''}
        </div>
        <div class="actions">
          <button class="done-btn" onclick="markDone(${task.id})">✔</button>
          <button class="delete-btn" onclick="deleteTask(${task.id})">🗑</button>
        </div>
      `;
      list.appendChild(li);
    });
  } catch (err) {
    console.error('Error loading tasks:', err);
  }
}

async function addTask() {
  const input = document.getElementById('taskInput');
  const dateInput = document.getElementById('dueDateInput');
  const title = input.value.trim();
  if (!title) return alert('Please enter a task!');

  try {
    await fetch('/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        due_date: dateInput.value || null
      })
    });
    input.value = '';
    dateInput.value = '';
    loadTasks();
  } catch (err) {
    console.error('Error adding task:', err);
  }
}

async function markDone(id) {
  try {
    await fetch(`/tasks/${id}`, { method: 'PATCH' });
    loadTasks();
  } catch (err) {
    console.error('Error marking done:', err);
  }
}

async function deleteTask(id) {
  try {
    await fetch(`/tasks/${id}`, { method: 'DELETE' });
    loadTasks();
  } catch (err) {
    console.error('Error deleting task:', err);
  }
}