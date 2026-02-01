'use strict';

// MÉTODOS DE VALIDACIÓN DE FORMULARIOS
window.validationMethods = {
    // =========================================================
    // CLASE CSS DE INPUTS (FEEDBACK VISUAL)
    // =========================================================
    inputClass(field) {
        if (this.authMode === 'login') {
            return '';
        }

        const val = (this.auth?.[field] ?? '').toString();

        // Vacío => sin borde
        if (!val.length) return '';

        return this.isFieldValid(field) ? 'is-valid' : 'is-invalid';
    },

    // =========================================================
    // VALIDACIÓN GENÉRICA POR CAMPO
    // =========================================================
    isFieldValid(field) {
        switch (field) {
            case 'dni': return this.validateDNI(this.auth.dni);
            case 'nombre': return this.validateNombre(this.auth.nombre);
            case 'email': return this.validateEmail(this.auth.email);
            case 'telefono': return this.validateTelefono(this.auth.telefono);
            case 'iban': return this.validateIBAN(this.auth.iban);
            case 'password': return this.validatePassword(this.auth.password);
            case 'password2': return this.validatePassword2(this.auth.password, this.auth.password2);
            default: return false;
        }
    },

    // =========================================================
    // VALIDACIONES ESPECÍFICAS (LOGIN / REGISTRO)
    // =========================================================
    // ===== DNI =====
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

    getDNICorrectLetter(dniRaw) {
        const dni = (dniRaw || '').trim();

        // Solo cuando hay exactamente 8 dígitos
        if (!/^\d{8}$/.test(dni)) return null;

        const letras = 'TRWAGMYFPDXBNJZSQVHLCKE';
        const num = parseInt(dni, 10);
        return letras[num % 23];
    },

    // ===== NOMBRE =====
    validateNombre(nombreRaw) {
        const nombre = (nombreRaw || '').trim();
        // 1 o más palabras, solo letras (incluye tildes/ñ) y espacios entre palabras
        const re = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?:\s+[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)*$/;
        return re.test(nombre);
    },

    // ===== EMAIL =====
    validateEmail(emailRaw) {
        const email = (emailRaw || '').trim();
        // Regex práctica (sin espacios, con @ y dominio)
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        return re.test(email);
    },

    // ===== TELÉFONO =====
    validateTelefono(telRaw) {
        // Permitimos +34 opcional y quitamos espacios
        const tel = (telRaw || '').replace(/\s+/g, '');
        const re = /^(?:\+34)?(?:6|7)\d{8}$/;
        return re.test(tel);
    },

    // ===== IBAN =====
    validateIBAN(ibanRaw) {
        const iban = (ibanRaw || '')
            .toUpperCase()
            .replace(/\s+/g, '');

        // IBAN genérico UE (ES incluido)
        const re = /^[A-Z]{2}[0-9]{22}$/;
        return re.test(iban);
    },

    // ===== CONTRASEÑAS =====
    validatePassword(passRaw) {
        const pass = (passRaw || '');
        return pass.length >= 4;
    },

    validatePassword2(pass1, pass2) {
        return this.validatePassword(pass2) && (pass1 === pass2);
    },

    // =========================================================
    // FORMULARIO ABOUT / CONTACTO
    // =========================================================
    submitAboutForm() {
        if (!this.aboutForm.email || !this.aboutForm.message) {
            this.showMessage('warning', this.t.messages.genericError);
            return;
        }
        this.showMessage('success', this.t.about.contactSuccess);
        this.aboutForm.email = '';
        this.aboutForm.message = '';
    },
};
