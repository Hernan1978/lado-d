const SHEET_API = 'https://script.google.com/macros/s/AKfycbwO7TVauAJNFXsK8mAQrePvbGEeZIMjvOX81HP2LGMmO9i1TzKmyswVdhpzK3USDwk/exec';

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

async function renderMural(){
  const mural = document.getElementById('muralContainer');
  if (!mural) return;

  try {
    const res = await fetch(`${SHEET_API}?sheet=mural`);
    const data = await res.json();
    const hitos = data.items || [];

    if (hitos.length === 0) {
      mural.innerHTML = '<p style="color:var(--muted);text-align:center;">Sin hitos cargados.</p>';
      return;
    }

    const votados = {};

    mural.innerHTML = `
      <div style="background:#1a1612;border-radius:24px;padding:2rem;position:relative;overflow:hidden;">
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:1.5rem;position:relative;z-index:2;" id="muralHitos"></div>
      </div>
      <div id="expOverlay" onclick="if(event.target===this)this.style.display='none'" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;align-items:center;justify-content:center;padding:1rem;"></div>
    `;

    document.getElementById('muralHitos').innerHTML = hitos.map((h, i) => `
      <div onclick="abrirExp(${i})" style="cursor:pointer;padding:1rem;border-radius:12px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);transition:filter .2s;${hitos.length % 2 !== 0 && i === hitos.length-1 ? 'grid-column:1/-1;max-width:340px;margin:0 auto;' : ''}" onmouseover="this.style.filter='brightness(1.15)'" onmouseout="this.style.filter='none'">
        <div style="font-size:10px;letter-spacing:.1em;color:${h.color||'var(--accent)'};margin-bottom:.3rem;">${h.anio||''}</div>
        <div style="font-size:18px;font-weight:700;color:${h.color||'var(--accent)'};margin-bottom:.4rem;line-height:1.2;">${h.titulo||''}</div>
        <div style="font-size:12px;color:var(--muted);line-height:1.6;">${h.descripcion||h.descrpcion||''}</div>
        <div style="font-size:11px;color:${h.color||'var(--accent)'};margin-top:.5rem;border-bottom:1.5px solid ${h.color||'var(--accent)'};display:inline-block;">${h.tag||''}</div>
        <div style="font-size:10px;color:var(--muted);margin-top:.4rem;font-style:italic;">↳ tocá para el veredicto de Carlos</div>
      </div>
    `).join('');

    window.abrirExp = function(idx) {
      const h = hitos[idx];
      const votado = votados[idx];
      document.getElementById('expOverlay').innerHTML = `
        <div style="background:#1a1410;border:1.5px solid #3a2a1a;max-width:500px;width:100%;padding:2rem;position:relative;border-radius:4px;border-top:4px solid #e84a2a;">
          <button onclick="document.getElementById('expOverlay').style.display='none'" style="position:absolute;top:.75rem;right:1rem;background:none;border:none;font-size:22px;cursor:pointer;color:#4a3a2a;">✕</button>
          <div style="text-align:center;border-bottom:1px dashed #3a2a1a;padding-bottom:1rem;margin-bottom:1.2rem;">
            <div style="font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#6b5a3a;margin-bottom:.4rem;">Podes venir a ver que dice el mural</div>
            <div style="font-size:18px;font-weight:700;color:#e8d5a0;line-height:1.3;">${h.titulo||''}</div>
          </div>
          <div style="font-size:9px;text-transform:uppercase;letter-spacing:.12em;color:#6b5a3a;margin-bottom:.35rem;">Hechos</div>
          <div style="font-size:12px;line-height:1.7;color:#b8a880;margin-bottom:1.1rem;">${h.hechos||'Sin hechos cargados.'}</div>
          <div style="font-size:9px;text-transform:uppercase;letter-spacing:.12em;color:#6b5a3a;margin-bottom:.35rem;">Opinologo Carlos</div>
          <div style="border-left:3px solid #e84a2a;padding:.75rem 1rem;font-size:14px;line-height:1.6;color:#e8d5a0;margin-bottom:1.1rem;background:rgba(232,74,42,.06);">${h.sentencia||'Sin sentencia cargada.'}</div>
          <button onclick="marcarEstabas(${idx})" id="estabas-${idx}" style="display:flex;align-items:center;gap:8px;background:transparent;border:1px solid #3a2a1a;border-radius:2px;padding:6px 14px;font-size:12px;color:${votado?'#e84a2a':'#6b5a3a'};cursor:pointer;">
            📍 ${votado ? 'Vos Estuviste ahí?' : 'Yo estaba ahí'}
          </button>
          <div style="text-align:right;font-size:10px;color:#4a3a2a;border-top:1px dashed #3a2a1a;padding-top:.75rem;margin-top:1rem;">Dr. Carlos de Argentina · Juez Titular</div>
        </div>
      `;
      document.getElementById('expOverlay').style.display = 'flex';
    };

    window.marcarEstabas = function(idx) {
      if (!votados[idx]) {
        votados[idx] = true;
        const btn = document.getElementById(`estabas-${idx}`);
        if (btn) { btn.style.color = '#e84a2a'; btn.innerHTML = '📍 Estuviste ahí'; }
      }
    };

  } catch(err) {
    mural.innerHTML = '<p style="color:var(--muted);text-align:center;">Error al cargar el mural.</p>';
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
    featuredMeta.textContent = 'Error al cargar';
    featuredTitle.textContent = 'No se pudo conectar con Sheets';
    featuredExcerpt.textContent = 'Verificá que el Apps Script esté desplegado como público.';
  }
  renderFilters();
  render();
  renderMural();
}

loadData();
