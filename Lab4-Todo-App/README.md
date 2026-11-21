# CSE343 Lab 4 – Todo App (TypeScript)

## How to run
1. Install Node.js (if you don't have it).
2. In this folder, run:
   npm install        (installs TypeScript)
   npx tsc            (compiles app.ts -> app.js)
3. Open index.html in the browser (or use VS Code "Live Server").

## Features
- Add a todo (Add button or Enter)
- Tick a todo to mark it completed
- Double-click a todo to edit it, Enter to save, Escape to cancel
- Delete a todo with the bin icon
- Filters: All / Active / Completed
- "items left" counter
- Clear completed / Clear all

## Lab concepts used (app.ts)
- TypeScript types: interface Todo, type Filter, type annotations
- Class TodoList with a getter (itemsLeft)
- Array methods: map, filter, spread (...)
- Object destructuring: const { id, text, completed } = todo
- Template literals and arrow functions
