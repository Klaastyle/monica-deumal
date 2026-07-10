/* ==========================================================================
   blog.js — Lógica interactiva de la página de Blog
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initBlogFilters();
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

/* ── FILTROS DE CATEGORÍA ──────────────────────────────────────────────── */
function initBlogFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.blog-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Actualizar botón activo
            filterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');

            const filter = btn.getAttribute('data-filter');

            // Animar las tarjetas
            cards.forEach(card => {
                const category = card.getAttribute('data-category');
                const matches = filter === 'all' || category === filter;

                if (matches) {
                    card.style.animation = 'none';
                    card.classList.remove('hidden');
                    // Reiniciar animación
                    card.offsetHeight; // reflow
                    card.style.animation = 'fadeInUp 0.4s ease forwards';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
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

/* ── ANIMACIÓN GLOBAL PARA FILTROS ─────────────────────────────────────── */
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(18px); }
        to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
        from { opacity: 0; }
        to   { opacity: 1; }
    }
`;
document.head.appendChild(style);
