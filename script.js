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
    // 模拟加载进度
    let progress = 0;
    const bar = document.getElementById('loadingProgress');
    const timer = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
            progress = 100;
            clearInterval(timer);
            setTimeout(hideLoading, 300);
        }
        if (bar) bar.style.width = progress + '%';
    }, 200);

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
