const SHEET_API = 'https://script.google.com/macros/s/AKfycbwjemX9LPiQlzAV_h1004PO_bia_nAK_mFE8ca18gIlZuAe1kllT6z0URqnq6nkapCD/exec';

const state = {
  items: [],
  category: 'Todas'
};

const filtersEl = document.getElementById('filters');
const gridEl = document.getElementById('notesGrid');
const featuredMeta = document.getElementById('featuredMeta');
const featuredTitle = document.getElementById('featuredTitle');
const featuredExcerpt = document.getElementById('featuredExcerpt');
const featuredLink = document.getElementById('featuredLink');

function categories(items){
  return ['Todas', ...new Set(items.map(i => i.category).filter(Boolean))];
}

function normalizeItem(item){
  return {
    title:    item.titulo    || '',
    category: item.categoria || '',
    date:     item.fecha     || '',
    excerpt:  item.resumen   || '',
    link:     `nota.html?id=${item.id}`,
    featured: String(item.destacado).toLowerCase() === 'true',
    image:    item.imagen    || '',
    slug:     item.slug      || ''
  };
}
}

function renderFilters(){
  filtersEl.innerHTML = categories(state.items).map(c => `
    <button type="button" data-cat="${c}">${c}</button>
  `).join('');
  filtersEl.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      state.category = btn.dataset.cat;
      render();
    });
  });
}

function renderFeatured(items){
  const featured = items.find(i => i.featured) || items[0];
  if (!featured) {
    featuredMeta.textContent = 'Sin datos';
    featuredTitle.textContent = 'Todavía no hay notas';
    featuredExcerpt.textContent = 'Cargá tus filas en Sheets y volvé a cargar.';
    featuredLink.href = '#';
    return;
  }
  featuredMeta.textContent = featured.date;
  featuredTitle.textContent = featured.title;
  featuredExcerpt.textContent = featured.excerpt;
  featuredLink.href = featured.link || '#';
}

function renderGrid(items){
  gridEl.innerHTML = items.map((item, idx) => `
    <article class="note-card reveal" style="animation-delay:${Math.min(idx * 0.04, 0.28)}s">
      <div class="meta">${item.date}</div>
      <h3>${item.title}</h3>
      <p>${item.excerpt}</p>
      <a href="${item.link || '#'}">Leer más</a>
    </article>
  `).join('');
}

function render(){
  const filtered = state.category === 'Todas'
    ? state.items
    : state.items.filter(i => i.category === state.category);
  renderFeatured(filtered);
  renderGrid(filtered);
}

async function loadData(){
  try {
    const res = await fetch(SHEET_API);
    const data = await res.json();
    const rawItems = Array.isArray(data.items) ? data.items : data;
    state.items = (rawItems || []).map(normalizeItem);
  } catch(err) {
    state.items = [];
    featuredMeta.textContent = 'Error al cargar';
    featuredTitle.textContent = 'No se pudo conectar con Sheets';
    featuredExcerpt.textContent = 'Verificá que el Apps Script esté desplegado como público.';
  }
  renderFilters();
  render();
}

loadData();
