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

document.addEventListener('DOMContentLoaded', () => {
    // 垂直进度条动画 - 从上到下
    let progress = 0;
    const bar = document.getElementById('loadingBar');
    const percent = document.getElementById('loadingPercent');
    const info = document.getElementById('loadingInfo');
    const horizontalBar = document.getElementById('loadingBarHorizontal');

    // 计算横向动画时长：保持速度一致
    // 目标：3388px宽度时0.5秒，速度 = 3388/0.5 = 6776px/秒
    // 公式：时长 = 当前宽度 / 6776
    const screenWidth = window.innerWidth;
    const horizontalDuration = screenWidth / 6776; // 根据屏幕宽度动态计算
    const horizontalDurationMs = Math.round(horizontalDuration * 1000); // 转换为毫秒

    // 动态设置CSS过渡时长
    if (horizontalBar) {
        horizontalBar.style.transition = `width ${horizontalDuration}s cubic-bezier(0.42, 0, 1, 1), left ${horizontalDuration}s cubic-bezier(0.42, 0, 1, 1)`;
    }

    // 初始化文字位置在顶部（跟随进度条头部）
    if (info) {
        info.style.bottom = `${window.innerHeight}px`;
    }

    const timer = setInterval(() => {
        // 递增进度 - 模拟真实加载
        let increment;
        if (progress < 30) {
            increment = Math.random() * 10 + 5;
        } else if (progress < 70) {
            increment = Math.random() * 5 + 2;
        } else if (progress < 90) {
            increment = Math.random() * 3 + 1;
        } else {
            increment = Math.random() * 6 + 3;
        }

        progress += increment;

        if (progress >= 100) {
            progress = 100;
            clearInterval(timer);

            // 添加水平展开动画
            if (horizontalBar) {
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
                    }, horizontalDurationMs); // 使用动态计算的时长

                    // 水平展开完成后，立即向右移动消失
                    setTimeout(() => {
                        horizontalBar.style.left = '120%';
                        setTimeout(() => {
                            hideLoading(); // 隐藏加载界面
                        }, 2000);
                    }, horizontalDurationMs); // 使用动态计算的时长
                }, 200);
            } else {
                setTimeout(hideLoading, 500);
            }
        }

        // 更新进度条高度（从上到下）
        if (bar) bar.style.height = progress + '%';

        // 更新百分比文字
        if (percent) percent.textContent = Math.floor(progress) + '%';

        // 更新进度信息位置（跟随进度条头部/底端）
        // 进度条从顶部开始，文字从顶部开始向下移动
        if (info) {
            const trackHeight = window.innerHeight; // 100vh
            const currentPos = (progress / 100) * trackHeight;
            // 文字从顶部开始，向下移动，跟随进度条头部
            info.style.bottom = `${trackHeight - currentPos}px`;
        }
    }, 60);

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
