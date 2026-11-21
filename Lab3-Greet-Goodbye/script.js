const title = document.getElementById('title');
const input = document.getElementById('name');
const list = document.getElementById('list');

function addName() {
  const name = input.value.trim();
  if (!name) return; 

  title.textContent = `Hello, ${name}!`;

  const li = document.createElement('li');
  li.textContent = name;
  list.appendChild(li);

  input.value = ''; 
  input.focus();
}

function removeName(e) {
  if (e.target.nodeName === 'LI') {
    title.textContent = `Goodbye, ${e.target.textContent}!`;
    e.target.remove();
  }
}

document.getElementById('greet').addEventListener('click', addName);
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addName();
});
list.addEventListener('click', removeName);
