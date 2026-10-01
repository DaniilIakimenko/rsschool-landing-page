const grid = document.querySelector('.catalog__grid');
const tabs = document.querySelectorAll('.catalog__tab');
const load = document.querySelector('.catalog__load-more');
const modal = document.querySelector('.modal');
const modalInner = document.querySelector('.modal__content');

let products = [];
let currentProduct = null;

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

  grid.addEventListener('click', (e) => {
    const card = e.target.closest('.catalog-card');
    if (!card) return;

    renderModal(card.dataset.id);

    modal.classList.add('is-open');
    modal.ariaHidden = 'false';
    document.body.classList.add('modal-open');
  });

  load.addEventListener('click', () => {
    grid.classList.add('is-expanded');
    load.classList.add('is-hidden');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.closest('.modal__close')) closeModal();
  });

  modalInner.addEventListener('click', (e) => {
    const option = e.target.closest('.modal__option');
    if (!option) return;

    if (option.dataset.sizeCode) {
      const allSizes = modalInner.querySelectorAll('[data-size-code]');

      allSizes.forEach(s => s.classList.remove('modal__option--active'));
      option.classList.add('modal__option--active');

      updateTotal();
    }

    if (option.dataset.addPrice) {
      option.classList.toggle('modal__option--active');

      updateTotal();
    }
  });
}

function renderCategory(category) {
  const items = products.filter((obj) => obj.category === category);

  const cardsHTML = items
    .map(
      (item) => `
        <article class='catalog-card' data-id='${item.id}'>
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

function renderModal(id) {
  const product = products.find((obj) => obj.id === Number(id));
  currentProduct = product;

  const sizesHTML = Object.entries(product.sizes)
    .map(([code, data], index) => `
      <button class='modal__option ${index === 0 ? 'modal__option--active' : ''}' type='button' data-size-code='${code}' data-size-price='${data.addPrice}'>
        <span class='modal__option-code'>${code.toUpperCase()}</span>
        <span class='modal__option-volume'>${data.size}</span>
      </button>
    `).join('');

  const additivesHTML = product.additives
    .map(add => `
      <button class='modal__option' type='button' data-add-price='${add.addPrice}'>
        <span>${add.name}</span>
      </button>
    `).join('');

  const modalHTML = `
    <div class='modal__image-wrap'>
      <img class='modal__image' src='${product.image}' alt='${product.name}'>
    </div>

    <div class='modal__body'>
      <h3 class='modal__title'>${product.name}</h3>
      <p class='modal__desc'>${product.description}</p>

      <div class='modal__group'>
        <p class='modal__label'>Size</p>
        <div class='modal__options'>${sizesHTML}</div>
      </div>

      <div class='modal__group'>
        <p class='modal__label'>Additives</p>
        <div class='modal__options'>${additivesHTML}</div>
      </div>

      <div class='modal__total'>
        <span class='modal__total-label'>Total:</span>
        <span class='modal__total-price'>$${product.price}</span>
      </div>

      <div class='modal__note'>
        <svg class='modal__note-icon' viewBox='0 0 16 16' aria-hidden='true'>
          <circle cx='8' cy='8' r='7' fill='none' stroke='currentColor' stroke-width='1.5'/>
          <path d='M8 7V11' stroke='currentColor' stroke-width='1.5' stroke-linecap='round'/>
          <circle cx='8' cy='4.75' r='0.85' fill='currentColor'/>
        </svg>
        <p class='modal__note-text'>
          The cost is not final. Download our mobile app to see the final price and place your order. Earn loyalty points and enjoy your favorite coffee with up to 20% discount.
        </p>
      </div>

      <button class='modal__close' type='button'>Close</button>
    </div>
  `

  modalInner.innerHTML = modalHTML;

  updateTotal();
}

const closeModal = () => {
  modal.classList.remove('is-open');
  modal.ariaHidden = 'true';
  document.body.classList.remove('modal-open');
};

const updateTotal = () => {
  const sizePrice = Number(modalInner.querySelector('[data-size-code].modal__option--active').dataset.sizePrice);
  const additivesPrice = [...modalInner.querySelectorAll('[data-add-price].modal__option--active')]
    .reduce((sum, item) => sum + Number(item.dataset.addPrice), 0);
  
  const total = Number(currentProduct.price) + sizePrice + additivesPrice;

  modalInner.querySelector('.modal__total-price').textContent = `$${total.toFixed(2)}`;
}

init();