// 雨州Minecraft - 现代化JS

let loadedPages = new Set();

function copyText(text, msg = '已复制到剪贴板！') {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => showToast(msg));
    } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.cssText = 'position:fixed;left:-9999px;top:-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy') ? showToast(msg) : showToast('复制失败');
        document.body.removeChild(ta);
    }
}

function copyIP() { copyText('mc.yuzhou.love', '服务器IP已复制！'); }
function copyQQ() { copyText('823557774', 'QQ群号已复制！'); }

function showToast(msg) {
    const t = document.createElement('div');
    t.textContent = msg;
    t.style.cssText = 'position:fixed;top:100px;left:50%;transform:translateX(-50%);background:rgba(0,212,255,0.9);color:#fff;padding:12px 24px;border-radius:8px;z-index:10000;animation:slideDown 0.3s';
    document.body.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transition = '0.3s'; setTimeout(() => t.remove(), 300); }, 2500);
}

async function loadPage(id) {
    if (loadedPages.has(id)) {
        const content = document.getElementById(id + '-content');
        if (content) {
            document.getElementById('mainContent').innerHTML = '';
            document.getElementById('mainContent').appendChild(content);
            content.classList.add('active');
        }
        return;
    }

    try {
        const res = await fetch(`pages/${id}.html`);
        const html = await res.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        let content = doc.querySelector('.page-content');
        
        if (!content) {
            content = document.createElement('div');
            content.innerHTML = html;
        }
        
        content.id = id + '-content';
        content.className = 'page-content active';
        
        const main = document.getElementById('mainContent');
        main.innerHTML = '';
        main.appendChild(content);
        
        loadedPages.add(id);
    } catch (err) {
        document.getElementById('mainContent').innerHTML = '<div class="page-content active" style="padding:150px 40px;text-align:center"><h1>加载失败</h1></div>';
    }
}

function hideLoading() {
    const loading = document.getElementById('loadingScreen');
    if (loading) {
        loading.style.opacity = '0';
        loading.style.transition = 'opacity 0.5s';
        setTimeout(() => loading.style.display = 'none', 500);
    }
}

// 真实资源加载进度追踪
class ResourceLoader {
    constructor() {
        this.totalResources = 0;
        this.loadedResources = 0;
        this.progress = 0;
        this.callbacks = [];
        this.startTime = Date.now();
        this.minLoadTime = 1500; // 最小加载时间1.5秒，保证动画可见性
    }

    onProgress(callback) {
        this.callbacks.push(callback);
    }

    updateProgress() {
        // 计算基于真实资源加载的进度
        let resourceProgress = this.totalResources > 0 
            ? (this.loadedResources / this.totalResources) * 100 
            : 0;
        
        // 计算基于时间的最小进度，保证动画流畅
        const elapsedTime = Date.now() - this.startTime;
        const timeProgress = Math.min((elapsedTime / this.minLoadTime) * 100, 100);
        
        // 取两者的较小值，确保资源加载主导，但时间保证最小进度
        this.progress = Math.max(resourceProgress, Math.min(timeProgress, resourceProgress + 30));
        
        // 触发回调
        this.callbacks.forEach(cb => cb(this.progress));
    }

    addResource() {
        this.totalResources++;
        this.updateProgress();
    }

    resourceLoaded() {
        this.loadedResources++;
        this.updateProgress();
    }

    isComplete() {
        return this.loadedResources >= this.totalResources && this.totalResources > 0;
    }
}

// 初始化资源加载器
const resourceLoader = new ResourceLoader();

document.addEventListener('DOMContentLoaded', () => {
    // 垂直进度条动画 - 从上到下（真实资源加载）
    let progress = 0;
    const bar = document.getElementById('loadingBar');
    const percent = document.getElementById('loadingPercent');
    const info = document.getElementById('loadingInfo');
    const horizontalBar = document.getElementById('loadingBarHorizontal');

    // 计算横向动画时长：保持速度一致，但设置最小时长保证可感知性
    const screenWidth = window.innerWidth;
    const minDuration = 0.35;
    const calculatedDuration = screenWidth / 6776;
    const horizontalDuration = Math.max(calculatedDuration, minDuration);
    const horizontalDurationMs = Math.round(horizontalDuration * 1000);

    // 动态设置CSS过渡时长
    if (horizontalBar) {
        horizontalBar.style.transition = `width ${horizontalDuration}s cubic-bezier(0.42, 0, 1, 1), left ${horizontalDuration}s cubic-bezier(0.42, 0, 1, 1)`;
    }

    // 初始化文字位置在顶部
    if (info) {
        info.style.bottom = `${window.innerHeight}px`;
    }

    // 追踪所有需要加载的资源
    const trackableResources = [];
    
    // 收集所有图片资源
    document.querySelectorAll('img').forEach(img => {
        if (img.src && !img.complete) {
            resourceLoader.addResource();
            trackableResources.push({
                element: img,
                type: 'image',
                src: img.src
            });
        }
    });
    
    // 收集所有CSS字体资源（通过检查字体加载）
    if (document.fonts) {
        document.fonts.forEach(font => {
            if (font.status === 'loading') {
                resourceLoader.addResource();
                trackableResources.push({
                    element: font,
                    type: 'font'
                });
            }
        });
    }

    // 监听资源加载完成
    trackableResources.forEach(resource => {
        if (resource.type === 'image') {
            resource.element.addEventListener('load', () => {
                resourceLoader.resourceLoaded();
            });
            resource.element.addEventListener('error', () => {
                resourceLoader.resourceLoaded(); // 错误也算加载完成
            });
        }
    });

    // 监听字体加载完成
    if (document.fonts) {
        document.fonts.ready.then(() => {
            // 字体全部加载完成
            resourceLoader.updateProgress();
        });
    }

    // 如果没有可追踪的资源，添加一个虚拟资源保证动画
    if (resourceLoader.totalResources === 0) {
        resourceLoader.addResource();
        setTimeout(() => {
            resourceLoader.resourceLoaded();
        }, 1000);
    }

    // 监听真实进度更新
    resourceLoader.onProgress((realProgress) => {
        progress = Math.min(realProgress, 100);
        
        // 更新进度条高度（从上到下）
        if (bar) bar.style.height = progress + '%';
        
        // 更新百分比文字
        if (percent) percent.textContent = Math.floor(progress) + '%';
        
        // 更新进度信息位置（跟随进度条头部/底端）
        if (info) {
            const trackHeight = window.innerHeight;
            const currentPos = (progress / 100) * trackHeight;
            // 设置底部位置，但限制最小距离屏幕底部20px
            const bottomPos = Math.max(trackHeight - currentPos, 20);
            info.style.bottom = `${bottomPos}px`;
        }
        
        // 检查是否完成
        if (progress >= 100 && resourceLoader.isComplete()) {
            completeLoading();
        }
    });

    // 完成加载处理
    function completeLoading() {
        progress = 100;
        
        // 添加水平展开动画
        if (horizontalBar) {
            // 纵向进度条达到100%后，等待0.3秒再开始横向进度条
            setTimeout(() => {
                horizontalBar.style.width = '100%';

                // 等待水平进度条完全展开后，再隐藏背景遮罩、垂直进度条和进度信息
                setTimeout(() => {
                    const loadingScreen = document.getElementById('loadingScreen');
                    if (loadingScreen) {
                        loadingScreen.classList.add('background-hidden');
                    }
                    // 立即隐藏进度信息
                    if (info) {
                        info.style.opacity = '0';
                    }
                }, horizontalDurationMs);

                // 水平展开完成后，等待0.3秒间隔再开始退场
                setTimeout(() => {
                    horizontalBar.classList.add('exiting');
                    const exitDuration = horizontalDuration * 0.6;
                    horizontalBar.style.transition = `left ${exitDuration}s cubic-bezier(0, 0, 0.3, 1)`;
                    horizontalBar.style.left = '120%';
                    setTimeout(() => {
                        hideLoading();
                    }, Math.round(exitDuration * 1000));
                }, horizontalDurationMs + 300);
            }, 300);
        } else {
            setTimeout(hideLoading, 500);
        }
    }

    // 备用：如果真实加载太慢，最多等待8秒后强制完成
    setTimeout(() => {
        if (progress < 100) {
            completeLoading();
        }
    }, 8000);

    // 导航切换
    const navLinks = document.querySelectorAll('.sidebar-link[data-page], .footer-links a[data-page]');
    navLinks.forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            const id = link.getAttribute('data-page');
            
            navLinks.forEach(l => l.classList.remove('active'));
            document.querySelectorAll(`[data-page="${id}"]`).forEach(l => l.classList.add('active'));
            
            await loadPage(id);
            window.scrollTo(0, 0);
        });
    });

    // 加载初始页面
    const path = window.location.pathname.replace(/^\//, '') || 'home';
    const validPages = { home: 'home', features: 'features', join: 'join', about: 'about' };
    const pageId = validPages[path] || 'home';
    
    loadPage(pageId);
    document.querySelectorAll(`[data-page="${pageId}"]`).forEach(l => l.classList.add('active'));
});
