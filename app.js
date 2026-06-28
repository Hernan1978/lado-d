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
function renderMural(){
  const mural = document.getElementById('muralContainer');
  if (!mural) return;
  mural.innerHTML = `
    <div style="background:#1a1612;border-radius:24px;padding:2rem;position:relative;overflow:hidden;">
      <div style="position:absolute;inset:0;background-image:repeating-linear-gradient(0deg,transparent,transparent 40px,rgba(255,255,255,.012) 40px,rgba(255,255,255,.012) 41px);pointer-events:none;border-radius:24px;"></div>
      <div style="font-family:'Permanent Marker',cursive;font-size:36px;color:#e84a2a;text-align:center;margin-bottom:1.5rem;text-shadow:2px 2px 0 #7a1a08;">Doble Vida · Soda Stereo</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;position:relative;z-index:2;" id="muralHitos"></div>
    </div>
  `;

  const hitos = [
    { anio:'1988 · Buenos Aires', titulo:'El clima que lo hizo posible', desc:'Argentina salía de años de plomo. La democracia tenía cuatro años y la gente salía a bailar como si la dictadura hubiera sido un mal sueño.', tag:'#contexto', color:'#e84a2a', id:0 },
    { anio:'1988 · Grabación', titulo:'Dos países, un disco', desc:'Buenos Aires y Río de Janeiro. Plata, tiempo, intención. No era el rock de garage de cinco años atrás.', tag:'#producción', color:'#4ab8e8', id:1 },
    { anio:'Agosto 1988 · Lanzamiento', titulo:'Sale el disco', desc:'En la ciudad de la furia. Té para tres. Cerati en su mejor momento. Un disco que en otro país hubiera sonado en todas las radios del mundo.', tag:'#lanzamiento', color:'#e8c84a', id:2 },
    { anio:'1988-1989 · Gira', titulo:'Obras. México. España.', desc:'La primera vez que una banda de rock argentina lo hacía así. Nadie sabía que se podía.', tag:'#gira', color:'#7ae84a', id:3 },
    { anio:'Hoy · Legado', titulo:'El disco que no envejece', desc:'35 años después sigue sonando. Cerati se fue pero la música no.', tag:'#legado', color:'#e84ab8', id:4 }
  ];

  const sentencias = [
    { numero:'001/1988', autos:'El Pueblo vs. "El Contexto"', hechos:'Argentina, 1988. La hiperinflación todavía no había llegado, Alfonsín gobernaba y la gente salía a bailar como si la dictadura hubiera sido un mal sueño.', sentencia:'RESUELVO: Que sin ese clima de euforia democrática, Doble Vida no hubiera pegado igual. La música necesita el momento. Y ese momento necesitaba a Soda.', count:412 },
    { numero:'002/1988', autos:'El Pueblo vs. La Producción Cara', hechos:'Grabar en dos países. Productores con plata. Un sonido limpio, casi europeo. Los puristas dijeron que habían vendido el alma.', sentencia:'RESUELVO: Que la discusión de si Soda era demasiado pop es la misma que se repite con cada artista que crece. El talento sin producción es un demo.', count:289 },
    { numero:'003/1988', autos:'El Pueblo vs. "Doble Vida" (el disco)', hechos:'Agosto de 1988. Sale el disco. En la ciudad de la furia. Doble vida. Té para tres. Cerati en su mejor momento compositivo.', sentencia:'RESUELVO: Que este disco es una de las pocas cosas que hicimos bien como país en esa década. El resto fue un desastre. Pero esto fue perfecto.', count:1847 },
    { numero:'004/1989', autos:'El Pueblo vs. La Gira', hechos:'Estadio Obras. México. España. Una banda de rock de Buenos Aires tocando afuera como si fueran los Rolling Stones.', sentencia:'RESUELVO: Que Soda abrió una puerta que antes no existía. Después de ellos, creer que el rock en español podía llegar lejos dejó de ser una fantasía.', count:756 },
    { numero:'005/2024', autos:'El Pueblo vs. El Tiempo', hechos:'Más de 35 años después, Doble Vida sigue sonando. Cerati se fue, pero la música no.', sentencia:'RESUELVO: Que el mejor legado de un disco es que te cambie aunque lo escuches cuando ya no sirve de nada. Con honores. Y con algo que se me pegó en la garganta.', count:2341 }
  ];

  const votados = {};

  document.getElementById('muralHitos').innerHTML = hitos.map((h, i) => `
    <div onclick="abrirExp(${h.id})" style="cursor:pointer;padding:1rem;border-radius:12px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);transition:filter .2s;" onmouseover="this.style.filter='brightness(1.15)'" onmouseout="this.style.filter='none'" ${i===4?'style="grid-column:1/-1;max-width:340px;margin:0 auto;cursor:pointer;padding:1rem;border-radius:12px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);"':''}>
      <div style="font-size:10px;letter-spacing:.1em;color:${h.color};margin-bottom:.3rem;">${h.anio}</div>
      <div style="font-size:18px;font-weight:700;color:${h.color};margin-bottom:.4rem;line-height:1.2;">${h.titulo}</div>
      <div style="font-size:12px;color:var(--muted);line-height:1.6;">${h.desc}</div>
      <div style="font-size:11px;color:${h.color};margin-top:.5rem;border-bottom:1.5px solid ${h.color};display:inline-block;">${h.tag}</div>
      <div style="font-size:10px;color:var(--muted);margin-top:.4rem;font-style:italic;">↳ tocá para el veredicto de Carlos</div>
    </div>
  `).join('');

  window.abrirExp = function(id) {
    const s = sentencias[id];
    const votado = votados[id];
    document.getElementById('expOverlay').innerHTML = `
      <div style="background:#1a1410;border:1.5px solid #3a2a1a;max-width:500px;width:100%;padding:2rem;position:relative;border-radius:4px;border-top:4px solid #e84a2a;transform:rotate(-0.4deg);">
        <button onclick="document.getElementById('expOverlay').style.display='none'" style="position:absolute;top:.75rem;right:1rem;background:none;border:none;font-size:22px;cursor:pointer;color:#4a3a2a;">✕</button>
        <div style="text-align:center;border-bottom:1px dashed #3a2a1a;padding-bottom:1rem;margin-bottom:1.2rem;">
          <div style="font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#6b5a3a;margin-bottom:.4rem;">Tribunal Superior del Rock Argentino · Sala Carlos</div>
          <div style="font-size:11px;color:#e84a2a;margin-bottom:.5rem;">Causa N° ${s.numero}</div>
          <div style="font-size:18px;font-weight:700;color:#e8d5a0;line-height:1.3;">AUTOS: ${s.autos}</div>
        </div>
        <div style="font-size:9px;text-transform:uppercase;letter-spacing:.12em;color:#6b5a3a;margin-bottom:.35rem;">Hechos probados</div>
        <div style="font-size:12px;line-height:1.7;color:#b8a880;margin-bottom:1.1rem;">${s.hechos}</div>
        <div style="font-size:9px;text-transform:uppercase;letter-spacing:.12em;color:#6b5a3a;margin-bottom:.35rem;">Sentencia de Carlos</div>
        <div style="border-left:3px solid #e84a2a;padding:.75rem 1rem;font-size:14px;line-height:1.6;color:#e8d5a0;margin-bottom:1.1rem;background:rgba(232,74,42,.06);">${s.sentencia}</div>
        <button onclick="marcarEstabas(${id})" id="estabas-${id}" style="display:flex;align-items:center;gap:8px;background:transparent;border:1px solid #3a2a1a;border-radius:2px;padding:6px 14px;font-size:12px;color:${votado?'#e84a2a':'#6b5a3a'};cursor:pointer;">
          📍 ${votado ? 'Estuviste ahí' : 'Yo estaba ahí'} · <span id="count-${id}">${(votado ? s.count+1 : s.count).toLocaleString('es-AR')}</span> personas
        </button>
        <div style="text-align:right;font-size:10px;color:#4a3a2a;border-top:1px dashed #3a2a1a;padding-top:.75rem;margin-top:1rem;">Dr. Carlos de Argentina · Juez Titular</div>
      </div>
    `;
    document.getElementById('expOverlay').style.display = 'flex';
  };

  window.marcarEstabas = function(id) {
    if (!votados[id]) {
      votados[id] = true;
      const btn = document.getElementById(`estabas-${id}`);
      const cnt = document.getElementById(`count-${id}`);
      btn.style.color = '#e84a2a';
      cnt.textContent = (sentencias[id].count + 1).toLocaleString('es-AR');
      btn.innerHTML = `📍 Estuviste ahí · <span id="count-${id}">${(sentencias[id].count+1).toLocaleString('es-AR')}</span> personas`;
    }
  };
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
