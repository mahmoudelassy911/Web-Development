"use strict";
// ===== Class that holds the data (Classes + getters) =====
class TodoList {
    constructor() {
        this.todos = [];
        this.nextId = 1;
    }
    add(text) {
        // spread: copy the old array and add the new todo at the end
        this.todos = [...this.todos, { id: this.nextId++, text, completed: false }];
    }
    toggle(id) {
        // map: return a new array, changing only the todo with this id
        this.todos = this.todos.map((todo) => todo.id === id ? { ...todo, completed: !todo.completed } : todo);
    }
    edit(id, text) {
        this.todos = this.todos.map((todo) => todo.id === id ? { ...todo, text } : todo);
    }
    remove(id) {
        // filter: keep every todo except the one with this id
        this.todos = this.todos.filter((todo) => todo.id !== id);
    }
    clearCompleted() {
        this.todos = this.todos.filter((todo) => !todo.completed);
    }
    clearAll() {
        this.todos = [];
    }
    getFiltered(filter) {
        if (filter === "active")
            return this.todos.filter((t) => !t.completed);
        if (filter === "completed")
            return this.todos.filter((t) => t.completed);
        return [...this.todos];
    }
    // getter: computed value, used like a property (list.itemsLeft)
    get itemsLeft() {
        return this.todos.filter((t) => !t.completed).length;
    }
}
// ===== DOM elements =====
// "as" tells TypeScript the exact element type
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const listEl = document.getElementById("todo-list");
const itemsLeftEl = document.getElementById("items-left");
const clearCompletedBtn = document.getElementById("clear-completed");
const clearAllBtn = document.getElementById("clear-all");
const filterButtons = document.querySelectorAll(".filter");
// ===== App state =====
const todoList = new TodoList();
let currentFilter = "all";
// Starting todos (same as the lab screenshot)
todoList.add("See Lecture");
todoList.add("Solve assignment");
// ===== Rendering =====
function createTodoItem(todo) {
    const { id, text, completed } = todo; // object destructuring
    const li = document.createElement("li");
    li.className = completed ? "todo-item done" : "todo-item";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = completed;
    checkbox.addEventListener("change", () => {
        todoList.toggle(id);
        render();
    });
    const span = document.createElement("span");
    span.className = "todo-text";
    span.textContent = text; // textContent is safe (no HTML injection)
    span.addEventListener("dblclick", () => startEditing(li, span, id, text));
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn-delete";
    deleteBtn.title = "Delete";
    deleteBtn.textContent = "🗑️";
    deleteBtn.addEventListener("click", () => {
        todoList.remove(id);
        render();
    });
    li.append(checkbox, span, deleteBtn);
    return li;
}
function startEditing(li, span, id, oldText) {
    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.className = "edit-input";
    editInput.value = oldText;
    li.replaceChild(editInput, span);
    editInput.focus();
    editInput.select();
    let finished = false;
    const save = () => {
        if (finished)
            return;
        finished = true;
        const newText = editInput.value.trim();
        if (newText === "") {
            todoList.remove(id); // empty text means delete the todo
        }
        else {
            todoList.edit(id, newText);
        }
        render();
    };
    const cancel = () => {
        if (finished)
            return;
        finished = true;
        render();
    };
    editInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter")
            save();
        if (e.key === "Escape")
            cancel();
    });
    editInput.addEventListener("blur", save);
}
function render() {
    listEl.innerHTML = "";
    const visible = todoList.getFiltered(currentFilter);
    if (visible.length === 0) {
        const empty = document.createElement("li");
        empty.className = "empty";
        empty.textContent = "Nothing here.";
        listEl.appendChild(empty);
    }
    else {
        // map each todo to an <li>, then add them all with spread
        listEl.append(...visible.map(createTodoItem));
    }
    const left = todoList.itemsLeft;
    itemsLeftEl.textContent = `${left} ${left === 1 ? "item" : "items"} left`;
    filterButtons.forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.filter === currentFilter);
    });
}
// ===== Events =====
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (text === "")
        return;
    todoList.add(text);
    input.value = "";
    render();
});
filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        currentFilter = btn.dataset.filter;
        render();
    });
});
clearCompletedBtn.addEventListener("click", () => {
    todoList.clearCompleted();
    render();
});
clearAllBtn.addEventListener("click", () => {
    todoList.clearAll();
    render();
});
render();
