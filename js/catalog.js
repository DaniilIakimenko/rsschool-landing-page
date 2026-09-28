const grid = document.querySelector('.catalog__grid');
const tabs = document.querySelectorAll('.catalog__tab');
const load = document.querySelector('.catalog__load-more');

let products = [];

async function init() {
  const response = await fetch('data/products.json');
  products = await response.json();

  renderCategory('coffee');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('catalog__tab--active'));

      tab.classList.add('catalog__tab--active');
      grid.classList.remove('is-expanded');

      renderCategory(tab.dataset.category);
    });
  });

  load.addEventListener('click', () => {
    grid.classList.add('is-expanded');
    load.classList.add('is-hidden');
  });
}

function renderCategory(category) {
  const items = products.filter((obj) => obj.category === category);

  const cardsHTML = items
    .map(
      (item) => `
        <article class='catalog-card'>
          <div class='catalog-card__media'>
            <img class='catalog-card__img' src='${item.image}' alt='${item.name}'>
          </div>

          <div class='catalog-card__body'>
            <h2 class='catalog-card__title'>${item.name}</h2>
            <p class='catalog-card__desc'>${item.description}</p>
            <p class='catalog-card__price'>$${item.price}</p>
          </div>
        </article>
      `,
    )
    .join('');

  if (grid.innerHTML.trim()) {
    grid.classList.add('is-fading');
  
    setTimeout(() => {
      grid.innerHTML = cardsHTML;
      grid.classList.remove('is-fading');

      load.classList.toggle('is-hidden', items.length <= 4);
    }, 200);
  } else {
    grid.innerHTML = cardsHTML;

    load.classList.toggle('is-hidden', items.length <= 4);
  }
}

init();