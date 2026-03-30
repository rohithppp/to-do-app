// Fetch and display all tasks when page loads
async function loadTasks() {
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
        <button class="done-btn" onclick="markDone('${task._id}')">✔</button>
        <button class="delete-btn" onclick="deleteTask('${task._id}')">🗑</button>
      </div>
    `;
    list.appendChild(li);
  });
}

// Add a new task
async function addTask() {
  const input = document.getElementById('taskInput');
  const title = input.value.trim();
  if (!title) return alert('Please enter a task!');

  await fetch('/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  });

  input.value = '';
  loadTasks();
}

// Mark task as done
async function markDone(id) {
  await fetch(`/tasks/${id}`, { method: 'PATCH' });
  loadTasks();
}

// Delete a task
async function deleteTask(id) {
  await fetch(`/tasks/${id}`, { method: 'DELETE' });
  loadTasks();
}

// Load tasks on page start
loadTasks();