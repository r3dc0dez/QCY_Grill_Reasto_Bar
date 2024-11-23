// Made by: @mkl.08 (Discord) | @pomcodes | 2024 
AOS.init({
    duration: 800,
    offset: 100,
    once: true
});

const contactForm = document.getElementById('contactForm');
const notification = document.getElementById('notification');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = contactForm.querySelector('.submit-btn');
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };

    const webhookBody = {
        content: 'New Contact Form Submission',
        embeds: [{
            title: 'Contact Form Details',
            color: 0xff4757,
            fields: [
                { name: 'Name', value: formData.name, inline: true },
                { name: 'Email', value: formData.email, inline: true },
                { name: 'Phone', value: formData.phone, inline: true },
                { name: 'Subject', value: formData.subject, inline: false },
                { name: 'Message', value: formData.message, inline: false }
            ],
            timestamp: new Date().toISOString()
        }]
    };

    try {
        const response = await fetch('', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(webhookBody)
        });

        if (response.ok) {
            showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
            contactForm.reset();
        } else {
            throw new Error('Failed to send message');
        }
    } catch (error) {
        showNotification('Failed to send message. Please try again later.', 'error');
    } finally {
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        submitBtn.disabled = false;
    }
});

function showNotification(message, type) {
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    setTimeout(() => notification.classList.remove('show'), 3000);
}

// Rest of the existing contact.js code remains the sameconst formGroups = document.querySelectorAll('.form-group');
formGroups.forEach(group => {
    const input = group.querySelector('input, textarea');
    if (input) {
        input.addEventListener('focus', () => {
            group.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                group.classList.remove('focused');
            }
        });
    }
});
const navbar = document.querySelector('.nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0)';
        navbar.style.boxShadow = 'none';
    }
});
const socialCards = document.querySelectorAll('.social-card');
socialCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});
const infoCards = document.querySelectorAll('.info-card');
infoCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.2}s`;
    card.classList.add('fade-in');
});

const inputs = document.querySelectorAll('input, textarea, select');
inputs.forEach(input => {
    input.addEventListener('invalid', (e) => {
        e.preventDefault();
        input.classList.add('error');
    });
    
    input.addEventListener('input', () => {
        if (input.classList.contains('error')) {
            input.classList.remove('error');
        }
    });
});
const phoneInput = document.getElementById('phone');
phoneInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 10) value = value.slice(0, 10);
    const formatted = value.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    e.target.value = formatted;
});
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
