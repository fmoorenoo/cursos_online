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
            paletteKeys: paletteKeys,
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
            selectedCourse: null
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
            if (this.currentView !== 'home') return;
            if (!this.cursos.length) return;
            if (this.slideInterval) return;

            this.slideInterval = setInterval(() => {
                if (!this.cursos.length) return;
                this.currentSlide = (this.currentSlide + 1) % this.cursos.length;
            }, 3500);
        },

        stopAutoSlide() {
            if (this.slideInterval) {
                clearInterval(this.slideInterval);
                this.slideInterval = null;
            }
        },

        resetAutoSlide() {
            this.stopAutoSlide();
            this.startAutoSlide();
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

        async cargarCursos() {
            try {
                const res = await fetch('../backend/getCursos.php');
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

        openLogin() {
            this.resetAuthForm();
            this.authMode = 'login';
            this.showAuthModal = true;
            document.body.classList.add('no-scroll');
        },

        openRegister() {
            this.resetAuthForm();
            this.authMode = 'register';
            this.showAuthModal = true;
            document.body.classList.add('no-scroll');
        },

        closeAuth() {
            this.resetAuthForm();
            this.showAuthModal = false;
            document.body.classList.remove('no-scroll');
        },

        resetAuthForm() {
            this.auth = {
                dni: '',
                nombre: '',
                email: '',
                telefono: '',
                password: '',
                password2: ''
            };
        },

        async submitAuth() {
            // Modo registro
            if (this.authMode === 'register') {
                if (!this.isRegisterFormValid) return;

                try {
                    const res = await fetch('../backend/auth/register.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            dni: this.auth.dni,
                            nombre: this.auth.nombre,
                            email: this.auth.email,
                            telefono: this.auth.telefono,
                            password: this.auth.password
                        })
                    });

                    const data = await res.json();

                    if (data.success) {
                        this.showMessage('success', this.t.messages.registerSuccess, 3000);
                        this.authMode = 'login';
                        this.resetAuthForm();
                    } else {
                        this.showMessage('error', this.t.messages.genericError, 2000);
                    }

                } catch (error) {
                    this.showMessage('error', this.t.messages.genericError, 2000);
                }

                return;
            }

            // Modo login
            try {
                const res = await fetch('../backend/auth/login.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: this.auth.email,
                        password: this.auth.password
                    })
                });

                const data = await res.json();

                if (data.success) {
                    this.showMessage('success', this.t.messages.loginSuccess, 3000);

                    this.sessionUser = data.user;
                    this.isLoggedIn = true;

                    sessionStorage.setItem('sessionUser', JSON.stringify(data.user));

                    this.closeAuth();
                } else {
                    this.showMessage('error', this.t.messages.loginError, 4000);
                }


            } catch (error) {
                this.showMessage('error', this.t.messages.genericError, 2000);
            }
        },

        logout() {
            sessionStorage.removeItem('sessionUser');
            this.sessionUser = null;
            this.isLoggedIn = false;
            this.showUserMenu = false;
            this.showMessage('info', this.t.messages.logout, 300);
        },

        inputClass(field) {
            if (this.authMode === 'login') {
                return '';
            }

            const val = (this.auth?.[field] ?? '').toString();

            // Vacío => sin borde
            if (!val.length) return '';

            return this.isFieldValid(field) ? 'is-valid' : 'is-invalid';
        },

        isFieldValid(field) {
            switch (field) {
                case 'dni': return this.validateDNI(this.auth.dni);
                case 'nombre': return this.validateNombre(this.auth.nombre);
                case 'email': return this.validateEmail(this.auth.email);
                case 'telefono': return this.validateTelefono(this.auth.telefono);
                case 'password': return this.validatePassword(this.auth.password);
                case 'password2': return this.validatePassword2(this.auth.password, this.auth.password2);
                default: return false;
            }
        },

        // ====== VALIDACIONES CON REGEX ======
        validateDNI(dniRaw) {
            const dni = (dniRaw || '').trim().toUpperCase();
            const re = /^\d{8}[A-Z]$/;
            if (!re.test(dni)) return false;

            const num = parseInt(dni.slice(0, 8), 10);
            const letra = dni.slice(8);
            const letras = 'TRWAGMYFPDXBNJZSQVHLCKE';
            const letraCorrecta = letras[num % 23];
            return letra === letraCorrecta;
        },

        validateNombre(nombreRaw) {
            const nombre = (nombreRaw || '').trim();
            // 1 o más palabras, solo letras (incluye tildes/ñ) y espacios entre palabras
            const re = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?:\s+[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)*$/;
            return re.test(nombre);
        },

        validateEmail(emailRaw) {
            const email = (emailRaw || '').trim();
            // Regex práctica (sin espacios, con @ y dominio)
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
            return re.test(email);
        },

        validateTelefono(telRaw) {
            // Permitimos +34 opcional y quitamos espacios
            const tel = (telRaw || '').replace(/\s+/g, '');
            const re = /^(?:\+34)?(?:6|7)\d{8}$/;
            return re.test(tel);
        },

        validatePassword(passRaw) {
            const pass = (passRaw || '');
            return pass.length >= 4;
        },

        validatePassword2(pass1, pass2) {
            return this.validatePassword(pass2) && (pass1 === pass2);
        },

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

        toggleUserMenu() {
            this.showUserMenu = !this.showUserMenu;
        },

        getSlideClass(index) {
            const totalSlides = this.cursos.length;

            if (totalSlides <= 1) return 'active-slide';

            const prevIndex = (this.currentSlide - 1 + totalSlides) % totalSlides;
            const nextIndex = (this.currentSlide + 1) % totalSlides;

            if (index === this.currentSlide) {
                return 'active-slide';
            } else if (index === prevIndex) {
                return 'prev-slide';
            } else if (index === nextIndex) {
                return 'next-slide';
            } else {
                return 'hidden-slide';
            }
        },

        loadCartItems() {
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
                try {
                    this.cartItems = JSON.parse(savedCart);
                } catch (e) {
                    console.error('Error cargando carrito:', e);
                    this.cartItems = [];
                }
            }
        },

        saveCartItems() {
            localStorage.setItem('cart', JSON.stringify(this.cartItems));
        },

        removeFromCart(index) {
            const courseTitle = this.cartItems[index].titulo;
            this.showMessage('info', this.t.messages.removeFromCart.replace('{course}', courseTitle), 2000);
            this.cartItems.splice(index, 1);
            this.saveCartItems();
        },

        checkout() {
            if (!this.isLoggedIn) {
                alert(this.t.cart.loginRequired);
                return;
            }

            if (!this.allItemsAvailable) {
                this.showMessage('error', this.t.messages.cartUnavailable, 3000);

                return;
            }

            this.showMessage('success', this.t.messages.paymentSuccess.replace('{total}', this.cartTotal), 3000);

            this.cartItems = [];
            this.saveCartItems();
        },

        addToCart(curso) {
            const alreadyInCart = this.cartItems.some(item => item.id === curso.id);

            if (alreadyInCart) {
                this.showMessage('info', this.t.messages.cartAlready, 2500);
                return;
            }

            this.cartItems.push({
                ...curso,
                duracion: curso.duracion || '60 min',
                disponible: curso.disponible !== undefined ? curso.disponible : true
            });

            this.saveCartItems();

            this.showMessage('success', this.t.messages.cartAdded.replace('{course}', curso.titulo), 2500);
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
        }
    },

    watch: {
        currentView(newView) {
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
        await this.cargarCursos();

        this.loadCartItems();

        const savedLang = localStorage.getItem('selectedLang');
        if (savedLang) this.selectedLang = savedLang;

        const savedUser = sessionStorage.getItem('sessionUser');
        if (savedUser) {
            this.sessionUser = JSON.parse(savedUser);
            this.isLoggedIn = true;
        }


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
            /* ===== PALETTE SELECTOR ===== */
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
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
            this.slideInterval = null;
        }
    }
}).mount('#app');