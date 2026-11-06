import './style.css';

const API_URL = 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://ghibliapi.vercel.app/people');

const app = document.querySelector('#app');

app.innerHTML = `
  <div class="container">
    <header>
      <h1>Ghibli Characters</h1>
      <p>Каталог персонажей студии Ghibli</p>
    </header>

    <div class="controls">
      <input
        type="text"
        id="search"
        placeholder="Поиск по имени..."
      />

      <select id="genderFilter"> 
        <option value="">Все персонажи</option>
      </select>

      <button id="refresh">Обновить</button>
    </div>

    <p id="status">Загрузка...</p>

    <div id="users" class="users"></div>
  </div>
`;

const usersContainer = document.querySelector('#users');
const status = document.querySelector('#status');
const searchInput = document.querySelector('#search');

const genderFilter = document.querySelector('#genderFilter'); 
const refreshButton = document.querySelector('#refresh');

let users = [];

async function loadUsers() {
  status.textContent = 'Загрузка...';
  usersContainer.innerHTML = '';

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error('Ошибка загрузки данных');
    }

    const data = await response.json();
    users = data.slice(0, 30); 

    status.textContent = '';

    fillGenders(); 
    renderUsers();

  } catch (error) {
    status.textContent =
      'Не удалось загрузить персонажей. Попробуйте ещё раз.';

    usersContainer.innerHTML = `
      <button id="retry">Повторить попытку</button>
    `;

    document.querySelector('#retry')
      .addEventListener('click', loadUsers);
  }
}

function fillGenders() {
  const genders = [...new Set(
    users.map(user => user.gender)
  )].filter(Boolean); 
  genderFilter.innerHTML = `
    <option value="">Все персонажи</option>
    ${genders.map(gender =>
      `<option value="${gender}">${gender}</option>`
    ).join('')}
  `;
}

function renderUsers() {
  const searchValue = searchInput.value.toLowerCase();
  const selectedGender = genderFilter.value;

  const filteredUsers = users.filter(user => {
    const matchesName = user.name
      .toLowerCase()
      .includes(searchValue);

    const matchesGender = selectedGender === '' ||
      user.gender === selectedGender;

    return matchesName && matchesGender;
  });

  if (filteredUsers.length === 0) {
    usersContainer.innerHTML = '<p>Ничего не найдено</p>';
    return;
  }

  usersContainer.innerHTML = filteredUsers.map(user => `
    <article class="user-card">
      <h2>${user.name}</h2>
      <p> Пол: ${user.gender}</p>
      <p> Возраст: ${user.age}</p>
      <p>👀 Глаза: ${user.eye_color}</p>
      <p> Волосы: ${user.hair_color}</p>
    </article>
  `).join('');
}

searchInput.addEventListener('input', renderUsers);
genderFilter.addEventListener('change', renderUsers); 
refreshButton.addEventListener('click', loadUsers);

loadUsers();
