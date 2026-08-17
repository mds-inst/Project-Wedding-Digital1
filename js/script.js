/**
 * DIGITAL WEDDING INVITATION - VANILLA SCRIPT
 * Yasa Erdiansyah & Nina Prihartini | 12 September 2026
 */

/* ==========================================================================
   1. CONFIGURATION DATA (EASY TO CHANGE IN ONE PLACE)
   ========================================================================== */
const CONFIG = {
    guestDefault: "Nama Tamu",
    weddingDateISO: "2026-09-12T09:00:00+07:00",
    
    // YouTube Live Streaming Link (Easily change this URL)
    youtubeLiveUrl: "https://www.youtube.com/@WeddingLiveStream",
    
    // Bank Account Details
    bankInfo: {
        bankName: "SEABANK",
        accountNumber: "901150848441",
        accountName: "Yasa dan Nina"
    }
};

/* ==========================================================================
   2. DOM INITIALIZATION
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    initGuestName();
    initInvitationOpen();
    initAudioPlayer();
    initCountdown();
    initCarousels();
    initYouTubeLink();
    initCopyBank();
    initScrollObserver();
});

/* ==========================================================================
   3. GUEST NAME FROM URL PARAMETER
   ========================================================================== */
function initGuestName() {
    const guestNameElement = document.getElementById('guest-name');
    if (!guestNameElement) return;

    try {
        const urlParams = new URLSearchParams(window.location.search);
        const rawGuest = urlParams.get('to') || 
                         urlParams.get('n') || 
                         urlParams.get('nama') || 
                         urlParams.get('guest');

        if (rawGuest && rawGuest.trim() !== '') {
            guestNameElement.textContent = rawGuest.trim();
        } else {
            guestNameElement.textContent = CONFIG.guestDefault;
        }
    } catch (e) {
        console.warn('Error reading URL parameters:', e);
    }
}

/* ==========================================================================
   4. INVITATION OPEN BUTTON HANDLER
   ========================================================================== */
function initInvitationOpen() {
    const btnOpen = document.getElementById('btn-open');
    const coverSection = document.getElementById('cover-section');
    const mainContent = document.getElementById('main-content');
    const bgAudio = document.getElementById('bg-audio');
    const audioToggle = document.getElementById('audio-toggle');

    if (!btnOpen) return;

    btnOpen.addEventListener('click', () => {
        // Hide Cover Section with animation
        if (coverSection) {
            coverSection.classList.add('opened');
        }

        // Unlock Main Content Wrapper
        if (mainContent) {
            mainContent.classList.add('unlocked');
        }

        // Play Background Audio
        if (bgAudio) {
            bgAudio.play().then(() => {
                if (audioToggle) audioToggle.classList.remove('paused');
            }).catch(err => {
                console.log('Audio autoplay prevented by browser interaction policy:', err);
            });
        }

        // Show Audio Control Floating Button
        if (audioToggle) {
            audioToggle.classList.add('visible');
        }

        // Smooth Scroll to Wedding Of Section
        setTimeout(() => {
            const weddingOfSection = document.getElementById('wedding-of');
            if (weddingOfSection) {
                weddingOfSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 300);
    });
}

/* ==========================================================================
   5. BACKGROUND AUDIO CONTROLLER
   ========================================================================== */
function initAudioPlayer() {
    const bgAudio = document.getElementById('bg-audio');
    const audioToggle = document.getElementById('audio-toggle');

    if (!bgAudio || !audioToggle) return;

    audioToggle.addEventListener('click', () => {
        if (bgAudio.paused) {
            bgAudio.play();
            audioToggle.classList.remove('paused');
        } else {
            bgAudio.pause();
            audioToggle.classList.add('paused');
        }
    });
}

/* ==========================================================================
   6. COUNTDOWN TIMER
   ========================================================================== */
function initCountdown() {
    const elDays = document.getElementById('cd-days');
    const elHours = document.getElementById('cd-hours');
    const elMinutes = document.getElementById('cd-minutes');
    const elSeconds = document.getElementById('cd-seconds');

    if (!elDays || !elHours || !elMinutes || !elSeconds) return;

    const targetTime = new Date(CONFIG.weddingDateISO).getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const difference = targetTime - now;

        if (difference <= 0) {
            elDays.textContent = "00";
            elHours.textContent = "00";
            elMinutes.textContent = "00";
            elSeconds.textContent = "00";
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        elDays.textContent = String(days).padStart(2, '0');
        elHours.textContent = String(hours).padStart(2, '0');
        elMinutes.textContent = String(minutes).padStart(2, '0');
        elSeconds.textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

/* ==========================================================================
   7. PHOTO CAROUSEL / SLIDER (AKAD & RESEPSI)
   ========================================================================== */
function initCarousels() {
    setupCarousel('carousel-akad');
    setupCarousel('carousel-resepsi');
}

function setupCarousel(carouselId) {
    const container = document.getElementById(carouselId);
    if (!container) return;

    const slides = container.querySelectorAll('.carousel-slide');
    const dots = container.querySelectorAll('.dot');
    const prevBtn = container.querySelector('.prev-btn');
    const nextBtn = container.querySelector('.next-btn');

    if (slides.length === 0) return;

    let currentIndex = 0;
    let autoSlideInterval = null;
    const AUTO_SLIDE_DELAY = 4000;

    function showSlide(index) {
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        currentIndex = index;

        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === currentIndex);
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    function nextSlide() {
        showSlide(currentIndex + 1);
    }

    function startAutoSlide() {
        stopAutoSlide();
        autoSlideInterval = setInterval(nextSlide, AUTO_SLIDE_DELAY);
    }

    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }
    }

    if (prevBtn) prevBtn.addEventListener('click', () => {
        showSlide(currentIndex - 1);
        startAutoSlide();
    });
    if (nextBtn) nextBtn.addEventListener('click', () => {
        showSlide(currentIndex + 1);
        startAutoSlide();
    });

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            showSlide(i);
            startAutoSlide();
        });
    });

    container.addEventListener('mouseenter', stopAutoSlide);
    container.addEventListener('mouseleave', startAutoSlide);
    container.addEventListener('focusin', stopAutoSlide);
    container.addEventListener('focusout', startAutoSlide);

    startAutoSlide();
}

/* ==========================================================================
   8. YOUTUBE LIVE STREAMING LINK SETUP
   ========================================================================== */
function initYouTubeLink() {
    const youtubeBtn = document.getElementById('youtube-btn');
    if (youtubeBtn) {
        youtubeBtn.href = CONFIG.youtubeLiveUrl;
    }
}

/* ==========================================================================
   9. COPY BANK ACCOUNT TO CLIPBOARD
   ========================================================================== */
function initCopyBank() {
    const btnCopy = document.getElementById('btn-copy-rekening');
    const bankNumberEl = document.getElementById('bank-number');
    const bankNameEl = document.getElementById('bank-name');
    const toast = document.getElementById('toast');

    if (bankNumberEl) bankNumberEl.textContent = CONFIG.bankInfo.accountNumber;
    if (bankNameEl) bankNameEl.textContent = CONFIG.bankInfo.accountName;

    if (!btnCopy) return;

    btnCopy.addEventListener('click', () => {
        const accountNumber = CONFIG.bankInfo.accountNumber;

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(accountNumber).then(() => {
                showToast();
            }).catch(err => {
                fallbackCopyText(accountNumber);
            });
        } else {
            fallbackCopyText(accountNumber);
        }
    });

    function fallbackCopyText(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            showToast();
        } catch (err) {
            console.error('Fallback copy failed:', err);
        }
        document.body.removeChild(textArea);
    }

    function showToast() {
        if (!toast) return;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

/* ==========================================================================
   10. INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
   ========================================================================== */
function initScrollObserver() {
    const reveals = document.querySelectorAll('.reveal, .reveal-img, .reveal-text');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    
                    // Trigger stagger children
                    if (entry.target.classList.contains('stagger')) {
                        entry.target.querySelectorAll('*').forEach((child, i) => {
                            setTimeout(() => child.style.opacity = '1', i * 100);
                        });
                    }
                    
                    // Trigger text line-by-line
                    if (entry.target.classList.contains('reveal-text')) {
                        entry.target.querySelectorAll('.line').forEach((line, i) => {
                            setTimeout(() => line.classList.add('active'), i * 150);
                        });
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: "0px 0px -30px 0px"
        });

        reveals.forEach(reveal => observer.observe(reveal));
    } else {
        reveals.forEach(reveal => reveal.classList.add('active'));
    }
}
