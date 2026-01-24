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
            }
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
                    precio: `$${curso.precio}`,
                    duracion: `${curso.duracion} min`,
                    disponible: curso.disponible == 1,
                    imagen: curso.imagen_url
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
            if (this.authMode === 'register') {
                if (!this.isRegisterFormValid) return;
                console.log('Registro aún no implementado');
                return;
            }

            try {
                const res = await fetch('../backend/auth/check_login.php', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        email: this.auth.email,
                        password: this.auth.password
                    })
                });

                const data = await res.json();

                if (data.success) {
                    console.log('Login correcto', data.user);
                    this.closeAuth();
                } else {
                    alert(data.message || 'Credenciales incorrectas');
                }

            } catch (error) {
                alert('Error de conexión con el servidor');
            }
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
    },

    mounted() {
        this.cargarCursos();

        const savedPalette = localStorage.getItem('selectedPalette');
        if (savedPalette && this.availablePalettes[savedPalette]) {
            this.selectedPalette = savedPalette;
        }
        this.applyPalette();

        // ===== Probar paleta de colores durante desarrollo =====
        // localStorage.removeItem('selectedPalette');

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