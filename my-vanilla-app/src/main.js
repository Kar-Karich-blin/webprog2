import './style.css';

const API_URL = 'https://jsonplaceholder.typicode.com/users';

const app = document.querySelector('#app');

app.innerHTML = `
  <div class="container">
    <header>
      <h1>User Explorer</h1>
      <p>Каталог пользователей</p>
    </header>

    <div class="controls">
      <input
        type="text"
        id="search"
        placeholder="Поиск по имени..."
      />

      <select id="cityFilter">
        <option value="">Все города</option>
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
const cityFilter = document.querySelector('#cityFilter');
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

    users = await response.json();

    status.textContent = '';

    fillCities();
    renderUsers();

  } catch (error) {
    status.textContent =
      'Не удалось загрузить пользователей. Попробуйте ещё раз.';

    usersContainer.innerHTML = `
      <button id="retry">Повторить попытку</button>
    `;

    document.querySelector('#retry')
      .addEventListener('click', loadUsers);
  }
}

function fillCities() {
  const cities = [...new Set(
    users.map(user => user.address.city)
  )];

  cityFilter.innerHTML = `
    <option value="">Все города</option>
    ${cities.map(city =>
      `<option value="${city}">${city}</option>`
    ).join('')}
  `;
}

function renderUsers() {
  const searchValue = searchInput.value.toLowerCase();
  const selectedCity = cityFilter.value;

  const filteredUsers = users.filter(user => {
    const matchesName = user.name
      .toLowerCase()
      .includes(searchValue);

    const matchesCity = selectedCity === '' ||
      user.address.city === selectedCity;

    return matchesName && matchesCity;
  });

  if (filteredUsers.length === 0) {
    usersContainer.innerHTML = '<p>Ничего не найдено</p>';
    return;
  }

  usersContainer.innerHTML = filteredUsers.map(user => `
    <article class="user-card">
      <h2>${user.name}</h2>
      <p>✉️ ${user.email}</p>
      <p>📍 ${user.address.city}</p>
      <p>🏢 ${user.company.name}</p>
    </article>
  `).join('');
}

searchInput.addEventListener('input', renderUsers);
cityFilter.addEventListener('change', renderUsers);
refreshButton.addEventListener('click', loadUsers);

loadUsers();
