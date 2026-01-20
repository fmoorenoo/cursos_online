// Selector de idiomas
    document.addEventListener('DOMContentLoaded', function() {
        const langOptions = document.querySelectorAll('.lang-option');
        
        // Español seleccionado por defecto
        const es = document.getElementById('es');
        const en = document.getElementById('en');
        
        // Configurar estado inicial
        es.classList.add('active');
        en.classList.remove('active');
        
        // Añadir event listeners
        langOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Remover clase 'active' de todos
                langOptions.forEach(opt => {
                    opt.classList.remove('active');
                });
                
                // Añadir clase 'active' al elemento clicado
                this.classList.add('active');
                
                // Aquí iría la lógica para cambiar el idioma realmente
                const selectedLang = this.getAttribute('data-lang');
                console.log('Idioma seleccionado:', selectedLang);
            });
        });
    });