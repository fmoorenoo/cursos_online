'use strict';

// Métodos de interfaz y navegación
window.uiMethods = {
    goTo(view) {
        this.currentView = view;

        if (view === 'cart') {
            this.$nextTick(() => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    },

    scrollTo(id) {
        // Si no estamos en home, cambiamos primero
        if (this.currentView !== 'home') {
            this.currentView = 'home';

            this.$nextTick(() => {
                const el = document.getElementById(id);
                if (!el) return;

                el.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        } else {
            const el = document.getElementById(id);
            if (!el) return;

            el.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    },

    changePalette(paletteKey) {
        this.selectedPalette = paletteKey;
        this.applyPalette();
    },

    applyPalette() {
        const palette = this.availablePalettes[this.selectedPalette];
        if (!palette) return;

        const root = document.documentElement;

        Object.entries(palette.colors).forEach(([key, value]) => {
            const cssVar = key.replace(/[A-Z]/g, m => '-' + m.toLowerCase());
            root.style.setProperty(`--${cssVar}`, value);
        });

        // Guardar en localStorage
        localStorage.setItem('selectedPalette', this.selectedPalette);
        this.showPaletteSelector = false;
    },

    togglePaletteSelector() {
        this.showPaletteSelector = !this.showPaletteSelector;
    },

    getPaletteColor(paletteKey, role) {
        const palette = this.availablePalettes?.[paletteKey];
        if (!palette) return '#f5f5f5';

        const map = {
            primary: 'colorPrimary',
            secondary: 'colorSecondary',
            background: 'surfacePage'
        };

        return palette.colors[map[role]] || '#f5f5f5';
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

    selectCourse(curso) {
        this.selectedCourse = curso;
        this.$nextTick(() => {
            const el = document.getElementById('catalog');
            if (el) {
                el.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }
        });
    },

    async cargarCursos() {
        try {
            const res = await fetch('backend/getCursos.php');
            const data = await res.json();

            this.cursos = data.map(curso => ({
                id: curso.id,
                titulo: curso.nombre,
                descripcion: curso.descripcion,
                precio: `${curso.precio}€`,
                duracion: `${curso.duracion} min`,
                disponible: curso.disponible == 1,
                imagen: curso.imagen_url,
                nivel: Number(curso.nivel),
                certificado: curso.certificado == 1,
                idioma: curso.idioma
            }));
        } catch (error) {
            console.error('Error cargando cursos:', error);
        }
    },

    showMessage(type, text, duration = 3000) {
        if (this.message.timeoutId) {
            clearTimeout(this.message.timeoutId);
        }

        this.message.type = type;
        this.message.text = text;
        this.message.show = true;

        this.message.timeoutId = setTimeout(() => {
            this.message.show = false;
            this.message.timeoutId = null;
        }, duration);
    },

    getMessageIconClass(type) {
        switch (type) {
            case 'success': return 'fas fa-check-circle';
            case 'info': return 'fas fa-info-circle';
            case 'warning': return 'fas fa-exclamation-triangle';
            case 'error': return 'fas fa-times-circle';
            default: return '';
        }
    },

    closeMobileMenu() {
        this.isMobileMenuOpen = false;
    },
};
