(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`https://corsproxy.io/?https://ghibliapi.vercel.app/people`,t=document.querySelector(`#app`);t.innerHTML=`
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
`;var n=document.querySelector(`#users`),r=document.querySelector(`#status`),i=document.querySelector(`#search`),a=document.querySelector(`#genderFilter`),o=document.querySelector(`#refresh`),s=[];async function c(){r.textContent=`Загрузка...`,n.innerHTML=``;try{let t=await fetch(e);if(!t.ok)throw Error(`Ошибка загрузки данных`);s=(await t.json()).slice(0,30),r.textContent=``,l(),u()}catch{r.textContent=`Не удалось загрузить персонажей. Попробуйте ещё раз.`,n.innerHTML=`
      <button id="retry">Повторить попытку</button>
    `,document.querySelector(`#retry`).addEventListener(`click`,c)}}function l(){a.innerHTML=`
    <option value="">Все персонажи</option>
    ${[...new Set(s.map(e=>e.gender))].filter(Boolean).map(e=>`<option value="${e}">${e}</option>`).join(``)}
  `}function u(){let e=i.value.toLowerCase(),t=a.value,r=s.filter(n=>{let r=n.name.toLowerCase().includes(e),i=t===``||n.gender===t;return r&&i});n.innerHTML=r.length===0?`<p>Ничего не найдено</p>`:r.map(e=>`
    <article class="user-card">
      <h2>${e.name}</h2>
      <p> Пол: ${e.gender}</p>
      <p> Возраст: ${e.age}</p>
      <p>👀 Глаза: ${e.eye_color}</p>
      <p> Волосы: ${e.hair_color}</p>
    </article>
  `).join(``)}i.addEventListener(`input`,u),a.addEventListener(`change`,u),o.addEventListener(`click`,c),c();