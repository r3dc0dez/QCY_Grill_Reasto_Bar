// Made by: @mkl.08 (Discord) | @pomcodes | 2024 
AOS.init({
    duration: 1000,
    offset: 120,
    once: false,
    mirror: true,
    anchorPlacement: 'center-bottom',
    easing: 'ease-out-cubic'
});

const statsNumbers = document.querySelectorAll('.stat-number');
statsNumbers.forEach(stat => {
    const finalValue = parseInt(stat.textContent);
    animateValue(stat, 0, finalValue, 2500);
});

function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easeProgress = easeOutCubic(progress);
        const current = Math.floor(easeProgress * (end - start) + start);
        element.textContent = current + '+';
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
}

const navbar = document.querySelector('.nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    
    if (currentScroll > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0)';
        navbar.style.boxShadow = 'none';
        navbar.style.backdropFilter = 'none';
    }

    if (currentScroll > lastScroll && currentScroll > 300) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    lastScroll = currentScroll;
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / 1000, 1);
            const easeProgress = easeOutCubic(progress);
            window.scrollTo(0, startPosition + distance * easeProgress);
            if (progress < 1) {
                requestAnimationFrame(animation);
            }
        }
        requestAnimationFrame(animation);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.style.opacity = '0';
                img.onload = () => {
                    img.style.transition = 'opacity 0.5s ease-in-out';
                    img.style.opacity = '1';
                };
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });

    images.forEach(img => imageObserver.observe(img));
});

const specialtyCards = document.querySelectorAll('.specialty-card');
specialtyCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-15px) scale(1.02)';
        const icon = card.querySelector('.specialty-icon');
        if (icon) {
            icon.style.transform = 'scale(1.1) rotate(5deg)';
        }
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
        const icon = card.querySelector('.specialty-icon');
        if (icon) {
            icon.style.transform = 'scale(1) rotate(0)';
        }
    });
});

const teamMembers = document.querySelectorAll('.team-member');
teamMembers.forEach(member => {
    member.addEventListener('mouseenter', () => {
        member.style.transform = 'translateY(-10px) scale(1.02)';
        member.style.boxShadow = '0 15px 30px rgba(0,0,0,0.15)';
    });
    
    member.addEventListener('mouseleave', () => {
        member.style.transform = 'translateY(0) scale(1)';
        member.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
    });
});

window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.3;
        if (section.classList.contains('parallax-bg')) {
            section.style.backgroundPosition = `center ${rate}px`;
        }
    });
});

const experienceCards = document.querySelectorAll('.experience-card');
const experienceObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.2
});

experienceCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    experienceObserver.observe(card);
});
