// app.js
const { createApp } = Vue;

// OBTENER LAS PALETAS DE LA VARIABLE GLOBAL
const palettes = window.PALETTES || {};
const paletteKeys = Object.keys(palettes);

createApp({
    data() {
        return {
            selectedLang: 'es',
            currentSlide: 0,
            slideInterval: null,
            selectedPalette: 'minimalista-azul', // Paleta por defecto
            showPaletteSelector: false,
            cursos: [
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
            ],
            // Guardamos las paletas en data para acceder fácilmente desde la plantilla
            availablePalettes: palettes,
            paletteKeys: paletteKeys
        };
    },
    
    computed: {
        trackStyle() {
            return {
                transform: `translateX(-${this.currentSlide * 100}%)`
            };
        },
        
        currentPaletteName() {
            return this.availablePalettes[this.selectedPalette]?.name || 'Minimalista Azul';
        }
    },
    
    methods: {
        goToSlide(index) {
            if (index < 0) index = this.cursos.length - 1;
            if (index >= this.cursos.length) index = 0;
            this.currentSlide = index;
            this.resetAutoSlide();
        },
        
        nextSlide() {
            this.goToSlide(this.currentSlide + 1);
        },
        
        prevSlide() {
            this.goToSlide(this.currentSlide - 1);
        },
        
        startAutoSlide() {
            this.slideInterval = setInterval(() => {
                this.nextSlide();
            }, 3500);
        },
        
        resetAutoSlide() {
            clearInterval(this.slideInterval);
            this.startAutoSlide();
        },
        
        selectCourse(curso) {
            console.log('Curso seleccionado:', curso.titulo);
            // Aquí puedes agregar lógica adicional
        },
        
        changePalette(paletteKey) {
            this.selectedPalette = paletteKey;
            this.applyPalette();
        },
        
        applyPalette() {
            const palette = this.availablePalettes[this.selectedPalette];
            if (!palette) return;
            
            const root = document.documentElement;
            
            // Aplicar todas las variables CSS
            Object.entries(palette.colors).forEach(([key, value]) => {
                root.style.setProperty(`--color-${key}`, value);
            });
            
            // Guardar en localStorage para persistencia
            localStorage.setItem('selectedPalette', this.selectedPalette);
            
            // Cerrar el selector después de elegir
            this.showPaletteSelector = false;
        },
        
        togglePaletteSelector() {
            this.showPaletteSelector = !this.showPaletteSelector;
        },
        
        // Método para obtener el color de una paleta específica (útil para vista previa)
        getPaletteColor(paletteKey, colorName) {
            return this.availablePalettes[paletteKey]?.colors[colorName] || '#000000';
        }
    },
    
    mounted() {
        // Cargar paleta guardada o usar la por defecto
        const savedPalette = localStorage.getItem('selectedPalette');
        if (savedPalette && this.availablePalettes[savedPalette]) {
            this.selectedPalette = savedPalette;
        }
        
        // Aplicar la paleta seleccionada
        this.applyPalette();
        
        // Iniciar carrusel
        this.startAutoSlide();
        
        // Pausar carrusel al pasar el mouse
        const carousel = document.querySelector('.promos-container');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => {
                clearInterval(this.slideInterval);
            });
            
            carousel.addEventListener('mouseleave', () => {
                this.startAutoSlide();
            });
        }
        
        // Cerrar selector de paletas al hacer clic fuera
        document.addEventListener('click', (event) => {
            const selector = document.querySelector('.palette-selector');
            const toggleBtn = document.querySelector('.palette-toggle-btn');
            
            if (selector && toggleBtn && 
                !selector.contains(event.target) && 
                !toggleBtn.contains(event.target)) {
                this.showPaletteSelector = false;
            }
        });
    },
    
    beforeUnmount() {
        clearInterval(this.slideInterval);
    }
}).mount('#app');