'use strict';

// MÉTODOS DE AUTENTICACIÓN Y SESIÓN DE USUARIO
window.authMethods = {
    // =========================================================
    // APERTURA / CIERRE DEL MODAL DE AUTENTICACIÓN
    // =========================================================
    openLogin() {
        this.resetAuthForm();
        this.authMode = 'login';
        this.showAuthModal = true;
    },

    openRegister() {
        this.resetAuthForm();
        this.authMode = 'register';
        this.showAuthModal = true;
    },

    closeAuth() {
        this.resetAuthForm();
        this.showAuthModal = false;
    },

    // =========================================================
    // RESET DEL FORMULARIO DE AUTENTICACIÓN
    // =========================================================
    resetAuthForm() {
        this.auth = {
            dni: '',
            nombre: '',
            email: '',
            telefono: '',
            iban: '',
            password: '',
            password2: ''
        };
    },

    // =========================================================
    // ENVÍO DEL FORMULARIO (LOGIN / REGISTRO)
    // =========================================================
    async submitAuth() {
        // -----------------------------------------------------
        // REGISTRO DE USUARIO
        // -----------------------------------------------------
        if (this.authMode === 'register') {
            if (!this.isRegisterFormValid) return;

            try {
                const res = await fetch('backend/auth/register.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        dni: this.auth.dni,
                        nombre: this.auth.nombre,
                        email: this.auth.email,
                        telefono: this.auth.telefono,
                        iban: this.auth.iban,
                        password: this.auth.password
                    })
                });

                const data = await res.json();

                if (data.success) {
                    this.showMessage('success', this.t.messages.registerSuccess, 4000);
                    this.authMode = 'login';
                    this.resetAuthForm();
                } else {
                    this.showMessage('error', this.getAuthMessage(data.error), 3000);
                }

            } catch (error) {
                this.showMessage('error', this.getAuthMessage(data.error), 3000);
            }

            return;
        }

        // -----------------------------------------------------
        // LOGIN DE USUARIO
        // -----------------------------------------------------
        try {
            const res = await fetch('backend/auth/login.php', {
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
                this.showMessage('error', this.getAuthMessage(data.error), 4000);
            }


        } catch (error) {
            this.showMessage('error', this.getAuthMessage(data.error), 3000);
        }
    },

    // =========================================================
    // MENSAJES DE ERROR / TRADUCCIONES
    // =========================================================
    getAuthMessage(key) {
        return this.t.messages[key] || this.t.messages.genericError;
    },

    // =========================================================
    // SESIÓN DE USUARIO
    // =========================================================
    logout() {
        sessionStorage.removeItem('sessionUser');
        this.sessionUser = null;
        this.isLoggedIn = false;
        this.showUserMenu = false;
        this.showMessage('info', this.t.messages.logout, 3000);
    },

    toggleUserMenu() {
        this.showUserMenu = !this.showUserMenu;
    },
};