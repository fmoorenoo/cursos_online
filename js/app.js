'use strict';

// Punto de entrada de la aplicación Vue
const { createApp } = Vue;
const CourseCard = {
    template: '#tpl-course-card',
    props: {
        curso: { type: Object, required: true }
    },
    methods: {
        handleImageError(event) {
            if (!event.target.dataset.fallback) {
                event.target.dataset.fallback = 'true';
                event.target.src = 'assets/course_image_error.png';
            }
        }
    }
};

createApp({
    data() {
        // Obtenemos todas las paletas de palettes.js
        const palettes = window.PALETTES || {};

        // Aquí van datos que van cambiando y se reflejan en la interfaz
        return {
            // IDIOMA / INTERNACIONALIZACIÓN (i18n)
            selectedLang: 'es',
            translations: window.I18N || {},
            // HEADER / NAVEGACIÓN
            isMobileMenuOpen: false,
            showPaletteSelector: false,
            showCourseTypeSelector: false,
            showUserMenu: false,
            // PALETAS DE COLORES (UI)
            selectedPalette: 'minimalista-azul',
            availablePalettes: palettes,
            paletteKeys: Object.keys(palettes),
            // AUTENTICACIÓN / SESIÓN DE USUARIO
            showAuthModal: false,
            authMode: 'login',
            isLoggedIn: false,
            sessionUser: null,
            auth: {
                dni: '',
                nombre: '',
                email: '',
                telefono: '',
                iban: '',
                password: '',
                password2: ''
            },
            // VISTA ACTUAL (HOME / CART)
            currentView: 'home',
            // CARRUSEL DE CURSOS DESTACADOS
            currentSlide: 0,
            slideInterval: null,
            // DATOS DE CURSOS
            cursos: [],
            selectedCourse: null,
            // BÚSQUEDA, FILTROS Y PAGINACIÓN (CATÁLOGO)
            searchQuery: '',
            showFilters: false,
            filters: {
                tipo: [],
                soloCertificado: false,
                precioMax: null
            },
            currentPage: 1,
            pageSize: 6,
            // CARRITO DE COMPRA
            cartItems: [],
            // MENSAJES DE FEEDBACK (TOAST / INFO)
            message: {
                show: false,
                type: 'info',
                text: '',
                timeoutId: null,
                goToCart: false
            },
            // ABOUT / CONTACTO
            aboutForm: {
                email: '',
                message: ''
            },
            aboutStats: {
                courses: 0,
                users: 0
            },
            aboutStatsAnimated: false
        };
    },

    // Aquí se calculan propiedades a partir de data(), se recalculan solo cuando estas cambian
    computed: {
        // =========================================================
        // HEADER / NAVEGACIÓN
        // =========================================================
        hasCartItems() {
            return this.cartItems.length > 0;
        },

        availableTipos() {
            const tipos = new Set(this.cursos.map(c => c.tipo));
            return Array.from(tipos).sort();
        },

        visibleCourseTypesLabel() {
            const count = this.filteredCursos.length;
            if (!this.filters.tipo || this.filters.tipo.length === 0) {
                return `${this.t.course.showingAllTypes} (${count})`;
            }
            const names = this.filters.tipo.map(tipo =>
                this.t.course['type' + tipo]
            );
            return `${this.t.course.showingTypes.replace('{types}', names.join(', '))} (${count})`;
        },

        // =========================================================
        // CARRUSEL DE CURSOS DESTACADOS
        // =========================================================

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

        trackStyle() {
            return {
                transform: `translateX(-${this.currentSlide * 100}%)`
            };
        },

        // =========================================================
        // CATÁLOGO / FILTROS / PAGINACIÓN
        // =========================================================
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

        // =========================================================
        // CARRITO
        // =========================================================
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

        // =========================================================
        // LOGIN / REGISTRO
        // =========================================================
        isLoginFormValid() {
            return this.validateEmail(this.auth.email) && this.validatePassword(this.auth.password);
        },

        isRegisterFormValid() {
            return this.validateDNI(this.auth.dni)
                && this.validateNombre(this.auth.nombre)
                && this.validateEmail(this.auth.email)
                && this.validateTelefono(this.auth.telefono)
                && this.validateIBAN(this.auth.iban)
                && this.validatePassword(this.auth.password)
                && this.validatePassword2(this.auth.password, this.auth.password2);
        },

        // =========================================================
        // IDIOMA / PALETAS
        // =========================================================
        t() {
            return this.translations?.[this.selectedLang]
                || this.translations?.es
                || {};
        },

        currentPaletteName() {
            const palette = this.availablePalettes[this.selectedPalette];
            if (!palette) return '';

            const key = palette.nameKey.split('.').pop();
            return this.t.palette[key];
        },
    },

    // Aquí van todas las acciones de la app (eventos de usuario o llamadas internas)
    methods: {
        // Importamos los métodos de las diferentes secciones (js/methods/*)
        ...window.sliderMethods,
        ...window.authMethods,
        ...window.cartMethods,
        ...window.uiMethods,
        ...window.validationMethods,
    },

    components: {
        'course-card': CourseCard
    },

    // Aquí se observan cambios en datos concretos y ejecuta código como reacción a esos cambios
    watch: {
        // UI / Scroll
        showAuthModal: 'updateBodyScroll',
        isMobileMenuOpen: 'updateBodyScroll',

        // Vista principal
        currentView(newView) {
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

        // Idioma
        selectedLang(newLang) {
            localStorage.setItem('selectedLang', newLang);
        },

        // Catálogo
        searchQuery() {
            this.currentPage = 1;
        },

        filters: {
            deep: true,
            handler() {
                this.currentPage = 1;
            }
        }
    },

    // Aquí va el código que se ejecuta una sola vez cuando el componente carga
    mounted: async function () {
        // CARGA INICIAL DE DATOS (BACKEND / STORAGE)
        await this.cargarCursos();
        this.loadCartItems();
        this.syncCartAvailability();

        // RESTAURAR ESTADO DE SESIÓN (USUARIO, VISTA, IDIOMA)
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

        // PALETA DE COLORES (PREFERENCIA DE USUARIO)
        const savedPalette = localStorage.getItem('selectedPalette');
        if (savedPalette && this.availablePalettes[savedPalette]) {
            this.selectedPalette = savedPalette;
        }
        this.applyPalette();


        // ESTADO INICIAL DE UI
        document.body.classList.remove('no-scroll');


        // CARRUSEL (SOLO SI ESTAMOS EN HOME)
        this.$nextTick(() => {
            if (this.currentView === 'home') this.startAutoSlide();
        });

        // ESTADÍSTICAS ABOUT (VALORES INICIALES)
        this.$nextTick(() => {
            setTimeout(() => {
                if (!this.aboutStatsAnimated) {
                    this.aboutStats.courses = this.cursos.length;
                    this.aboutStats.users = 1250;
                    this.aboutStatsAnimated = true;
                }
            }, 1200);
        });

        // CIERRE AUTOMÁTICO DE MENÚS AL CLICAR FUERA
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

        // OBSERVER: ANIMACIÓN DE ESTADÍSTICAS (ABOUT)
        this.$nextTick(() => {
            const el = this.$refs.aboutStatsBlock;
            if (!el) return;

            const observer = new IntersectionObserver(
                (entries) => {
                    const entry = entries[0];
                    if (entry && entry.isIntersecting) {
                        this.startAboutStatsAnimation();
                        observer.disconnect();
                    }
                },
                {
                    threshold: 0.6
                }
            );
            observer.observe(el);
            this._aboutObserver = observer;
        });
    },

    // Aquí se hace limpieza de algunos valores antes de destruir el componente
    beforeUnmount() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
            this.slideInterval = null;
        }

        if (this._aboutObserver) {
            this._aboutObserver.disconnect();
            this._aboutObserver = null;
        }
    }
}).mount('#app');