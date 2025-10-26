// Initialize all event handlers
document.addEventListener('DOMContentLoaded', function() {
    const orderModal = new bootstrap.Modal(document.getElementById('orderModal'));
    const orderForm = document.getElementById('orderForm');
    const packageCards = document.querySelectorAll('.package-card');

    initPaymentMethodToggle();
    initCopyButtons();
    initOrderHandling(orderModal, packageCards);
    initFormValidation();
    checkOrderCompletion();
    handleAuth();
});

// Payment method toggle
function initPaymentMethodToggle() {
    const ezcashDetails = document.getElementById('ezcashDetails');
    const bankDetails = document.getElementById('bankDetails');
    const paymentMethods = document.getElementsByName('paymentMethod');

    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            if (this.value === 'ezcash') {
                ezcashDetails.style.display = 'block';
                bankDetails.style.display = 'none';
            } else {
                ezcashDetails.style.display = 'none';
                bankDetails.style.display = 'block';
            }
        });
    });
}

// Copy buttons functionality
function initCopyButtons() {
    document.querySelectorAll('[data-copy]').forEach(button => {
        button.addEventListener('click', function() {
            const textToCopy = this.getAttribute('data-copy');
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    const originalHTML = this.innerHTML;
                    this.innerHTML = '<i class="fas fa-check"></i>';
                    setTimeout(() => {
                        this.innerHTML = originalHTML;
                    }, 2000);
                })
                .catch(() => {
                    // Fallback for older browsers
                    const textarea = document.createElement('textarea');
                    textarea.value = textToCopy;
                    document.body.appendChild(textarea);
                    textarea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                    
                    const originalHTML = this.innerHTML;
                    this.innerHTML = '<i class="fas fa-check"></i>';
                    setTimeout(() => {
                        this.innerHTML = originalHTML;
                    }, 2000);
                });
        });
    });
}

// Order handling initialization
function initOrderHandling(orderModal, packageCards) {
    packageCards.forEach(card => {
        const orderBtn = card.querySelector('.btn-order');
        if (orderBtn) {
            orderBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const packageName = card.getAttribute('data-package');
                const packagePrice = card.getAttribute('data-price');

                document.getElementById('selectedPackageName').textContent = packageName;
                document.getElementById('selectedPackagePrice').textContent = 'Rs.' + packagePrice;
                document.getElementById('packageName').value = packageName;
                document.getElementById('packagePrice').value = packagePrice;

                // Generate Order ID and Date
                const orderId = 'FFSG' + Date.now().toString().slice(-8);
                const orderDate = new Date().toLocaleString();

                document.getElementById('orderId').value = orderId;
                document.getElementById('orderDate').value = orderDate;
                document.getElementById('emailSubject').value = `Order ${orderId} - Free Fire (SG) - ${packageName}`;

                orderModal.show();
            });
        }
    });
}

// Form validation and submission
function initFormValidation() {
    const form = document.getElementById('orderForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            if (!this.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
            }
            this.classList.add('was-validated');

            if (this.checkValidity()) {
                const submitBtn = this.querySelector('.btn-submit-order');
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;

                // Store order data for WhatsApp message
                const orderData = {
                    gameId: document.getElementById('gameId').value.trim(),
                    username: document.getElementById('username').value.trim(),
                    phoneNumber: document.getElementById('phoneNumber').value.trim(),
                    email: document.getElementById('email').value.trim(),
                    packageName: document.getElementById('packageName').value,
                    packagePrice: document.getElementById('packagePrice').value,
                    orderId: document.getElementById('orderId').value
                };

                sessionStorage.setItem('orderData', JSON.stringify(orderData));
            }
        });
    }
}

// Check for completed order
function checkOrderCompletion() {
    const orderData = sessionStorage.getItem('orderData');
    if (orderData) {
        const data = JSON.parse(orderData);
        sessionStorage.removeItem('orderData');

        showSuccessMessage('Order sent successfully! Check your email for confirmation.');

        const messageText = 
            `🎮 *New Order - Free Fire (SG)*\n\n` +
            `📋 *Order ID:* ${data.orderId}\n` +
            `📦 *Package:* ${data.packageName}\n` +
            `💰 *Price:* Rs.${data.packagePrice}\n\n` +
            `👤 *Customer Details:*\n` +
            `🎯 Game ID: ${data.gameId}\n` +
            `👨 Username: ${data.username}\n` +
            `📱 Phone: ${data.phoneNumber}\n` +
            `📧 Email: ${data.email}\n\n` +
            `✅ Email with payment slip sent\n\n` +
            `Please confirm and process this order. Thank you!`;

        setTimeout(() => {
            showWhatsAppModal(messageText, '94773043667');
        }, 1000);
    }
}

// Success message display
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
        position: fixed; top: 20px; right: 20px;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white; padding: 20px 25px; border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3); z-index: 99999;
    `;
    successDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
            <i class="fas fa-check-circle" style="font-size: 24px;"></i>
            <div>
                <strong style="display: block; margin-bottom: 5px;">Success!</strong>
                <span style="font-size: 14px;">${message}</span>
            </div>
        </div>
    `;
    document.body.appendChild(successDiv);
    setTimeout(() => successDiv.remove(), 5000);
}

// WhatsApp modal display
function showWhatsAppModal(messageText, whatsappNumber) {
    const modalHTML = `
        <div class="modal fade" id="whatsappModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content" style="background: #0f1729; border: 2px solid rgba(147, 51, 234, 0.3);">
                    <div class="modal-header" style="border-bottom: 1px solid rgba(147, 51, 234, 0.2);">
                        <h5 class="modal-title text-white">
                            <i class="fas fa-check-circle text-success"></i>
                            Continue to WhatsApp
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-success bg-success bg-opacity-10 border-success border-opacity-10">
                            <i class="fas fa-info-circle"></i>
                            <strong>Next Steps:</strong>
                            <ol class="mb-0 mt-2">
                                <li>Copy the order message below</li>
                                <li>Click "Open WhatsApp" button</li>
                                <li>Paste and send the message</li>
                            </ol>
                        </div>

                        <div class="bg-dark bg-opacity-50 p-3 rounded">
                            <h6 class="text-purple mb-2">Message Preview:</h6>
                            <textarea id="whatsappMessage" readonly 
                                class="form-control bg-dark text-white border-secondary"
                                style="height: 200px; font-family: monospace;"
                            >${messageText}</textarea>
                        </div>

                        <div class="d-grid gap-2 mt-3">
                            <button onclick="copyMessage()" class="btn btn-purple">
                                <i class="fas fa-copy"></i> Copy Message
                            </button>
                            <button onclick="openWhatsApp('${whatsappNumber}')" class="btn btn-success">
                                <i class="fab fa-whatsapp"></i> Open WhatsApp
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const existingModal = document.getElementById('whatsappModal');
    if (existingModal) existingModal.remove();

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('whatsappModal'));
    modal.show();
    
    setTimeout(() => copyMessage(), 500);
}

// Copy message
function copyMessage() {
    const messageTextarea = document.getElementById('whatsappMessage');
    if (!messageTextarea) return;

    messageTextarea.select();
    document.execCommand('copy');
    window.getSelection().removeAllRanges();

    const copyBtn = document.querySelector('.btn-purple');
    if (copyBtn) {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => copyBtn.innerHTML = originalText, 2000);
    }
}

// Open WhatsApp
function openWhatsApp(number) {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const url = isMobile
        ? `https://api.whatsapp.com/send?phone=${number}`
        : `https://web.whatsapp.com/send?phone=${number}`;
    window.open(url, '_blank');
}

// Auth handling
function handleAuth() {
    try {
        const navLink = document.querySelector('.navbar-nav a[href="login.html"]');
        if (!navLink) return;
        
        if (window.SLGAuth && SLGAuth.getAuthUser()) {
            navLink.textContent = 'Logout';
            navLink.href = '#';
            navLink.addEventListener('click', function(e) {
                e.preventDefault();
                SLGAuth.logout();
            });
        } else {
            navLink.textContent = 'Login';
            navLink.href = 'login.html';
        }
    } catch (err) {
        console.error('Auth handling error:', err);
    }
}
