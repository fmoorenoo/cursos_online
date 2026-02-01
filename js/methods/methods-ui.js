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
        this.showCourseTypeSelector = false;
        this.showUserMenu = false;
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
                tipo: Number(curso.tipo),
                certificado: curso.certificado == 1,
                idioma: curso.idioma
            }));
        } catch (error) {
            console.error('Error cargando cursos:', error);
        }
    },

    showMessage(type, text, duration = 3000, goToCart = false) {
        if (this.message.timeoutId) {
            clearTimeout(this.message.timeoutId);
        }

        this.message.type = type;
        this.message.text = text;
        this.message.goToCart = goToCart;
        this.message.show = true;

        this.message.timeoutId = setTimeout(() => {
            this.message.show = false;
            this.message.timeoutId = null;
            this.message.goToCart = false;
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

    toggleCourseTypeSelector() {
        this.showCourseTypeSelector = !this.showCourseTypeSelector;
        this.showPaletteSelector = false;
        this.showUserMenu = false;
    },

    selectCourseType(tipo) {
        this.selectedCourse = null;
        this.searchQuery = '';
        this.filters.soloCertificado = false;
        this.filters.precioMax = null;

        if (tipo === null) {
            this.filters.tipo = [];
            this.showMessage('info', this.t.course.allCoursesMessage || 'Mostrando todos los cursos');
        } else {
            this.filters.tipo = [tipo];
            this.showMessage('info', this.t.course.showingTypeMessage?.replace('{type}', this.t.course['type' + tipo])
                || `Mostrando cursos de ${this.t.course['type' + tipo]}`
            );
        }

        this.showCourseTypeSelector = false;
        this.currentView = 'home';

        this.$nextTick(() => {
            this.scrollTo('catalog');
        });
    },

    resetFilters() {
        this.filters.tipo = [];
        this.filters.soloCertificado = false;
        this.filters.precioMax = null;
        this.currentPage = 1;
        this.showFilters = false;

        this.showMessage('info', this.t.course.filtersReset || 'Filtros restablecidos');
    },

    handleImageError(event) {
        if (!event.target.dataset.fallback) {
            event.target.dataset.fallback = 'true';
            event.target.src = 'assets/course_image_error.png';
        }
    },

    animateStat(key, target, duration = 1500) {
        const startTime = performance.now();

        const step = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            this.aboutStats[key] = Math.floor(progress * target);

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                this.aboutStats[key] = target;
            }
        };

        requestAnimationFrame(step);
    },

    startAboutStatsAnimation() {
        if (this.aboutStatsAnimated) return;

        this.aboutStatsAnimated = true;

        this.animateStat('courses', this.cursos.length);
        this.animateStat('users', 1250);
    },

    getCourseTypeIcon(tipo) {
        const icons = {
            1: 'fas fa-laptop-code',
            2: 'fas fa-chalkboard',
            3: 'fas fa-video'
        };

        return icons[tipo] || 'fas fa-book';
    }
};
