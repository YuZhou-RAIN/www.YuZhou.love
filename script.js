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
    t.style.cssText = 'position:fixed;top:100px;left:50%;transform:translateX(-50%);background:#0078d4;color:#fff;padding:12px 24px;border-radius:6px;z-index:10000;box-shadow:0 4px 12px rgba(0,0,0,0.15)';
    document.body.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transition = '0.3s'; setTimeout(() => t.remove(), 300); }, 2500);
}

async function loadPage(id) {
    const main = document.getElementById('mainContent');

    if (loadedPages.has(id)) {
        document.querySelectorAll('.page-content').forEach(el => el.classList.remove('active'));
        const content = document.getElementById(id + '-content');
        if (content) content.classList.add('active');
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
        content.className = 'page-content';
        
        document.querySelectorAll('.page-content').forEach(el => el.classList.remove('active'));
        main.appendChild(content);
        content.classList.add('active');
        
        loadedPages.add(id);
    } catch (err) {
        main.innerHTML = '<div class="page-content active" style="padding:150px 40px;text-align:center"><h1>加载失败</h1></div>';
    }
}

function hideLoading() {
    const loading = document.getElementById('loadingScreen');
    if (loading) {
        loading.classList.remove('active');
        document.body.classList.remove('loading');
        window.scrollTo(0, 0);
    }
}

function initTheme() {
    const saved = localStorage.getItem('yuzhouTheme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (saved === 'dark' || (!saved && prefersDark)) {
        document.documentElement.dataset.theme = 'dark';
    }

    updateThemeIcon();
}

function toggleTheme() {
    const isDark = document.documentElement.dataset.theme === 'dark';
    if (isDark) {
        delete document.documentElement.dataset.theme;
        localStorage.setItem('yuzhouTheme', 'light');
    } else {
        document.documentElement.dataset.theme = 'dark';
        localStorage.setItem('yuzhouTheme', 'dark');
    }
    updateThemeIcon();
}

function updateThemeIcon() {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    const isDark = document.documentElement.dataset.theme === 'dark';
    btn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

document.addEventListener('DOMContentLoaded', () => {
    // 初始化主题
    initTheme();
    
    // 主题切换
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
    
    // 禁止页面滚动，防止加载期间用户滚动
    document.body.classList.add('loading');
    window.scrollTo(0, 0);

    const bar = document.getElementById('loadingBar');
    const percent = document.getElementById('loadingPercent');
    const startTime = Date.now();
    const MIN_LOADING_MS = 400;
    const MAX_LOADING_MS = 4000;

    let pending = 0;
    let loaded = 0;

    function onProgress() {
        loaded++;
        const pct = pending > 0 ? Math.round(loaded / pending * 100) : 100;
        if (bar) bar.style.width = pct + '%';
        if (percent) percent.textContent = pct;
        if (loaded >= pending) finishLoading();
    }

    function finishLoading() {
        const elapsed = Date.now() - startTime;
        const wait = Math.max(0, MIN_LOADING_MS - elapsed);
        setTimeout(hideLoading, wait);
    }

    // 追踪初始 HTML 中的图片
    const imgs = Array.from(document.querySelectorAll('img')).filter(img => img.src);
    pending += imgs.length;
    imgs.forEach(img => {
        if (img.complete) { onProgress(); }
        else { img.addEventListener('load', onProgress, { once: true });
               img.addEventListener('error', onProgress, { once: true }); }
    });

    // 追踪字体
    if (document.fonts) {
        pending++;
        document.fonts.ready.then(onProgress);
    }

    // 无资源时直接完成
    if (pending === 0) finishLoading();

    // 后备超时
    setTimeout(hideLoading, MAX_LOADING_MS);

    // 导航切换（事件代理，支持动态插入的元素）
    document.addEventListener('click', (e) => {
        const link = e.target.closest('[data-page]');
        if (!link) return;
        e.preventDefault();
        const id = link.getAttribute('data-page');
        
        if (id === 'home') {
            history.pushState({ page: id }, '', '/');
        } else {
            history.pushState({ page: id }, '', `/${id}`);
        }
        
        document.querySelectorAll('[data-page].active').forEach(l => l.classList.remove('active'));
        document.querySelectorAll(`[data-page="${id}"]`).forEach(l => l.classList.add('active'));
        
        loadPage(id).then(() => window.scrollTo(0, 0));
    });

    // 监听浏览器前进/后退按钮
    window.addEventListener('popstate', () => {
        const path = window.location.pathname.replace(/^\//, '') || 'home';
        const validPages = { home: 'home', features: 'features', join: 'join', about: 'about' };
        const pageId = validPages[path] || 'home';
        
        document.querySelectorAll('[data-page].active').forEach(l => l.classList.remove('active'));
        document.querySelectorAll(`[data-page="${pageId}"]`).forEach(l => l.classList.add('active'));
        
        loadPage(pageId);
        window.scrollTo(0, 0);
    });

    // 加载初始页面
    // 处理 GitHub Pages SPA 重定向
    const redirectPath = sessionStorage.getItem('yuzhouRedirectPath');
    if (redirectPath) {
        sessionStorage.removeItem('yuzhouRedirectPath');
        const validPages = { home: 'home', features: 'features', join: 'join', about: 'about' };
        let pageId = validPages[redirectPath] || 'home';
        
        if (pageId === 'home') {
            history.replaceState({ page: pageId }, '', '/');
        } else {
            history.replaceState({ page: pageId }, '', `/${pageId}`);
        }
        
        loadPage(pageId);
        document.querySelectorAll(`[data-page="${pageId}"]`).forEach(l => l.classList.add('active'));
        return;
    }
    
    // 直接从URL路径加载页面，支持直接访问路径
    let pageId = 'home';
    const path = window.location.pathname.replace(/^\//, '') || 'home';
    const validPages = { home: 'home', features: 'features', join: 'join', about: 'about' };
    const repoPrefix = '/www.yuzhou.love';
    
    // 提取页面标识（去掉仓库名前缀）
    if (path.startsWith(repoPrefix)) {
        pageId = path.slice(repoPrefix.length);
    } else {
        pageId = validPages[path] || 'home';
    }
    
    loadPage(pageId);
    document.querySelectorAll(`[data-page="${pageId}"]`).forEach(l => l.classList.add('active'));
});
