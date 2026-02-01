'use strict';

// MÉTODOS DEL CARRITO DE COMPRA
window.cartMethods = {
    // =========================================================
    // CARGA Y GUARDADO DEL CARRITO (LOCALSTORAGE)
    // =========================================================
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

    // =========================================================
    // AÑADIR / ELIMINAR CURSOS DEL CARRITO
    // =========================================================
    addToCart(curso) {
        const alreadyInCart = this.cartItems.some(item => item.id === curso.id);

        if (alreadyInCart) {
            this.showMessage('info', this.t.messages.cartAlready, 3500, true);
            return;
        }

        this.cartItems.push({
            ...curso,
            duracion: curso.duracion || '60 min',
            disponible: curso.disponible !== undefined ? curso.disponible : true
        });

        this.saveCartItems();

        this.showMessage('success', this.t.messages.cartAdded.replace('{course}', curso.titulo), 3500, true);
    },

    removeFromCart(index) {
        const courseTitle = this.cartItems[index].titulo;
        this.showMessage('info', this.t.messages.removeFromCart.replace('{course}', courseTitle), 2500);
        this.cartItems.splice(index, 1);
        this.saveCartItems();
    },

    // =========================================================
    // SINCRONIZACIÓN DE DISPONIBILIDAD
    // =========================================================
    syncCartAvailability() {
        this.cartItems = this.cartItems.map(item => {
            const cursoActual = this.cursos.find(c => c.id === item.id);

            if (!cursoActual) {
                return {
                    ...item,
                    disponible: false
                };
            }

            return {
                ...item,
                disponible: cursoActual.disponible
            };
        });

        this.saveCartItems();
    },

    // =========================================================
    // PROCESO DE COMPRA
    // =========================================================
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

    // =========================================================
    // NAVEGACIÓN DESDE EL CARRITO
    // =========================================================
    continueShopping() {
        if (this.selectedCourse) {
            this.selectedCourse = null;
        }
        this.scrollTo('catalog');
    }
};
