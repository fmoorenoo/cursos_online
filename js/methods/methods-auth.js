'use strict';

// Métodos de autenticación y sesión
window.authMethods = {
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
            iban: '',
            password: '',
            password2: ''
        };
    },

    async submitAuth() {
        // Modo registro
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
        this.showMessage('info', this.t.messages.logout, 3000);
    },

    toggleUserMenu() {
        this.showUserMenu = !this.showUserMenu;
    },
};