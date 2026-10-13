/* ==========================================================================
   blog.js — Lógica interactiva de la página de Blog (Buscador, Filtros y Paginación)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initBlogEngine();
    initNewsletterForm();
});

/* ── SCROLL DEL HEADER ──────────────────────────────────────────────────── */
function initHeaderScroll() {
    const header = document.getElementById('main-header');
    if (!header) return;
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });
}

/* ── MOTOR INTERACTIVO DEL BLOG (FILTROS, BÚSQUEDA Y PAGINACIÓN) ────────── */
function initBlogEngine() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('blog-search');
    const cards = Array.from(document.querySelectorAll('.blog-card'));
    const paginationWrap = document.getElementById('blog-pagination');
    if (!cards.length) return;

    let currentFilter = 'all';
    let searchQuery = '';
    let currentPage = 1;
    const POSTS_PER_PAGE = 6;

    function getFilteredCards() {
        return cards.filter(card => {
            const cat = card.getAttribute('data-category') || '';
            const matchesCat = (currentFilter === 'all') || (cat === currentFilter);
            const title = (card.querySelector('.blog-card-title')?.textContent || '').toLowerCase();
            const excerpt = (card.querySelector('.blog-card-excerpt')?.textContent || '').toLowerCase();
            const q = searchQuery.toLowerCase().trim();
            const matchesSearch = !q || title.includes(q) || excerpt.includes(q);
            return matchesCat && matchesSearch;
        });
    }

    function render() {
        const filtered = getFilteredCards();
        const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE) || 1;
        if (currentPage > totalPages) currentPage = 1;

        const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
        const endIndex = startIndex + POSTS_PER_PAGE;

        // Ocultar todas las tarjetas primero
        cards.forEach(card => card.classList.add('hidden'));

        // Mostrar solo el segmento correspondiente a la página activa
        filtered.slice(startIndex, endIndex).forEach(card => {
            card.classList.remove('hidden');
            card.style.animation = 'none';
            card.offsetHeight; // reflow
            card.style.animation = 'fadeInUp 0.35s ease forwards';
        });

        // Actualizar controles de paginación
        if (paginationWrap) {
            if (filtered.length <= POSTS_PER_PAGE) {
                paginationWrap.style.display = 'none';
            } else {
                paginationWrap.style.display = 'flex';
                let html = '';
                if (currentPage > 1) {
                    html += `<button class="page-btn page-prev" data-page="${currentPage - 1}" aria-label="Página anterior">←</button>`;
                }
                for (let i = 1; i <= totalPages; i++) {
                    html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}" aria-label="Ir a página ${i}">${i}</button>`;
                }
                if (currentPage < totalPages) {
                    html += `<button class="page-btn page-next" data-page="${currentPage + 1}" aria-label="Página siguiente">Siguiente →</button>`;
                }
                paginationWrap.innerHTML = html;

                paginationWrap.querySelectorAll('.page-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const targetPage = parseInt(btn.getAttribute('data-page'), 10);
                        if (targetPage && targetPage !== currentPage) {
                            currentPage = targetPage;
                            render();
                            const grid = document.getElementById('blog-grid');
                            if (grid) {
                                window.scrollTo({
                                    top: grid.offsetTop - 120,
                                    behavior: 'smooth'
                                });
                            }
                        }
                    });
                });
            }
        }
    }

    // Botones de filtro por categoría
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
            currentFilter = btn.getAttribute('data-filter') || 'all';
            currentPage = 1;
            render();
        });
    });

    // Búsqueda en vivo
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            currentPage = 1;
            render();
        });
    }

    render();
}

/* ── FORMULARIO DE NEWSLETTER ──────────────────────────────────────────── */
function initNewsletterForm() {
    const form = document.getElementById('newsletter-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('.newsletter-input');
        const btn   = form.querySelector('.newsletter-btn');
        const email = input.value.trim();

        if (!email) return;

        btn.disabled = true;
        btn.textContent = 'Suscribiendo...';

        setTimeout(() => {
            form.innerHTML = `
                <div style="text-align:center; padding: 20px 0; animation: fadeIn 0.5s ease;">
                    <div style="font-size:2.5rem; color: var(--gold); margin-bottom:12px;">✓</div>
                    <p style="color:#fff; font-size:1rem; font-weight:600; margin-bottom:6px;">¡Suscripción confirmada!</p>
                    <p style="color: var(--text-muted); font-size:0.88rem;">Te enviaremos actualizaciones a <strong style="color:var(--gold)">${email}</strong></p>
                </div>
            `;
        }, 1200);
    });
}

/* ── ANIMACIÓN GLOBAL PARA TRANSICIONES ────────────────────────────────── */
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(16px); }
        to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
        from { opacity: 0; }
        to   { opacity: 1; }
    }
`;
document.head.appendChild(style);
