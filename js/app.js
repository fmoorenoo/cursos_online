'use strict';

// Punto de entrada de la aplicación Vue
const { createApp } = Vue;

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
            searchQuery: ''
        };
    },

    computed: {
        filteredCursos() {
            if (!this.searchQuery) return this.cursos;
            const query = this.searchQuery.toLowerCase();
            return this.cursos.filter(curso => 
                curso.titulo.toLowerCase().includes(query)
            );
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
            this.showUserMenu = false;
            this.isMobileMenuOpen = false;
        },

        selectedLang(newLang) {
            localStorage.setItem('selectedLang', newLang);
        }
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