'use strict';

// MÉTODOS DEL CARRUSEL DE CURSOS DESTACADOS
window.sliderMethods = {
    // =========================================================
    // NAVEGACIÓN DIRECTA ENTRE SLIDES
    // =========================================================
    goToSlide(index) {
        const total = this.featuredCursos.length;
        if (!total) return;
        if (index < 0) index = total - 1;
        if (index >= total) index = 0;
        this.currentSlide = index;
        this.resetAutoSlide();
    },

    nextSlide() {
        this.goToSlide(this.currentSlide + 1);
    },

    prevSlide() {
        this.goToSlide(this.currentSlide - 1);
    },

    // =========================================================
    // AUTOPLAY DEL CARRUSEL
    // =========================================================
    startAutoSlide() {
        if (this.currentView !== 'home') return;
        if (!this.featuredCursos.length) return;
        if (this.slideInterval) return;

        this.slideInterval = setInterval(() => {
            const total = this.featuredCursos.length;
            if (!total) return;
            this.currentSlide = (this.currentSlide + 1) % total;
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

    // =========================================================
    // CLASE CSS DE CADA SLIDE (ESTADO VISUAL)
    // =========================================================
    getSlideClass(index) {
        const totalSlides = this.featuredCursos.length;

        if (totalSlides <= 1) return 'active-slide';
        const prevIndex = (this.currentSlide - 1 + totalSlides) % totalSlides;
        const nextIndex = (this.currentSlide + 1) % totalSlides;

        if (index === this.currentSlide) return 'active-slide';
        if (index === prevIndex) return 'prev-slide';
        if (index === nextIndex) return 'next-slide';
        return 'hidden-slide';
    },

    // =========================================================
    // SOPORTE TÁCTIL (SWIPE CON DETECCIÓN DE TAP)
    // =========================================================
    initTouchSlider() {
        const track = document.querySelector('.carousel-track');
        if (!track) return;

        let startX = 0;
        let startY = 0;
        let deltaX = 0;
        let deltaY = 0;
        let isTouching = false;
        let hasMoved = false;

        const SWIPE_THRESHOLD = 50;
        const TAP_TOLERANCE = 10;

        track.addEventListener('touchstart', (e) => {
            if (e.touches.length !== 1) return;

            this.stopAutoSlide();

            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            deltaX = 0;
            deltaY = 0;
            hasMoved = false;
            isTouching = true;
        }, { passive: true });

        track.addEventListener('touchmove', (e) => {
            if (!isTouching) return;

            deltaX = e.touches[0].clientX - startX;
            deltaY = e.touches[0].clientY - startY;

            if (Math.abs(deltaX) > TAP_TOLERANCE || Math.abs(deltaY) > TAP_TOLERANCE) {
                hasMoved = true;
            }
        }, { passive: true });

        track.addEventListener('touchend', () => {
            if (!isTouching) return;

            if (hasMoved && Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > SWIPE_THRESHOLD) {
                if (deltaX < 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }

            isTouching = false;
            this.startAutoSlide();
        });
    },
};
