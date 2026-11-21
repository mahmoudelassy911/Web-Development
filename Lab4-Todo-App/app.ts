// ===== Types =====
type Filter = "all" | "active" | "completed";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

// ===== Class that holds the data (Classes + getters) =====
class TodoList {
  private todos: Todo[] = [];
  private nextId: number = 1;

  add(text: string): void {
    // spread: copy the old array and add the new todo at the end
    this.todos = [...this.todos, { id: this.nextId++, text, completed: false }];
  }

  toggle(id: number): void {
    // map: return a new array, changing only the todo with this id
    this.todos = this.todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
  }

  edit(id: number, text: string): void {
    this.todos = this.todos.map((todo) =>
      todo.id === id ? { ...todo, text } : todo
    );
  }

  remove(id: number): void {
    // filter: keep every todo except the one with this id
    this.todos = this.todos.filter((todo) => todo.id !== id);
  }

  clearCompleted(): void {
    this.todos = this.todos.filter((todo) => !todo.completed);
  }

  clearAll(): void {
    this.todos = [];
  }

  getFiltered(filter: Filter): Todo[] {
    if (filter === "active") return this.todos.filter((t) => !t.completed);
    if (filter === "completed") return this.todos.filter((t) => t.completed);
    return [...this.todos];
  }

  // getter: computed value, used like a property (list.itemsLeft)
  get itemsLeft(): number {
    return this.todos.filter((t) => !t.completed).length;
  }
}

// ===== DOM elements =====
// "as" tells TypeScript the exact element type
const form = document.getElementById("todo-form") as HTMLFormElement;
const input = document.getElementById("todo-input") as HTMLInputElement;
const listEl = document.getElementById("todo-list") as HTMLUListElement;
const itemsLeftEl = document.getElementById("items-left") as HTMLSpanElement;
const clearCompletedBtn = document.getElementById("clear-completed") as HTMLButtonElement;
const clearAllBtn = document.getElementById("clear-all") as HTMLButtonElement;
const filterButtons = document.querySelectorAll<HTMLButtonElement>(".filter");

// ===== App state =====
const todoList = new TodoList();
let currentFilter: Filter = "all";

// Starting todos (same as the lab screenshot)
todoList.add("See Lecture");
todoList.add("Solve assignment");

// ===== Rendering =====
function createTodoItem(todo: Todo): HTMLLIElement {
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

function startEditing(li: HTMLLIElement, span: HTMLSpanElement, id: number, oldText: string): void {
  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.className = "edit-input";
  editInput.value = oldText;

  li.replaceChild(editInput, span);
  editInput.focus();
  editInput.select();

  let finished = false;

  const save = (): void => {
    if (finished) return;
    finished = true;
    const newText = editInput.value.trim();
    if (newText === "") {
      todoList.remove(id); // empty text means delete the todo
    } else {
      todoList.edit(id, newText);
    }
    render();
  };

  const cancel = (): void => {
    if (finished) return;
    finished = true;
    render();
  };

  editInput.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Enter") save();
    if (e.key === "Escape") cancel();
  });
  editInput.addEventListener("blur", save);
}

function render(): void {
  listEl.innerHTML = "";

  const visible = todoList.getFiltered(currentFilter);

  if (visible.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = "Nothing here.";
    listEl.appendChild(empty);
  } else {
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
form.addEventListener("submit", (e: SubmitEvent) => {
  e.preventDefault();
  const text = input.value.trim();
  if (text === "") return;
  todoList.add(text);
  input.value = "";
  render();
});

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter as Filter;
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
