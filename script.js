document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. NAVEGACIÓN DINÁMICA SINGLE PAGE
    // ==========================================
    const heroCta = document.getElementById('hero-cta');
    const navProdLink = document.getElementById('nav-prod-link');
    const productsSection = document.getElementById('productos');

    function smoothScroll(e) {
        e.preventDefault();
        productsSection.scrollIntoView({ behavior: 'smooth' });
    }

    if(heroCta) heroCta.addEventListener('click', smoothScroll);
    if(navProdLink) navProdLink.addEventListener('click', smoothScroll);


    // ==========================================
    // 2. SISTEMA DE CARRITO DE COMPRAS EN TIEMPE REAL
    // ==========================================
    let cart = [];

    const cartSidebar = document.getElementById('cart-sidebar');
    const openCartBtn = document.getElementById('open-cart');
    const closeCartBtn = document.getElementById('close-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCounter = document.getElementById('cart-counter');
    const cartTotalAmount = document.getElementById('cart-total-amount');
    const addCartButtons = document.querySelectorAll('.btn-add-cart');

    // Despliegue Sidebar
    openCartBtn.addEventListener('click', () => cartSidebar.classList.add('open'));
    closeCartBtn.addEventListener('click', () => cartSidebar.classList.remove('open'));

    // Escucha de clicks para agregar productos
    addCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            const name = e.target.getAttribute('data-name');
            const price = parseFloat(e.target.getAttribute('data-price'));

            addProductToCart(id, name, price);
            cartSidebar.classList.add('open'); // Efecto interactivo: Abre la bolsa automáticamente
        });
    });

    function addProductToCart(id, name, price) {
        const productExist = cart.find(item => item.id === id);

        if(productExist) {
            // Requisito cumplido: si se presiona 2 o más veces incrementa la cantidad y acumula el total
            productExist.quantity += 1;
        } else {
            cart.push({ id, name, price, quantity: 1 });
        }
        renderCartUI();
    }

    function renderCartUI() {
        cartItemsContainer.innerHTML = '';

        if(cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="cart-empty-text">No has añadido piezas a tu selección.</p>';
            cartCounter.textContent = '0';
            cartTotalAmount.textContent = '$0';
            return;
        }

        let totalQuantity = 0;
        let grandTotal = 0;

        cart.forEach(item => {
            totalQuantity += item.quantity;
            const itemCost = item.price * item.quantity;
            grandTotal += itemCost;

            const cartRow = document.createElement('div');
            cartRow.classList.add('cart-item');
            cartRow.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.quantity} x $${item.price.toLocaleString('es-CO')}</p>
                </div>
                <div class="cart-item-subtotal">
                    $${itemCost.toLocaleString('es-CO')}
                </div>
            `;
            cartItemsContainer.appendChild(cartRow);
        });

        cartCounter.textContent = totalQuantity;
        cartTotalAmount.textContent = `$${grandTotal.toLocaleString('es-CO')}`;
    }


    // ==========================================
    // 3. ARQUITECTURA DE MODALES INTERACTIVOS MULTIPLES
    // ==========================================
    const modalOverlay = document.getElementById('modal-container');
    const footerModalButtons = document.querySelectorAll('.footer-link');
    const navAboutBtn = document.getElementById('nav-about-btn');
    const allModalCards = document.querySelectorAll('.modal-card');
    const closeModalButtons = document.querySelectorAll('.close-modal');

    // Función para abrir un modal específico
    function openSpecificModal(modalId) {
        // Apagar cualquier modal activo previamente
        allModalCards.forEach(card => card.classList.remove('active-card'));
        
        const targetCard = document.getElementById(modalId);
        if(targetCard) {
            modalOverlay.classList.add('active');
            targetCard.classList.add('active-card');
        }
    }

    // Eventos del Footer
    footerModalButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetModalId = btn.getAttribute('data-modal');
            openSpecificModal(targetModalId);
        });
    });

    // Evento desde el Menú Superior ("¿Qué es MJ Brand?")
    if(navAboutBtn) {
        navAboutBtn.addEventListener('click', () => {
            openSpecificModal('modal-about');
        });
    }

    // Cerrar Modales
    closeModalButtons.forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            modalOverlay.classList.remove('active');
        });
    });

    // Cerrar si hace clic fuera del contenido del modal
    modalOverlay.addEventListener('click', (e) => {
        if(e.target === modalOverlay) {
            modalOverlay.classList.remove('active');
        }
    });

    // Botón Checkout
    document.getElementById('checkout-action').addEventListener('click', () => {
        if(cart.length > 0) {
            alert('Procesando su solicitud de alta costura. Conectando con pasarela segura...');
        } else {
            alert('Su bolsa de compras está vacía.');
        }
    });
});