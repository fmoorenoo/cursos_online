'use strict';

// Punto de entrada de la aplicación Vue
const { createApp } = Vue;
const CourseCard = {
    template: '#tpl-course-card',
    props: {
        curso: { type: Object, required: true }
    }
};

createApp({
    data() {
        // Obtenemos todas las paletas de palettes.js
        const palettes = window.PALETTES || {};

        // Aquí van datos que van cambiando y se reflejan en la interfaz
        return {
            selectedLang: 'es',
            translations: window.I18N || {},
            currentSlide: 0,
            slideInterval: null,
            selectedPalette: 'minimalista-azul',
            cursos: [],
            showPaletteSelector: false,
            availablePalettes: palettes,
            paletteKeys: Object.keys(palettes),
            showAuthModal: false,
            authMode: 'login',
            auth: {
                dni: '',
                nombre: '',
                email: '',
                telefono: '',
                password: '',
                password2: ''
            },
            currentView: 'home',
            isLoggedIn: false,
            sessionUser: null,
            showUserMenu: false,
            cartItems: [],
            isMobileMenuOpen: false,
            message: {
                show: false,
                type: 'info',
                text: '',
                timeoutId: null
            },
            selectedCourse: null,
            searchQuery: '',
            showFilters: false,
            filters: {
                tipo: [],
                soloCertificado: false,
                precioMax: null
            },
            showCourseTypeSelector: false,
            currentPage: 1,
            pageSize: 6,
            aboutForm: {
                email: '',
                message: ''
            },
        };
    },

    computed: {
        hasCartItems() {
            return this.cartItems.length > 0;
        },

        featuredCursos() {
            if (!this.cursos.length) return [];
            const MAX = 6;
            const byType = {};
            this.cursos.forEach(curso => {
                if (!byType[curso.tipo]) {
                    byType[curso.tipo] = [];
                }
                byType[curso.tipo].push(curso);
            });

            const result = [];

            Object.keys(byType).forEach(tipo => {
                if (result.length < MAX) {
                    result.push(byType[tipo][0]);
                }
            });

            if (result.length < MAX) {
                const restantes = this.cursos.filter(c => !result.includes(c));
                for (const curso of restantes) {
                    if (result.length >= MAX) break;
                    result.push(curso);
                }
            }

            return result;
        },

        filteredCursos() {
            let result = this.cursos;
            // Búsqueda por texto
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                result = result.filter(c =>
                    c.titulo.toLowerCase().includes(query)
                );
            }
            // Filtro por tipo
            if (this.filters.tipo.length > 0) {
                result = result.filter(c =>
                    this.filters.tipo.includes(c.tipo)
                );
            }
            // Solo con certificado
            if (this.filters.soloCertificado) {
                result = result.filter(c => c.certificado);
            }
            // Precio máximo
            if (this.filters.precioMax !== null && this.filters.precioMax !== undefined) {
                result = result.filter(c => {
                    const precio = parseFloat(c.precio.replace('€', ''));
                    return precio <= this.filters.precioMax;
                });
            }

            return result;
        },

        paginatedCursos() {
            const start = (this.currentPage - 1) * this.pageSize;
            return this.filteredCursos.slice(start, start + this.pageSize);
        },

        totalPages() {
            return Math.ceil(this.filteredCursos.length / this.pageSize) || 1;
        },

        // Aquí se calculan propiedades a partir de data(), se recalculan solo cuando estas cambian
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
        },

        isLoginFormValid() {
            return this.validateEmail(this.auth.email) && this.validatePassword(this.auth.password);
        },

        isRegisterFormValid() {
            return this.validateDNI(this.auth.dni)
                && this.validateNombre(this.auth.nombre)
                && this.validateEmail(this.auth.email)
                && this.validateTelefono(this.auth.telefono)
                && this.validatePassword(this.auth.password)
                && this.validatePassword2(this.auth.password, this.auth.password2);
        },

        cartTotal() {
            if (!this.cartItems || !Array.isArray(this.cartItems)) return 0;
            const total = this.cartItems.reduce((total, item) => {
                if (!item || !item.precio) return total;
                const priceStr = String(item.precio).replace('€', '').trim();
                const price = parseFloat(priceStr);
                return total + (isNaN(price) ? 0 : price);
            }, 0);
            return total.toFixed(2);
        },

        allItemsAvailable() {
            if (!this.cartItems || !Array.isArray(this.cartItems)) return false;
            return this.cartItems.every(item => item && item.disponible);
        },

        availableTipos() {
            const tipos = new Set(this.cursos.map(c => c.tipo));
            return Array.from(tipos).sort();
        },

        visibleCourseTypesLabel() {
            if (!this.filters.tipo || this.filters.tipo.length === 0) {
                return this.t.course.showingAllTypes;
            }

            const names = this.filters.tipo.map(tipo =>
                this.t.course['type' + tipo]
            );

            return this.t.course.showingTypes.replace('{types}', names.join(', '));
        }
    },

    methods: {
        // Aquí van todas las acciones de la app (eventos de usuario o llamadas internas)
        // Importamos los métodos de las diferentes secciones (js/methods/*)
        ...window.sliderMethods,
        ...window.authMethods,
        ...window.cartMethods,
        ...window.uiMethods,
        ...window.validationMethods
    },

    components: {
        'course-card': CourseCard
    },

    watch: {
        // Aquí se observan cambios en datos concretos y ejecuta código como reacción a esos cambios
        currentView(newView) {
            // Guardar vista actual en sessionStorage
            sessionStorage.setItem('currentView', newView);

            if (newView === 'home') {
                setTimeout(() => {
                    this.startAutoSlide();
                }, 100);
            } else {
                this.stopAutoSlide();
            }

            if (newView === 'cart') {
                this.searchQuery = '';
                this.filters.tipo = [];
                this.filters.soloCertificado = false;
                this.filters.precioMax = null;
            }

            this.showUserMenu = false;
            this.isMobileMenuOpen = false;
        },

        selectedLang(newLang) {
            localStorage.setItem('selectedLang', newLang);
        },

        searchQuery() {
            this.currentPage = 1;
        },

        filters: {
            deep: true,
            handler() {
                this.currentPage = 1;
            }
        },
    },

    mounted: async function () {
        // Aquí va el código que se ejecuta una sola vez cuando el componente carga
        await this.cargarCursos();
        this.loadCartItems();
        this.syncCartAvailability();

        const savedUser = sessionStorage.getItem('sessionUser');
        if (savedUser) {
            this.sessionUser = JSON.parse(savedUser);
            this.isLoggedIn = true;
        }

        const savedView = sessionStorage.getItem('currentView');
        if (savedView) {
            this.currentView = savedView;
        }

        const savedLang = localStorage.getItem('selectedLang');
        if (savedLang) this.selectedLang = savedLang;

        const savedPalette = localStorage.getItem('selectedPalette');
        if (savedPalette && this.availablePalettes[savedPalette]) {
            this.selectedPalette = savedPalette;
        }
        this.applyPalette();

        // ===== Probar paleta de colores durante desarrollo =====
        // localStorage.removeItem('selectedPalette');

        this.$nextTick(() => {
            if (this.currentView === 'home') this.startAutoSlide();
        });

        document.addEventListener('click', (event) => {
            // Cerrar menú hamburguesa al clicar fuera
            const headerNav = document.querySelector('.header-nav');
            const hamburgerBtn = document.querySelector('.hamburger-btn');

            if (
                this.isMobileMenuOpen &&
                headerNav &&
                hamburgerBtn &&
                !headerNav.contains(event.target) &&
                !hamburgerBtn.contains(event.target)
            ) {
                this.isMobileMenuOpen = false;
            }

            /* Selector de paleta de colores */
            const paletteSelector = document.querySelector('.palette-selector');
            const paletteToggle = document.querySelector('.palette-toggle-btn');

            if (
                this.showPaletteSelector &&
                paletteSelector &&
                paletteToggle &&
                !paletteSelector.contains(event.target) &&
                !paletteToggle.contains(event.target)
            ) {
                this.showPaletteSelector = false;
            }

            /* ===== USER MENU ===== */
            const userDropdown = document.querySelector('.user-dropdown-like');
            const userToggle = document.querySelector('.user-name');

            if (
                this.showUserMenu &&
                userDropdown &&
                userToggle &&
                !userDropdown.contains(event.target) &&
                !userToggle.contains(event.target)
            ) {
                this.showUserMenu = false;
            }

            /* ===== COURSE TYPE SELECTOR ===== */
            const courseSelector = document.querySelector('.course-type-selector');
            const courseToggle = document.querySelector('.course-type-toggle-btn');

            if (
                this.showCourseTypeSelector &&
                courseSelector &&
                courseToggle &&
                !courseSelector.contains(event.target) &&
                !courseToggle.contains(event.target)
            ) {
                this.showCourseTypeSelector = false;
            }

            /* ===== FILTERS PANEL ===== */
            const filtersPanel = document.querySelector('.filters-panel');
            const filterBtn = document.querySelector('.filter-btn');

            if (
                this.showFilters &&
                filtersPanel &&
                filterBtn &&
                !filtersPanel.contains(event.target) &&
                !filterBtn.contains(event.target)
            ) {
                this.showFilters = false;
            }
        });
    },

    beforeUnmount() {
        // Aquí se hace limpieza de algunos valores antes de destruir el componente
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
            this.slideInterval = null;
        }
    }
}).mount('#app');