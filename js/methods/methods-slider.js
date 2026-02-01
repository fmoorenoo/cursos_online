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
};
