// ============================================
// ARTÍCULOS DE EJEMPLO (para empezar)
// ============================================
const articles = [
    {
        id: 1,
        title: "La Revolución Libertadora",
        category: "historia",
        preview: "El golpe militar de 1955 que derrocó a Perón y instauró un gobierno de facto que duró hasta 1958...",
        date: "1955-09-16",
        image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&h=400&fit=crop",
        link: "#"
    },
    {
        id: 2,
        title: "Attaque 77: La banda que cambió el rock argentino",
        category: "bandas",
        preview: "Desde el underground de los 80 hasta ser uno de los grupos más importantes del rock nacional...",
        date: "2024-03-15",
        image: "https://images.unsplash.com/photo-1493225255756-d9584f8506e9?w=600&h=400&fit=crop",
        link: "#"
    },
    {
        id: 3,
        title: "El Tango: Más que un baile, una pasión",
        category: "baile",
        preview: "Nacido en los arrabales de Buenos Aires, el tango se convirtió en el símbolo cultural de Argentina...",
        date: "2024-02-20",
        image: "https://images.unsplash.com/photo-1514316454349-95687999f8b7?w=600&h=400&fit=crop",
        link: "#"
    },
    {
        id: 4,
        title: "Quilmes: El rock que nació en el barrio",
        category: "musica",
        preview: "Cómo un semplice barrio del sur de Buenos Aires dio origen a una de las bandas más legendarias...",
        date: "2024-01-10",
        image: "https://images.unsplash.com/photo-1511671782779-c97d3d2b61d5?w=600&h=400&fit=crop",
        link: "#"
    },
    {
        id: 5,
        title: "Menemismo: Los años del neoliberalismo",
        category: "historia",
        preview: "La década de los 90, las reformas económicas, las privatizaciones y el cambio profundo de la sociedad...",
        date: "1990-05-14",
        image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&h=400&fit=crop",
        link: "#"
    },
    {
        id: 6,
        title: "Cumbia Villera: La música de los arrabales",
        category: "musica",
        preview: "Desde las villas de emergencia hasta los estadios. La cumbia que rompió todos los límites...",
        date: "2000-08-22",
        image: "https://images.unsplash.com/photo-1511671782779-c97d3d2b61d5?w=600&h=400&fit=crop",
        link: "#"
    },
    {
        id: 7,
        title: "Los Secretros de la Alianza",
        category: "historia",
        preview: "La coalición política que llegó al poder en 1999 y sus dos años de gobierno marcado por la crisis...",
        date: "1999-10-24",
        image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&h=400&fit=crop",
        link: "#"
    },
    {
        id: 8,
        title: "Pescao Virtuoso: El folclore moderno",
        category: "baile",
        preview: "Cómo el folclore argentino se actualizó sin perder su esencia. Zamba, chacarera y milonga hoy...",
        date: "2023-11-30",
        image: "https://images.unsplash.com/photo-1514316454349-95687999f8b7?w=600&h=400&fit=crop",
        link: "#"
    },
    {
        id: 9,
        title: "Soda Stereo: El fenómeno que unió a todo el país",
        category: "bandas",
        preview: "De Buenos Aires a toda Latinoamérica. La banda que definió el rock de los 80s y 90s...",
        date: "1985-06-18",
        image: "https://images.unsplash.com/photo-1493225255756-d9584f8506e9?w=600&h=400&fit=crop",
        link: "#"
    },
    {
        id: 10,
        title: "Bad Bunny y la nueva ola latina",
        category: "musica",
        preview: "Cómo un artista de Puerto Rico dominó las playlists argentinas y cambió la música local...",
        date: "2024-04-05",
        image: "https://images.unsplash.com/photo-1511671782779-c97d3d2b61d5?w=600&h=400&fit=crop",
        link: "#"
    }
];

// ============================================
// VARIABLES GLOBALES
// ============================================
let currentCategory = 'all';
let searchQuery = '';

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    loadArticles();
    setupSearch();
    setupFilters();
    setupInstagramLink();
});

// ============================================
// CARGAR ARTÍCULOS
// ============================================
function loadArticles(filteredList = null) {
    const grid = document.getElementById('articlesGrid');
    const articlesToShow = filteredList || getFilteredArticles();
    
    grid.innerHTML = articlesToShow.map(article => `
        <article class="article-card" onclick="window.location.href='${article.link}';">
            <img src="${article.image}" alt="${article.title}" class="article-image">
            <div class="article-content">
                <span class="article-category">${translateCategory(article.category)}</span>
                <h3 class="article-title">${article.title}</h3>
                <p class="article-preview">${article.preview}</p>
                <div class="article-meta">
                    <span class="article-date">
                        <i class="fas fa-calendar"></i>
                        ${formatDate(article.date)}
                    </span>
                    <a href="${article.link}" class="article-link">
                        Leer <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        </article>
    `).join('');
}

// ============================================
// FILTRAR ARTÍCULOS
// ============================================
function getFilteredArticles() {
    return articles.filter(article => {
        const matchesCategory = currentCategory === 'all' || article.category === currentCategory;
        const matchesSearch = searchQuery === '' || 
            article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.preview.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });
}

// ============================================
// SETUP BUSCADOR
// ============================================
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        loadArticles();
    });
}

// ============================================
// SETUP FILTROS
// ============================================
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Actualizar clase active
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Actualizar categoría
            currentCategory = button.dataset.category;
            loadArticles();
        });
    });
}

// ============================================
// CONFIGURAR LINK INSTAGRAM
// ============================================
function setupInstagramLink() {
    const instagramLink = document.getElementById('instagramLink');
    // Cuando crees tu Instagram, cambia esta URL
    instagramLink.href = 'https://instagram.com/tu_usuario';
}

// ============================================
// FUNCIONES AUXILIARES
// ============================================
function translateCategory(category) {
    const translations = {
        'historia': 'Historia',
        'musica': 'Música',
        'baile': 'Baile',
        'bandas': 'Bandas'
    };
    return translations[category] || category;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long' };
    return date.toLocaleDateString('es-AR', options);
}

// ============================================
// INTEGRACIÓN GOOGLE SHEETS (PREPARADO)
// ============================================
// Para conectar con Google Sheets, vas a:
// 1. Crear un Sheet con columns: id, title, category, preview, date, image, link
// 2. Publicar el Sheet como CSV
// 3. Usar este código para cargar los datos:

/*
async function loadFromGoogleSheets(sheetUrl) {
    try {
        const response = await fetch(sheetUrl);
        const data = await response.text();
        const parsed = parseCSV(data);
        articles = parsed;
        loadArticles();
    } catch (error) {
        console.error('Error loading from Sheets:', error);
        loadArticles(); // Usar artículos de ejemplo si falla
    }
}
*/
