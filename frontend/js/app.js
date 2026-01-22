// app.js
const { createApp } = Vue;

// OBTENER LAS PALETAS DE LA VARIABLE GLOBAL
const palettes = window.PALETTES || {};
const paletteKeys = Object.keys(palettes);

createApp({
    data() {
        return {
            selectedLang: 'es',
            translations: window.I18N || {},
            currentSlide: 0,
            slideInterval: null,
            selectedPalette: 'minimalista-azul',
            cursos: [],
            showPaletteSelector: false,
            availablePalettes: palettes,
            paletteKeys: paletteKeys
        };
    },
    computed: {
        t() {
            return this.translations?.[this.selectedLang]
                || this.translations?.es
                || {};
        },

        trackStyle() {
            return {
                transform: `translateX(-${this.currentSlide * 100}%)`
            };
        },

        currentPaletteName() {
            const palette = this.availablePalettes[this.selectedPalette];
            if (!palette) return '';

            const key = palette.nameKey.split('.').pop();
            return this.t.palette[key];
        }

    },

    methods: {
        goToSlide(index) {
            if (!this.cursos.length) return;
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
            if (!this.cursos.length) return;
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

        getPaletteColor(paletteKey, colorName) {
            return this.availablePalettes[paletteKey]?.colors[colorName] || '#000000';
        },

        getPaletteName(key) {
            const palette = this.availablePalettes?.[key];
            if (!palette) return '—';

            const nameKey = palette.nameKey;
            if (!nameKey || typeof nameKey !== 'string') {
                console.warn(`Paleta sin nameKey: ${key}`);
                return key;
            }

            const shortKey = nameKey.split('.').pop();
            const translated = this.t?.palette?.[shortKey];

            if (!translated) {
                console.warn(`Traducción faltante para: ${nameKey}`);
                return shortKey;
            }

            return translated;
        },

        async cargarCursos() {
            try {
                const res = await fetch('../backend/getCursos.php');
                const data = await res.json();

                this.cursos = data.map(curso => ({
                    id: curso.id,
                    titulo: curso.nombre,
                    descripcion: curso.descripcion,
                    precio: `$${curso.precio}`,
                    duracion: `${curso.duracion} min`,
                    disponible: curso.disponible == 1,
                    imagen: curso.imagen_url
                }));
            } catch (error) {
                console.error('Error cargando cursos:', error);
            }
        }
    },

    mounted() {
        // Cargar cursos al iniciar
        this.cargarCursos();

        // Cargar paleta guardada o usar la paleta por defecto
        const savedPalette = localStorage.getItem('selectedPalette');
        if (savedPalette && this.availablePalettes[savedPalette]) {
            this.selectedPalette = savedPalette;
        }
        this.applyPalette();

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