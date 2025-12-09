// 全局变量定义
let currentBgIndex = 0;
let shuffledBackgroundImages = [];

// 资源加载状态变量
let imagesTotalCount = 0;
let pagesTotalCount = 0;
let fontsTotalCount = 0;
let imagesLoadingCount = 0;
let pagesLoadingCount = 0;
let fontsLoadingCount = 0;
let domCssLoaded = false;
let backgroundImagesLoaded = false;

// 加载界面显示控制
let loadingIndicatorVisible = false;
let showLoadingTimeout = null;
let skipButtonCheckInterval = null;
const loadStartTime = Date.now();

// DOM元素引用
let progressFill = null;
let progressText = null;
let resourceCountElement = null;
let loadingIndicator = null;

// 触摸设备检测
let isTouchDevice = false;
let touchInteractionDetected = false;
let mouseInteractionDetected = false;
let lastTouchTime = 0;
let lastMouseEventTime = 0;
const INTERACTION_THRESHOLD = 500;
const CHECK_INTERVAL = 30000;

// 初始化
console.log('初始化加载状态变量');
console.log('imagesTotalCount:', imagesTotalCount);
console.log('pagesTotalCount:', pagesTotalCount);
console.log('fontsTotalCount:', fontsTotalCount);
console.log('imagesLoadingCount:', imagesLoadingCount);
console.log('pagesLoadingCount:', pagesLoadingCount);
console.log('fontsLoadingCount:', fontsLoadingCount);

// 背景图片列表
const originalBackgroundImages = [
    'images/主页背景图/1.jpg',
    'images/主页背景图/2.jpg',
    'images/主页背景图/3.jpg',
    'images/主页背景图/4.jpg'
];

// 背景图片随机排序
function initBackgroundImages() {
    if (shuffledBackgroundImages.length > 0) {
        return shuffledBackgroundImages;
    }
    const tempArray = [...originalBackgroundImages];
    for (let i = tempArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tempArray[i], tempArray[j]] = [tempArray[j], tempArray[i]];
    }
    shuffledBackgroundImages = tempArray;
    console.log('背景图片随机排序结果:', shuffledBackgroundImages);
    return shuffledBackgroundImages;
}

function getBackgroundImages() {
    return initBackgroundImages();
}

// 复制功能
function copyServerIP() {
    copyText('mc.yuzhou.love', '服务器IP已复制到剪贴板！');
}

function copyQQGroup() {
    copyText('823557774', 'QQ群号已复制到剪贴板！');
}

function copyText(text, customMessage = '已复制到剪贴板！') {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification(customMessage);
        }).catch(err => {
            console.error('现代剪贴板API复制失败:', err);
            fallbackCopyTextToClipboard(text, customMessage);
        });
    } else {
        fallbackCopyTextToClipboard(text, customMessage);
    }
}

function fallbackCopyTextToClipboard(text, customMessage) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    
    try {
        textArea.select();
        textArea.setSelectionRange(0, 999999);
        const successful = document.execCommand('copy');
        if (successful) {
            showNotification(customMessage);
        } else {
            showNotification('复制失败，请手动复制：' + text);
        }
    } catch (err) {
        console.error('降级方案复制失败:', err);
        showNotification('复制失败，请手动复制：' + text);
    } finally {
        document.body.removeChild(textArea);
    }
}

// 显示通知
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.backgroundColor = 'rgba(33, 150, 243, 0.9)';
    notification.style.color = 'white';
    notification.style.padding = '12px 24px';
    notification.style.borderRadius = '4px';
    notification.style.zIndex = '10000';
    notification.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s ease';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 10);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// 触摸设备检测
function detectDeviceCapabilities() {
    const hasTouchAPI = ('ontouchstart' in window);
    const hasTouchPoints = (navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0);
    const hasTouchEvents = 'TouchEvent' in window;
    
    isTouchDevice = hasTouchAPI || hasTouchPoints || hasTouchEvents;
    
    const ua = navigator.userAgent;
    const hasTouchUA = /\btouch\b/i.test(ua) || /iPad|iPhone|iPod|Android|Windows Phone/i.test(ua);
    
    if (isTouchDevice || hasTouchUA) {
        document.documentElement.classList.add('supports-touch');
        document.documentElement.classList.add('touch-device');
    } else {
        document.documentElement.classList.add('mouse-device');
    }
    
    console.log('设备检测结果:', { isTouchDevice, hasTouchUA });
}

function handleTouchEvent(e) {
    lastTouchTime = Date.now();
    if (lastMouseEventTime && (lastTouchTime - lastMouseEventTime) < INTERACTION_THRESHOLD) {
        return;
    }
    
    touchInteractionDetected = true;
    document.documentElement.classList.add('touch-device');
    document.documentElement.classList.remove('mouse-device');
    console.log('检测到触摸交互');
}

function handleMouseEvent(e) {
    if (lastTouchTime && (Date.now() - lastTouchTime) < INTERACTION_THRESHOLD) {
        return;
    }
    
    lastMouseEventTime = Date.now();
    mouseInteractionDetected = true;
    document.documentElement.classList.remove('touch-device');
    document.documentElement.classList.add('mouse-device');
    console.log('检测到鼠标交互');
}

function setupEventListeners() {
    document.addEventListener('touchstart', handleTouchEvent, { passive: true, capture: true });
    document.addEventListener('touchmove', handleTouchEvent, { passive: true, capture: true });
    document.addEventListener('touchend', handleTouchEvent, { passive: true, capture: true });
    
    document.addEventListener('mousedown', handleMouseEvent, { passive: true, capture: true });
    document.addEventListener('mousemove', handleMouseEvent, { passive: true, capture: true });
    document.addEventListener('mouseup', handleMouseEvent, { passive: true, capture: true });
    
    setInterval(() => {
        const now = Date.now();
        const touchInactive = now - lastTouchTime > CHECK_INTERVAL;
        const mouseInactive = now - lastMouseEventTime > CHECK_INTERVAL;
        
        if (touchInactive && mouseInactive) {
            if (isTouchDevice) {
                document.documentElement.classList.add('touch-device');
                document.documentElement.classList.remove('mouse-device');
            } else {
                document.documentElement.classList.remove('touch-device');
                document.documentElement.classList.add('mouse-device');
            }
        }
    }, CHECK_INTERVAL);
}

function enhancedTouchDetection() {
    detectDeviceCapabilities();
    setupEventListeners();
    
    let lastTouchTarget = null;
    
    document.addEventListener('touchend', (e) => {
        lastTouchTarget = e.target;
    }, { passive: true });
    
    document.addEventListener('click', (e) => {
        if (lastTouchTime && (Date.now() - lastTouchTime) < INTERACTION_THRESHOLD && lastTouchTarget === e.target) {
            e.stopPropagation();
            lastTouchTarget = null;
        }
    }, { capture: true });
}

// 页面加载器类
class PageLoader {
    constructor() {
        this.loadedPages = new Set();
        this.loadingPromises = new Map();
        this.transitionDuration = 300;
    }
    
    async loadPage(pageId, preload = false) {
        const transitionLayer = document.querySelector('.page-transition');
        if (transitionLayer && !preload) {
            transitionLayer.classList.add('active');
        }
        
        if (this.loadedPages.has(pageId)) {
            const pageContent = document.getElementById(`${pageId}-content`);
            const mainContent = document.querySelector('#main-content');
            
            if (mainContent && pageContent && !mainContent.contains(pageContent)) {
                mainContent.innerHTML = '';
                mainContent.appendChild(pageContent);
            }
            
            await new Promise(resolve => setTimeout(resolve, this.transitionDuration));
            
            if (transitionLayer) {
                setTimeout(() => {
                    transitionLayer.classList.remove('active');
                }, 50);
            }
            
            return pageContent;
        }
        
        if (this.loadingPromises.has(pageId)) {
            if (transitionLayer && !transitionLayer.classList.contains('active')) {
                transitionLayer.classList.add('active');
            }
            return this.loadingPromises.get(pageId);
        }
        
        const pagePath = `pages/${pageId}.html`;
        
        const loadPromise = fetch(pagePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`加载页面失败: ${response.status} ${response.statusText}`);
                }
                return response.text();
            })
            .then(html => {
                return new Promise(resolve => {
                    setTimeout(() => {
                        resolve(html);
                    }, this.transitionDuration);
                });
            })
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                
                let pageContent = doc.querySelector('.page-content');
                if (!pageContent) {
                    pageContent = doc.body.firstElementChild;
                    if (!pageContent) {
                        pageContent = document.createElement('div');
                        pageContent.innerHTML = html;
                    }
                }
                
                const mainContent = document.querySelector('#main-content');
                if (mainContent) {
                    mainContent.innerHTML = '';
                    pageContent.id = `${pageId}-content`;
                    pageContent.className = 'page-content';
                    mainContent.appendChild(pageContent);
                    console.log(`页面 ${pageId} 内容已添加到主内容区域`);
                }
                
                if (pageId === 'home') {
                    resetBackgroundInitialization();
                    setTimeout(() => {
                        initHeroBackground();
                    }, 100);
                }
                
                if (!preload) {
                    pageContent.classList.add('active');
                } else {
                    console.log(`页面 ${pageId} 已预加载，但暂时不激活显示`);
                }
                
                this.loadedPages.add(pageId);
                
                if (transitionLayer && !preload) {
                    setTimeout(() => {
                        transitionLayer.classList.remove('active');
                    }, 50);
                }
                
                return pageContent;
            })
            .catch(error => {
                console.error('页面加载错误:', error);
                const errorPage = document.createElement('div');
                errorPage.id = `${pageId}-content`;
                errorPage.className = 'page-content';
                errorPage.innerHTML = `
                    <div class="page-header">
                        <div class="container">
                            <h1>页面加载失败</h1>
                        </div>
                    </div>
                    <div class="container">
                        <div class="error-message">
                            <p>抱歉，无法加载此页面内容。请稍后重试。</p>
                            <button class="btn" onclick="location.reload()">刷新页面</button>
                        </div>
                    </div>
                `;
                
                const mainContent = document.querySelector('#main-content');
                if (mainContent) {
                    mainContent.appendChild(errorPage);
                }
                
                if (transitionLayer) {
                    setTimeout(() => {
                        transitionLayer.classList.remove('active');
                    }, 50);
                }
                
                return errorPage;
            })
            .finally(() => {
                this.loadingPromises.delete(pageId);
            });
        
        this.loadingPromises.set(pageId, loadPromise);
        return loadPromise;
    }
    
    isPageLoaded(pageId) {
        return this.loadedPages.has(pageId);
    }
    
    preloadPage(pageId) {
        if (!this.isPageLoaded(pageId) && pageId !== 'home') {
            const pagePath = `pages/${pageId}.html`;
            
            fetch(pagePath)
                .then(response => {
                    if (response.ok) {
                        console.log(`页面 ${pageId} 已预加载`);
                        this.loadedPages.add(pageId);
                    }
                })
                .catch(error => {
                    console.error(`预加载页面 ${pageId} 失败:`, error);
                });
        }
    }
}

// 创建页面加载器实例
const pageLoader = new PageLoader();

// 加载完成处理
function finishLoading() {
    try {
        if (loadingIndicator) {
            const loadingContent = loadingIndicator.querySelector('.loading-content');
            if (loadingContent) {
                loadingContent.style.opacity = '0';
                loadingContent.style.transform = 'translateY(20px)';
                loadingContent.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            }
            
            setTimeout(() => {
                loadingIndicator.style.opacity = '0';
                loadingIndicator.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                
                const skipButton = document.getElementById('skip-loading-btn');
                if (skipButton) {
                    skipButton.style.opacity = '0';
                    skipButton.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                    setTimeout(() => {
                        skipButton.style.display = 'none';
                    }, 600);
                }
                
                setTimeout(() => {
                    loadingIndicator.style.display = 'none';
                    document.body.classList.add('loaded');
                    
                    if (typeof AppInitializer !== 'undefined' && typeof AppInitializer.initAnimations === 'function') {
                        AppInitializer.initAnimations();
                    }
                }, 600);
            }, 600);
        }
        
        const loadEndTime = Date.now();
        console.log(`页面加载完成，耗时: ${loadEndTime - loadStartTime}ms`);
    } catch (error) {
        console.error('finishLoading执行出错:', error);
        document.body.classList.add('loaded');
    }
}

// 进度更新
let progress = 0;
let progressInterval = null;

function updateProgress(percent) {
    if (progressFill && progressText) {
        progress = Math.min(99, percent);
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `${Math.round(progress)}%`;
    }
}

function updateResourceCount() {
    if (resourceCountElement) {
        const loaded = (imagesTotalCount - imagesLoadingCount) + (pagesTotalCount - pagesLoadingCount) + (fontsTotalCount - fontsLoadingCount);
        const total = imagesTotalCount + pagesTotalCount + fontsTotalCount;
        resourceCountElement.textContent = `${loaded}/${total}`;
    }
}

function updateProgressAndResourceCount() {
    const loaded = (imagesTotalCount - imagesLoadingCount) + (pagesTotalCount - pagesLoadingCount) + (fontsTotalCount - fontsLoadingCount);
    const total = imagesTotalCount + pagesTotalCount + fontsTotalCount;
    const currentProgress = (loaded / total) * 100;
    updateProgress(currentProgress);
    updateResourceCount();
}

function startProgressUpdate() {
    updateProgress(0);
    
    progressInterval = setInterval(() => {
        const loaded = (imagesTotalCount - imagesLoadingCount) + (pagesTotalCount - pagesLoadingCount) + (fontsTotalCount - fontsLoadingCount);
        const total = imagesTotalCount + pagesTotalCount + fontsTotalCount;
        const realProgress = total > 0 ? (loaded / total) * 100 : 0;
        
        if (realProgress > progress) {
            progress = realProgress;
        } else if (realProgress < progress - 10) {
            progress = realProgress;
        } else {
            const growthRate = 100 - progress;
            const increment = Math.random() * growthRate * 0.02;
            progress += increment;
        }
        
        updateProgress(progress);
        
        if (progress >= 95) {
            clearInterval(progressInterval);
        }
    }, 500);
}

// 控制台日志
function addConsoleLog(message) {
    console.log(message);
}

// 跳过按钮
function showSkipButton() {
    const skipButton = document.getElementById('skip-loading-btn');
    if (skipButton) {
        skipButton.classList.add('show');
    }
}

function setupSkipLoadingButton() {
    const skipButton = document.getElementById('skip-loading-btn');
    
    if (skipButton) {
        skipButton.addEventListener('click', () => {
            console.log('用户点击了"不等了，先看文字"按钮，跳过加载');
            finishLoading();
        });
    } else {
        console.warn('跳过加载按钮未找到');
    }
}

async function checkSkipButtonDisplay() {
    try {
        if (document.body.classList.contains('loaded')) {
            if (skipButtonCheckInterval) {
                clearInterval(skipButtonCheckInterval);
                skipButtonCheckInterval = null;
                console.log('页面已加载完成，清除跳过按钮检查定时器');
            }
            return;
        }
        
        const skipButton = document.getElementById('skip-loading-btn');
        if (!skipButton) {
            if (skipButtonCheckInterval) {
                clearInterval(skipButtonCheckInterval);
                skipButtonCheckInterval = null;
            }
            return;
        }
        
        const safeDomCssLoaded = typeof domCssLoaded !== 'undefined' ? domCssLoaded : false;
        const safeImagesLoadingCount = typeof imagesLoadingCount !== 'undefined' ? imagesLoadingCount : 0;
        const safeFontsLoadingCount = typeof fontsLoadingCount !== 'undefined' ? fontsLoadingCount : 0;
        const safeImagesTotalCount = typeof imagesTotalCount !== 'undefined' ? imagesTotalCount : 0;
        const safeLoadStartTime = typeof loadStartTime !== 'undefined' ? loadStartTime : Date.now();
        
        const htmlCssJsLoaded = safeDomCssLoaded;
        const assetsStillLoading = (safeImagesLoadingCount > 0 || safeFontsLoadingCount > 0);
        const pageNotLoaded = !document.body.classList.contains('loaded');
        
        const currentTime = Date.now();
        const elapsedTime = currentTime - safeLoadStartTime;
        const loadingLongEnough = elapsedTime >= 5000;
        
        const currentSecond = Math.floor(elapsedTime / 2000);
        if (!window.lastLogSecond || window.lastLogSecond !== currentSecond) {
            window.lastLogSecond = currentSecond;
            console.log(`加载状态更新 (${Math.floor(elapsedTime / 1000)}秒): 图片剩余 ${safeImagesLoadingCount}/${safeImagesTotalCount}`);
        }
        
        if (htmlCssJsLoaded && assetsStillLoading && pageNotLoaded && loadingLongEnough) {
            if (skipButton.style.display !== 'block') {
                skipButton.style.display = 'block';
                setTimeout(() => {
                    skipButton.classList.add('show');
                }, 10);
                console.log('显示跳过加载按钮：加载时间超过5秒且资源仍在加载');
            }
        } else {
            if (skipButton.style.display !== 'none') {
                skipButton.classList.remove('show');
                setTimeout(() => {
                    skipButton.style.display = 'none';
                }, 500);
            }
        }
    } catch (error) {
        console.error('检查跳过按钮显示状态出错:', error);
        if (skipButtonCheckInterval) {
            clearInterval(skipButtonCheckInterval);
            skipButtonCheckInterval = null;
        }
    }
}

// 资源预加载
async function preloadAllResources() {
    console.log('开始预加载所有资源...');
    addConsoleLog('开始预加载所有资源...');
    
    try {
        const imageResources = [
            'images/主页背景图/1.jpg',
            'images/主页背景图/2.jpg',
            'images/主页背景图/3.jpg',
            'images/主页背景图/4.jpg',
            'images/loading.avif',
            'images/雨州logo.svg',
            'images/服务器特色-四象限构图/左.jpg',
            'images/服务器特色-四象限构图/右.jpg',
            'images/Java版加入指南.png',
            'images/基岩版加入指南.png'
        ];
        
        const pageResources = [
            'pages/home.html',
            'pages/features.html',
            'pages/join.html',
            'pages/about.html'
        ];
        
        const fontResources = [
            'fonts/fontawesome-free-6.4.0-web/webfonts/fa-solid-900.woff2',
            'fonts/fontawesome-free-6.4.0-web/webfonts/fa-brands-400.woff2',
            'fonts/fontawesome-free-6.4.0-web/webfonts/fa-regular-400.woff2'
        ];
        
        imagesTotalCount = imageResources.length;
        pagesTotalCount = pageResources.length;
        fontsTotalCount = fontResources.length;
        
        updateResourceCount();
        updateProgress(0);
        
        const timeoutPromise = new Promise((resolve) => {
            setTimeout(() => {
                console.warn('预加载超时，跳过剩余资源加载');
                addConsoleLog('预加载超时，跳过剩余资源加载');
                resolve();
            }, 15000);
        });
        
        const imagePromises = imageResources.map(imgSrc => {
            return new Promise((resolve) => {
                imagesLoadingCount++;
                const img = new Image();
                img.onload = () => {
                    imagesLoadingCount--;
                    console.log(`图片加载完成: ${imgSrc}, 剩余: ${imagesLoadingCount}`);
                    addConsoleLog(`图片加载完成: ${imgSrc}`);
                    updateProgressAndResourceCount();
                    resolve();
                };
                img.onerror = () => {
                    imagesLoadingCount--;
                    console.warn(`图片加载失败: ${imgSrc}, 但继续加载其他资源`);
                    addConsoleLog(`图片加载失败: ${imgSrc}`);
                    updateProgressAndResourceCount();
                    resolve();
                };
                img.src = imgSrc;
            });
        });
        
        const pagePromises = pageResources.map(pageSrc => {
            return new Promise((resolve) => {
                pagesLoadingCount++;
                fetch(pageSrc)
                    .then(() => {
                        pagesLoadingCount--;
                        console.log(`页面预加载完成: ${pageSrc}, 剩余: ${pagesLoadingCount}`);
                        addConsoleLog(`页面预加载完成: ${pageSrc}`);
                        updateProgressAndResourceCount();
                        resolve();
                    })
                    .catch(() => {
                        pagesLoadingCount--;
                        console.warn(`页面预加载失败: ${pageSrc}, 但继续加载其他资源`);
                        addConsoleLog(`页面预加载失败: ${pageSrc}`);
                        updateProgressAndResourceCount();
                        resolve();
                    });
            });
        });
        
        const fontPromises = fontResources.map(fontSrc => {
            return new Promise((resolve) => {
                fontsLoadingCount++;
                const font = new FontFace('FontAwesome', `url(${fontSrc})`);
                font.load()
                    .then(() => {
                        fontsLoadingCount--;
                        console.log(`字体加载完成: ${fontSrc}, 剩余: ${fontsLoadingCount}`);
                        addConsoleLog(`字体加载完成: ${fontSrc}`);
                        updateProgressAndResourceCount();
                        resolve();
                    })
                    .catch(() => {
                        fontsLoadingCount--;
                        console.warn(`字体加载失败: ${fontSrc}, 但继续加载其他资源`);
                        addConsoleLog(`字体加载失败: ${fontSrc}`);
                        updateProgressAndResourceCount();
                        resolve();
                    });
            });
        });
        
        await Promise.all([
            ...imagePromises,
            ...pagePromises,
            ...fontPromises,
            timeoutPromise
        ]);
        
        console.log('所有资源预加载完成或超时!');
        addConsoleLog('所有资源预加载完成或超时!');
    } catch (error) {
        console.error('预加载过程中出现错误:', error);
        addConsoleLog('预加载过程中出现错误: ' + error.message);
    }
    
    return true;
}

async function loadResources() {
    try {
        console.log('开始资源加载流程');
        await preloadAllResources();
        console.log('所有资源预加载完成，调用finishLoading');
        finishLoading();
    } catch (error) {
        console.error('资源加载过程中发生错误:', error);
        finishLoading();
    }
}

// 背景初始化
function resetBackgroundInitialization() {
    console.log('重置背景初始化');
}

function initHeroBackground() {
    console.log('初始化英雄区背景');
}

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 初始化DOM元素引用
    loadingIndicator = document.querySelector('.loading-indicator');
    progressFill = document.getElementById('progressFill');
    progressText = document.getElementById('progressText');
    resourceCountElement = document.getElementById('resourceCount');
    
    // 初始化增强的触摸检测
    enhancedTouchDetection();
    
    // 启动进度更新
    startProgressUpdate();
    
    // 启动资源加载
    loadResources();
    
    // 初始化跳过按钮
    setupSkipLoadingButton();
    
    // 检查跳过按钮显示
    if (!document.body.classList.contains('loaded')) {
        checkSkipButtonDisplay();
        if (!skipButtonCheckInterval) {
            skipButtonCheckInterval = setInterval(checkSkipButtonDisplay, 1000);
            console.log('启动跳过按钮检查定时器，每1秒检查一次');
        }
    }
    
    // 3秒后显示跳过按钮
    setTimeout(() => {
        if (!document.body.classList.contains('loaded')) {
            showSkipButton();
        }
    }, 3000);
    
    // 导航链接处理
    const navLinks = document.querySelectorAll('.nav-link[data-page]');
    const footer = document.querySelector('footer');
    
    addConsoleLog('DOM内容加载完成');
    updateProgress();
    
    // 显示加载提示
    if (loadingIndicator && !document.body.classList.contains('loaded')) {
        const currentTime = Date.now();
        const elapsedTime = currentTime - loadStartTime;
        
        if (elapsedTime >= 3000 || loadingIndicatorVisible) {
            loadingIndicator.style.display = 'block';
            loadingIndicatorVisible = true;
            console.log('DOM加载完成且已过3秒，加载提示保持可见');
            addConsoleLog('显示加载界面');
        } else {
            loadingIndicator.style.display = 'none';
            console.log('DOM加载完成但未过3秒，暂不显示加载提示');
        }
    }
    
    // DOM和CSS已加载完成
    domCssLoaded = true;
    console.log('DOM和CSS加载完成');
    addConsoleLog('DOM和CSS加载完成');
    
    // 预加载主要页面
    setTimeout(() => {
        pageLoader.preloadPage('features');
        console.log('已预加载主要页面');
        addConsoleLog('已预加载主要页面');
    }, 3000);
    
    // 页面切换函数
    async function switchPage(pageId) {
        console.log(`[路由] 尝试切换到页面: ${pageId}`);
        
        const validPages = ['home', 'features', 'join', 'about'];
        if (!validPages.includes(pageId)) {
            console.error(`[路由] 无效的页面ID: ${pageId}`);
            return;
        }
        
        const targetPageId = `${pageId}-content`;
        
        try {
            pageLoader.loadedPages.delete(pageId);
            await pageLoader.loadPage(pageId);
            console.log(`[路由] 页面 ${pageId} 加载成功`);
        } catch (error) {
            console.error('[路由] 页面加载失败:', error);
            showNotification(`页面加载失败: ${error.message}`);
            return;
        }
        
        const targetPage = document.getElementById(targetPageId);
        if (!targetPage) {
            console.error(`[路由] 无法找到页面元素: ${targetPageId}`);
            return;
        }
        
        const currentActivePage = document.querySelector('.page-content.active');
        
        // 更新导航链接
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        const targetLink = document.querySelector(`.nav-link[data-page="${pageId}"]`);
        if (targetLink) {
            targetLink.classList.add('active');
        }
        
        // 页面切换动画
        const transitionLayer = document.querySelector('.page-transition');
        if (transitionLayer) {
            transitionLayer.classList.add('active');
        }
        
        if (currentActivePage) {
            currentActivePage.style.opacity = '0';
            if (footer) {
                footer.style.opacity = '0';
            }
        }
        
        setTimeout(() => {
            if (currentActivePage) {
                currentActivePage.style.display = 'none';
                currentActivePage.classList.remove('active');
            }
            
            targetPage.style.display = 'block';
            targetPage.classList.add('active');
            targetPage.style.opacity = '0';
            targetPage.offsetHeight;
            targetPage.style.opacity = '1';
            
            setTimeout(() => {
                targetPage.style.opacity = '';
            }, 300);
            
            console.log(`[路由] 切换到页面: ${pageId}`);
            
            if (footer) {
                footer.offsetHeight;
                footer.style.opacity = '1';
            }
            
            if (transitionLayer) {
                setTimeout(() => {
                    transitionLayer.classList.remove('active');
                }, 50);
            }
        }, 300);
        
        if (pageId === 'home') {
            resetBackgroundInitialization();
            setTimeout(() => {
                initHeroBackground();
            }, 100);
        }
        
        window.scrollTo(0, 0);
        
        // 更新浏览器历史记录
        const pageTitle = getPageTitle(pageId);
        history.pushState({ page: pageId }, pageTitle, `/${getPagePath(pageId)}`);
        document.title = pageTitle;
        
        console.log(`[路由] 页面切换完成: ${pageId}`);
    }
    
    // 页面标题和路径处理
    function getPageTitle(pageId) {
        const titles = {
            'home': '雨州Minecraft服务器',
            'features': '服务器特色 - 雨州Minecraft服务器',
            'join': '加入指南 - 雨州Minecraft服务器',
            'about': '关于我们 - 雨州Minecraft服务器'
        };
        return titles[pageId] || '雨州Minecraft服务器';
    }
    
    function getPagePath(pageId) {
        const paths = {
            'home': '',
            'features': 'features',
            'join': 'join',
            'about': 'about'
        };
        return paths[pageId] || '';
    }
    
    function getPageIdFromPath(path) {
        const normalizedPath = path.startsWith('/') ? path.substring(1) : path;
        const paths = {
            '': 'home',
            'home': 'home',
            'features': 'features',
            'join': 'join',
            'about': 'about'
        };
        return paths[normalizedPath] || 'home';
    }
    
    // 初始页面检查
    async function checkInitialPage() {
        console.log('[路由] 开始检查初始页面');
        const path = window.location.pathname;
        const normalizedPath = path.startsWith('/') ? path.substring(1) : path;
        const pathToPageId = {
            '': 'home',
            'home': 'home',
            'features': 'features',
            'join': 'join',
            'about': 'about'
        };
        
        let pageId = pathToPageId[normalizedPath] || 'home';
        const validPages = ['home', 'features', 'join', 'about'];
        
        if (!validPages.includes(pageId)) {
            pageId = 'home';
        }
        
        await switchPage(pageId);
        console.log('[路由] 初始页面检查和切换完成');
    }
    
    checkInitialPage();
    
    // 导航链接点击事件
    navLinks.forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('data-page');
            await switchPage(pageId);
        });
    });
});

// 超时后备机制
setTimeout(() => {
    if (!document.body.classList.contains('loaded')) {
        console.warn('加载过程超时，强制完成加载');
        finishLoading();
    }
}, 8000);

// 确保finishLoading可全局调用
window.finishLoading = finishLoading;