const input = document.querySelector(".todo-input");
const searchInput = document.querySelector(".search-bar");
const addButton = document.querySelector(".add-button");
const todosHtml = document.querySelector(".todos");
const emptyImage = document.querySelector(".empty-image");
const deleteAllButton = document.querySelector(".delete-all");
const filters = document.querySelectorAll(".filter");

let todosJson = JSON.parse(localStorage.getItem("todos")) || [];
let filter = "";
let searchQuery = "";

// Show tasks on page
function showTodos() {
  const filteredTodos = todosJson.filter(todo => {
    const matchesFilter = !filter || todo.status === filter;
    const matchesSearch = !searchQuery || todo.name.toLowerCase().includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  todosHtml.innerHTML = filteredTodos.map((todo, index) => `
    <li class="todo">
      <label>
        <input type="checkbox" ${todo.status === "completed" ? "checked" : ""} onchange="toggleStatus(${index})">
        <span>${todo.name}</span>
      </label>
      <button onclick="editTask(${index})">✏️</button>
      <button onclick="removeTask(${index})">❌</button>
    </li>
  `).join("");

  emptyImage.style.display = todosJson.length ? "none" : "block";
  localStorage.setItem("todos", JSON.stringify(todosJson));
}

// Add new task
function addTodo() {
  const name = input.value.trim();
  if (!name) return;
  todosJson.unshift({ name, status: "pending" });
  input.value = "";
  showTodos();
}

// Toggle task status
function toggleStatus(index) {
  todosJson[index].status = todosJson[index].status === "completed" ? "pending" : "completed";
  showTodos();
}

// Edit task
function editTask(index) {
  const newName = prompt("Edit task:", todosJson[index].name);
  if (newName) {
    todosJson[index].name = newName.trim();
    showTodos();
  }
}

// Remove task
function removeTask(index) {
  todosJson.splice(index, 1);
  showTodos();
}

// Clear all tasks
deleteAllButton.onclick = () => {
  todosJson = [];
  showTodos();
};

// Filter tasks by status
filters.forEach(button => {
  button.onclick = () => {
    filters.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    filter = button.dataset.filter === "all" ? "" : button.dataset.filter;
    showTodos();
  };
});

// Search tasks
searchInput.oninput = () => {
  searchQuery = searchInput.value.toLowerCase();
  showTodos();
};

// Add task via button click or Enter key
addButton.onclick = addTodo;
input.onkeyup = e => e.key === "Enter" && addTodo();

// Initial render
showTodos();
