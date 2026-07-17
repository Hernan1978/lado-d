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

function renderDestacada(items){
  const wrap = document.getElementById('notaPrincipal');
  const sep = document.getElementById('npSep');
  if (!wrap) return;

  const nota = items.find(n => n.featured) || items[0];
  if (!nota) {
    wrap.style.display = 'none';
    if (sep) sep.style.display = 'none';
    return;
  }

  document.getElementById('npVolanta').textContent = nota.category || 'Destacada';
  document.getElementById('npTitular').textContent = nota.title;
  document.getElementById('npCopete').textContent = nota.excerpt;
  document.getElementById('npLink').href = nota.link;

  wrap.style.display = '';
  if (sep) sep.style.display = '';
}

function normalizeTxt(s){
  return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

function renderEfemeride(items){
  const zona = document.getElementById('efemerideZona');
  if (!zona) return;

  const ef = items.find(n => normalizeTxt(n.category) === 'efemeride');
  if (!ef) {
    zona.style.display = 'none';
    return;
  }

  document.getElementById('efTitulo').textContent = ef.title;
  document.getElementById('efTexto').textContent = ef.excerpt;
  zona.style.display = '';
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
  renderDestacada(state.items);
  renderEfemeride(state.items);
  renderEdiciones();
}

loadData();
