/* ==========================================================================
   Ea Súp Smart Hub - Interactive Client Logic & Search Filter
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initSearchFilter();
    initMobileNav();
    initCardToasts();
    initModalHandlers();
});

/**
 * Live Search Filter functionality
 */
function initSearchFilter() {
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    const searchActionBtn = document.getElementById('searchActionBtn');
    const serviceCards = document.querySelectorAll('.service-card');
    
    if (!searchInput) return;

    function handleSearch() {
        const query = searchInput.value.trim().toLowerCase();
        
        // Show or hide clear button
        if (query.length > 0) {
            clearSearchBtn.style.display = 'flex';
        } else {
            clearSearchBtn.style.display = 'none';
        }

        let matchCount = 0;

        serviceCards.forEach(card => {
            const title = card.getAttribute('data-title') || '';
            const cardText = card.querySelector('.card-title')?.textContent.toLowerCase() || '';

            if (title.includes(query) || cardText.includes(query)) {
                card.classList.remove('hidden');
                matchCount++;
            } else {
                card.classList.add('hidden');
            }
        });

        // Optional feedback if zero matches
        const cardsGrid = document.getElementById('cardsGrid');
        let noMatchMsg = document.getElementById('noMatchMessage');

        if (matchCount === 0) {
            if (!noMatchMsg) {
                noMatchMsg = document.createElement('div');
                noMatchMsg.id = 'noMatchMessage';
                noMatchMsg.className = 'no-match-message';
                noMatchMsg.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; background: #ffffff; border-radius: 16px; box-shadow: var(--shadow-soft);">
                        <i class="fa-solid fa-magnifying-glass-minus" style="font-size: 2.5rem; color: #94a3b8; margin-bottom: 12px;"></i>
                        <h4 style="font-size: 1.2rem; color: #334155; margin-bottom: 6px;">Không tìm thấy dịch vụ tương ứng</h4>
                        <p style="color: #64748b; font-size: 0.95rem;">Vui lòng thử từ khóa khác như "phản ánh", "dịch vụ công", "bản đồ", "dữ liệu"...</p>
                    </div>
                `;
                cardsGrid.appendChild(noMatchMsg);
            }
        } else {
            if (noMatchMsg) {
                noMatchMsg.remove();
            }
        }
    }

    // Input events
    searchInput.addEventListener('input', handleSearch);

    clearSearchBtn?.addEventListener('click', () => {
        searchInput.value = '';
        handleSearch();
        searchInput.focus();
    });

    searchActionBtn?.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query === '') {
            // Scroll smoothly to cards grid
            document.querySelector('.grid-section')?.scrollIntoView({ behavior: 'smooth' });
        } else {
            handleSearch();
            document.querySelector('.grid-section')?.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

/**
 * Mobile Navigation Toggle
 */
function initMobileNav() {
    const mobileToggleBtn = document.getElementById('mobileToggleBtn');
    const navMenu = document.querySelector('.nav-menu');

    mobileToggleBtn?.addEventListener('click', () => {
        navMenu?.classList.toggle('mobile-open');
    });
}

/**
 * Toast Notifications on External Link Clicks
 */
function initCardToasts() {
    const cards = document.querySelectorAll('.service-card[target="_blank"]');
    
    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            const title = card.querySelector('.card-title')?.textContent || 'Dịch vụ';
            showToast(`Đang chuyển hướng tới: ${title}`);
        });
    });
}

function showToast(message) {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${message}</span>`;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

/**
 * Modal Dialog Logic for "Thông tin Ea Súp"
 */
function openEasupModal() {
    const modal = document.getElementById('easupModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeEasupModal(event, force = false) {
    const modal = document.getElementById('easupModal');
    if (!modal) return;

    if (force || event.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function initModalHandlers() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeEasupModal(null, true);
        }
    });
}
