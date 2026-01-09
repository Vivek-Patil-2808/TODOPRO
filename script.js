// ================================
// ELEMENTS
// ================================
const input = document.getElementById("todo-input");
const dueInput = document.getElementById("due-date");
const priorityInput = document.getElementById("priority");
const addBtn = document.getElementById("add-btn");
const clearBtn = document.getElementById("clear-completed");
const list = document.getElementById("todo-list");
const themeToggle = document.getElementById("theme-toggle");

const aboutBtn = document.getElementById("about-btn");
const contactBtn = document.getElementById("contact-btn");
const contactCtaBtn = document.getElementById("contact-cta-btn");

const aboutModal = document.getElementById("about-modal");
const contactModal = document.getElementById("contact-modal");

// ================================
// LOAD TODOS
// ================================
let todos = JSON.parse(localStorage.getItem("todos")) || [];

// ================================
// THEME
// ================================
if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light");
  themeToggle.innerHTML = `<i class="fas fa-sun"></i> Light Mode`;
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");

  if (document.body.classList.contains("light")) {
    localStorage.setItem("theme", "light");
    themeToggle.innerHTML = `<i class="fas fa-sun"></i> Light Mode`;
  } else {
    localStorage.setItem("theme", "dark");
    themeToggle.innerHTML = `<i class="fas fa-moon"></i> Dark Mode`;
  }
});

// ================================
// SAVE TODOS
// ================================
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// ================================
// RENDER TODOS
// ================================
function renderTodos() {
  list.innerHTML = "";

  todos.forEach((todo, index) => {
    const li = document.createElement("li");
    li.classList.add(todo.priority);

    li.innerHTML = `
      <input type="checkbox" ${todo.completed ? "checked" : ""}>
      <span>${todo.text}</span>
      <small>${todo.dueDate || ""}</small>
      <button><i class="fas fa-trash"></i></button>
    `;

    li.querySelector("input").addEventListener("change", () => {
      todo.completed = !todo.completed;
      saveTodos();
      renderTodos();
    });

    li.querySelector("button").addEventListener("click", () => {
      todos.splice(index, 1);
      saveTodos();
      renderTodos();
    });

    list.appendChild(li);
  });
}

// ================================
// ADD TODO
// ================================
addBtn.addEventListener("click", () => {
  if (!input.value.trim()) return;

  todos.push({
    text: input.value,
    dueDate: dueInput.value,
    priority: priorityInput.value,
    completed: false
  });

  input.value = "";
  dueInput.value = "";
  priorityInput.value = "medium";

  saveTodos();
  renderTodos();
});

input.addEventListener("keydown", e => {
  if (e.key === "Enter") addBtn.click();
});

// ================================
// CLEAR COMPLETED
// ================================
clearBtn.addEventListener("click", () => {
  todos = todos.filter(todo => !todo.completed);
  saveTodos();
  renderTodos();
});

// ================================
// MODALS
// ================================
aboutBtn.addEventListener("click", () => {
  aboutModal.classList.add("show");
});

contactBtn.addEventListener("click", () => {
  contactModal.classList.add("show");
});

contactCtaBtn.addEventListener("click", () => {
  contactModal.classList.add("show");
});

document.querySelectorAll(".close").forEach(btn => {
  btn.addEventListener("click", () => {
    document.getElementById(btn.dataset.close).classList.remove("show");
  });
});

document.querySelectorAll(".modal").forEach(modal => {
  modal.addEventListener("click", e => {
    if (e.target === modal) modal.classList.remove("show");
  });
});

// ================================
// CONTACT FORM (FORMSPREE)
// ================================
document.getElementById("contact-form").addEventListener("submit", async e => {
  e.preventDefault();

  const form = e.target;

  const response = await fetch(form.action, {
    method: "POST",
    body: new FormData(form),
    headers: { "Accept": "application/json" }
  });

  if (response.ok) {
    alert("Message sent successfully! 🎉");
    form.reset();
    contactModal.classList.remove("show");
  } else {
    alert("Something went wrong. Please try again.");
  }
});

// ================================
// INITIAL RENDER
// ================================
renderTodos();
