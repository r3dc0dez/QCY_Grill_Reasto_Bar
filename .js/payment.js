// Made by: @mkl.08 (Discord) | @pomcodes | 2024 
class PaymentProcessor {
    constructor() {
        this.webhookUrl = 'https://discord.com/api/webhooks/1317933358679855114/qApVkHY5QC2iG3CEshOL6CGmPgKiMPeYKuQaFhCpujhB1PUyTC1ol9QD-s08HvFxOJHj';
        this.cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
        this.currentStep = 1;
        this.verificationToken = '';
        this.transactionId = '';
        this.exchangeRates = {
            PHP: 1,
            USD: 0.018,
            EUR: 0.016,
            DKK: 0.12
        };
        this.captchaWord = '';
        this.addressTimeoutId = null;
        
        this.initializeUI();
    }

    initializeUI() {
        this.displayOrderSummary();
        this.setupEventListeners();
        this.setupCurrencyConverter();
        this.setupDeliveryHandling();
        this.showSection(1);
    }

    displayOrderSummary() {
        const orderItemsContainer = document.getElementById('order-items');
        const totalAmount = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        orderItemsContainer.innerHTML = this.cartItems.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p>₱${item.price} x ${item.quantity}</p>
                    <p>Subtotal: ₱${item.price * item.quantity}</p>
                </div>
            </div>
        `).join('');

        document.getElementById('total-amount').innerHTML = `
            <h3>Total: ₱${totalAmount.toFixed(2)}</h3>
        `;
    }

    setupEventListeners() {
        const continueButton = document.getElementById('verifyEmail');
        if (continueButton) {
            continueButton.addEventListener('click', () => {
                const email = document.getElementById('email').value;
                const fullName = document.getElementById('fullName').value;
                const phone = document.getElementById('phone').value;
                const wantDelivery = document.getElementById('wantDelivery').checked;
                const address = document.getElementById('address').value;

                if (wantDelivery && !address) {
                    alert('Please enter a delivery address');
                    return;
                }

                if (!email || !fullName || !phone) {
                    alert('Please fill in all required fields (name, email, and phone)');
                    return;
                }

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    alert('Please enter a valid email address');
                    return;
                }

                const phoneRegex = /^\+?\d{5,}$/;
                if (!phoneRegex.test(phone.replace(/[\s-]/g, ''))) {
                    alert('Please enter a valid phone number');
                    return;
                }

                this.moveToStep(2);
                this.setupVerificationEvents();
            });
        }

        const currencySelect = document.getElementById('currency-select');
        if (currencySelect) {
            currencySelect.addEventListener('change', (e) => this.convertCurrency(e.target.value));
        }

        const cancelButton = document.getElementById('cancelOrder');
        if (cancelButton) {
            cancelButton.addEventListener('click', () => this.cancelOrder());
        }
    }

    cancelOrder() {
        if (confirm('Are you sure you want to cancel your order?')) {
            localStorage.removeItem('cartItems');
            window.location.href = 'menu.html';
        }
    }

    setupCurrencyConverter() {
        this.updateCurrencyDisplay('PHP');
    }

    convertCurrency(currency) {
        const totalInPHP = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const convertedAmount = totalInPHP * this.exchangeRates[currency];
        const currencySymbols = { PHP: '₱', USD: '$', EUR: '€', DKK: 'kr.' };
        
        document.getElementById('total-amount').innerHTML = `
            <h3>Total: ${currencySymbols[currency]}${convertedAmount.toFixed(2)}</h3>
        `;
    }

    setupDeliveryHandling() {
        const wantDeliveryCheckbox = document.getElementById('wantDelivery');
        const addressSection = document.getElementById('addressSection');
        const addressInput = document.getElementById('address');
        const suggestionsDiv = document.getElementById('suggestions');

        if (wantDeliveryCheckbox && addressSection) {
            wantDeliveryCheckbox.addEventListener('change', () => {
                addressSection.classList.toggle('hidden', !wantDeliveryCheckbox.checked);
                if (!wantDeliveryCheckbox.checked) {
                    addressInput.value = '';
                    suggestionsDiv.innerHTML = '';
                }
            });
        }

        if (addressInput && suggestionsDiv) {
            addressInput.addEventListener('input', () => {
                clearTimeout(this.addressTimeoutId);
                const query = addressInput.value.trim();
                
                if (query.length < 3) {
                    suggestionsDiv.innerHTML = '';
                    return;
                }

                this.addressTimeoutId = setTimeout(() => {
                    this.fetchAddressSuggestions(query);
                }, 500);
            });

            document.addEventListener('click', (e) => {
                if (!addressSection.contains(e.target)) {
                    suggestionsDiv.innerHTML = '';
                }
            });
        }
    }

    async fetchAddressSuggestions(query) {
        const suggestionsDiv = document.getElementById('suggestions');
        const addressInput = document.getElementById('address');

        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`);
            const data = await response.json();
            
            suggestionsDiv.innerHTML = '';
            data.forEach(place => {
                const div = document.createElement('div');
                div.className = 'suggestion-item';
                div.textContent = place.display_name;
                div.addEventListener('click', () => {
                    addressInput.value = place.display_name;
                    suggestionsDiv.innerHTML = '';
                });
                suggestionsDiv.appendChild(div);
            });
        } catch (error) {
            console.error('Error fetching address suggestions:', error);
        }
    }

    generateTransactionId() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let id = '';
        for (let i = 0; i < 16; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    async verifyAndContinue() {
        const email = document.getElementById('email').value;
        const fullName = document.getElementById('fullName').value;
        const phone = document.getElementById('phone').value;
        const wantDelivery = document.getElementById('wantDelivery').checked;
        const address = document.getElementById('address').value;

        if (wantDelivery && !address) {
            alert('Please enter a delivery address');
            return;
        }

        if (!email || !fullName || !phone) {
            alert('Please fill in all required fields (name, email, and phone)');
            return;
        }

        const recaptchaResponse = grecaptcha.getResponse();
        
        if (!recaptchaResponse) {
            alert('Please complete the reCAPTCHA');
            return;
        }

        this.moveToStep(2);
        
        setTimeout(() => {
            this.completeOrder();
        }, 1500);
    }

    async completeOrder() {
        this.transactionId = this.generateTransactionId();
        
        const orderDetails = {
            embeds: [{
                title: "🛍️ New Order Received!",
                color: 0xFF4757,
                fields: [
                    {
                        name: "Customer Information",
                        value: `Name: ${document.getElementById('fullName').value}\nEmail: ${document.getElementById('email').value}\nPhone: ${document.getElementById('phone').value}\nAddress: ${document.getElementById('address').value}`,
                        inline: false
                    },
                    {
                        name: "Transaction ID",
                        value: this.transactionId,
                        inline: false
                    },
                    ...this.cartItems.map(item => ({
                        name: item.name,
                        value: `Price: ₱${item.price}\nQuantity: ${item.quantity}\nSubtotal: ₱${item.price * item.quantity}`,
                        inline: true
                    })),
                    {
                        name: "Total Amount",
                        value: `₱${this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}`,
                        inline: false
                    }
                ],
                timestamp: new Date().toISOString(),
                footer: {
                    text: "QCY Grill Resto & Bar"
                }
            }]
        };

        try {
            const response = await fetch(this.webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderDetails)
            });

            if (response.ok) {
                const cancelButton = document.getElementById('cancelOrder');
                if (cancelButton) {
                    cancelButton.style.display = 'none';
                }

                this.moveToStep(3);
                document.getElementById('transactionId').textContent = this.transactionId;
                
                this.showSuccessAnimation();
                localStorage.removeItem('cartItems');
            }
        } catch (error) {
            alert('Failed to process order. Please try again.');
        }
    }

    moveToStep(step) {
        document.querySelectorAll('.form-section').forEach(section => {
            section.classList.add('hidden');
        });
        
        const sectionToShow = document.getElementById(`section${step}`);
        if (sectionToShow) {
            sectionToShow.classList.remove('hidden');
        }
        
        document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
        document.querySelector(`#step${step}`).classList.add('active');
        
        this.currentStep = step;
    }

    showSuccessAnimation() {
        const animation = document.createElement('div');
        animation.id = 'success-animation';
        animation.innerHTML = `
            <div class="success-content">
                <div class="checkmark">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2>Order Complete!</h2>
                <p>Your transaction ID is:</p>
                <div class="transaction-display">${this.transactionId}</div>
            </div>
        `;

        document.body.appendChild(animation);
        
        setTimeout(() => {
            animation.style.opacity = '1';
        }, 100);

        setTimeout(() => {
            animation.style.opacity = '0';
            setTimeout(() => {
                animation.remove();
            }, 300);
        }, 3000);
    }

    generateCaptchaWord() {
        const words = ['SECURE', 'VERIFY', 'HUMAN', 'REAL', 'VALID', 'TRUST', 'CHECK'];
        return words[Math.floor(Math.random() * words.length)];
    }

    setupVerificationEvents() {
        const holdButton = document.getElementById('holdButton');
        const blurContainer = document.querySelector('.blur-container');
        const captchaText = document.getElementById('captchaText');
        const verifyButton = document.getElementById('verifyCaptcha');
        
        this.captchaWord = this.generateCaptchaWord();
        captchaText.textContent = this.captchaWord;

        holdButton.replaceWith(holdButton.cloneNode(true));
        const newHoldButton = document.getElementById('holdButton');

        newHoldButton.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            blurContainer.style.filter = 'blur(0)';
        });

        newHoldButton.addEventListener('mouseup', (e) => {
            e.preventDefault();
            e.stopPropagation();
            blurContainer.style.filter = 'blur(8px)';
        });

        newHoldButton.addEventListener('mouseleave', (e) => {
            e.preventDefault();
            e.stopPropagation();
            blurContainer.style.filter = 'blur(8px)';
        });

        newHoldButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            blurContainer.style.filter = 'blur(0)';
        });

        newHoldButton.addEventListener('touchend', (e) => {
            e.preventDefault();
            e.stopPropagation();
            blurContainer.style.filter = 'blur(8px)';
        });

        verifyButton.addEventListener('click', (e) => {
            e.preventDefault();
            const input = document.getElementById('captchaInput').value.toUpperCase();
            if (input === this.captchaWord) {
                this.completeOrder();
            } else {
                alert('Incorrect verification word. Please try again.');
                document.getElementById('captchaInput').value = '';
                this.captchaWord = this.generateCaptchaWord();
                captchaText.textContent = this.captchaWord;
                blurContainer.style.filter = 'blur(8px)';
            }
        });
    }

    async sendVerificationEmail() {
        const email = document.getElementById('email').value;
        const fullName = document.getElementById('fullName').value;
        const phone = document.getElementById('phone').value;
        const wantDelivery = document.getElementById('wantDelivery').checked;
        const address = document.getElementById('address').value;

        if (wantDelivery && !address) {
            alert('Please enter a delivery address');
            return;
        }

        if (!email || !fullName || !phone) {
            alert('Please fill in all required fields (name, email, and phone)');
            return;
        }

        this.moveToStep(2);
        this.setupVerificationEvents();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PaymentProcessor();
});