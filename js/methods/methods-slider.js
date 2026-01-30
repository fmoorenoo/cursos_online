'use strict';

// Métodos relacionados con el carrusel
window.sliderMethods = {
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
};
