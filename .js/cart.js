// Made by: @mkl.08 (Discord) | @pomcodes | 2024 
class Cart {
    constructor() {
        this.items = [];
        this.webhookUrl = '';
        this.isOpen = false;
    }

    toggleCart() {
        const cartSidebar = document.querySelector('.cart-sidebar');
        this.isOpen = !this.isOpen;
        cartSidebar.style.right = this.isOpen ? '0' : '-400px';
    }

    addItem(item) {
        const existingItem = this.items.find(i => i.name === item.name);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({ ...item, quantity: 1 });
        }
        this.updateCartUI();
        this.showNotification('Item added to cart!', 'success');
    }

    updateQuantity(index, change) {
        const item = this.items[index];
        const newQuantity = item.quantity + change;
        
        if (newQuantity > 0) {
            item.quantity = newQuantity;
        } else {
            this.items.splice(index, 1);
        }
        this.updateCartUI();
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    async submitOrder() {
        if (this.items.length === 0) {
            this.showNotification('Your cart is empty!', 'error');
            return;
        }

        localStorage.setItem('cartItems', JSON.stringify(this.items));
        
        window.location.href = 'payment.html';
    }

    removeItem(index) {
        const cartItems = document.querySelectorAll('.cart-item');
        const itemToRemove = cartItems[index];
        
        itemToRemove.style.animation = 'slideOutRight 0.3s ease forwards';
        
        setTimeout(() => {
            this.items.splice(index, 1);
            this.updateCartUI();
            this.showNotification('Item removed from cart', 'success');
        }, 300);
    }

    updateCartUI() {
        const cartCount = document.querySelector('.cart-count');
        const cartItems = document.querySelector('.cart-items');
        const cartTotal = document.querySelector('.cart-total');

        if (cartCount) {
            cartCount.textContent = this.items.reduce((sum, item) => sum + item.quantity, 0);
        }
        
        if (cartItems) {
            cartItems.innerHTML = this.items.map((item, index) => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h3>${item.name}</h3>
                        <p class="cart-item-price">₱${item.price}</p>
                        <div class="quantity-controls">
                            <button onclick="cart.updateQuantity(${index}, -1)">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span>${item.quantity}</span>
                            <button onclick="cart.updateQuantity(${index}, 1)">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                    <button onclick="cart.removeItem(${index})" class="remove-btn" title="Remove item">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `).join('');
        }

        if (cartTotal) {
            const total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartTotal.textContent = `₱${total.toFixed(2)}`;
        }

        const cartEmpty = document.querySelector('.cart-empty');
        if (cartEmpty) {
            if (this.items.length === 0) {
                cartEmpty.style.display = 'block';
                cartItems.style.display = 'none';
            } else {
                cartEmpty.style.display = 'none';
                cartItems.style.display = 'block';
            }
        }
    }
}

const cart = new Cart();

function toggleCart() {
    cart.toggleCart();
}
