// 在这里添加JavaScript代码

// 全局变量和函数定义
let currentBgIndex = 0;
let shuffledBackgroundImages = [];

// 资源加载状态变量 - 移至全局作用域
let imagesTotalCount = 0;
let pagesTotalCount = 0;
let fontsTotalCount = 0;
let imagesLoadingCount = 0;
let pagesLoadingCount = 0;
let fontsLoadingCount = 0;

// DOM和CSS加载状态
let domCssLoaded = false;
let backgroundImagesLoaded = false;

// 加载界面显示控制
let loadingIndicatorVisible = false;
let showLoadingTimeout = null;

// 跳过按钮检查定时器ID
let skipButtonCheckInterval = null;

// 页面加载开始时间
const loadStartTime = Date.now();

// 控制台日志元素
let consoleLog = null;
let progressFill = null;
let progressText = null;
let resourceCountElement = null;

// 原始背景图片列表
const originalBackgroundImages = [
    'images/主页背景图/1.jpg',
    'images/主页背景图/2.jpg',
    'images/主页背景图/3.jpg',
    'images/主页背景图/4.jpg'
];

// 确保加载指示器在页面加载时可见
const loadingIndicator = document.querySelector('.loading-indicator');
if (loadingIndicator) {
    loadingIndicator.style.display = 'flex';
}

// 初始化时对图片进行随机排序
function initBackgroundImages() {
    // 如果已经有排序结果（本次会话中已初始化），则直接返回
    if (shuffledBackgroundImages.length > 0) {
        return shuffledBackgroundImages;
    }

    // 深拷贝原始数组以避免修改原始数组
    const tempArray = [...originalBackgroundImages];

    // Fisher-Yates 洗牌算法进行随机排序
    for (let i = tempArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tempArray[i], tempArray[j]] = [tempArray[j], tempArray[i]];
    }

    // 保存排序结果，本次会话中保持固定
    shuffledBackgroundImages = tempArray;
    console.log('背景图片随机排序结果:', shuffledBackgroundImages);
    return shuffledBackgroundImages;
}

// 获取当前会话的图片列表（已随机排序）
function getBackgroundImages() {
    return initBackgroundImages();
}

// 复制服务器IP功能
function copyServerIP() {
    const serverIP = 'mc.yuzhou.love';
    copyText(serverIP, '服务器IP已复制到剪贴板！');
}

// 复制QQ群号功能
function copyQQGroup() {
    const qqGroup = '823557774';
    copyText(qqGroup, 'QQ群号已复制到剪贴板！');
}

// 全局复制文本功能
function copyText(text, customMessage = '已复制到剪贴板！') {
    // 检查浏览器是否支持现代剪贴板API
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

// 降级复制方案
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

// 增强的触摸设备检测逻辑
let isTouchDevice = false;
let touchInteractionDetected = false;
let mouseInteractionDetected = false;
let lastTouchTime = 0;
let lastMouseEventTime = 0;
// 跳过按钮检查定时器ID
let skipButtonCheckInterval = null;
const INTERACTION_THRESHOLD = 500; // 交互间隔阈值，毫秒
const CHECK_INTERVAL = 30000; // 定期检查间隔，30秒

// 更高级的设备特性检测
function detectDeviceCapabilities() {
    // 基础触摸支持检测
    const hasTouchAPI = ('ontouchstart' in window);
    const hasTouchPoints = (navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0);

    // 检测触摸事件构造函数
    const hasTouchEvents = 'TouchEvent' in window;

    // 综合判断触摸能力
    isTouchDevice = hasTouchAPI || hasTouchPoints || hasTouchEvents;

    // 检测用户代理信息（作为辅助）
    const ua = navigator.userAgent;
    const hasTouchUA = /\btouch\b/i.test(ua) ||
        /iPad|iPhone|iPod|Android|Windows Phone/i.test(ua);

    // 如果检测到触摸能力，添加支持触摸类
    if (isTouchDevice || hasTouchUA) {
        document.documentElement.classList.add('supports-touch');
        // 默认假设是触摸设备，直到检测到鼠标交互
        document.documentElement.classList.add('touch-device');
    } else {
        document.documentElement.classList.add('mouse-device');
    }

    console.log('设备检测结果:', { isTouchDevice, hasTouchUA });
}

// 处理触摸事件
function handleTouchEvent(e) {
    // 记录触摸时间
    lastTouchTime = Date.now();

    // 如果最近有鼠标事件，且时间差小于阈值，忽略此次触摸
    if (lastMouseEventTime && (lastTouchTime - lastMouseEventTime) < INTERACTION_THRESHOLD) {
        return;
    }

    // 标记为触摸交互
    touchInteractionDetected = true;

    // 更新DOM类
    document.documentElement.classList.add('touch-device');
    document.documentElement.classList.remove('mouse-device');

    console.log('检测到触摸交互');
}

// 处理鼠标事件
function handleMouseEvent(e) {
    // 忽略由触摸事件触发的鼠标事件（幽灵点击）
    if (lastTouchTime && (Date.now() - lastTouchTime) < INTERACTION_THRESHOLD) {
        return;
    }

    // 记录鼠标时间
    lastMouseEventTime = Date.now();

    // 标记为鼠标交互
    mouseInteractionDetected = true;

    // 更新DOM类
    document.documentElement.classList.remove('touch-device');
    document.documentElement.classList.add('mouse-device');

    console.log('检测到鼠标交互');
}

// 设置事件监听
function setupEventListeners() {
    // 使用捕获阶段监听，确保最早捕获事件
    document.addEventListener('touchstart', handleTouchEvent, { passive: true, capture: true });
    document.addEventListener('touchmove', handleTouchEvent, { passive: true, capture: true });
    document.addEventListener('touchend', handleTouchEvent, { passive: true, capture: true });

    document.addEventListener('mousedown', handleMouseEvent, { passive: true, capture: true });
    document.addEventListener('mousemove', handleMouseEvent, { passive: true, capture: true });
    document.addEventListener('mouseup', handleMouseEvent, { passive: true, capture: true });

    // 定期检查，保持检测的准确性
    setInterval(() => {
        // 如果一段时间没有交互，重置状态
        const now = Date.now();
        const touchInactive = now - lastTouchTime > CHECK_INTERVAL;
        const mouseInactive = now - lastMouseEventTime > CHECK_INTERVAL;

        if (touchInactive && mouseInactive) {
            // 都没有活动，根据初始检测设置默认状态
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

// 增强的初始检测
function enhancedTouchDetection() {
    // 立即执行设备特性检测
    detectDeviceCapabilities();

    // 设置事件监听器
    setupEventListeners();

    // 优化幽灵点击处理，只阻止真正的幽灵点击而不影响正常交互
    let lastTouchTarget = null;

    // 记录触摸目标
    document.addEventListener('touchend', (e) => {
        lastTouchTarget = e.target;
    }, { passive: true });

    // 更智能的点击事件处理
    document.addEventListener('click', (e) => {
        // 只有当点击时间接近触摸时间且目标相同时，才可能是幽灵点击
        if (lastTouchTime && (Date.now() - lastTouchTime) < INTERACTION_THRESHOLD &&
            lastTouchTarget === e.target) {
            // 只阻止传播，不阻止默认行为，避免影响按钮功能
            e.stopPropagation();
            // 重置触摸目标，避免连续阻止
            lastTouchTarget = null;
        }
    }, { capture: true });
}

// 在页面加载时初始化增强的触摸检测
window.addEventListener('DOMContentLoaded', enhancedTouchDetection);

// 动态页面加载器
class PageLoader {
    constructor() {
        this.loadedPages = new Set(); // 跟踪已加载的页面
        this.loadingPromises = new Map(); // 跟踪正在进行的加载请求
        this.transitionDuration = 300; // 过渡动画持续时间
    }

    // 加载页面内容
    async loadPage(pageId, preload = false) {
        // 如果不是预加载模式，才显示页面过渡效果
        const transitionLayer = document.querySelector('.page-transition');
        if (transitionLayer && !preload) {
            transitionLayer.classList.add('active');
        }

        // 如果页面已经加载，等待过渡效果后返回
        if (this.loadedPages.has(pageId)) {
            // 获取页面内容元素
            const pageContent = document.getElementById(`${pageId}-content`);

            // 确保主内容区域显示页面内容
            const mainContent = document.querySelector('#main-content');
            if (mainContent && pageContent && !mainContent.contains(pageContent)) {
                // 清空主内容区域
                mainContent.innerHTML = '';
                // 添加页面内容
                mainContent.appendChild(pageContent);
            }

            await new Promise(resolve => setTimeout(resolve, this.transitionDuration));

            // 隐藏过渡效果
            if (transitionLayer) {
                setTimeout(() => {
                    transitionLayer.classList.remove('active');
                }, 50);
            }

            return pageContent;
        }

        // 如果页面正在加载中，返回加载Promise
        if (this.loadingPromises.has(pageId)) {
            // 确保显示过渡效果
            if (transitionLayer && !transitionLayer.classList.contains('active')) {
                transitionLayer.classList.add('active');
            }
            return this.loadingPromises.get(pageId);
        }

        // 页面不存在于缓存中，需要加载
        const pagePath = `pages/${pageId}.html`;

        // 创建加载Promise
        const loadPromise = fetch(pagePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`加载页面失败: ${response.status} ${response.statusText}`);
                }
                return response.text();
            })
            .then(html => {
                // 等待过渡效果开始
                return new Promise(resolve => {
                    setTimeout(() => {
                        resolve(html);
                    }, this.transitionDuration);
                });
            })
            .then(html => {
                // 解析HTML内容
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                // 提取页面内容部分
                let pageContent = doc.querySelector('.page-content');
                if (!pageContent) {
                    // 如果没有.page-content，直接使用body内容
                    pageContent = doc.body.firstElementChild;
                    if (!pageContent) {
                        pageContent = document.createElement('div');
                        pageContent.innerHTML = html;
                    }
                }

                // 获取主内容区域
                const mainContent = document.querySelector('#main-content');

                if (mainContent) {
                    // 清空主内容区域（移除加载占位符）
                    mainContent.innerHTML = '';

                    // 为页面内容添加ID，以便后续可以找到它
                    pageContent.id = `${pageId}-content`;
                    pageContent.className = 'page-content';

                    // 添加页面内容
                    mainContent.appendChild(pageContent);
                    console.log(`页面 ${pageId} 内容已添加到主内容区域`);
                }

                // 对于首页，重置并重新初始化背景
                if (pageId === 'home') {
                    resetBackgroundInitialization();
                    setTimeout(() => {
                        initHeroBackground();
                    }, 100);
                }

                // 只有在非预加载模式下才立即添加active类
                if (!preload) {
                    pageContent.classList.add('active');
                } else {
                    // 预加载模式下，延迟添加active类，直到页面真正显示
                    console.log(`页面 ${pageId} 已预加载，但暂时不激活显示`);
                }

                // 注意：AppInitializer.init()不再在这里调用，而是在首次页面加载时统一初始化

                // 标记页面为已加载
                this.loadedPages.add(pageId);

                // 如果不是预加载模式，才隐藏过渡效果
                if (transitionLayer && !preload) {
                    setTimeout(() => {
                        transitionLayer.classList.remove('active');
                    }, 50);
                }

                return pageContent;
            })
            .catch(error => {
                console.error('页面加载错误:', error);
                // 创建错误提示页面
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

                // 添加到主内容区域
                const mainContent = document.querySelector('#main-content');
                if (mainContent) {
                    mainContent.appendChild(errorPage);
                }

                // 即使出错也要隐藏过渡效果
                if (transitionLayer) {
                    setTimeout(() => {
                        transitionLayer.classList.remove('active');
                    }, 50);
                }

                return errorPage;
            })
            .finally(() => {
                // 清除加载Promise
                this.loadingPromises.delete(pageId);
            });

        // 保存加载Promise
        this.loadingPromises.set(pageId, loadPromise);

        return loadPromise;
    }

    // 检查页面是否已加载
    isPageLoaded(pageId) {
        return this.loadedPages.has(pageId);
    }

    // 预加载页面 - 只加载但不添加到DOM
    preloadPage(pageId) {
        if (!this.isPageLoaded(pageId) && pageId !== 'home') {
            // 直接使用fetch预加载，不调用loadPage以避免DOM操作和页面切换
            const pagePath = `pages/${pageId}.html`;

            fetch(pagePath)
                .then(response => {
                    if (response.ok) {
                        console.log(`页面 ${pageId} 已预加载`);
                        // 标记为已加载但不添加到DOM
                        this.loadedPages.add(pageId);
                    }
                })
                .catch(error => {
                    console.error(`预加载页面 ${pageId} 失败:`, error);
                });
        }
    }
}

// 创建全局页面加载器实例
const pageLoader = new PageLoader();

// 单页应用页面切换功能
// 初始化loadingIndicator变量，但不立即显示
const loadingIndicator = document.querySelector('.loading-indicator');
if (loadingIndicator) {
    // 先隐藏加载指示器，等待3秒后再显示
    loadingIndicator.style.display = 'none';
    console.log('加载提示已初始化并暂时隐藏');
}

// 优先加载loading.avif动图
function loadLoadingGif() {
    const loadingGif = document.getElementById('loading-gif');
    const loadingSpinner = document.querySelector('.loading-spinner');

    if (loadingGif && loadingSpinner) {
        // 创建图片对象进行预加载
        const img = new Image();
        img.src = 'images/loading.avif';

        // 设置超时处理 - 确保即使图片加载缓慢也有响应
        const timeoutId = setTimeout(() => {
            console.warn('loading.avif 动图加载超时，保持默认动画');
            loadingGif.style.display = 'none';
            loadingSpinner.style.display = 'block';
        }, 3000); // 3秒超时

        // 加载成功
        img.onload = function () {
            clearTimeout(timeoutId); // 清除超时计时器
            console.log('loading.avif 动图加载成功，替换加载动画');
            loadingGif.src = 'images/loading.avif';
            loadingGif.style.display = 'block';
            loadingSpinner.style.display = 'none';

            // 保持按钮显示状态一致，不自动隐藏
            // 按钮的显示/隐藏由checkSkipButtonDisplay函数控制
        };

        // 加载失败
        img.onerror = function () {
            clearTimeout(timeoutId); // 清除超时计时器
            console.log('loading.avif 动图加载失败，使用默认动画');
            loadingGif.style.display = 'none';
            loadingSpinner.style.display = 'block';
        };
    }
}

// 记录加载开始时间
const loadStartTime = Date.now();
// 加载界面显示控制
let loadingIndicatorVisible = false;
let showLoadingTimeout = null;

// 延迟3秒后显示完整的加载界面
showLoadingTimeout = setTimeout(() => {
    // 只有在页面未完全加载时才显示加载界面
    if (!document.body.classList.contains('loaded') && loadingIndicator) {
        loadingIndicator.style.display = 'flex';
        loadingIndicator.style.opacity = '1';
        loadLoadingGif();
        loadingIndicatorVisible = true;
        console.log('3秒后显示完整加载界面');
    }
}, 3000);

// 如果页面加载完成，清除定时器防止加载界面显示
function cancelLoadingIndicator() {
    if (showLoadingTimeout) {
        clearTimeout(showLoadingTimeout);
        showLoadingTimeout = null;
    }
}

// 跟踪资源加载状态
let domCssLoaded = false;
let backgroundImagesLoaded = false;
let imagesLoadingCount = 0;

// 页面加载完成处理函数
let imagesTotalCount = 0;

// 完成加载的处理函数
function finishLoading() {
    try {
        // 隐藏加载界面
        const loadingIndicator = document.querySelector('.loading-indicator');
        if (loadingIndicator) {
            // 先淡出加载提示和进度条
            const loadingContent = loadingIndicator.querySelector('.loading-content');
            if (loadingContent) {
                loadingContent.style.opacity = '0';
                loadingContent.style.transform = 'translateY(20px)';
                loadingContent.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            }
            
            // 然后淡出整个加载指示器
            setTimeout(() => {
                loadingIndicator.style.opacity = '0';
                loadingIndicator.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                
                // 隐藏跳过按钮
                const skipButton = document.getElementById('skip-loading-btn');
                if (skipButton) {
                    skipButton.style.opacity = '0';
                    skipButton.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                    setTimeout(() => {
                        skipButton.style.display = 'none';
                    }, 600);
                }
                
                // 显示页面内容
                setTimeout(() => {
                    loadingIndicator.style.display = 'none';
                    // 添加加载完成的类
                    document.body.classList.add('loaded');
                    // 初始化动画
                    if (typeof AppInitializer !== 'undefined' && typeof AppInitializer.initAnimations === 'function') {
                        AppInitializer.initAnimations();
                    }
                }, 600);
            }, 600);
        }
        // 记录加载结束时间
        const loadEndTime = Date.now();
        console.log(`页面加载完成，耗时: ${loadEndTime - loadStartTime}ms`);
    } catch (error) {
        console.error('finishLoading执行出错:', error);
        // 即使出错也添加loaded类，确保页面能显示
        document.body.classList.add('loaded');
    }
}

// 启动资源加载过程
// 检查waitForAllResources函数是否存在
if (typeof waitForAllResources === 'function') {
    waitForAllResources();
} else {
    console.warn('waitForAllResources函数未定义，将在资源加载时自动处理');
}

// 显示跳过按钮
function showSkipButton() {
    const skipButton = document.getElementById('skip-loading-btn');
    if (skipButton) {
        skipButton.classList.add('show');
    }
}

// 进度更新变量
let progress = 0;
let progressInterval = null;

// 更新进度条
function updateProgress(percent) {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    if (progressFill && progressText) {
        // 确保进度至少为1%，不超过99%
        progress = Math.max(1, Math.min(99, percent));
        
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `${progress}%`;
    }
}

// 启动进度更新
function startProgressUpdate() {
    // 每500ms更新一次进度
    progressInterval = setInterval(() => {
        // 非线性进度增长逻辑，前期快，后期慢
        const growthRate = 100 - progress;
        const increment = Math.random() * growthRate * 0.05;
        progress += increment;
        updateProgress(progress);
        
        // 如果进度接近100%，停止自动更新
        if (progress >= 95) {
            clearInterval(progressInterval);
        }
    }, 500);
}

// 在DOM加载完成后启动进度更新
document.addEventListener('DOMContentLoaded', () => {
    startProgressUpdate();
});

// 添加一个后备机制，确保即使预加载过程出现问题也能完成加载
setTimeout(() => {
    if (!document.body.classList.contains('loaded')) {
        console.warn('加载过程超时，强制完成加载');
        finishLoading();
    }
}, 15000);

// 3秒后显示跳过按钮
setTimeout(() => {
    if (!document.body.classList.contains('loaded')) {
        showSkipButton();
    }
}, 3000);



        // 预加载所有资源的函数
        async function preloadAllResources() {
            console.log('开始预加载所有资源...');
            addConsoleLog('开始预加载所有资源...');

            try {
                // 图片资源列表
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

                // 页面资源列表
                const pageResources = [
                    'pages/home.html',
                    'pages/features.html',
                    'pages/join.html',
                    'pages/about.html'
                ];

                // 字体资源列表 - 只包含当前项目引用到的字体
                const fontResources = [
                    'fonts/fontawesome-free-6.4.0-web/webfonts/fa-solid-900.woff2',
                    'fonts/fontawesome-free-6.4.0-web/webfonts/fa-brands-400.woff2',
                    'fonts/fontawesome-free-6.4.0-web/webfonts/fa-regular-400.woff2'
                ];

                // 初始化计数器
                imagesTotalCount = imageResources.length;
                pagesTotalCount = pageResources.length;
                fontsTotalCount = fontResources.length;

                updateProgress();

                // 添加超时机制
                const timeoutPromise = new Promise((resolve) => {
                    setTimeout(() => {
                        console.warn('预加载超时，跳过剩余资源加载');
                        addConsoleLog('预加载超时，跳过剩余资源加载');
                        resolve();
                    }, 15000); // 15秒超时
                });

                // 预加载图片
                const imagePromises = imageResources.map(imgSrc => {
                    return new Promise((resolve) => {
                        imagesLoadingCount++;
                        const img = new Image();
                        img.onload = () => {
                            imagesLoadingCount--;
                            console.log(`图片加载完成: ${imgSrc}, 剩余: ${imagesLoadingCount}`);
                            addConsoleLog(`图片加载完成: ${imgSrc}`);
                            updateProgress();
                            resolve();
                        };
                        img.onerror = () => {
                            imagesLoadingCount--;
                            console.warn(`图片加载失败: ${imgSrc}, 但继续加载其他资源`);
                            addConsoleLog(`图片加载失败: ${imgSrc}`);
                            updateProgress();
                            resolve(); // 失败时也继续
                        };
                        img.src = imgSrc;
                    });
                });

                // 预加载页面
                const pagePromises = pageResources.map(pageSrc => {
                    return new Promise((resolve) => {
                        pagesLoadingCount++;
                        fetch(pageSrc)
                            .then(() => {
                                pagesLoadingCount--;
                                console.log(`页面预加载完成: ${pageSrc}, 剩余: ${pagesLoadingCount}`);
                                addConsoleLog(`页面预加载完成: ${pageSrc}`);
                                updateProgress();
                                resolve();
                            })
                            .catch(() => {
                                pagesLoadingCount--;
                                console.warn(`页面预加载失败: ${pageSrc}, 但继续加载其他资源`);
                                addConsoleLog(`页面预加载失败: ${pageSrc}`);
                                updateProgress();
                                resolve(); // 失败时也继续
                            });
                    });
                });

                // 预加载字体
                const fontPromises = fontResources.map(fontSrc => {
                    return new Promise((resolve) => {
                        fontsLoadingCount++;
                        // 使用FontFace API加载字体
                        const font = new FontFace('FontAwesome', `url(${fontSrc})`);
                        font.load()
                            .then(() => {
                                fontsLoadingCount--;
                                console.log(`字体加载完成: ${fontSrc}, 剩余: ${fontsLoadingCount}`);
                                addConsoleLog(`字体加载完成: ${fontSrc}`);
                                updateProgress();
                                resolve();
                            })
                            .catch(() => {
                                fontsLoadingCount--;
                                console.warn(`字体加载失败: ${fontSrc}, 但继续加载其他资源`);
                                addConsoleLog(`字体加载失败: ${fontSrc}`);
                                updateProgress();
                                resolve(); // 失败时也继续
                            });
                    });
                });

                // 等待所有资源加载完成或超时
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

        // 启动资源加载过程
        // 检查waitForAllResources函数是否存在
        if (typeof waitForAllResources === 'function') {
            waitForAllResources();
        } else {
            console.warn('waitForAllResources函数未定义，将在资源加载时自动处理');
        }

        // 添加一个后备机制，确保即使预加载过程出现问题也能完成加载
        setTimeout(() => {
            if (!document.body.classList.contains('loaded')) {
                console.warn('加载过程超时，强制完成加载');

                // 设置跳过加载按钮功能
                function setupSkipLoadingButton() {
                    const skipButton = document.getElementById('skip-loading-btn');

                    if (skipButton) {
                        skipButton.addEventListener('click', function () {
                            console.log('用户点击了"不等了，先看文字"按钮，跳过加载');
                            finishLoading();
                        });
                    } else {
                        console.warn('跳过加载按钮未找到');
                    }
                }

                // 检查是否需要显示跳过按钮 - 彻底修复循环问题
                async function checkSkipButtonDisplay() {
                    try {
                        // 如果页面已经加载完成，清除定时器并返回
                        if (document.body.classList.contains('loaded')) {
                            if (skipButtonCheckInterval) {
                                clearInterval(skipButtonCheckInterval);
                                skipButtonCheckInterval = null;
                                console.log('页面已加载完成，清除跳过按钮检查定时器');
                            }
                            return;
                        }

                        // 获取按钮元素
                        const skipButton = document.getElementById('skip-loading-btn');
                        if (!skipButton) {
                            // 确保清除定时器，避免循环
                            if (skipButtonCheckInterval) {
                                clearInterval(skipButtonCheckInterval);
                                skipButtonCheckInterval = null;
                            }
                            return;
                        }

                        // 安全检查并初始化变量
                        const safeDomCssLoaded = typeof domCssLoaded !== 'undefined' ? domCssLoaded : false;
                        const safeImagesLoadingCount = typeof imagesLoadingCount !== 'undefined' ? imagesLoadingCount : 0;
                        const safeFontsLoadingCount = typeof fontsLoadingCount !== 'undefined' ? fontsLoadingCount : 0;
                        const safeImagesTotalCount = typeof imagesTotalCount !== 'undefined' ? imagesTotalCount : 0;
                        const safeLoadStartTime = typeof loadStartTime !== 'undefined' ? loadStartTime : Date.now();

                        // 只有在CSS、JS、HTML加载完成但图片和字体资源仍在加载时才显示按钮
                        const htmlCssJsLoaded = safeDomCssLoaded; // HTML、CSS、JS已加载
                        const assetsStillLoading = (safeImagesLoadingCount > 0 || safeFontsLoadingCount > 0); // 图片或字体仍在加载
                        const pageNotLoaded = !document.body.classList.contains('loaded'); // 页面还未完全加载

                        // 增加时间限制：只有在加载超过5秒后才显示跳过按钮
                        const currentTime = Date.now();
                        const elapsedTime = currentTime - safeLoadStartTime;
                        const loadingLongEnough = elapsedTime >= 5000; // 5秒

                        // 优化日志输出：每2秒才输出一次状态，避免日志过多
                        const currentSecond = Math.floor(elapsedTime / 2000);
                        if (!window.lastLogSecond || window.lastLogSecond !== currentSecond) {
                            window.lastLogSecond = currentSecond;
                            console.log(`加载状态更新 (${Math.floor(elapsedTime / 1000)}秒): 图片剩余 ${safeImagesLoadingCount}/${safeImagesTotalCount}`);
                        }

                        // 修改显示条件：加载足够长时间且满足其他条件时才显示按钮
                        if (htmlCssJsLoaded && assetsStillLoading && pageNotLoaded && loadingLongEnough) {
                            // 避免重复设置display
                            if (skipButton.style.display !== 'block') {
                                skipButton.style.display = 'block';
                                // 添加淡入动画效果
                                setTimeout(() => {
                                    skipButton.classList.add('show');
                                }, 10);
                                console.log('显示跳过加载按钮：加载时间超过5秒且资源仍在加载');
                            }
                        } else {
                            // 避免重复设置display
                            if (skipButton.style.display !== 'none') {
                                // 添加淡出动画效果
                                skipButton.classList.remove('show');
                                setTimeout(() => {
                                    skipButton.style.display = 'none';
                                }, 500);
                            }
                        }
                    } catch (error) {
                        console.error('检查跳过按钮显示状态出错:', error);
                        // 出错时确保清除定时器，防止无限循环
                        if (skipButtonCheckInterval) {
                            clearInterval(skipButtonCheckInterval);
                            skipButtonCheckInterval = null;
                        }
                    }
                }

                // 初始化跳过按钮功能
                setupSkipLoadingButton();

                document.addEventListener('DOMContentLoaded', () => {
                    // 获取所有导航链接
                    const navLinks = document.querySelectorAll('.nav-link[data-page]');
                    const footer = document.querySelector('footer');

                    // 添加初始日志
                    addConsoleLog('DOM内容加载完成');
                    updateProgress();

                    // 只有在3秒后且页面未完全加载时才显示加载提示
                    if (loadingIndicator && !document.body.classList.contains('loaded')) {
                        // 检查是否已经过了3秒
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

                    // 只有在页面未加载完成时才启动定时器检查
                    if (!document.body.classList.contains('loaded')) {
                        // 立即检查是否需要显示跳过按钮
                        checkSkipButtonDisplay();

                        // 定时检查，确保在图片加载过程中也能正确显示按钮
                        // 保存定时器ID，以便在页面加载完成后清除
                        // 确保只创建一个定时器，防止多个定时器导致循环
                        if (!skipButtonCheckInterval) {
                            skipButtonCheckInterval = setInterval(checkSkipButtonDisplay, 1000); // 降低频率到1秒，减少资源消耗
                            console.log('启动跳过按钮检查定时器，每1秒检查一次');
                        }
                    }

                    // 选择性预加载 - 只预加载可能会快速访问的页面
                    // 延迟预加载以避免影响首页加载性能
                    setTimeout(() => {
                        // 只预加载'features'页面，其他页面在需要时再加载
                        pageLoader.preloadPage('features');
                        console.log('已预加载主要页面');
                        addConsoleLog('已预加载主要页面');
                    }, 3000);

                    // 页面切换函数 - 使用异步加载
                    async function switchPage(pageId) {
                        console.log(`[路由] 尝试切换到页面: ${pageId}`);

                        // 验证页面ID是否有效
                        const validPages = ['home', 'features', 'join', 'about'];
                        if (!validPages.includes(pageId)) {
                            console.error(`[路由] 无效的页面ID: ${pageId}`);
                            return;
                        }

                        // 获取目标页面ID
                        const targetPageId = `${pageId}-content`;

                        // 首先确保加载页面内容，无论当前是否已在目标页面
                        try {
                            // 强制重新加载页面内容，确保最新内容显示
                            pageLoader.loadedPages.delete(pageId);
                            await pageLoader.loadPage(pageId);
                            console.log(`[路由] 页面 ${pageId} 加载成功`);
                        } catch (error) {
                            console.error('[路由] 页面加载失败:', error);
                            showNotification(`页面加载失败: ${error.message}`);
                            return; // 如果加载失败，终止切换
                        }

                        // 获取目标页面（此时应该已存在）
                        const targetPage = document.getElementById(targetPageId);
                        if (!targetPage) {
                            console.error(`[路由] 无法找到页面元素: ${targetPageId}`);
                            return;
                        }

                        // 获取当前活跃页面
                        const currentActivePage = document.querySelector('.page-content.active');

                        // 更新导航链接
                        navLinks.forEach(link => {
                            link.classList.remove('active');
                        });

                        // 添加active类到目标导航链接
                        const targetLink = document.querySelector(`.nav-link[data-page="${pageId}"]`);
                        if (targetLink) {
                            targetLink.classList.add('active');
                        }

                        // 执行页面切换动画 - 无论是否已在目标页面都执行切换逻辑
                        // 确保过渡层激活
                        const transitionLayer = document.querySelector('.page-transition');
                        if (transitionLayer) {
                            transitionLayer.classList.add('active');
                        }

                        // 隐藏当前页面（如果存在）
                        if (currentActivePage) {
                            currentActivePage.style.opacity = '0';
                            if (footer) {
                                footer.style.opacity = '0';
                            }
                        }

                        // 使用统一的切换逻辑，确保无论从哪个页面切换都能正常工作
                        setTimeout(() => {
                            // 隐藏当前页面
                            if (currentActivePage) {
                                currentActivePage.style.display = 'none';
                                currentActivePage.classList.remove('active'); // 移除当前页面的active类
                            }

                            // 显示目标页面
                            targetPage.style.display = 'block';
                            targetPage.classList.add('active'); // 确保添加active类
                            targetPage.style.opacity = '0';
                            targetPage.offsetHeight; // 触发重排
                            targetPage.style.opacity = '1';

                            setTimeout(() => {
                                targetPage.style.opacity = '';
                            }, 300);

                            console.log(`[路由] 切换到页面: ${pageId}`);

                            // 页脚淡入
                            if (footer) {
                                footer.offsetHeight; // 触发重排
                                footer.style.opacity = '1';
                            }

                            // 隐藏过渡效果
                            if (transitionLayer) {
                                setTimeout(() => {
                                    transitionLayer.classList.remove('active');
                                }, 50);
                            }
                        }, 300);

                        // 如果是首页，重置并重新初始化背景
                        if (pageId === 'home') {
                            resetBackgroundInitialization();
                            // 延迟确保DOM更新完成
                            setTimeout(() => {
                                initHeroBackground();
                            }, 100);
                        }

                        window.scrollTo(0, 0);

                        // 更新浏览器历史记录
                        const pageTitle = getPageTitle(pageId);
                        history.pushState({ page: pageId }, pageTitle, `/${getPagePath(pageId)}`);

                        // 更新页面标题
                        document.title = pageTitle;

                        console.log(`[路由] 页面切换完成: ${pageId}`);
                    }

                    // 获取页面标题
                    function getPageTitle(pageId) {
                        const titles = {
                            'home': '雨州Minecraft服务器',
                            'features': '服务器特色 - 雨州Minecraft服务器',
                            'join': '加入指南 - 雨州Minecraft服务器',
                            'about': '关于我们 - 雨州Minecraft服务器'
                        };
                        return titles[pageId] || '雨州Minecraft服务器';
                    }

                    // 获取页面路径
                    function getPagePath(pageId) {
                        const paths = {
                            'home': '',
                            'features': 'features',
                            'join': 'join',
                            'about': 'about'
                        };
                        return paths[pageId] || '';
                    }

                    // 根据路径获取页面ID
                    function getPageIdFromPath(path) {
                        // 移除开头的斜杠
                        if (path.startsWith('/')) {
                            path = path.substring(1);
                        }

                        const paths = {
                            '': 'home',
                            'features': 'features',
                            'join': 'join',
                            'about': 'about'
                        };
                        return paths[path] || 'home';
                    }

                    // 页面加载时检查URL路径并切换到相应页面
                    async function checkInitialPage() {
                        console.log('[路由] 开始检查初始页面');

                        // 定义有效的页面ID列表
                        const validPages = ['home', 'features', 'join', 'about'];

                        // 定义有效的页面路径映射
                        const pathToPageId = {
                            '': 'home',
                            'home': 'home',
                            'features': 'features',
                            'join': 'join',
                            'about': 'about'
                        };

                        // 解析路径获取页面ID的辅助函数
                        function parsePageIdFromPath(path) {
                            // 清理路径
                            let cleanPath = path.trim();
                            if (cleanPath.startsWith('/')) {
                                cleanPath = cleanPath.substring(1);
                            }
                            if (cleanPath.endsWith('/')) {
                                cleanPath = cleanPath.substring(0, cleanPath.length - 1);
                            }

                            // 获取第一部分路径
                            const pathPart = cleanPath.split('/')[0];
                            console.log('[路由] 清理后的路径部分:', pathPart);

                            // 返回对应的页面ID或默认值
                            return pathToPageId[pathPart] || 'home';
                        }

                        // 1. 优先处理从404页面重定向过来的路径
                        let redirectPath = null;
                        try {
                            if (sessionStorage) {
                                // 尝试多种可能的存储键名，确保兼容性
                                redirectPath = sessionStorage.getItem('githubPagesRedirectPath') ||
                                    sessionStorage.getItem('redirectPath');
                                // 无论如何都清除sessionStorage中的值，避免影响后续操作
                                sessionStorage.removeItem('githubPagesRedirectPath');
                                sessionStorage.removeItem('redirectPath');
                                console.log('[路由] 重定向路径处理:', redirectPath);
                            }
                        } catch (e) {
                            console.error('[路由] 读取或清除sessionStorage失败:', e);
                        }

                        let targetPageId = 'home';

                        if (redirectPath) {
                            console.log('[路由] 检测到重定向路径:', redirectPath);
                            // 从重定向路径解析页面ID
                            targetPageId = parsePageIdFromPath(redirectPath);
                        } else {
                            // 2. 如果没有重定向路径，则从当前URL解析
                            const currentPath = window.location.pathname;
                            console.log('[路由] 当前路径:', currentPath);
                            targetPageId = parsePageIdFromPath(currentPath);
                        }

                        console.log('[路由] 确定的目标页面ID:', targetPageId);

                        // 确保目标页面ID有效
                        if (!validPages.includes(targetPageId)) {
                            console.warn('[路由] 无效的页面ID，默认使用home:', targetPageId);
                            targetPageId = 'home';
                        }

                        try {
                            // 切换到目标页面
                            await switchPage(targetPageId);

                            // 更新页面标题
                            const pageTitle = getPageTitle(targetPageId);
                            document.title = pageTitle;

                            // 更新浏览器历史记录，确保URL路径正确
                            const targetPath = `/${getPagePath(targetPageId)}`;
                            if (window.location.pathname !== targetPath) {
                                try {
                                    history.replaceState({ page: targetPageId }, pageTitle, targetPath);
                                    console.log('[路由] 已更新浏览器历史记录到:', targetPath);
                                } catch (e) {
                                    console.error('[路由] 更新历史记录失败:', e);
                                }
                            }

                            console.log('[路由] 初始页面检查和加载完成');
                        } catch (error) {
                            console.error('[路由] 加载目标页面失败:', error);
                            // 即使加载失败，也确保用户看到一个有效的页面
                            try {
                                await switchPage('home');
                                document.title = getPageTitle('home');
                            } catch (e) {
                                console.error('[路由] 恢复到首页也失败:', e);
                            }
                        }
                    }

                    // 检查初始页面
                    checkInitialPage();

                    // 初始化应用程序组件
                    AppInitializer.init();

                    // 事件监听器
                    // 为导航链接添加点击事件
                    navLinks.forEach(link => {
                        link.addEventListener('click', async (e) => {
                            e.preventDefault();
                            const pageId = link.getAttribute('data-page');
                            await switchPage(pageId);

                            // 关闭移动端菜单
                            const hamburger = document.querySelector('.hamburger');
                            const navMenu = document.querySelector('.nav-menu');
                            if (hamburger && navMenu) {
                                hamburger.classList.remove('active');
                                navMenu.classList.remove('active');
                            }
                        });
                    });

                    // 为带有data-page属性的按钮添加点击事件
                    document.querySelectorAll('.btn[data-page]').forEach(button => {
                        button.addEventListener('click', async (e) => {
                            e.preventDefault();
                            const pageId = button.getAttribute('data-page');
                            await switchPage(pageId);
                        });
                    });

                    // 为页脚链接添加点击事件
                    document.querySelectorAll('.footer-nav-link').forEach(link => {
                        link.addEventListener('click', async (e) => {
                            e.preventDefault();
                            const pageId = link.getAttribute('data-page');
                            await switchPage(pageId);
                        });
                    });

                    // 为logo区域添加点击事件，切换到首页
                    const logoArea = document.querySelector('.logo');
                    if (logoArea) {
                        logoArea.addEventListener('click', async (e) => {
                            e.preventDefault();
                            await switchPage('home');

                            // 关闭移动端菜单
                            const hamburger = document.querySelector('.hamburger');
                            const navMenu = document.querySelector('.nav-menu');
                            if (hamburger && navMenu) {
                                hamburger.classList.remove('active');
                                navMenu.classList.remove('active');
                            }
                        });
                    }

                    // 监听浏览器的后退/前进按钮
                    window.addEventListener('popstate', async function (event) {
                        let pageId = 'home';
                        if (event.state && event.state.page) {
                            pageId = event.state.page;
                        } else {
                            // 从当前URL路径获取页面ID
                            const path = window.location.pathname;
                            pageId = getPageIdFromPath(path);
                        }
                        await switchPage(pageId);

                        // 更新页面标题
                        document.title = getPageTitle(pageId);
                    });
                });

                // 统一的应用程序初始化器 - 防止重复初始化
                const AppInitializer = {
                    initialized: false,
                    init() {
                        if (this.initialized) {
                            console.log('应用已初始化，跳过重复初始化');
                            return;
                        }

                        console.log('开始应用程序初始化');
                        this.initialized = true;

                        // 初始化页面组件
                        this.initPageComponents();
                        this.initCopyFeatures();
                        // 注意：动画初始化已移至finishLoading函数中，确保在页面完全加载后才执行
                        this.initBackgroundEffects();
                    },

                    initPageComponents() {
                        // 复制按钮功能
                        document.querySelectorAll('.copy-btn').forEach(button => {
                            button.isCopying = false;

                            button.addEventListener('click', function () {
                                if (this.isCopying) {
                                    return;
                                }

                                const textToCopy = this.getAttribute('data-copy');

                                // 检查clipboard API是否可用
                                if (navigator.clipboard && window.isSecureContext) {
                                    // 使用现代clipboard API
                                    navigator.clipboard.writeText(textToCopy).then(() => {
                                        const originalText = this.innerHTML;
                                        this.innerHTML = '<i class="fas fa-check"></i> 已复制';
                                        this.isCopying = true;

                                        setTimeout(() => {
                                            this.innerHTML = originalText;
                                            this.isCopying = false;
                                        }, 3000);
                                    }).catch(err => {
                                        console.error('复制失败: ', err);
                                        this.isCopying = false;
                                        // 提示用户手动复制
                                        alert('无法自动复制，请手动复制: ' + textToCopy);
                                    });
                                } else {
                                    // 降级处理：使用传统的execCommand方法
                                    try {
                                        const textArea = document.createElement("textarea");
                                        textArea.value = textToCopy;

                                        // 避免滚动到底部
                                        textArea.style.top = "0";
                                        textArea.style.left = "0";
                                        textArea.style.position = "fixed";
                                        textArea.style.opacity = "0";

                                        document.body.appendChild(textArea);
                                        textArea.focus();
                                        textArea.select();

                                        const successful = document.execCommand('copy');
                                        document.body.removeChild(textArea);

                                        if (successful) {
                                            const originalText = this.innerHTML;
                                            this.innerHTML = '<i class="fas fa-check"></i> 已复制';
                                            this.isCopying = true;

                                            setTimeout(() => {
                                                this.innerHTML = originalText;
                                                this.isCopying = false;
                                            }, 3000);
                                        } else {
                                            throw new Error('execCommand failed');
                                        }
                                    } catch (err) {
                                        console.error('复制失败: ', err);
                                        this.isCopying = false;
                                        // 提示用户手动复制
                                        alert('无法自动复制，请手动复制: ' + textToCopy);
                                    }
                                }
                            });
                        });

                        // 平滑滚动效果 - 仅用于页面内锚点
                        document.querySelectorAll('a[href^="#"]:not([data-page])').forEach(anchor => {
                            anchor.addEventListener('click', function (e) {
                                e.preventDefault();
                                const target = document.querySelector(this.getAttribute('href'));
                                if (target) {
                                    target.scrollIntoView({
                                        behavior: 'smooth',
                                        block: 'start'
                                    });
                                }
                            });
                        });
                    },

                    initCopyFeatures() {
                        const serverIPElement = document.querySelector('.server-ip');
                        const qqGroupElement = document.querySelector('.server-qq');

                        // 优化后的事件处理函数，使用统一的事件处理方式
                        function addCopyEvent(element, callback, title) {
                            if (element) {
                                element.style.cursor = 'pointer';
                                element.title = title;

                                // 使用click事件作为主要交互方式
                                // 移除touchstart事件避免事件冲突
                                element.addEventListener('click', (e) => {
                                    // 只阻止冒泡，不阻止默认行为
                                    e.stopPropagation();

                                    // 立即执行复制操作
                                    callback();
                                });

                                // 添加touchend事件作为备用，但不阻止默认行为
                                element.addEventListener('touchend', (e) => {
                                    // 确保不与click事件冲突
                                    // 只阻止冒泡，不阻止默认行为
                                    e.stopPropagation();

                                    // 检查目标元素是否为复制按钮或其子元素
                                    if (element.contains(e.target)) {
                                        // 添加微小延迟确保不与click冲突
                                        setTimeout(() => {
                                            callback();
                                        }, 50);
                                    }
                                }, { passive: true }); // 使用passive提高性能
                            }
                        }

                        addCopyEvent(serverIPElement, copyServerIP, '点击复制服务器IP');
                        addCopyEvent(qqGroupElement, copyQQGroup, '点击复制QQ群号');
                    },

                    initAnimations() {
                        // 滚动显示动画
                        const observerOptions = {
                            threshold: 0.1,
                            rootMargin: '0px 0px -50px 0px'
                        };

                        const observer = new IntersectionObserver((entries) => {
                            entries.forEach(entry => {
                                if (entry.isIntersecting) {
                                    entry.target.style.opacity = '1';
                                    entry.target.style.transform = 'translateY(0)';
                                }
                            });
                        }, observerOptions);

                        // 为需要动画的元素添加观察
                        const animatedElements = document.querySelectorAll('.status-item, .news-card');
                        animatedElements.forEach(el => {
                            el.style.opacity = '0';
                            el.style.transform = 'translateY(20px)';
                            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                            observer.observe(el);
                        });
                    },

                    initBackgroundEffects() {
                        // 鼠标移动视差效果
                        document.addEventListener('mousemove', (e) => {
                            const hero = document.querySelector('.hero');
                            const heroBg = document.querySelector('.hero-bg');
                            const heroBgLayer = document.querySelector('.hero-bg-layer');

                            if (hero && heroBg && heroBgLayer) {
                                const x = e.clientX / window.innerWidth;
                                const y = e.clientY / window.innerHeight;

                                // 主背景图移动（较小幅度）
                                const moveX1 = (x - 0.5) * 40;
                                const moveY1 = (y - 0.5) * 40;

                                // 次背景层移动（较大幅度）
                                const moveX2 = (x - 0.5) * 80;
                                const moveY2 = (y - 0.5) * 80;

                                // 应用移动效果
                                heroBg.style.transform = `translate(${moveX1}px, ${moveY1}px)`;
                                heroBgLayer.style.transform = `translate(${moveX2}px, ${moveY2}px)`;
                            }
                        });
                    }
                };

                // 页面加载后检查是否有重定向路径需要处理
                // 注意：路由处理逻辑已移至DOMContentLoaded事件中，此处仅保留背景图片初始化和页面滚动
                // 此监听器已被下方统一的加载监听器取代，保留作为备份注释
                /* window.addEventListener('load', function() {
                    console.log('页面资源加载完成');
                    // 添加loaded类到body，使页面内容显示
                    document.body.classList.add('loaded');
                    
                    // 只在页面完全加载后才初始化背景
                    setTimeout(() => {
                        initHeroBackground();
                    }, 200);
                }); */

                // 背景图片加载管理器 - 优化缓存机制
                const BackgroundImageManager = {
                    initialized: false,
                    loading: false,
                    cachedImages: {}, // 存储已缓存的图片

                    // 清理URL中的查询参数，确保使用一致的URL作为缓存键
                    cleanUrl(url) {
                        if (typeof url !== 'string') return url;

                        // 解码URL（处理中文等特殊字符）
                        let decodedUrl;
                        try {
                            decodedUrl = decodeURIComponent(url);
                        } catch (e) {
                            decodedUrl = url; // 如果解码失败，使用原始URL
                        }

                        // 移除查询参数
                        let cleanUrl = decodedUrl.split('?')[0];

                        // 确保图片URL路径正确
                        // 如果URL是相对路径但不以images/开头，则添加images/前缀
                        if (!cleanUrl.startsWith('http') && !cleanUrl.startsWith('/') && !cleanUrl.startsWith('images/')) {
                            cleanUrl = 'images/' + cleanUrl;
                        }

                        return cleanUrl;
                    },

                    init() {
                        if (this.initialized || this.loading) {
                            console.log('背景图片管理器: 已初始化或正在初始化，跳过');
                            return;
                        }

                        this.loading = true;
                        console.log('开始初始化背景图片');

                        try {
                            const heroSection = document.querySelector('.hero');
                            if (!heroSection) {
                                console.log('背景图片管理器: 未找到hero元素');
                                this.loading = false;
                                return;
                            }

                            const heroBg = heroSection.querySelector('.hero-bg');
                            const heroBgLayer = heroSection.querySelector('.hero-bg-layer');

                            if (!heroBg || !heroBgLayer) {
                                console.log('背景图片管理器: 未找到背景元素');
                                this.loading = false;
                                return;
                            }

                            // 验证DOM元素的有效性
                            if (!heroBg.style || !heroBgLayer.style) {
                                console.error('背景元素样式属性无效');
                                this.loading = false;
                                return;
                            }

                            // 设置初始状态
                            heroBg.style.opacity = '0';
                            heroBgLayer.style.opacity = '0';

                            // 预加载所有背景图片
                            this.preloadAllImages().then(() => {
                                console.log('所有背景图片预加载成功');
                                this.setBackgroundStyles(heroBg, heroBgLayer);
                                this.initialized = true;
                                this.loading = false;
                                document.body.dataset.backgroundInitialized = 'true';
                            }).catch(error => {
                                console.error('背景图片加载失败:', error);
                                this.loading = false;
                                // 即使失败也设置基本样式
                                this.setFallbackBackground(heroBg, heroBgLayer);
                            });
                        } catch (error) {
                            console.error('初始化背景图片时发生错误:', error);
                            this.loading = false;
                            // 尝试设置备用背景
                            const heroSection = document.querySelector('.hero');
                            if (heroSection) {
                                const heroBg = heroSection.querySelector('.hero-bg');
                                const heroBgLayer = heroSection.querySelector('.hero-bg-layer');
                                if (heroBg && heroBgLayer) {
                                    this.setFallbackBackground(heroBg, heroBgLayer);
                                }
                            }
                        }
                    },

                    // 预加载单张图片 - 添加循环请求防护
                    preloadImage(src) {
                        // 清理URL
                        const cleanSrc = this.cleanUrl(src);

                        // 如果图片已经缓存，直接返回成功
                        if (this.cachedImages[cleanSrc]) {
                            console.log(`图片 ${cleanSrc} 已在缓存中，直接使用`);
                            return Promise.resolve(this.cachedImages[cleanSrc]);
                        }

                        // 防止对同一图片的重复加载
                        if (this._loadingPromises && this._loadingPromises[cleanSrc]) {
                            console.log(`图片 ${cleanSrc} 正在加载中，返回现有Promise`);
                            return this._loadingPromises[cleanSrc];
                        }

                        // 初始化加载Promise集合
                        if (!this._loadingPromises) {
                            this._loadingPromises = {};
                        }

                        // 创建加载Promise
                        const loadingPromise = new Promise((resolve, reject) => {
                            const img = new Image();

                            // 增加调试信息
                            console.log(`开始加载图片: ${cleanSrc}`);

                            img.onload = () => {
                                this.cachedImages[cleanSrc] = img; // 缓存已加载的图片
                                console.log(`图片 ${cleanSrc} 加载完成并缓存`);
                                delete this._loadingPromises[cleanSrc]; // 清除加载中的Promise
                                resolve(img);
                            };
                            img.onerror = (err) => {
                                console.error(`图片 ${cleanSrc} 加载失败`, err);
                                delete this._loadingPromises[cleanSrc]; // 清除加载中的Promise

                                // 不再尝试使用替代路径，直接拒绝以避免循环请求
                                reject(err);
                            };

                            // 移除cache_bust参数，允许浏览器缓存
                            img.src = cleanSrc;

                            // 设置超时防止无限等待
                            setTimeout(() => {
                                if (!img.complete) {
                                    const error = new Error('图片加载超时');
                                    console.error(`图片 ${cleanSrc} 加载超时`);
                                    delete this._loadingPromises[cleanSrc]; // 清除加载中的Promise
                                    reject(error);
                                }
                            }, 5000);
                        });

                        // 保存加载中的Promise
                        this._loadingPromises[cleanSrc] = loadingPromise;
                        return loadingPromise;
                    },

                    // 获取备用图片路径 - 防止无限循环
                    getFallbackPath(originalPath) {
                        // 如果已经尝试过这个路径，返回null防止循环
                        if (this._triedPaths && this._triedPaths.has(originalPath)) {
                            console.warn(`已经尝试过路径 ${originalPath}，避免循环`);
                            return null;
                        }

                        // 初始化已尝试路径集合
                        if (!this._triedPaths) {
                            this._triedPaths = new Set();
                        }

                        // 记录当前尝试的路径
                        this._triedPaths.add(originalPath);

                        // 尝试不同的路径组合 - 简化逻辑，只尝试最可能的路径
                        const possiblePaths = [
                            originalPath, // 原始路径
                            originalPath.replace('images/', '') // 移除images/前缀
                        ];

                        // 返回一个不在原路径中且未尝试过的备用路径
                        for (let path of possiblePaths) {
                            if (path !== originalPath && !this._triedPaths.has(path)) {
                                return path;
                            }
                        }

                        return null; // 没有可用的备用路径
                    },

                    // 预加载所有背景图片 - 添加失败计数和熔断机制
                    preloadAllImages() {
                        const imagesToLoad = getBackgroundImages() || ['images/主页背景图/1.jpg'];
                        console.log('需要预加载的图片列表:', imagesToLoad);

                        // 初始化失败计数器
                        if (!this._failureCount) this._failureCount = 0;
                        if (!this._maxFailures) this._maxFailures = 5; // 最大失败次数

                        // 检查是否超过最大失败次数
                        if (this._failureCount >= this._maxFailures) {
                            console.warn(`图片加载失败次数过多(${this._failureCount})，启用熔断机制，跳过预加载`);
                            return Promise.resolve([]); // 返回空数组，跳过预加载
                        }

                        // 使用Promise.allSettled替代Promise.all，允许部分图片加载失败但其他图片仍能使用
                        const promises = imagesToLoad.map(src => this.preloadImage(src)
                            .catch(err => {
                                console.warn(`单张图片加载失败，但继续尝试其他图片: ${src}`, err);
                                this._failureCount++; // 增加失败计数
                                return null; // 返回null表示此图片加载失败但不中断整体流程
                            }));

                        return Promise.allSettled(promises).then(results => {
                            // 过滤出成功的结果
                            const successfulLoads = results.filter(result => result.status === 'fulfilled' && result.value !== null);
                            console.log(`预加载完成，成功: ${successfulLoads.length}/${imagesToLoad.length} 张图片`);

                            // 如果所有图片都加载失败，增加失败计数
                            if (successfulLoads.length === 0) {
                                this._failureCount++;
                                console.warn(`所有图片加载失败，失败计数: ${this._failureCount}/${this._maxFailures}`);
                            } else {
                                // 有图片加载成功，重置失败计数
                                this._failureCount = 0;
                            }

                            return successfulLoads.map(result => result.value);
                        });
                    },

                    // 检查图片是否已缓存
                    isImageCached(src) {
                        const cleanSrc = this.cleanUrl(src);
                        return !!this.cachedImages[cleanSrc];
                    },

                    setBackgroundStyles(heroBg, heroBgLayer) {
                        console.log('设置背景样式');

                        try {
                            // 确定要使用的图片 - 添加错误处理
                            const fallbackImage = 'images/主页背景图/1.jpg';
                            let imageToUse = fallbackImage;

                            // 安全地获取背景图片列表
                            let images = [];
                            try {
                                images = getBackgroundImages ? getBackgroundImages() : null;
                            } catch (error) {
                                console.warn('获取背景图片列表失败，使用默认图片:', error);
                                images = null;
                            }

                            // 检查图片列表是否有效
                            if (images && Array.isArray(images) && images.length > 0) {
                                // 验证第一张图片是否有效
                                const firstImage = images[0];
                                if (firstImage && typeof firstImage === 'string' && firstImage.trim() !== '') {
                                    imageToUse = this.cleanUrl(firstImage);
                                    console.log(`使用第一张图片: ${imageToUse}`);
                                } else {
                                    console.warn('第一张图片无效，使用默认图片');
                                }
                            } else {
                                console.log('没有可用的背景图片，使用默认图片');
                            }

                            // 验证最终选择的图片路径
                            if (!imageToUse || typeof imageToUse !== 'string' || imageToUse.trim() === '') {
                                console.warn('图片路径无效，使用默认备用图片');
                                imageToUse = fallbackImage;
                            }

                            console.log(`最终使用图片: ${imageToUse}`);

                            // 设置背景图片
                            heroBg.style.backgroundImage = `url('${imageToUse}')`;
                            heroBg.style.backgroundSize = 'cover';
                            heroBg.style.backgroundPosition = 'center';
                            heroBg.style.backgroundRepeat = 'no-repeat';
                            heroBg.style.opacity = '0';
                            heroBg.style.transform = 'translate(0, 0)';

                            // heroBgLayer设置
                            heroBgLayer.style.background = 'rgba(0, 0, 0, 0.15)';
                            heroBgLayer.style.opacity = '0';
                            heroBgLayer.style.transform = 'translate(0, 0)';

                            // 延迟显示背景，添加错误处理
                            const showBackground = () => {
                                try {
                                    heroBg.style.opacity = '1';
                                    heroBgLayer.style.opacity = '0.3';
                                    console.log('背景样式设置成功');
                                } catch (error) {
                                    console.error('显示背景时出错:', error);
                                    this.setFallbackBackground(heroBg, heroBgLayer);
                                }
                            };

                            setTimeout(showBackground, 100);

                        } catch (error) {
                            console.error('设置背景样式时出错:', error);
                            this.setFallbackBackground(heroBg, heroBgLayer);
                        }
                    },

                    setFallbackBackground(heroBg, heroBgLayer) {
                        console.log('设置备用背景样式');

                        try {
                            // 验证DOM元素是否存在
                            if (!heroBg || !heroBgLayer) {
                                console.error('DOM元素不存在，无法设置备用背景');
                                return;
                            }

                            // 使用渐变背景作为备用方案
                            heroBg.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                            heroBg.style.backgroundImage = 'none'; // 清除可能的背景图片
                            heroBg.style.opacity = '1';
                            heroBg.style.transform = 'translate(0, 0)';

                            heroBgLayer.style.background = 'rgba(0, 0, 0, 0.15)';
                            heroBgLayer.style.opacity = '0.3';
                            heroBgLayer.style.transform = 'translate(0, 0)';

                            console.log('备用背景设置成功');
                        } catch (error) {
                            console.error('设置备用背景时出错:', error);
                            // 最后的备用方案 - 确保至少显示点什么
                            if (heroBg) {
                                heroBg.style.backgroundColor = '#667eea';
                                heroBg.style.opacity = '1';
                            }
                            if (heroBgLayer) {
                                heroBgLayer.style.backgroundColor = 'rgba(0, 0, 0, 0.15)';
                                heroBgLayer.style.opacity = '0.3';
                            }
                        }
                    },

                    reset() {
                        this.initialized = false;
                        this.loading = false;
                        delete document.body.dataset.backgroundInitialized;
                    }
                };

                // 初始化背景图片 - 统一调用点
                function initHeroBackground() {
                    console.log('调用initHeroBackground');
                    BackgroundImageManager.init();
                }

                // 重置背景初始化状态（用于页面切换时）
                function resetBackgroundInitialization() {
                    console.log('重置背景初始化状态');
                    BackgroundImageManager.reset();
                }

                // 导航菜单点击事件 - 统一管理
                function initNavigation() {
                    // 导航功能已在DOMContentLoaded中实现，此函数保持简洁，避免事件重复绑定
                    // 只保留移动端菜单切换的逻辑
                    const hamburger = document.querySelector('.hamburger');
                    const navMenu = document.querySelector('.nav-menu');

                    if (hamburger && navMenu) {
                        hamburger.addEventListener('click', () => {
                            hamburger.classList.toggle('active');
                            navMenu.classList.toggle('active');
                        });
                    }
                }

                // 确保在DOMContentLoaded之后调用initNavigation
                // 注意：导航链接的点击事件已在DOMContentLoaded事件监听器中统一处理

                // 滚动时导航栏效果
                window.addEventListener('scroll', () => {
                    const navbar = document.querySelector('.navbar');
                    if (window.scrollY > 100) {
                        navbar.style.backgroundColor = 'rgba(10, 10, 10, 0.95)';
                        navbar.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
                    } else {
                        navbar.style.backgroundColor = 'rgba(10, 10, 10, 0.9)';
                        navbar.style.boxShadow = 'none';
                    }
                });

                // 页面加载动画 - 统一的加载事件监听器
                // 检查是否有初始页面ID（用于GitHub Pages路由修复）
                let initialPageId = null;
                window.addEventListener('load', async () => {
                    // 不再在这里直接隐藏按钮，而是让checkSkipButtonDisplay函数统一控制
                    // 这样可以避免在带资源路径URL访问时出现显示混乱

                    console.log('基础资源加载完成，开始等待背景图片加载和预加载所有资源');

                    // 确保BackgroundImageManager被初始化
                    if (!BackgroundImageManager || !BackgroundImageManager.initialized) {
                        // 如果还没初始化，手动调用initHeroBackground()
                        if (typeof initHeroBackground === 'function') {
                            initHeroBackground();
                        }
                    }

                    // 等待背景图片加载完成后再结束加载界面
                    const waitForAllResources = async () => {
                        try {
                            // 首先等待背景图片加载完成
                            await new Promise((resolve) => {
                                if (BackgroundImageManager && BackgroundImageManager.initialized) {
                                    resolve();
                                    return;
                                }

                                // 设置一个最大等待时间，防止无限等待
                                const maxWaitTime = 10000; // 10秒
                                const startTime = Date.now();

                                const checkInterval = setInterval(() => {
                                    if (BackgroundImageManager && BackgroundImageManager.initialized) {
                                        clearInterval(checkInterval);
                                        console.log('背景图片已全部加载完成');
                                        resolve();
                                    } else if (Date.now() - startTime > maxWaitTime) {
                                        clearInterval(checkInterval);
                                        console.warn('背景图片加载超时，继续其他资源预加载');
                                        resolve();
                                    }
                                }, 200); // 每200ms检查一次
                            });

                            // 然后预加载所有其他资源
                            console.log('开始预加载所有其他资源（图片、页面、字体）');
                            addConsoleLog('开始预加载所有其他资源（图片、页面、字体）');
                            await preloadAllResources();
                            console.log('所有资源已全部预加载完成');
                            addConsoleLog('所有资源已全部预加载完成');

                        } catch (error) {
                            console.error('资源加载过程中出现错误:', error);
                            addConsoleLog('资源加载过程中出现错误: ' + error.message);
                            // 即使出错也继续，避免加载界面永久停留
                        } finally {
                            // 完成加载，调用finishLoading函数
                            finishLoading();
                        }
                    };

                    // 启动资源加载过程
                    waitForAllResources();
                });

                // 页面加载完成处理函数
                function finishLoadingInternal() {
                    // 更新背景图片加载状态
                    backgroundImagesLoaded = true;

                    // 清除跳过按钮检查定时器，避免无限循环
                    if (skipButtonCheckInterval) {
                        clearInterval(skipButtonCheckInterval);
                        console.log('已清除跳过按钮检查定时器');
                    }

                    // 检查是否有初始页面ID（来自404.html的路由修复）
                    // 先从sessionStorage获取（新的方式）
                    let pageIdFromStorage = sessionStorage.getItem('initialPageId');
                    if (pageIdFromStorage && pageLoader) {
                        initialPageId = pageIdFromStorage;
                        console.log('从sessionStorage检测到初始页面ID:', initialPageId);
                        // 清除sessionStorage中的页面ID，避免影响后续导航
                        sessionStorage.removeItem('initialPageId');
                    }
                    // 兼容旧的方式
                    else if (window.initialPageId && pageLoader) {
                        initialPageId = window.initialPageId;
                        console.log('从window对象检测到初始页面ID:', initialPageId);
                    } else {
                        initialPageId = 'home';
                    }

                    // 计算加载时长
                    const loadDuration = Date.now() - loadStartTime;
                    const isQuickLoad = loadDuration < 3000; // 3秒

                    console.log(`加载完成，总时长: ${loadDuration}ms，是否快速加载: ${isQuickLoad}`);

                    console.log('完成加载过程');

                    // 先淡出加载指示器
                    const loadingIndicator = document.querySelector('.loading-indicator');
                    if (loadingIndicator) {
                        // 取消可能的加载界面显示定时器
                        cancelLoadingIndicator();

                        // 调用全局的finishLoading函数来处理加载完成逻辑
                        finishLoading();
                    }
                }

                // 预加载所有资源的函数
                // 注意：preloadAllResources函数已经在文件前面定义（第660行附近）
                // 此处不再重复定义，避免函数覆盖导致的加载问题

                return true;
            }

            // 服务器状态模拟更新
            function updateServerStatus() {
                const playerCount = document.querySelector('.status-item:nth-child(2) .status-text');
                if (playerCount) {
                    // 模拟玩家数量变化
                    const minPlayers = 8;
                    const maxPlayers = 25;
                    const randomPlayers = Math.floor(Math.random() * (maxPlayers - minPlayers + 1)) + minPlayers;
                    playerCount.textContent = `在线玩家: ${randomPlayers}/100`;
                }
            }

            // 每30秒更新一次服务器状态
            setInterval(updateServerStatus, 30000);

            // 全局函数已移至文件顶部

            // 注意：AppInitializer.init()现在在第一个DOMContentLoaded监听器中被调用，避免重复初始化
            // 此监听器已被移除，以防止重复初始化和潜在的路由冲突

            // 滚动显示动画
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);

            // 为需要动画的元素添加观察（已移动到AppInitializer.initAnimations中）

            // 背景图片切换功能 - 使用全局函数
            // 已在全局作用域声明currentBgIndex，这里不再重复声明

            // 添加节流控制，防止频繁切换背景
            let isChangingBackground = false;

            function changeBackground() {
                // 如果正在切换背景或图片列表为空，则直接返回
                if (isChangingBackground) {
                    console.log('背景切换被节流控制阻止');
                    return;
                }

                const heroSection = document.querySelector('.hero');
                const heroBg = heroSection ? heroSection.querySelector('.hero-bg') : null;
                const backgroundImages = getBackgroundImages(); // 获取当前会话的随机排序图片列表

                if (heroSection && heroBg && backgroundImages && backgroundImages.length > 0) {
                    // 设置节流标志
                    isChangingBackground = true;

                    // 先淡出当前背景
                    heroBg.style.transition = 'opacity 1s ease-in-out';
                    heroBg.style.opacity = '0';

                    // 在淡出完成后切换图片并淡入
                    setTimeout(() => {
                        try {
                            // 简单地切换到下一个图片索引，不依赖缓存检查
                            currentBgIndex = (currentBgIndex + 1) % backgroundImages.length;
                            const nextImageUrl = backgroundImages[currentBgIndex];

                            // 直接设置背景图片，不再进行额外的加载测试
                            // 这确保了即使图片未缓存也会尝试显示
                            console.log(`背景图片切换: ${nextImageUrl}`);
                            heroBg.style.backgroundImage = `url('${nextImageUrl}')`;
                            heroBg.style.opacity = '1';

                            // 重置失败计数（优化：即使没有完全加载也视为成功切换）
                            resetFailureCount();

                        } catch (error) {
                            console.error('背景切换过程中发生错误:', error);
                            incrementFailureCount();
                            heroBg.style.opacity = '1'; // 确保背景可见
                        } finally {
                            // 确保在动画完成后重置节流标志
                            setTimeout(() => {
                                isChangingBackground = false;
                            }, 1000); // 与淡入动画时间保持一致
                        }
                    }, 1000);
                } else {
                    // 如果没有找到必要的元素，重置节流标志
                    isChangingBackground = false;
                    // 优化：不增加失败计数，避免因DOM问题导致切换停止
                }
            }

            // 每10秒切换一次背景图片 - 改进的实现
            let backgroundIntervalId = null;
            let consecutiveFailures = 0;
            const maxConsecutiveFailures = 10; // 增加阈值，避免轻易停止
            let nextScheduledChange = Date.now(); // 记录下次计划切换时间

            function startBackgroundRotation() {
                // 清除可能存在的旧定时器
                if (backgroundIntervalId) {
                    clearInterval(backgroundIntervalId);
                }

                // 记录下次计划切换时间
                nextScheduledChange = Date.now() + 10000;

                // 设置新的定时器
                backgroundIntervalId = setInterval(() => {
                    // 即使有失败，也继续尝试切换，但会记录失败次数
                    if (consecutiveFailures >= maxConsecutiveFailures) {
                        console.warn(`背景图片连续切换失败${consecutiveFailures}次，但仍会继续尝试`);
                        // 不再停止轮换，而是继续尝试
                    }

                    // 确保距离上次切换至少有9秒，避免切换过快
                    const now = Date.now();
                    if (now >= nextScheduledChange) {
                        changeBackground();
                        nextScheduledChange = now + 10000;
                    }
                }, 10000); // 每10秒尝试一次

                console.log('背景图片自动切换已启动，每10秒切换一次');
            }

            // 重置连续失败计数
            function resetFailureCount() {
                if (consecutiveFailures > 0) {
                    console.log(`背景图片切换成功，重置失败计数(原为${consecutiveFailures})`);
                    consecutiveFailures = 0;
                }
            }

            // 增加失败计数
            function incrementFailureCount() {
                consecutiveFailures++;
                console.warn(`背景图片切换失败，连续失败次数: ${consecutiveFailures}/${maxConsecutiveFailures}`);
            }

            // 初始化背景轮换 - 确保在页面完全加载后启动
            document.addEventListener('DOMContentLoaded', () => {
                // 确保currentBgIndex已初始化
                currentBgIndex = 0;

                // 延迟启动背景轮换，确保页面完全加载
                setTimeout(() => {
                    startBackgroundRotation();

                    // 添加额外的故障恢复机制
                    setInterval(() => {
                        // 如果定时器不存在或已停止，重新启动
                        if (!backgroundIntervalId) {
                            console.log('检测到背景轮换停止，正在重新启动...');
                            startBackgroundRotation();
                        }
                    }, 60000); // 每分钟检查一次
                }, 3000); // 缩短启动延迟时间
            });

            // 鼠标移动视差效果
            document.addEventListener('mousemove', (e) => {
                const hero = document.querySelector('.hero');
                const heroBg = document.querySelector('.hero-bg');
                const heroBgLayer = document.querySelector('.hero-bg-layer');

                if (hero && heroBg && heroBgLayer) {
                    const x = e.clientX / window.innerWidth;
                    const y = e.clientY / window.innerHeight;

                    // 主背景图移动（较小幅度）
                    const moveX1 = (x - 0.5) * 40;  // 增加移动范围
                    const moveY1 = (y - 0.5) * 40;  // 增加移动范围

                    // 次背景层移动（较大幅度）
                    const moveX2 = (x - 0.5) * 80;  // 增加移动范围
                    const moveY2 = (y - 0.5) * 80;  // 增加移动范围

                    // 应用移动效果（使用transform而不是backgroundPosition）
                    heroBg.style.transform = `translate(${moveX1}px, ${moveY1}px)`;
                    heroBgLayer.style.transform = `translate(${moveX2}px, ${moveY2}px)`;
                }
            });

            // 页面完全加载后移除事件监听器，避免内存泄漏
            window.addEventListener('beforeunload', () => {
                document.removeEventListener('mousemove', null);
            });
        });
    });
