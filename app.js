const SHEET_API = 'https://script.google.com/macros/s/AKfycbxfEtCvNYk3cWjuhLk2giOX2W1dPFo5I0Z761DK90jRUPGsFK0WsOs5lRvLNo7kxyEt/exec';

const state = { items: [], category: 'Todas' };

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

function renderNotaPrincipal(items){
  const el = document.getElementById('notaPrincipal');
  if (!el) return;
  const nota = items.find(i => i.featured) || items[0];
  if (!nota) {
    el.innerHTML = '<div class="volanta">Sin notas publicadas</div>';
    return;
  }
  el.innerHTML = `
    <div class="volanta">Nota principal</div>
    <div class="titular-principal">${nota.title}</div>
    <div class="nota-principal-inner">
      ${nota.image ? `<img class="nota-principal-img" src="${nota.image}" alt="${nota.title}">` : '<div style="background:#d4c89a;height:220px;border:1px solid var(--borde);display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:11px;">[ fotografía ]</div>'}
      <div>
        <div class="copete">${nota.excerpt}</div>
        <div class="firma">Por Carlos de Argentina · ${nota.date}</div>
        <a class="btn-leer" href="${nota.link}">Leer nota completa →</a>
      </div>
    </div>
  `;
}

function renderNotas(items){
  const el = document.getElementById('notasGrilla');
  if (!el) return;
  const resto = items.slice(1);
  if (resto.length === 0) {
    el.innerHTML = '<p class="cargando">No hay más notas publicadas.</p>';
    return;
  }
  el.innerHTML = resto.map(n => `
    <div class="nota-col">
      ${n.image ? `<img class="nota-col-img" src="${n.image}" alt="${n.title}">` : ''}
      <div class="volanta" style="font-size:10px;">${n.category || ''}</div>
      <div class="nota-col-titulo">${n.title}</div>
      <div class="nota-col-texto">${n.excerpt}</div>
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
        <a class="edicion-col-link" href="edicion.html?id=${ed.id}">Ver edición completa →</a>
      </div>
    `).join('');
  } catch(err) {
    el.innerHTML = '<p class="cargando">Error al cargar las ediciones.</p>';
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
  renderNotaPrincipal(state.items);
  renderNotas(state.items);
  renderEdiciones();
}

loadData();
