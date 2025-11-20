// 在这里添加JavaScript代码

// 增强的触摸设备检测逻辑
let isTouchDevice = false;
let touchInteractionDetected = false;
let mouseInteractionDetected = false;
let lastTouchTime = 0;
let lastMouseEventTime = 0;
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
    async loadPage(pageId) {
        // 显示页面过渡效果
        const transitionLayer = document.querySelector('.page-transition');
        if (transitionLayer) {
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
                
                // 为页面内容添加active类，确保它可见
                pageContent.classList.add('active');
                
                // 注意：AppInitializer.init()不再在这里调用，而是在首次页面加载时统一初始化
                
                // 标记页面为已加载
                this.loadedPages.add(pageId);
                
                // 隐藏过渡效果
                if (transitionLayer) {
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
// 立即显示加载提示 - 不需要等待DOMContentLoaded
const loadingIndicator = document.querySelector('.loading-indicator');
if (loadingIndicator) {
    loadingIndicator.style.display = 'flex';
    loadingIndicator.style.opacity = '1';
    console.log('加载提示已立即显示');
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
        img.onload = function() {
            clearTimeout(timeoutId); // 清除超时计时器
            console.log('loading.avif 动图加载成功，替换加载动画');
            loadingGif.src = 'images/loading.avif';
            loadingGif.style.display = 'block';
            loadingSpinner.style.display = 'none';
        };
        
        // 加载失败
        img.onerror = function() {
            clearTimeout(timeoutId); // 清除超时计时器
            console.log('loading.avif 动图加载失败，使用默认动画');
            loadingGif.style.display = 'none';
            loadingSpinner.style.display = 'block';
        };
    }
}

// 立即开始加载动图
loadLoadingGif();

// 跟踪资源加载状态
let domCssLoaded = false;
let backgroundImagesLoaded = false;
let imagesLoadingCount = 0;
let imagesTotalCount = 0;

// 设置跳过加载按钮功能
function setupSkipLoadingButton() {
    const skipButton = document.getElementById('skip-loading-btn');
    
    if (skipButton) {
        skipButton.addEventListener('click', function() {
            console.log('测试模式 - 用户点击了"不等了，先看文字"按钮，跳过图片加载');
            
            try {
                // 先显示页面内容
                document.body.classList.remove('loading');
                document.body.classList.add('loaded');
                document.body.dataset.skipLoading = 'true'; // 添加标记表示用户选择跳过加载
                
                // 然后淡出加载指示器
                const loadingIndicator = document.querySelector('.loading-indicator');
                if (loadingIndicator) {
                    loadingIndicator.style.opacity = '0';
                    loadingIndicator.style.transform = 'translate(-50%, -50%) scale(0.9)';
                    
                    setTimeout(() => {
                        loadingIndicator.style.display = 'none';
                        console.log('测试模式 - 加载指示器已隐藏');
                    }, 300);
                }
                
                // 隐藏跳过按钮
                skipButton.style.display = 'none';
                
                // 模拟图片仍在后台加载的情况
                console.log('测试模式 - 背景图片仍在后台继续加载中...');
            } catch (error) {
                console.error('跳过加载按钮点击处理出错:', error);
                // 即使出错也要显示内容
                document.body.classList.remove('loading');
                document.body.classList.add('loaded');
            }
        });
    } else {
        console.warn('跳过加载按钮未找到');
    }
}

// 检查是否需要显示跳过按钮
function checkSkipButtonDisplay() {
    try {
        // 只有在DOM和CSS已加载但图片资源仍在加载时才显示按钮
        if (domCssLoaded && !backgroundImagesLoaded && !document.body.classList.contains('loaded')) {
            const skipButton = document.getElementById('skip-loading-btn');
            if (skipButton) {
                skipButton.style.display = 'block';
                console.log('测试模式 - 显示跳过加载按钮：DOM和CSS已加载，但背景图片仍在加载');
            } else {
                console.warn('测试模式 - 按钮元素不存在，无法显示跳过按钮');
            }
        } else {
            // 确保在不满足条件时隐藏按钮
            const skipButton = document.getElementById('skip-loading-btn');
            if (skipButton && skipButton.style.display === 'block') {
                skipButton.style.display = 'none';
                console.log('测试模式 - 隐藏跳过按钮：条件不满足');
            }
        }
    } catch (error) {
        console.error('测试模式 - 检查跳过按钮显示状态出错:', error);
    }
}

// 初始化跳过按钮功能
setupSkipLoadingButton();

document.addEventListener('DOMContentLoaded', () => {
    // 获取所有导航链接
    const navLinks = document.querySelectorAll('.nav-link[data-page]');
    const footer = document.querySelector('footer');
    
    // 确保加载提示在DOM加载完成后仍然可见
    if (loadingIndicator) {
        loadingIndicator.style.display = 'flex';
        console.log('DOM加载完成，加载提示保持可见');
    }
    
    // DOM和CSS已加载完成
    domCssLoaded = true;
    console.log('DOM和CSS加载完成');
    
    // 检查是否需要显示跳过按钮
    checkSkipButtonDisplay();
    
    // 选择性预加载 - 只预加载可能会快速访问的页面
    // 延迟预加载以避免影响首页加载性能
    setTimeout(() => {
        // 只预加载'features'页面，其他页面在需要时再加载
        pageLoader.preloadPage('features');
        console.log('已预加载主要页面');
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
        history.pushState({page: pageId}, pageTitle, `/${getPagePath(pageId)}`);
        
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
                    history.replaceState({page: targetPageId}, pageTitle, targetPath);
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
    window.addEventListener('popstate', async function(event) {
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
        this.initAnimations();
        this.initBackgroundEffects();
    },
    
    initPageComponents() {
        // 复制按钮功能
        document.querySelectorAll('.copy-btn').forEach(button => {
            button.isCopying = false;
            
            button.addEventListener('click', function() {
                if (this.isCopying) {
                    return;
                }
                
                const textToCopy = this.getAttribute('data-copy');
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
                });
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
        // 移除查询参数
        let cleanUrl = url.split('?')[0];
        
        // 安全检查：确保图片URL以images/开头
        if (cleanUrl.includes('%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE') && !cleanUrl.startsWith('images/')) {
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
    },
    
    // 预加载单张图片
    preloadImage(src) {
        // 清理URL
        const cleanSrc = this.cleanUrl(src);
        
        // 如果图片已经缓存，直接返回成功
        if (this.cachedImages[cleanSrc]) {
            console.log(`图片 ${cleanSrc} 已在缓存中，直接使用`);
            return Promise.resolve(this.cachedImages[cleanSrc]);
        }
        
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.cachedImages[cleanSrc] = img; // 缓存已加载的图片
                console.log(`图片 ${cleanSrc} 加载完成并缓存`);
                resolve(img);
            };
            img.onerror = (err) => {
                console.error(`图片 ${cleanSrc} 加载失败`, err);
                reject(err);
            };
            
            // 移除cache_bust参数，允许浏览器缓存
            img.src = cleanSrc;
            
            // 设置超时防止无限等待
            setTimeout(() => {
                if (!img.complete) {
                    reject(new Error('图片加载超时'));
                }
            }, 5000);
        });
    },
    
    // 预加载所有背景图片
    preloadAllImages() {
        const imagesToLoad = backgroundImages || ['images/EF13DDC8136672FB8AB3C77429A5FE14.jpg'];
        const promises = imagesToLoad.map(src => this.preloadImage(src));
        return Promise.all(promises);
    },
    
    // 检查图片是否已缓存
    isImageCached(src) {
        const cleanSrc = this.cleanUrl(src);
        return !!this.cachedImages[cleanSrc];
    },
    
    setBackgroundStyles(heroBg, heroBgLayer) {
        console.log('设置背景样式');
        
        // 只在heroBg上设置主背景图片，优先使用缓存
        const firstImage = backgroundImages ? backgroundImages[0] : 'images/EF13DDC8136672FB8AB3C77429A5FE14.jpg';
        const cleanFirstImage = this.cleanUrl(firstImage);
        heroBg.style.backgroundImage = `url('${cleanFirstImage}')`;
        heroBg.style.backgroundSize = 'cover';
        heroBg.style.backgroundPosition = 'center';
        heroBg.style.backgroundRepeat = 'no-repeat';
        heroBg.style.opacity = '0';
        heroBg.style.transform = 'translate(0, 0)';
        
        // heroBgLayer改为使用半透明渐变，不使用重复的背景图片
        heroBgLayer.style.background = 'linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.3))';
        heroBgLayer.style.opacity = '0';
        heroBgLayer.style.transform = 'translate(0, 0)';
        
        // 延迟显示背景
        setTimeout(() => {
            heroBg.style.opacity = '1'; // 增加主背景的不透明度
            heroBgLayer.style.opacity = '1'; // 渐变层保持较高透明度
        }, 100);
    },
    
    setFallbackBackground(heroBg, heroBgLayer) {
        console.log('设置备用背景样式');
        heroBg.style.backgroundColor = 'black';
        heroBgLayer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        heroBg.style.opacity = '1';
        heroBgLayer.style.opacity = '1';
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
window.addEventListener('load', () => {
    // 更新背景图片加载状态
    backgroundImagesLoaded = true;
    
    // 隐藏跳过加载按钮
    const skipButton = document.getElementById('skip-loading-btn');
    if (skipButton) {
        skipButton.style.display = 'none';
    }
    
    console.log('资源加载完成');
    
    // 先显示页面内容
    document.body.classList.remove('loading');
    document.body.classList.add('loaded');
    
    // 然后淡出加载指示器
    const loadingIndicator = document.querySelector('.loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.style.opacity = '0';
        loadingIndicator.style.transform = 'translate(-50%, -50%) scale(0.9)';
        
        setTimeout(() => {
            loadingIndicator.style.display = 'none';
        }, 300);
    }
    
    console.log('页面完全加载完成');
});

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

// 复制服务器IP功能
function copyServerIP() {
    const serverIP = 'mc.yuzhou.love';
    // 统一使用copyText函数处理复制逻辑
    copyText(serverIP, '服务器IP已复制到剪贴板！');
}

// 复制QQ群号功能
function copyQQGroup() {
    const qqGroup = '823557774';
    // 统一使用copyText函数处理复制逻辑
    copyText(qqGroup, 'QQ群号已复制到剪贴板！');
}

// 增强的文本复制功能，支持自定义通知消息
function copyText(text, customMessage = '已复制到剪贴板！') {
    // 检查浏览器是否支持现代剪贴板API
    if (navigator.clipboard && window.isSecureContext) {
        // 现代浏览器支持的方式
        navigator.clipboard.writeText(text).then(() => {
            showNotification(customMessage);
        }).catch(err => {
            console.error('现代剪贴板API复制失败:', err);
            // 降级到传统方式
            fallbackCopyTextToClipboard(text, customMessage);
        });
    } else {
        // 直接使用降级方案
        fallbackCopyTextToClipboard(text, customMessage);
    }
}

// 降级复制方案，适用于所有浏览器
function fallbackCopyTextToClipboard(text, customMessage) {
    // 创建临时元素用于复制
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // 设置样式避免在某些浏览器中闪烁
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    textArea.style.opacity = '0';
    
    document.body.appendChild(textArea);
    
    try {
        // 选择文本
        textArea.select();
        textArea.setSelectionRange(0, 999999); // 兼容移动设备
        
        // 执行复制命令
        const successful = document.execCommand('copy');
        
        if (successful) {
            showNotification(customMessage);
        } else {
            console.error('execCommand复制失败');
            // 最终降级：提示用户手动复制
            showNotification('复制失败，请手动复制：' + text);
        }
    } catch (err) {
        console.error('降级方案复制失败:', err);
        showNotification('复制失败，请手动复制：' + text);
    } finally {
        // 确保移除临时元素
        document.body.removeChild(textArea);
    }
}

// 显示通知
function showNotification(message) {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // 添加样式
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
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 显示通知
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 10);
    
    // 3秒后移除通知
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

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

// 背景图片切换功能
let currentBgIndex = 0;
const backgroundImages = [
    'images/EF13DDC8136672FB8AB3C77429A5FE14.jpg',
    'images/38B32115FF628DB757ECA3562B2178AB.jpg',
    'images/2E0A6A054B80D94AA1FE5A5D45A17F6D.jpg',
    'images/6A7AC902334C0E90B0E5568DF4FBEEB6.jpg',
    'images/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-05-18%20130428.png'
];

function changeBackground() {
    const heroSection = document.querySelector('.hero');
    const heroBg = heroSection ? heroSection.querySelector('.hero-bg') : null;
    
    if (heroSection && heroBg && backgroundImages && backgroundImages.length > 0) {
        // 先淡出当前背景
        heroBg.style.transition = 'opacity 1s ease-in-out';
        heroBg.style.opacity = '0';
        
        // 在淡出完成后切换图片并淡入
        setTimeout(() => {
            // 找到下一个有效的图片索引
            let validIndex = currentBgIndex;
            let attempts = 0;
            const maxAttempts = backgroundImages.length;
            
            do {
                validIndex = (validIndex + 1) % backgroundImages.length;
                attempts++;
                // 尝试预加载验证图片
                if (BackgroundImageManager && typeof BackgroundImageManager.preloadImage === 'function') {
                    const nextImageUrl = backgroundImages[validIndex];
                    // 使用Promise.resolve确保即使预加载失败也能继续
                    Promise.resolve().then(() => {
                        return BackgroundImageManager.preloadImage(nextImageUrl)
                            .catch(err => {
                                console.warn(`图片 ${nextImageUrl} 预加载失败，将尝试下一张图片`, err);
                                // 这里不reject，让循环继续寻找有效的图片
                            });
                    });
                }
            } while (attempts < maxAttempts && 
                     BackgroundImageManager && 
                     !BackgroundImageManager.isImageCached(backgroundImages[validIndex]));
            
            currentBgIndex = validIndex;
            const nextImageUrl = backgroundImages[currentBgIndex];
            
            // 检查图片是否已缓存
            if (BackgroundImageManager && BackgroundImageManager.isImageCached(nextImageUrl)) {
                console.log(`使用缓存的背景图片: ${nextImageUrl}`);
                heroBg.style.backgroundImage = `url('${nextImageUrl}')`;
            } else {
                console.log(`切换到背景图片: ${nextImageUrl}`);
                heroBg.style.backgroundImage = `url('${nextImageUrl}')`;
                
                // 如果没有缓存，尝试预加载
                if (BackgroundImageManager && typeof BackgroundImageManager.preloadImage === 'function') {
                    BackgroundImageManager.preloadImage(nextImageUrl).catch(err => {
                        console.error('预加载图片失败:', err);
                    });
                }
            }
            
            heroBg.style.opacity = '1';
        }, 1000);
    }
}

// 每10秒切换一次背景图片
setInterval(changeBackground, 10000);

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