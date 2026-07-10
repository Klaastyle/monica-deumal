/* ==========================================================================
   contacto.js — Lógica interactiva de la página de Contacto
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initContactForm();
    initFAQ();
});

/* ── SCROLL DEL HEADER ──────────────────────────────────────────────────── */
function initHeaderScroll() {
    const header = document.getElementById('main-header');
    if (!header) return;
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });
}

/* ── FORMULARIO DE CONTACTO COMPLETO ───────────────────────────────────── */
function initContactForm() {
    const form    = document.getElementById('contact-full-form');
    const success = document.getElementById('form-success');
    const submitBtn = document.getElementById('contact-submit-btn');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name    = document.getElementById('cf-name').value.trim();
        const email   = document.getElementById('cf-email').value.trim();
        const message = document.getElementById('cf-message').value.trim();
        const privacy = document.getElementById('cf-privacy').checked;

        // Validación
        if (!name || !email || !message) {
            shakeButton(submitBtn);
            showFieldErrors({ name, email, message });
            return;
        }

        if (!privacy) {
            alert('Debe aceptar la política de privacidad para continuar.');
            return;
        }

        // Animación de envío
        submitBtn.disabled = true;
        submitBtn.querySelector('.btn-text').textContent = 'Enviando...';
        submitBtn.querySelector('.btn-icon').textContent = '⟳';

        setTimeout(() => {
            // Ocultar formulario con fade
            form.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            form.style.opacity = '0';
            form.style.transform = 'translateY(-10px)';

            setTimeout(() => {
                form.style.display = 'none';
                const header = document.querySelector('.contact-form-header');
                if (header) header.style.display = 'none';

                // Actualizar mensaje de éxito
                const successMsg = document.getElementById('success-msg');
                if (successMsg) {
                    successMsg.innerHTML = `Gracias, <strong style="color:var(--gold)">${name}</strong>. Mónica Deumal o un miembro experto del despacho revisará tu caso y te contactará en menos de 24 horas.`;
                }

                // Mostrar éxito
                success.classList.add('visible');
                success.style.display = 'block';
            }, 400);
        }, 1500);
    });
}

/* ── RESET DEL FORMULARIO ──────────────────────────────────────────────── */
function resetForm() {
    location.reload();
}

/* ── SHAKE ANIMATION EN ERROR ──────────────────────────────────────────── */
function shakeButton(btn) {
    btn.style.animation = 'shake 0.4s ease';
    setTimeout(() => { btn.style.animation = ''; }, 400);
}

function showFieldErrors({ name, email, message }) {
    const fields = [
        { id: 'cf-name',    value: name },
        { id: 'cf-email',   value: email },
        { id: 'cf-message', value: message },
    ];

    fields.forEach(({ id, value }) => {
        const el = document.getElementById(id);
        if (!el) return;
        if (!value) {
            el.style.borderColor = 'rgba(239,68,68,0.6)';
            el.addEventListener('input', () => { el.style.borderColor = ''; }, { once: true });
        }
    });
}

/* ── ACORDEÓN DE FAQ ────────────────────────────────────────────────────── */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (!question) return;

        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            // Cerrar todos
            faqItems.forEach(i => {
                i.classList.remove('open');
                const q = i.querySelector('.faq-question');
                if (q) q.setAttribute('aria-expanded', 'false');
            });

            // Abrir el clickeado si estaba cerrado
            if (!isOpen) {
                item.classList.add('open');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });
}

/* ── INYECCIÓN DE ANIMACIONES GLOBALES ─────────────────────────────────── */
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20%       { transform: translateX(-6px); }
        40%       { transform: translateX(6px); }
        60%       { transform: translateX(-4px); }
        80%       { transform: translateX(4px); }
    }
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(12px); }
        to   { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);
