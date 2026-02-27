let cart = [];

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

function addToCart(productName, price) {
    const quantity = event.target.parentElement.querySelector('.quantity').value;
    const quantityNum = parseInt(quantity) || 1;
    
    for (let i = 0; i < quantityNum; i++) {
        cart.push({
            name: productName,
            price: price,
            id: Date.now() + Math.random()
        });
    }
    
    updateCart();
    showNotification(`✅ ${productName} agregado al carrito`);
}

function addFeaturedProduct(index) {
    const card = event.target.closest('.featured');
    const select = card.querySelector('.select-gramaje');
    const quantity = card.querySelector('.quantity');
    
    if (select.value === 'Selecciona un gramaje' && index < 2) {
        alert('Por favor selecciona un gramaje o tamaño');
        return;
    }
    
    let productName = '';
    let price = 0;
    
    if (index === 0) {
        productName = `Filete de Pechuga Porcionado ${select.value}gr`;
        price = parseFloat(select.value) / 50;
    } else if (index === 1) {
        productName = `Chuzos de Pollo ${select.value}gr`;
        const prices = { '100': 1.50, '150': 2.00, '200': 2.50 };
        price = prices[select.value] || 2.00;
    } else {
        productName = 'Lomito de Pechuga por lb';
        price = 4.00;
    }
    
    const quantityNum = parseInt(quantity.value) || 1;
    
    for (let i = 0; i < quantityNum; i++) {
        cart.push({
            name: productName,
            price: price,
            id: Date.now() + Math.random()
        });
    }
    
    updateCart();
    showNotification(`✅ ${productName} agregado al carrito`);
}

function updateCart() {
    const cartCount = document.getElementById('cart-count');
    cartCount.textContent = cart.length;
    renderCartItems();
}

function renderCartItems() {
    const cartItemsDiv = document.getElementById('cart-items');
    
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<div class="empty-cart"><p>Tu carrito está vacío</p></div>';
        document.getElementById('total-price').textContent = '0.00';
        return;
    }
    
    let html = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        html += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                </div>
                <button class="cart-item-delete" onclick="removeFromCart(${index})">Eliminar</button>
            </div>
        `;
        total += item.price;
    });
    
    cartItemsDiv.innerHTML = html;
    document.getElementById('total-price').textContent = total.toFixed(2);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
    showNotification('❌ Producto removido del carrito');
}

function toggleCart() {
    const modal = document.getElementById('cart-modal');
    modal.classList.toggle('show');
    if (modal.classList.contains('show')) {
        renderCartItems();
    }
}

function clearCart() {
    if (confirm('¿Estás seguro de que quieres limpiar el carrito?')) {
        cart = [];
        updateCart();
        showNotification('🗑️ Carrito limpiado');
    }
}

function checkout() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    let total = 0;
    let orderDetails = 'RESUMEN DEL PEDIDO:\n\n';
    
    cart.forEach(item => {
        orderDetails += `- ${item.name}: $${item.price.toFixed(2)}\n`;
        total += item.price;
    });
    
    orderDetails += `\nTOTAL: $${total.toFixed(2)}\n\n`;
    orderDetails += '¿Deseas confirmar este pedido?\n\n';
    orderDetails += '📞 Te contactaremos para confirmar tu pedido.\n';
    orderDetails += '📧 O envía este resumen a: info@listopollo.com';
    
    alert(orderDetails);
    
    // Aquí puedes enviar el pedido a un servidor
    sendOrder();
}

function sendOrder() {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const orderData = {
        items: cart,
        total: total,
        timestamp: new Date().toISOString()
    };
    
    console.log('Pedido enviado:', orderData);
    
    // Simular envío
    setTimeout(() => {
        alert('✅ ¡Pedido confirmado!\n\nNos pondremos en contacto pronto para confirmar los detalles.');
        cart = [];
        updateCart();
        toggleCart();
    }, 500);
}

function showNotification(message) {
    // Crear notificación flotante
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #c40000;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Agregar animaciones
const style = document.createElement('style');
style.innerHTML = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Inicializar
updateCart();
