// PhotoContinuum 產品頁面互動功能

document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initScrollEffects();
    initNavbar();
    initAnimations();
    initSmoothScroll();
    initLanguageSwitcher();
});

// 滾動效果處理
function initScrollEffects() {
    // 創建 Intersection Observer 來處理淡入效果
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // 觀察需要動畫的元素
    const animateElements = document.querySelectorAll('.feature-card, .step-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // 滾動視差效果
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroBackground = document.querySelector('.hero::before');

        if (heroBackground) {
            const rate = scrolled * -0.5;
            heroBackground.style.transform = `translateY(${rate}px)`;
        }
    });
}

// 導航欄滾動效果
function initNavbar() {
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// 動畫初始化
function initAnimations() {
    // 為數字進行計數動畫
    const counters = document.querySelectorAll('.counter');

    counters.forEach(counter => {
        const target = parseInt(counter.dataset.target);
        const increment = target / 100;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            counter.textContent = Math.floor(current);

            if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
            }
        }, 20);
    });

    // 特色卡片懸停效果
    const featureCards = document.querySelectorAll('.feature-card');

    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // 步驟項目序列動畫
    const stepItems = document.querySelectorAll('.step-item');

    stepItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('fade-in');
        }, index * 200);
    });
}

// 平滑滾動
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // 考慮導航欄高度

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 語言切換功能
function initLanguageSwitcher() {
    const languageLinks = document.querySelectorAll('.language-switch a');

    languageLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            // 移除所有 active 類別
            languageLinks.forEach(l => l.classList.remove('active'));

            // 為當前連結添加 active 類別
            this.classList.add('active');

            // 執行語言切換邏輯
            const targetLang = this.dataset.lang;
            switchLanguage(targetLang);
        });
    });
}

// 語言切換實現
function switchLanguage(lang) {
    const currentPage = window.location.pathname;
    let targetPage;

    if (lang === 'en') {
        if (currentPage.includes('index.html') || currentPage.endsWith('/')) {
            targetPage = 'index-en.html';
        }
    } else {
        if (currentPage.includes('index-en.html')) {
            targetPage = 'index.html';
        }
    }

    if (targetPage) {
        // 添加淡出效果
        document.body.style.opacity = '0.8';

        setTimeout(() => {
            window.location.href = targetPage;
        }, 300);
    }
}

// App Store 下載追蹤
function trackDownload(source) {
    // 這裡可以添加分析追蹤代碼
    console.log(`Download tracked from: ${source}`);

    // Google Analytics 追蹤示例（需要先載入 GA）
    if (typeof gtag !== 'undefined') {
        gtag('event', 'download_app', {
            'event_category': 'App Store',
            'event_label': source
        });
    }
}

// 下載按鈕點擊事件
document.addEventListener('click', function(e) {
    if (e.target.matches('.download-button') || e.target.closest('.download-button')) {
        trackDownload('hero_button');
    }
});

// 頁面載入完成後的初始化
window.addEventListener('load', function() {
    // 移除載入狀態
    document.body.classList.remove('loading');

    // 添加載入完成類別
    document.body.classList.add('loaded');

    // 顯示主要內容
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.opacity = '1';
    }
});

// 錯誤處理
window.addEventListener('error', function(e) {
    console.error('頁面錯誤:', e.error);
});

// 響應式功能
function handleResize() {
    const width = window.innerWidth;

    // 根據螢幕寺寸調整功能
    if (width <= 768) {
        // 移動設備專用功能
        enableMobileFeatures();
    } else {
        // 桌面設備專用功能
        enableDesktopFeatures();
    }
}

function enableMobileFeatures() {
    // 移動設備觸控優化
    const cards = document.querySelectorAll('.feature-card');

    cards.forEach(card => {
        card.addEventListener('touchstart', function() {
            this.classList.add('touched');
        });

        card.addEventListener('touchend', function() {
            setTimeout(() => {
                this.classList.remove('touched');
            }, 150);
        });
    });
}

function enableDesktopFeatures() {
    // 桌面設備專用功能
    // 滑鼠追蹤效果等
}

// 監聽視窗大小變化
window.addEventListener('resize', debounce(handleResize, 250));

// 防抖函數
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 初始響應式檢查
handleResize();

// 頁面可見性 API - 處理標籤頁切換
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // 頁面隱藏時暫停動畫
        document.body.classList.add('page-hidden');
    } else {
        // 頁面顯示時恢復動畫
        document.body.classList.remove('page-hidden');
    }
});

// 鍵盤導航支援
document.addEventListener('keydown', function(e) {
    // ESC 鍵關閉模態框等
    if (e.key === 'Escape') {
        closeModals();
    }

    // 方向鍵導航支援
    if (e.key === 'ArrowDown') {
        scrollToNextSection();
    } else if (e.key === 'ArrowUp') {
        scrollToPrevSection();
    }
});

function closeModals() {
    // 關閉所有開啟的模態框
    const modals = document.querySelectorAll('.modal.open');
    modals.forEach(modal => {
        modal.classList.remove('open');
    });
}

function scrollToNextSection() {
    // 滾動到下一個區塊
    const sections = document.querySelectorAll('.section');
    const current = getCurrentSection();
    const next = current + 1;

    if (next < sections.length) {
        sections[next].scrollIntoView({ behavior: 'smooth' });
    }
}

function scrollToPrevSection() {
    // 滾動到上一個區塊
    const sections = document.querySelectorAll('.section');
    const current = getCurrentSection();
    const prev = current - 1;

    if (prev >= 0) {
        sections[prev].scrollIntoView({ behavior: 'smooth' });
    }
}

function getCurrentSection() {
    const sections = document.querySelectorAll('.section');
    const scrollTop = window.pageYOffset;

    for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const sectionTop = section.offsetTop - 100;

        if (scrollTop >= sectionTop) {
            return i;
        }
    }

    return 0;
}

// 性能優化 - 使用 requestAnimationFrame
function optimizedScroll() {
    let ticking = false;

    function updateScrollEffects() {
        // 執行滾動相關的動畫更新
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }

    return requestTick;
}

// 初始化優化的滾動處理
const optimizedScrollHandler = optimizedScroll();
window.addEventListener('scroll', optimizedScrollHandler, { passive: true });