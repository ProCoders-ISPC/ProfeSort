// Este archivo maneja la funcionalidad del menú hamburguesa, el toggle de modo claro/oscuro, y cualquier otro elemento interactivo de la página.

// Valida que los elementos críticos del DOM existan
function validateElements(elements) {
    const missingElements = [];
    
    for (const [name, element] of Object.entries(elements)) {
        if (!element) {
            missingElements.push(name);
        }
    }
    
    if (missingElements.length > 0) {
        console.error('Elementos no encontrados:', missingElements);
        return false;
    }
    
    return true;
}

// Actualiza el logo según el tema actual - Afecta: .header__logo img
function updateLogo(body, logo) {
    if (!logo) return;
    
    if (body.classList.contains('dark-mode')) {
        logo.src = logo.src.replace('logo-light-theme.png', 'logo-dark-theme.png');
    } else {
        logo.src = logo.src.replace('logo-dark-theme.png', 'logo-light-theme.png');
    }
}

// Inicializa el tema desde localStorage - Afecta: body
function initializeTheme(body) {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
    }
}

// Configura el toggle de tema - Afecta: #theme-toggle, body, logo
function setupThemeToggle(toggleButton, body, logo) {
    updateLogo(body, logo);
    
    toggleButton.addEventListener('click', () => {
        body.classList.toggle('dark-mode');

        const theme = body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
        
        setTimeout(() => updateLogo(body, logo), 100);
    });
}

// Configura el menú hamburguesa - Afecta: #hamburger, .header__nav
function setupHamburgerMenu(hamburger, navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('header__nav--active');
        hamburger.classList.toggle('header__hamburger--active');
    });
}

// Cierra el menú al hacer clic en enlaces - Afecta: .header__link, .btn
function setupMenuAutoClose(navMenu, hamburger) {
    const navLinks = document.querySelectorAll('.header__link, .btn');
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('header__nav--active');
            hamburger.classList.remove('header__hamburger--active');
        });
    });
}

// Inicializa el slider de proyectos - Afecta: .projectsSwiper, .projects-pagination
function initializeSwiper() {
    if (typeof Swiper === 'undefined') {
        console.warn('Librería Swiper no cargada');
        return;
    }

    const projectsSwiper = new Swiper(".projectsSwiper", {
        allowTouchMove: false,
        allowSlideNext: true,
        allowSlidePrev: true,
        
        pagination: {
            el: ".projects-pagination",
            clickable: true,
            renderBullet: function (index, className) {
                return `<span class="${className}">${index + 1}</span>`;
            },
        },
        
        breakpoints: {
            320: { allowTouchMove: false },
            768: { allowTouchMove: false }
        }
    });

    return projectsSwiper;
}

// Función principal que inicializa toda la aplicación
function initializeApp() {
    const elements = {
        hamburger: document.getElementById('hamburger'),
        navMenu: document.querySelector('.header__nav'),
        toggleButton: document.getElementById('theme-toggle'),
        body: document.body,
        logo: document.querySelector('.header__logo img')
    };

    const criticalElements = {
        hamburger: elements.hamburger,
        navMenu: elements.navMenu,
        toggleButton: elements.toggleButton
    };

    if (!validateElements(criticalElements)) {
        return;
    }

    try {
        initializeTheme(elements.body);
        setupThemeToggle(elements.toggleButton, elements.body, elements.logo);
        setupHamburgerMenu(elements.hamburger, elements.navMenu);
        setupMenuAutoClose(elements.navMenu, elements.hamburger);
        initializeSwiper();

        console.log('✅ Aplicación inicializada correctamente');
        
    } catch (error) {
        console.error('❌ Error al inicializar la aplicación:', error);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initializeApp);