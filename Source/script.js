/* global emailjs */
document.addEventListener('DOMContentLoaded', () => {
    // ✅ UPDATED – your real public key
    emailjs.init('5mnAW_dBWTP1l6pEV');

    /* ---------- DOM HOOKS ---------- */
    const cart = [];
    const cartItemsContainer = document.getElementById('cart-items');
    const totalAmountEl = document.getElementById('total-amount');
    const addButtons = document.querySelectorAll('.add-item');
    const removeButtons = document.querySelectorAll('.remove-item');
    const bookNowBtn = document.getElementById('book-now-btn');
    const confirmationMessage = document.getElementById('confirmation-message');
    const fullNameInput = document.getElementById('full-name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const newsletterForm = document.getElementById('newsletter-form');

    /* ---------- CART LOGIC ---------- */
    removeButtons.forEach(btn => (btn.style.display = 'none'));

    function updateCartUI() {
        cartItemsContainer.innerHTML = '';
        if (!cart.length) {
            cartItemsContainer.innerHTML =
                '<tr><td colspan="3" style="text-align:center;">No items added yet</td></tr>';
            totalAmountEl.textContent = 'Total: $0.00';
            return;
        }
        cart.forEach((item, idx) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${idx + 1}</td>
                <td>${item.service}</td>
                <td>$${item.price.toFixed(2)}</td>`;
            cartItemsContainer.appendChild(tr);
        });
        const total = cart.reduce((s, i) => s + i.price, 0);
        totalAmountEl.textContent = `Total: $${total.toFixed(2)}`;
    }

    function addItem(service, price) {
        if (cart.find(i => i.service === service))
            return alert(`${service} is already in the cart.`);
        cart.push({ service, price });
        updateCartUI();
    }
    function removeItem(service) {
        const idx = cart.findIndex(i => i.service === service);
        if (idx !== -1) cart.splice(idx, 1);
        updateCartUI();
    }

    /* ---------- ADD / REMOVE BUTTONS ---------- */
    addButtons.forEach(btn => {
        const service = btn.dataset.service;
        const price = +btn.dataset.price;
        const removeBtn = btn.parentElement.querySelector('.remove-item');

        btn.addEventListener('click', () => {
            addItem(service, price);
            btn.style.display = 'none';
            removeBtn.style.display = 'inline-block';
        });
    });
    removeButtons.forEach(btn => {
        const service = btn.dataset.service;
        const addBtn = btn.parentElement.querySelector('.add-item');
        btn.addEventListener('click', () => {
            removeItem(service);
            btn.style.display = 'none';
            addBtn.style.display = 'inline-block';
        });
    });

    /* ---------- BOOK NOW ---------- */
    bookNowBtn.addEventListener('click', async e => {
        e.preventDefault();
        if (!cart.length) return alert('Please add at least one service.');
        if (!fullNameInput.value.trim()) return alert('Enter your full name.');
        if (!emailInput.value.trim()) return alert('Enter your email.');
        if (!phoneInput.value.trim()) return alert('Enter your phone number.');

        const templateParams = {
            user_name: fullNameInput.value.trim(),
            user_email: emailInput.value.trim(),
            phone: phoneInput.value.trim(),
            service_list: cart.map(i => i.service).join(', '),
            total: cart.reduce((s, i) => s + i.price, 0).toFixed(2)
        };

        try {
            // ✅ UPDATED – real service & template IDs
            const res = await emailjs.send(
                'service_phio4r7',
                'template_2mmwktp',
                templateParams
            );
            console.log('EmailJS success:', res.status, res.text);
            confirmationMessage.style.display = 'block';

            // reset form + cart
            fullNameInput.value = '';
            emailInput.value = '';
            phoneInput.value = '';
            cart.length = 0;
            updateCartUI();
            addButtons.forEach(b => (b.style.display = 'inline-block'));
            removeButtons.forEach(b => (b.style.display = 'none'));
            setTimeout(() => (confirmationMessage.style.display = 'none'), 4000);
        } catch (err) {
            // ✅ UPDATED – clearer error in console + alert
            console.error('EmailJS error:', err);
            alert(`Send failed: ${err.text || err.message}`);
        }
    });

    /* ---------- NEWSLETTER ---------- */
    newsletterForm?.addEventListener('submit', e => {
        e.preventDefault();
        const name = newsletterForm.querySelector('input[type="text"]').value.trim();
        const email = newsletterForm.querySelector('input[type="email"]').value.trim();
        if (!name || !email) return alert('Please fill both fields.');
        alert(`Thanks ${name} for subscribing!`);
        newsletterForm.reset();
    });
});