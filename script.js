// --- CONFIGURATION ---
// IMPORTANT: Replace this number with your actual WhatsApp phone number.
// Format: Include country code, without '+' or leading zeros. (e.g., 1234567890 if US, or 919876543210 if India)
const WHATSAPP_NUMBER = "8789626386"; // <-- Paste your WhatsApp number here
// ---------------------

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // 2. Setup Modals
    setupModal();

    // 3. Setup WhatsApp Buttons Global
    setupWhatsAppButtons();

    // 4. View Toggles (Grid vs List on files page)
    setupViewToggles();
});

function setupModal() {
    const modal = document.getElementById('file-details-modal');
    const closeBtn = document.getElementById('close-modal-btn');
    const openBtns = document.querySelectorAll('.open-modal-btn');

    if (!modal) return;

    openBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            // Find the closest file-card to get data, or use the button itself if data is on it
            const parentCard = btn.closest('.file-card');
            if (!parentCard) return;

            const title = parentCard.getAttribute('data-title') || 'Unknown File';
            const type = parentCard.getAttribute('data-type') || 'Unknown Type';
            const size = parentCard.getAttribute('data-size') || '-- MB';
            const price = parentCard.getAttribute('data-price') || 'Free';
            const desc = parentCard.getAttribute('data-desc') || 'No description available.';
            const image = parentCard.getAttribute('data-image') || 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=300&fit=crop';

            // Populate Modal
            document.getElementById('modal-title').textContent = title;
            document.getElementById('modal-type').textContent = `Type: ${type}`;
            document.getElementById('modal-size').textContent = `Size: ${size}`;
            document.getElementById('modal-desc').textContent = desc;
            document.getElementById('modal-image').src = image;

            // Handle Pricing block inside modal
            const priceBlock = document.getElementById('modal-price-block');
            const priceText = document.getElementById('modal-price');
            const modalWaBtn = document.getElementById('modal-wa-btn');
            const modalDownloadBtn = document.getElementById('modal-download-btn');

            if (price.toLowerCase() === 'free') {
                priceBlock.classList.add('hidden');
                modalDownloadBtn.classList.remove('hidden');
                modalWaBtn.classList.add('hidden');
            } else {
                priceBlock.classList.remove('hidden');
                priceText.textContent = price;
                modalDownloadBtn.classList.add('hidden');
                modalWaBtn.classList.remove('hidden');

                // Set the modal Whatsapp Button link dynamically
                setupWhatsAppLink(modalWaBtn, title, price);
            }

            // Show Modal with animation
            modal.classList.remove('hidden');
            modal.classList.add('flex');

            // Micro-delay for transition
            setTimeout(() => {
                const modalContent = modal.querySelector('.modal-transition');
                modalContent.classList.remove('scale-95', 'opacity-0');
                modalContent.classList.add('scale-100', 'opacity-100');
            }, 10);
        });
    });

    const closeModal = () => {
        const modalContent = modal.querySelector('.modal-transition');
        modalContent.classList.remove('scale-100', 'opacity-100');
        modalContent.classList.add('scale-95', 'opacity-0');

        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }, 300);
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

function setupWhatsAppButtons() {
    // 1. Static links (nav bar, footer)
    const waLinks = document.querySelectorAll('.whatsapp-link');
    waLinks.forEach(link => {
        const predefinedMessage = link.getAttribute('data-message') || "Hello, I'm visiting your website and have an inquiry.";
        link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(predefinedMessage)}`;
    });

    // 2. Dynamic card buttons on home/files grid (if any direct buttons exist)
    const cardWaBtns = document.querySelectorAll('.card-wa-btn');
    cardWaBtns.forEach(btn => {
        const parentCard = btn.closest('.file-card');
        if (parentCard) {
            const title = parentCard.getAttribute('data-title');
            const price = parentCard.getAttribute('data-price');
            setupWhatsAppLink(btn, title, price);
        }
    });
}

function setupWhatsAppLink(element, title, price) {
    if (!element) return;
    const action = (price && price.toLowerCase().includes('month')) ? 'renting' : 'buying';
    const message = `Hi! I am interested in ${action} *${title}* listed for ${price}. How can I proceed to payment?`;
    element.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function setupViewToggles() {
    const gridBtn = document.getElementById('view-grid');
    const listBtn = document.getElementById('view-list');
    const container = document.getElementById('files-container');

    if (!gridBtn || !listBtn || !container) return;

    gridBtn.addEventListener('click', () => {
        gridBtn.classList.add('text-deep-blue', 'bg-blue-50');
        gridBtn.classList.remove('text-gray-400');
        listBtn.classList.add('text-gray-400');
        listBtn.classList.remove('text-deep-blue', 'bg-blue-50');

        container.classList.remove('flex', 'flex-col', 'space-y-4');
        container.classList.add('grid', 'grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3', 'gap-6');

        container.querySelectorAll('.file-card').forEach(card => {
            card.classList.remove('flex-row');
            card.classList.add('flex-col');
            card.querySelector('.card-img-wrapper').classList.remove('w-48');
            card.querySelector('.card-img-wrapper').classList.add('w-full', 'h-48');
            card.querySelector('.card-content').classList.remove('flex-1');
        });
    });

    listBtn.addEventListener('click', () => {
        listBtn.classList.add('text-deep-blue', 'bg-blue-50');
        listBtn.classList.remove('text-gray-400');
        gridBtn.classList.add('text-gray-400');
        gridBtn.classList.remove('text-deep-blue', 'bg-blue-50');

        container.classList.remove('grid', 'grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3', 'gap-6');
        container.classList.add('flex', 'flex-col', 'space-y-4');

        container.querySelectorAll('.file-card').forEach(card => {
            card.classList.remove('flex-col');
            card.classList.add('flex-row');
            card.querySelector('.card-img-wrapper').classList.remove('w-full', 'h-48');
            card.querySelector('.card-img-wrapper').classList.add('w-48');
            card.querySelector('.card-content').classList.add('flex-1');
        });
    });
}
