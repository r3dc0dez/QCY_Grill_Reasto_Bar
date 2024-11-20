// Made by: @mkl.08 (Discord)
document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;
    AOS.init({
        duration: 800,
        once: true,
        offset: 100
    });

    initSlider();
});

function navigateToPage(fullPath, cleanPath) {
    fetch(fullPath)
        .then(response => {
            if (!response.ok) {
                window.location.href = '/404.html';
                return;
            }
            window.history.pushState(null, '', cleanPath);
            window.location.href = fullPath;
        })
        .catch(() => {
            window.location.href = '/404.html';
        });
}

function initSlider() {
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
        setInterval(nextSlide, 10);
    }
}

const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

window.addEventListener('scroll', () => {
    const nav = document.querySelector('.nav');
    if (window.scrollY > 100) {
        nav.style.background = 'rgba(47, 53, 66, 0.98)';
        nav.style.padding = '0.8rem 5%';
    } else {
        nav.style.background = 'rgba(47, 53, 66, 0.95)';
        nav.style.padding = '1rem 5%';
    }
});

document.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG' || e.target.tagName === 'SCRIPT') {
        console.error('Resource not found:', e.target.src);
        if (e.target.tagName === 'IMG') {
            e.target.src = '/images/placeholder.jpg';
        }
    }
}, true);
function initNavScroll() {
    const nav = document.querySelector('.nav');
    const hero = document.querySelector('.hero-slider');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > hero.offsetHeight - 100) {
            nav.style.background = 'rgba(47, 53, 66, 0.98)';
        } else {
            nav.style.background = 'rgba(47, 53, 66, 0.2)';
        }
    });
}

function initAutoSlider() {
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    
    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }
    
    setInterval(nextSlide, 4000);
}

document.addEventListener('DOMContentLoaded', () => {
    initNavScroll();
    initAutoSlider();
});

function URLenchanter() {
    const url = window.location.href;
    let newUrl = url;
    newUrl = newUrl.replace('http://', 'https://');
    if (newUrl.endsWith('.html')) {
        newUrl = newUrl.slice(0, -5); 
    } else {
        const pathParts = newUrl.split('/');
        const lastPart = pathParts[pathParts.length - 1];
        
        if (lastPart && !lastPart.includes('.')) {
            newUrl = newUrl + '.html';
            newUrl = newUrl.slice(0, -5);
        }
    }

    if (newUrl !== url) {
        window.location.href = newUrl;
    }
}