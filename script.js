// Fetch card list from config.json and display cards

const cardsContainer = document.getElementById('cards-container');
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modal-image');
const modalCloseBtn = document.getElementById('modal-close');

function createCard(filename) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.tabIndex = 0;
  card.setAttribute('role', 'button');
  card.setAttribute('aria-label', `View ${filename}`);

  const img = document.createElement('img');
  img.src = `images/${filename}`;
  img.alt = filename.replace(/[-_]/g, ' ').replace('.png', '');
  img.loading = 'lazy';

  card.appendChild(img);

  card.addEventListener('click', () => openModal(img.src, img.alt));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openModal(img.src, img.alt);
    }
  });

  return card;
}

function openModal(src, alt) {
  modalImage.src = src;
  modalImage.alt = alt;
  modal.classList.remove('hidden');
  modal.focus();
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.add('hidden');
  modalImage.src = '';
  modalImage.alt = '';
  document.body.style.overflow = '';
}

modalCloseBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

async function loadCards() {
  try {
    const response = await fetch('config.json');
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data.cards)) {
      console.error('config.json must contain an array property "cards"');
      return;
    }
    data.cards.forEach(filename => {
      const card = createCard(filename);
      cardsContainer.appendChild(card);
    });
  } catch (error) {
    console.error('Failed to load cards from config.json:', error);
    cardsContainer.textContent = 'Failed to load cards.';
  }
}

loadCards();

