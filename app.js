const SHEET_API = 'https://script.google.com/macros/s/AKfycbxfEtCvNYk3cWjuhLk2giOX2W1dPFo5I0Z761DK90jRUPGsFK0WsOs5lRvLNo7kxyEt/exec';

const state = { items: [] };

function normalizeItem(item){
  return {
    id:       item.id,
    title:    item.titulo    || '',
    category: item.categoria || '',
    date:     item.fecha     || '',
    excerpt:  item.resumen   || '',
    link:     `nota.html?id=${item.id}`,
    featured: String(item.destacado).toLowerCase() === 'true',
    image:    item.imagen    || ''
  };
}

function renderNotas(items){
  const el = document.getElementById('notasGrilla');
  if (!el) return;
  if (items.length === 0) {
    el.innerHTML = '<p class="cargando">No hay notas publicadas.</p>';
    return;
  }
  el.innerHTML = items.map(n => `
    <div class="nota-col">
      ${n.image ? `<img class="nota-col-img" src="${n.image}" alt="${n.title}" onerror="this.style.display='none'">` : ''}
      <div class="volanta" style="font-size:10px;">${n.category || ''}</div>
      <div class="nota-col-titulo">${n.title}</div>
      <div class="nota-col-texto">${n.excerpt}</div>
      <div class="nota-col-fecha">${n.date}</div>
      <a class="nota-col-link" href="${n.link}">Leer más →</a>
    </div>
  `).join('');
}

async function renderEdiciones(){
  const el = document.getElementById('edicionesGrilla');
  if (!el) return;
  try {
    const res = await fetch(`${SHEET_API}?sheet=ediciones`);
    const data = await res.json();
    const ediciones = data.items || [];
    if (ediciones.length === 0) {
      el.innerHTML = '<p class="cargando">No hay ediciones publicadas todavía.</p>';
      return;
    }
    el.innerHTML = ediciones.map(ed => `
      <div class="edicion-col">
        <div class="edicion-col-numero">N° ${ed.id} · ${ed.fecha}</div>
        <div class="edicion-col-nombre">${ed.nombre}</div>
        <div class="edicion-col-desc">${ed.descripcion}</div>
        <a class="edicion-col-link" href="edicion.html?id=${ed.id}">Ver este quilombo completo →</a>
      </div>
    `).join('');
  } catch(err) {
    el.innerHTML = '<p class="cargando">Error al cargar este quilombo.</p>';
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
  renderNotas(state.items);
  renderEdiciones();
}

loadData();
