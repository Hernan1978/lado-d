const SHEET_API = 'https://script.google.com/macros/s/AKfycbxfEtCvNYk3cWjuhLk2giOX2W1dPFo5I0Z761DK90jRUPGsFK0WsOs5lRvLNo7kxyEt/exec';

const state = {
  items: [],
  category: 'Todas'
};

const filtersEl = document.getElementById('filters');
const gridEl = document.getElementById('notesGrid');

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

function renderFilters(){
  if (!filtersEl) return;
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

function renderGrid(items){
  if (!gridEl) return;
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
  renderGrid(filtered);
}

async function renderEdiciones(){
  const container = document.getElementById('edicionesContainer');
  if (!container) return;

  try {
    const res = await fetch(`${SHEET_API}?sheet=ediciones`);
    const data = await res.json();
    const ediciones = data.items || [];

    if (ediciones.length === 0) {
      container.innerHTML = '<p style="color:var(--muted);">No hay ediciones publicadas todavía.</p>';
      return;
    }

    container.innerHTML = ediciones.map((ed) => `
      <div class="edicion-card">
        <div class="edicion-numero">N° ${ed.id} · ${ed.fecha}</div>
        <div class="edicion-nombre">${ed.nombre}</div>
        <div class="edicion-descripcion">${ed.descripcion}</div>
        <a class="btn btn-primary" href="edicion.html?id=${ed.id}" style="display:inline-flex;margin-top:12px;font-size:.85rem;">Ver edición completa →</a>
      </div>
    `).join('');

  } catch(err) {
    container.innerHTML = '<p style="color:var(--muted);">Error al cargar las ediciones.</p>';
  }
}

async function loadData(){
  try {
    const res = await fetch(SHEET_API);
    const data = await res.json();
    const rawItems = Array.isArray(data.items) ? data.items : data;
    state.items = (rawItems || []).map(normalizeItem);
  } catch(err) {
    state.items = [];
  }
  renderFilters();
  render();
  renderEdiciones();
}

loadData();
