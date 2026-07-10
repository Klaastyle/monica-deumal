document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initActiveNavLinks();
    initTiltAndSpotlight();
    initCounters();
    initTestimonials();
    initContactForm();
});

/* ==========================================================================
   EFECTO DE SCROLL EN CABECERA
   ========================================================================== */
function initHeaderScroll() {
    const header = document.getElementById('main-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/* ==========================================================================
   ENLACES ACTIVOS EN EL MENÚ SEGÚN EL SCROLL
   ========================================================================== */
function initActiveNavLinks() {
    const sections = document.querySelectorAll('section, header.hero');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (window.scrollY >= sectionTop) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}` || 
                (currentSectionId === 'inicio' && link.getAttribute('href') === '#')) {
                link.classList.add('active');
            }
        });
    });
}

/* ==========================================================================
   INTERACCIONES 21ST.DEV - PERSPECTIVA TILT 3D Y SPOTLIGHT
   ========================================================================== */
function initTiltAndSpotlight() {
    const cards = document.querySelectorAll('.practice-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Definir la variable CSS del cursor para el Spotlight radial
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
            
            // Efecto Tilt 3D
            const width = rect.width;
            const height = rect.height;
            const centerX = rect.left + width / 2;
            const centerY = rect.top + height / 2;
            const mouseX = e.clientX - centerX;
            const mouseY = e.clientY - centerY;
            
            const maxRotate = 8; // Inclinación máxima
            const rotateX = ((mouseY / (height / 2)) * -maxRotate).toFixed(2);
            const rotateY = ((mouseX / (width / 2)) * maxRotate).toFixed(2);
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
        });
        
        // Resetear inclinación cuando el cursor sale de la tarjeta
        card.style.transition = 'transform 0.5s ease';
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
        
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none'; // Desactivar transición durante el movimiento
        });
    });
}

/* ==========================================================================
   CONTADORES NUMÉRICOS ANIMADOS CON INTERSECTION OBSERVER
   ========================================================================== */
function initCounters() {
    const statsSection = document.getElementById('estadisticas');
    const counters = document.querySelectorAll('.stat-number');
    let animated = false;
    
    const animateCounters = () => {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'), 10);
            const suffix = counter.getAttribute('data-suffix') || '';
            const duration = 2000; // Milisegundos de animación
            const stepTime = Math.abs(Math.floor(duration / target));
            let current = 0;
            
            const timer = setInterval(() => {
                current += 1;
                if (current >= target) {
                    counter.textContent = target + suffix;
                    clearInterval(timer);
                } else {
                    counter.textContent = current + suffix;
                }
            }, stepTime > 15 ? stepTime : 15);
        });
    };
    
    // Ejecutar la animación solo cuando la sección de estadísticas sea visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animateCounters();
                animated = true; // Prevenir animaciones duplicadas
                observer.unobserve(statsSection);
            }
        });
    }, { threshold: 0.3 });
    
    if (statsSection) {
        observer.observe(statsSection);
    }
}

/* ==========================================================================
   CARRUSEL DE TESTIMONIOS INTERACTIVO
   ========================================================================== */
function initTestimonials() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.getElementById('prev-testimonial');
    const nextBtn = document.getElementById('next-testimonial');
    let currentSlide = 0;
    let autoPlayInterval;
    
    if (slides.length === 0) return;
    
    const showSlide = (index) => {
        slides.forEach(slide => slide.classList.remove('active'));
        
        currentSlide = (index + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
    };
    
    const nextSlide = () => showSlide(currentSlide + 1);
    const prevSlide = () => showSlide(currentSlide - 1);
    
    // Auto-rotación cada 6 segundos
    const startAutoPlay = () => {
        autoPlayInterval = setInterval(nextSlide, 6000);
    };
    
    const stopAutoPlay = () => {
        clearInterval(autoPlayInterval);
    };
    
    // Eventos de botones
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            stopAutoPlay();
            nextSlide();
            startAutoPlay();
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            stopAutoPlay();
            prevSlide();
            startAutoPlay();
        });
    }
    
    // Inicializar carrusel
    showSlide(0);
    startAutoPlay();
}

/* ==========================================================================
   VALIDACIÓN Y ANIMACIÓN DEL FORMULARIO DE CONTACTO
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Evitar recarga real de página
        
        // Validación simple
        const name = document.getElementById('form-name').value.trim();
        const email = document.getElementById('form-email').value.trim();
        const phone = document.getElementById('form-phone').value.trim();
        const message = document.getElementById('form-message').value.trim();
        
        if (!name || !email || !message) {
            alert('Por favor, complete todos los campos obligatorios.');
            return;
        }
        
        // Animación visual de éxito
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
        
        setTimeout(() => {
            // Transformar la tarjeta a estado de éxito
            const contactCard = document.querySelector('.contact-card');
            contactCard.style.transition = 'all 0.5s ease';
            contactCard.style.transform = 'scale(0.95)';
            contactCard.style.opacity = '0';
            
            setTimeout(() => {
                contactCard.innerHTML = `
                    <div style="text-align: center; padding: 40px 20px; animation: fadeIn 0.5s ease forwards;">
                        <div style="font-size: 3.5rem; color: #d4af37; margin-bottom: 20px;">✓</div>
                        <h3 class="serif-font" style="font-size: 1.8rem; margin-bottom: 12px; color: #ffffff;">¡Consulta Solicitada!</h3>
                        <p style="color: #94a3b8; font-weight: 300; font-size: 1rem; margin-bottom: 24px;">
                            Gracias, <strong>${name}</strong>. Mónica Deumal o un miembro experto del despacho revisará tu mensaje y se pondrá en contacto contigo en las próximas 24 horas.
                        </p>
                        <button class="btn btn-secondary" onclick="location.reload()" style="padding: 10px 20px; font-size: 0.85rem;">Solicitar otra consulta</button>
                    </div>
                `;
                contactCard.style.transform = 'scale(1)';
                contactCard.style.opacity = '1';
            }, 500);
        }, 1500);
    });
}
