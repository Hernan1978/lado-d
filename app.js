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
    image:    item.imagen    || '',
    archivada: String(item.edicion || '').trim() !== ''
  };
}

function normalizeTxt(s){
  return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

function renderEfemeride(items){
  const zona = document.getElementById('efemerideZona');
  if (!zona) return;

  const ef = items.find(n => {
    const c = normalizeTxt(n.category);
    return c === 'efemeride' || c === 'efemerides';
  });
  if (!ef) {
    zona.style.display = 'none';
    return;
  }

  document.getElementById('efTitulo').textContent = ef.title;
  document.getElementById('efTexto').textContent = ef.excerpt;
  zona.style.display = '';
}

function renderPasacalle(items){
  const zona = document.getElementById('pasacalleZona');
  if (!zona) return;

  const frase = items.find(n => {
    const c = normalizeTxt(n.category);
    return c === 'frase' || c === 'frases';
  });

  if (!frase) {
    zona.style.display = 'none';
    return;
  }

  document.getElementById('pasacalleTextoInner').textContent = frase.title || frase.excerpt;
  zona.style.display = '';
}

async function loadData(){
  try {
    const res = await fetch(SHEET_API, { cache: 'no-store' });
    const data = await res.json();
    const rawItems = Array.isArray(data.items) ? data.items : data;
    state.items = (rawItems || []).map(normalizeItem);
  } catch(err) {
    state.items = [];
  }
  renderEfemeride(state.items);
  renderPasacalle(state.items);
}

function initParallax(){
  const video = document.querySelector('.pasacalle-video');
  const texto = document.querySelector('.pasacalle-texto');
  const zona = document.querySelector('.pasacalle-zona');
  if (!video || !zona) return;

  function onScroll(){
    const rect = zona.getBoundingClientRect();
    const offset = rect.top * 0.08;
    video.style.transform = `translateY(${offset}px) scale(1.2)`;
    if (texto) texto.style.transform = `translateY(${offset}px)`;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

loadData();
initParallax();
