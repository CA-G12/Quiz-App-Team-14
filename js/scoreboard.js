let users = JSON.parse(localStorage.getItem('users'));
let container = document.querySelector('.scores');
let main = document.querySelector('main');

console.log(main);

if (users) {
  users = users.sort((a, b) => b.score - a.score);
  users.forEach((e) => {
    let userDiv = document.createElement('div');
    container.appendChild(userDiv);

    let name = document.createElement('span');
    name.textContent = e.name;
    userDiv.appendChild(name);

    let score = document.createElement('span');
    score.textContent = e.score;
    userDiv.appendChild(score);
  });
} else {
  let message = document.createElement('p');
  message.textContent = 'No Players Yet';
  container.textContent = '';
  container.appendChild(message);
}
