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

// 平滑进度动画管理器 - 解决缓存情况下瞬间加载的问题
class SmoothProgress {
    constructor() {
        this.targetProgress = 0;
        this.currentProgress = 0;
        this.animationId = null;
        this.callbacks = [];
        this.isComplete = false;
    }

    onUpdate(callback) {
        this.callbacks.push(callback);
    }

    setTarget(target) {
        this.targetProgress = Math.min(target, 100);
        if (!this.animationId) {
            this.animate();
        }
    }

    animate() {
        const step = () => {
            if (this.isComplete) return;

            // 平滑插值：当前进度向目标进度靠近
            const diff = this.targetProgress - this.currentProgress;
            
            if (Math.abs(diff) < 0.1) {
                this.currentProgress = this.targetProgress;
            } else {
                // 使用缓动系数，让动画更自然
                this.currentProgress += diff * 0.08;
            }

            // 触发回调
            this.callbacks.forEach(cb => cb(this.currentProgress));

            // 继续动画或停止
            if (Math.abs(this.targetProgress - this.currentProgress) > 0.01 || this.targetProgress < 100) {
                this.animationId = requestAnimationFrame(step);
            } else {
                this.animationId = null;
            }
        };
        
        this.animationId = requestAnimationFrame(step);
    }

    complete() {
        this.isComplete = true;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.currentProgress = 100;
        this.callbacks.forEach(cb => cb(100));
    }
}

// 精细资源加载器 - 精确追踪每个资源
class PreciseResourceLoader {
    constructor() {
        this.resources = [];
        this.loadedCount = 0;
        this.totalWeight = 0;
        this.smoothProgress = new SmoothProgress();
    }

    // 添加资源，每个资源有独立的权重
    addResource(name, type, weight = 1) {
        const resource = {
            name,
            type,
            weight,
            loaded: false,
            id: this.resources.length
        };
        this.resources.push(resource);
        this.totalWeight += weight;
        return resource;
    }

    // 标记资源加载完成
    markLoaded(resourceId) {
        const resource = this.resources.find(r => r.id === resourceId);
        if (resource && !resource.loaded) {
            resource.loaded = true;
            this.loadedCount++;
            this.updateProgress();
        }
    }

    // 计算当前进度（基于权重）
    updateProgress() {
        let loadedWeight = 0;
        this.resources.forEach(r => {
            if (r.loaded) loadedWeight += r.weight;
        });
        
        const progress = this.totalWeight > 0 
            ? (loadedWeight / this.totalWeight) * 100 
            : 0;
        
        this.smoothProgress.setTarget(progress);
    }

    // 获取平滑进度管理器
    getProgressManager() {
        return this.smoothProgress;
    }

    // 是否全部完成
    isAllLoaded() {
        return this.resources.every(r => r.loaded);
    }

    // 强制完成（备用）
    forceComplete() {
        this.resources.forEach(r => r.loaded = true);
        this.smoothProgress.complete();
    }
}

// 初始化精确资源加载器
const preciseLoader = new PreciseResourceLoader();

document.addEventListener('DOMContentLoaded', () => {
    const bar = document.getElementById('loadingBar');
    const percent = document.getElementById('loadingPercent');
    const info = document.getElementById('loadingInfo');
    const horizontalBar = document.getElementById('loadingBarHorizontal');
    let loadingCompleted = false;

    // 计算横向动画时长
    const screenWidth = window.innerWidth;
    const minDuration = 0.35;
    const calculatedDuration = screenWidth / 6776;
    const horizontalDuration = Math.max(calculatedDuration, minDuration);
    const horizontalDurationMs = Math.round(horizontalDuration * 1000);

    if (horizontalBar) {
        horizontalBar.style.transition = `width ${horizontalDuration}s cubic-bezier(0.42, 0, 1, 1), left ${horizontalDuration}s cubic-bezier(0.42, 0, 1, 1)`;
    }

    if (info) {
        info.style.bottom = `${window.innerHeight}px`;
    }

    // 收集并注册所有资源
    const resourcePromises = [];

    // 1. 图片资源 - 每张图片独立计算
    const images = Array.from(document.querySelectorAll('img')).filter(img => img.src && !img.complete);
    images.forEach((img, index) => {
        const resource = preciseLoader.addResource(`img-${index}`, 'image', 1);
        
        const promise = new Promise((resolve) => {
            const onLoad = () => {
                preciseLoader.markLoaded(resource.id);
                resolve();
            };
            
            if (img.complete) {
                onLoad();
            } else {
                img.addEventListener('load', onLoad, { once: true });
                img.addEventListener('error', onLoad, { once: true });
            }
        });
        
        resourcePromises.push(promise);
    });

    // 2. 字体资源 - 每个字体家族独立计算
    if (document.fonts) {
        const fontFamilies = new Set();
        document.fonts.forEach(font => fontFamilies.add(font.family));
        
        fontFamilies.forEach(fontFamily => {
            const resource = preciseLoader.addResource(`font-${fontFamily}`, 'font', 2);
            
            const promise = document.fonts.load(`1em "${fontFamily}"`).then(() => {
                preciseLoader.markLoaded(resource.id);
            }).catch(() => {
                preciseLoader.markLoaded(resource.id);
            });
            
            resourcePromises.push(promise);
        });
    }

    // 3. CSS样式表资源
    const stylesheets = Array.from(document.styleSheets).filter(s => s.href);
    stylesheets.forEach((_, index) => {
        const resource = preciseLoader.addResource(`css-${index}`, 'stylesheet', 1);
        
        // CSS通常已加载，标记为完成
        preciseLoader.markLoaded(resource.id);
    });

    // 4. 脚本资源（动态加载的）
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    scripts.forEach((script, index) => {
        const resource = preciseLoader.addResource(`script-${index}`, 'script', 1);
        
        if (script.readyState === 'complete' || script.readyState === 'loaded') {
            preciseLoader.markLoaded(resource.id);
        } else {
            const promise = new Promise((resolve) => {
                script.addEventListener('load', () => {
                    preciseLoader.markLoaded(resource.id);
                    resolve();
                }, { once: true });
                script.addEventListener('error', () => {
                    preciseLoader.markLoaded(resource.id);
                    resolve();
                }, { once: true });
            });
            resourcePromises.push(promise);
        }
    });

    // 5. 追踪CSS背景图片
    const bgImageUrls = new Set();
    
    // 从所有样式表中提取背景图片URL
    try {
        Array.from(document.styleSheets).forEach(sheet => {
            try {
                Array.from(sheet.cssRules || []).forEach(rule => {
                    if (rule.style) {
                        const bgImage = rule.style.backgroundImage || rule.style.background;
                        if (bgImage) {
                            const matches = bgImage.match(/url\(["']?([^"')]+)["']?\)/g);
                            if (matches) {
                                matches.forEach(match => {
                                    const url = match.replace(/url\(["']?([^"')]+)["']?\)/, '$1');
                                    if (url && !url.startsWith('data:')) {
                                        bgImageUrls.add(url);
                                    }
                                });
                            }
                        }
                    }
                });
            } catch (e) {
                // 跨域样式表可能无法访问，忽略错误
            }
        });
    } catch (e) {
        console.log('无法解析CSS背景图片');
    }
    
    // 同时检查内联样式
    document.querySelectorAll('*').forEach(el => {
        const style = el.getAttribute('style');
        if (style) {
            const matches = style.match(/url\(["']?([^"')]+)["']?\)/g);
            if (matches) {
                matches.forEach(match => {
                    const url = match.replace(/url\(["']?([^"')]+)["']?\)/, '$1');
                    if (url && !url.startsWith('data:')) {
                        bgImageUrls.add(url);
                    }
                });
            }
        }
    });
    
    // 预加载并追踪CSS背景图片
    bgImageUrls.forEach((url, index) => {
        const resource = preciseLoader.addResource(`bg-image-${index}`, 'background-image', 2);
        
        const img = new Image();
        const promise = new Promise((resolve) => {
            img.onload = () => {
                preciseLoader.markLoaded(resource.id);
                resolve();
            };
            img.onerror = () => {
                preciseLoader.markLoaded(resource.id);
                resolve();
            };
        });
        
        img.src = url;
        resourcePromises.push(promise);
    });

    // 6. 如果没有资源，添加虚拟资源保证动画
    if (preciseLoader.resources.length === 0) {
        for (let i = 0; i < 10; i++) {
            preciseLoader.addResource(`virtual-${i}`, 'virtual', 1);
        }
        // 逐步加载虚拟资源
        let virtualIndex = 0;
        const virtualInterval = setInterval(() => {
            if (virtualIndex < preciseLoader.resources.length) {
                preciseLoader.markLoaded(preciseLoader.resources[virtualIndex].id);
                virtualIndex++;
            } else {
                clearInterval(virtualInterval);
            }
        }, 150);
    }

    // 监听平滑进度更新
    preciseLoader.getProgressManager().onUpdate((smoothProgress) => {
        // 更新进度条
        if (bar) bar.style.height = `${smoothProgress}%`;
        
        // 更新百分比文字（只显示数字，%符号由CSS伪元素添加）
        if (percent) percent.textContent = Math.floor(smoothProgress);
        
        // 更新进度信息位置
        if (info) {
            const trackHeight = window.innerHeight;
            const currentPos = (smoothProgress / 100) * trackHeight;
            // 限制最小距离屏幕底部20px
            const bottomPos = Math.max(trackHeight - currentPos, 20);
            info.style.bottom = `${bottomPos}px`;
        }
        
        // 检查是否完成（100%且所有资源加载完成）
        if (smoothProgress >= 99.9 && preciseLoader.isAllLoaded() && !loadingCompleted) {
            loadingCompleted = true;
            completeLoading();
        }
    });

    // 等待所有资源加载完成
    Promise.all(resourcePromises).then(() => {
        // 所有资源已加载，平滑过渡到100%
        preciseLoader.getProgressManager().setTarget(100);
    });

    // 完成加载处理
    function completeLoading() {
        // 确保进度显示100%
        if (bar) bar.style.height = '100%';
        if (percent) percent.textContent = '100';
        
        // 纵向进度条达到100%后，等待0.3秒再开始横向进度条
        setTimeout(() => {
            if (horizontalBar) {
                horizontalBar.style.width = '100%';

                // 等待水平进度条完全展开后，再隐藏背景遮罩、垂直进度条和进度信息
                setTimeout(() => {
                    const loadingScreen = document.getElementById('loadingScreen');
                    if (loadingScreen) {
                        loadingScreen.classList.add('background-hidden');
                    }
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
            } else {
                hideLoading();
            }
        }, 300);
    }

    // 备用：最多等待6秒后强制完成
    setTimeout(() => {
        if (!loadingCompleted) {
            preciseLoader.forceComplete();
        }
    }, 6000);

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
