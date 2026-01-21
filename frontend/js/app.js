// Selector de idiomas
document.addEventListener('DOMContentLoaded', function () {
    const langOptions = document.querySelectorAll('.lang-option');

    // Español seleccionado por defecto
    const es = document.getElementById('es');
    const en = document.getElementById('en');

    // Configurar estado inicial
    es.classList.add('active');
    en.classList.remove('active');

    // Añadir event listeners
    langOptions.forEach(option => {
        option.addEventListener('click', function () {
            langOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            const selectedLang = this.getAttribute('data-lang');
            console.log('Idioma seleccionado:', selectedLang);
        });
    });

    // Inicializar el carrusel de cursos
    initCarousel();
});

// Datos de cursos con imágenes
const cursos = [
    {
        id: 1,
        titulo: "Desarrollo Web Full Stack",
        descripcion: "Aprende a crear aplicaciones web completas desde el frontend hasta el backend.",
        precio: "$299",
        duracion: "4800 min",
        disponible: true,
        imagen: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=400&fit=crop"
    },
    {
        id: 2,
        titulo: "Machine Learning con Python",
        descripcion: "Domina los fundamentos del machine learning y crea modelos predictivos.",
        precio: "$349",
        duracion: "3600 min",
        disponible: true,
        imagen: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=400&fit=crop"
    },
    {
        id: 3,
        titulo: "Diseño UI/UX Avanzado",
        descripcion: "Crea experiencias de usuario excepcionales.",
        precio: "$249",
        duracion: "2400 min",
        disponible: false,
        imagen: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=400&fit=crop"
    },
    {
        id: 4,
        titulo: "DevOps y CI/CD",
        descripcion: "Implementa pipelines de integración y despliegue continuo.",
        precio: "$399",
        duracion: "4200 min",
        disponible: true,
        imagen: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=400&fit=crop"
    },
    {
        id: 5,
        titulo: "Ciberseguridad para Desarrolladores",
        descripcion: "Protege tus aplicaciones de vulnerabilidades comunes.",
        precio: "$279",
        duracion: "3000 min",
        disponible: true,
        imagen: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=400&fit=crop"
    },
    {
        id: 6,
        titulo: "React Native: Apps Móviles",
        descripcion: "Desarrolla aplicaciones móviles para iOS y Android con React Native.",
        precio: "$229",
        duracion: "2800 min",
        disponible: true,
        imagen: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=400&fit=crop"
    }
];

// Variables del carrusel
let currentSlide = 0;
let slideInterval;

// Función para inicializar el carrusel
function initCarousel() {
    const carouselTrack = document.querySelector('.carousel-track');
    const carouselDots = document.querySelector('.carousel-dots');

    // Crear las diapositivas
    cursos.forEach((curso, index) => {
        // Crear slide
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';

        // Crear tarjeta del curso con imagen a la izquierda
        const cardHTML = `
        <div class="promo-card">
            <div class="course-content">
                <div class="course-image">
                    <img src="${curso.imagen}" alt="${curso.titulo}">
                </div>
                <div class="course-info">
                    <h3>${curso.titulo}</h3>
                    <p>${curso.descripcion}</p>
                    <span class="price">${curso.precio}</span>
                    <div class="course-meta">
                        <span class="duration">${curso.duracion} (${Math.round(parseInt(curso.duracion) / 60)} horas)</span>
                        <div class="availability ${curso.disponible ? 'available' : 'unavailable'}">
                            ${curso.disponible ? 'Disponible' : 'Agotado'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

        slide.innerHTML = cardHTML;
        carouselTrack.appendChild(slide);

        // Crear punto de navegación
        const dot = document.createElement('div');
        dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
        dot.setAttribute('data-index', index);
        dot.addEventListener('click', () => goToSlide(index));
        carouselDots.appendChild(dot);
    });

    // Inicializar controles
    document.querySelector('.prev-btn').addEventListener('click', () => goToSlide(currentSlide - 1));
    document.querySelector('.next-btn').addEventListener('click', () => goToSlide(currentSlide + 1));

    // Iniciar carrusel automático (cambia cada 5 segundos)
    startAutoSlide();
}

// Ir a slide específico
function goToSlide(index) {
    // Ajustar índice si se sale de los límites
    if (index < 0) index = cursos.length - 1;
    if (index >= cursos.length) index = 0;

    // Actualizar slide actual
    currentSlide = index;

    // Mover el track
    const carouselTrack = document.querySelector('.carousel-track');
    carouselTrack.style.transform = `translateX(-${index * 100}%)`;

    // Actualizar puntos de navegación
    document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });

    // Reiniciar temporizador
    resetAutoSlide();
}

// Iniciar navegación automática
function startAutoSlide() {
    slideInterval = setInterval(() => {
        goToSlide(currentSlide + 1);
    }, 5000);
}

// Reiniciar navegación automática
function resetAutoSlide() {
    clearInterval(slideInterval);
    startAutoSlide();
}