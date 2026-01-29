document.addEventListener("DOMContentLoaded", () => {

    // ==========================
    // FILTER PRODUCTS
    // ==========================
    window.filterProducts = function(category) {
        document.querySelectorAll(".product").forEach(product => {
            product.style.display = (category === "all" || product.classList.contains(category)) ? "block" : "none";
        });
    }

    // ==========================
    // CART STORAGE
    // ==========================
    function getCart() {
        return JSON.parse(localStorage.getItem('cart')) || [];
    }

    function saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateMiniCart();
    }

    // ==========================
    // MINI CART
    // ==========================
    const cartCountEl = document.getElementById('cart-count');
    const cartDropdown = document.getElementById('cart-dropdown');
    const miniCartItemsEl = document.getElementById('mini-cart-items');

    function updateMiniCart() {
        const cart = getCart();

        // Update count
        if (cartCountEl) {
            cartCountEl.innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
        }

        // Update dropdown
        if (miniCartItemsEl) {
            miniCartItemsEl.innerHTML = '';
            if (cart.length === 0) {
                miniCartItemsEl.innerHTML = '<li>Panier vide</li>';
            } else {
                cart.forEach(item => {
                    miniCartItemsEl.innerHTML += `<li>${item.name} x${item.quantity} - ${item.price * item.quantity}€</li>`;
                });
            }
        }
    }

    // Toggle mini-cart dropdown
    const miniCartEl = document.querySelector('.mini-cart');
    if (miniCartEl && cartDropdown) {
        miniCartEl.addEventListener('click', () => {
            cartDropdown.style.display = cartDropdown.style.display === 'block' ? 'none' : 'block';
        });
    }

    // ==========================
    // ADD TO CART ("Louer" buttons)
    // ==========================
    function addToCart(product) {
        const cart = getCart();
        const existing = cart.find(item => item.name === product.name);
        if (existing) {
            existing.quantity += 1;
        } else {
            product.quantity = 1;
            cart.push(product);
        }
        saveCart(cart);
        alert(`${product.name} a été ajouté au panier !`);
        if (window.renderCart) renderCart(); // update cart page if present
    }

    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            const product = {
                name: btn.dataset.name,
                price: parseInt(btn.dataset.price)
            };
            addToCart(product);
        });
    });

    // ==========================
    // CART PAGE RENDERING
    // ==========================
    const cartItemsEl = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');

    window.renderCart = function() {
        if (!cartItemsEl || !cartTotalEl) return;

        const cart = getCart();
        let total = 0;
        cartItemsEl.innerHTML = '';

        if (cart.length === 0) {
            cartItemsEl.innerHTML = `<tr><td colspan="5">Votre panier est vide</td></tr>`;
        } else {
            cart.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                cartItemsEl.innerHTML += `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.price}€</td>
                        <td>
                            <input type="number" min="1" value="${item.quantity}" onchange="updateCartQuantity(${index}, this.value)">
                        </td>
                        <td>${itemTotal}€</td>
                        <td><button onclick="removeCartItem(${index})">Supprimer</button></td>
                    </tr>
                `;
            });
        }

        cartTotalEl.innerText = total + '€';
    }
    
    

    window.updateCartQuantity = function(index, qty) {
        const cart = getCart();
        cart[index].quantity = parseInt(qty);
        saveCart(cart);
        renderCart();
    }

    window.removeCartItem = function(index) {
        const cart = getCart();
        cart.splice(index, 1);
        saveCart(cart);
        renderCart();
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
    const cart = getCart();
    if (cart.length === 0) {
        alert("Votre panier est vide !");
        return;
    }

    // Clear the cart
    saveCart([]);

    // Redirect to confirmation page
    window.location.href = "confirmation.html";
});

    }
    
    // ==========================
// RENTAL DATE SYSTEM
// ==========================

const checkBtn = document.getElementById("check-availability");
const confirmBtn = document.getElementById("confirm-rental");
const messageEl = document.getElementById("availability-message");

// FAKE booked dates (simulation)
let bookedDates = [
    { start: "2026-02-10", end: "2026-02-15" },
    { start: "2026-03-01", end: "2026-03-05" }
];

function datesOverlap(start1, end1, start2, end2) {
    return new Date(start1) <= new Date(end2) && new Date(end1) >= new Date(start2);
}

if (checkBtn) {
    checkBtn.addEventListener("click", function() {
        alert("CLICK DETECTED");
        const startDate = document.getElementById("start-date").value;
        const endDate = document.getElementById("end-date").value;

        if (!startDate || !endDate) {
            messageEl.innerText = "Veuillez choisir les deux dates.";
            messageEl.style.color = "red";
            return;
        }

        let unavailable = bookedDates.some(booking =>
            datesOverlap(startDate, endDate, booking.start, booking.end)
        );

        if (unavailable) {
            messageEl.innerText = "❌ Certains articles ne sont pas disponibles pour ces dates.";
            messageEl.style.color = "red";
            confirmBtn.style.display = "none";
        } else {
            messageEl.innerText = "✅ Tous les articles sont disponibles !";
            messageEl.style.color = "green";
            confirmBtn.style.display = "inline-block";
        }
    });
}

if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
        alert("Location confirmée ! Merci 💖");
        localStorage.removeItem("cart"); // vide le panier
        location.reload();
    });
}


    // Initial render
    renderCart();
    updateMiniCart();
});
