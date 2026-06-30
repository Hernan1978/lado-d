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

function renderFeatured(items){
  if (!featuredMeta) return;
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
  renderFeatured(filtered);
  renderGrid(filtered);
}

function buildBricks(rows){
  const brickW = 80;
  const brickH = 36;
  const gap = 2;
  const totalW = 700;
  const bricksPerRow = Math.ceil(totalW / (brickW + gap)) + 1;
  const colors = ['#3d2418','#3a2115','#3e2519','#3b2216','#3c2418'];
  let svg = `<svg style="position:absolute;inset:0;width:100%;height:100%;" viewBox="0 0 700 ${rows*(brickH+gap)}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">`;
  for(let r=0;r<rows;r++){
    const offset = r%2===0 ? 0 : -(brickW+gap)/2;
    for(let c=0;c<bricksPerRow;c++){
      const x = offset + c*(brickW+gap);
      const y = r*(brickH+gap);
      const col = colors[(r+c)%colors.length];
      svg += `<rect x="${x}" y="${y}" width="${brickW}" height="${brickH}" fill="${col}" rx="1" stroke="#1a120c" stroke-width="1"/>`;
    }
  }
  svg += `<rect x="0" y="0" width="700" height="${rows*(brickH+gap)}" fill="rgba(0,0,0,0.42)"/>`;
  svg += `</svg>`;
  return svg;
}

const rotaciones = [-2.5, 1.8, -1, 2.2, -1.5, 2, -1.2, 1.5];
const papelColors = ['#ede4c8','#e8dfc4','#f2e9d2','#ebe2c6','#eee5ca'];

function papelHTML(h, i){
  const rot = rotaciones[i % rotaciones.length];
  const bg = papelColors[i % papelColors.length];
  return `
    <div onclick="abrirExp(${i})"
      style="cursor:pointer;background:${bg};padding:1rem 1.1rem 1.2rem;position:relative;border-radius:2px;transform:rotate(${rot}deg);transition:filter .2s,transform .2s;box-shadow:2px 4px 12px rgba(0,0,0,.4);"
      onmouseover="this.style.filter='brightness(1.08)';this.style.transform='rotate(${rot}deg) translateY(-3px)'"
      onmouseout="this.style.filter='none';this.style.transform='rotate(${rot}deg)'">
      <div style="position:absolute;top:-10px;left:50%;transform:translateX(-50%) rotate(${-rot}deg);width:50px;height:14px;background:rgba(220,200,150,0.55);border:0.5px solid rgba(180,160,100,0.3);border-radius:1px;"></div>
      <div style="font-family:monospace;font-size:10px;color:#8b2500;letter-spacing:.1em;margin-bottom:.3rem;">${h.anio||''}</div>
      <div style="font-size:16px;font-weight:700;color:#1a1008;margin-bottom:.4rem;line-height:1.2;">${h.titulo||''}</div>
      <div style="font-family:monospace;font-size:11.5px;color:#3d2e10;line-height:1.6;">${h.descripcion||h.descrpcion||''}</div>
      <div style="font-family:monospace;font-size:11px;color:#8b2500;margin-top:.5rem;border-bottom:1.5px solid #8b2500;display:inline-block;">${h.tag||''}</div>
      <div style="font-family:monospace;font-size:10px;color:#7a6535;margin-top:.4rem;font-style:italic;">↳ tocá para el veredicto de Carlos</div>
    </div>
  `;
}

let muralHitos = [];
const muralVotados = {};

window.abrirExp = function(idx) {
  const h = muralHitos[idx];
  const votado = muralVotados[idx];
  const overlay = document.getElementById('expOverlay');
  if (!overlay || !h) return;
  overlay.innerHTML = `
    <div style="background:#f0e8d0;max-width:500px;width:100%;padding:2rem;position:relative;transform:rotate(-0.5deg);border-radius:2px;border-top:5px solid #8b2500;box-shadow:0 20px 60px rgba(0,0,0,.6);">
      <div style="position:absolute;top:-10px;left:50%;transform:translateX(-50%);width:70px;height:16px;background:rgba(220,200,150,0.6);border:0.5px solid rgba(180,160,100,0.3);border-radius:1px;"></div>
      <button onclick="document.getElementById('expOverlay').style.display='none'" style="position:absolute;top:.75rem;right:1rem;background:none;border:none;font-size:22px;cursor:pointer;color:#8b7a5a;font-family:monospace;">✕</button>
      <div style="text-align:center;border-bottom:1px dashed #8b7a5a;padding-bottom:1rem;margin-bottom:1.2rem;">
        <div style="font-family:monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#8b7a5a;margin-bottom:.4rem;">Pasa y mira el mural</div>
        <div style="font-size:20px;font-weight:700;color:#1a1008;line-height:1.3;">${h.titulo||''}</div>
      </div>
      <div style="font-family:monospace;font-size:9px;text-transform:uppercase;letter-spacing:.12em;color:#8b7a5a;margin-bottom:.35rem;">Hechos</div>
      <div style="font-family:monospace;font-size:12px;line-height:1.7;color:#3d2e10;margin-bottom:1.1rem;">${h.hechos||'Sin hechos cargados.'}</div>
      <div style="font-family:monospace;font-size:9px;text-transform:uppercase;letter-spacing:.12em;color:#8b7a5a;margin-bottom:.35rem;">Opinólogo Carlos</div>
      <div style="border-left:3px solid #8b2500;padding:.75rem 1rem;font-size:14px;line-height:1.6;color:#1a1008;margin-bottom:1.1rem;background:#e8dfc4;font-weight:600;">${h.sentencia||'Sin sentencia cargada.'}</div>
      <button onclick="marcarEstabas(${idx})" id="estabas-${idx}" style="display:flex;align-items:center;gap:8px;background:transparent;border:1.5px solid #8b7a5a;border-radius:2px;padding:6px 14px;font-family:monospace;font-size:12px;color:${votado?'#8b2500':'#5a4520'};cursor:pointer;">
        📍 ${votado ? 'Estuviste ahí' : 'Yo estaba ahí'}
      </button>
      <div style="text-align:right;font-family:monospace;font-size:10px;color:#8b7a5a;border-top:1px dashed #8b7a5a;padding-top:.75rem;margin-top:1rem;">Carlos de Argentina</div>
    </div>
  `;
  overlay.style.display = 'flex';
};

window.marcarEstabas = function(idx) {
  if (!muralVotados[idx]) {
    muralVotados[idx] = true;
    const btn = document.getElementById(`estabas-${idx}`);
    if (btn) { btn.style.color = '#8b2500'; btn.innerHTML = '📍 Estuviste ahí'; }
  }
};

async function renderMuralPreview(){
  const container = document.getElementById('muralPreviewContainer');
  if (!container) return;

  try {
    const res = await fetch(`${SHEET_API}?sheet=mural`);
    const data = await res.json();
    muralHitos = data.items || [];

    if (muralHitos.length === 0) {
      container.innerHTML = '<p style="color:var(--muted);text-align:center;">Sin hitos cargados.</p>';
      return;
    }

    const preview = muralHitos.slice(0, 2);

    container.innerHTML = `
      <div style="position:relative;border-radius:24px;overflow:hidden;padding:2.5rem 2rem 2rem;">
        ${buildBricks(8)}
        <div style="position:relative;z-index:2;display:grid;grid-template-columns:repeat(2,1fr);gap:2rem;" id="muralPreviewHitos"></div>
      </div>
      <div id="expOverlay" onclick="if(event.target===this)this.style.display='none'" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:200;align-items:center;justify-content:center;padding:1rem;"></div>
    `;

    document.getElementById('muralPreviewHitos').innerHTML = preview.map((h,i) => papelHTML(h,i)).join('');

  } catch(err) {
    container.innerHTML = '<p style="color:var(--muted);text-align:center;">Error al cargar el mural.</p>';
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
    if (featuredMeta) {
      featuredMeta.textContent = 'Error al cargar';
      featuredTitle.textContent = 'No se pudo conectar con Sheets';
      featuredExcerpt.textContent = 'Verificá que el Apps Script esté desplegado como público.';
    }
  }
  renderFilters();
  render();
  renderMuralPreview();
}

loadData();
