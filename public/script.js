// Load tasks when page opens
document.addEventListener('DOMContentLoaded', loadTasks);

async function loadTasks() {
  try {
    const res = await fetch('/tasks');
    const tasks = await res.json();

    const list = document.getElementById('taskList');
    list.innerHTML = '';

    tasks.forEach(task => {
      const li = document.createElement('li');
      if (task.done) li.classList.add('done');

      li.innerHTML = `
        <span>${task.title}</span>
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
  const title = input.value.trim();
  if (!title) return alert('Please enter a task!');

  try {
    await fetch('/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });
    input.value = '';
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
