// 动态页面加载器
class PageLoader {
    constructor() {
        this.loadedPages = new Set(); // 跟踪已加载的页面
        this.loadingPromises = new Map(); // 跟踪正在进行的加载请求
    }
    
    // 加载页面内容
    async loadPage(pageId) {
        // 如果页面已经加载，直接返回
        if (this.loadedPages.has(pageId)) {
            return document.getElementById(`${pageId}-content`);
        }
        
        // 如果页面正在加载中，返回加载Promise
        if (this.loadingPromises.has(pageId)) {
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
                    // 添加页面内容
                    mainContent.appendChild(pageContent);
                }
                
                // 标记页面为已加载
                this.loadedPages.add(pageId);
                
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
    
    // 预加载页面
    preloadPage(pageId) {
        if (!this.isPageLoaded(pageId) && pageId !== 'home') {
            this.loadPage(pageId);
        }
    }
}

// 创建全局页面加载器实例
const pageLoader = new PageLoader();

// 单页应用页面切换功能
document.addEventListener('DOMContentLoaded', () => {
    // 获取所有导航链接
    const navLinks = document.querySelectorAll('.nav-link[data-page]');
    const footer = document.querySelector('footer');
    
    // 预加载所有其他页面
    ['features', 'join', 'about'].forEach(pageId => {
        // 在首页加载完成后延迟预加载其他页面，避免阻塞首页渲染
        setTimeout(() => {
            pageLoader.preloadPage(pageId);
        }, 1000);
    });
    
    // 页面切换函数 - 使用异步加载
    async function switchPage(pageId) {
        // 检查目标页面是否已加载
        let targetPage = document.getElementById(`${pageId}-content`);
        
        // 如果页面未加载，先加载
        if (!targetPage && pageId !== 'home') { // 首页始终存在，不需要加载
            try {
                targetPage = await pageLoader.loadPage(pageId);
            } catch (error) {
                console.error('页面加载失败:', error);
                showNotification(`页面加载失败: ${error.message}`);
                return; // 如果加载失败，终止切换
            }
        }
        
        // 获取当前页面
        const currentPage = document.querySelector('.page-content.active');
        
        // 如果目标页面就是当前页面，直接返回
        if (currentPage === targetPage) return;
        
        // 更新导航链接
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // 添加active类到目标导航链接
        const targetLink = document.querySelector(`.nav-link[data-page="${pageId}"]`);
        if (targetLink) {
            targetLink.classList.add('active');
        }
        
        // 执行页面切换动画
        if (!currentPage) {
            // 没有当前页面，直接显示目标页面
            if (targetPage) {
                targetPage.classList.add('active');
                targetPage.style.opacity = '0';
                targetPage.offsetHeight; // 触发重排
                targetPage.style.opacity = '1';
                
                // 清除样式
                setTimeout(() => {
                    targetPage.style.opacity = '';
                }, 300);
            }
            
            // 如果是首页，重新初始化背景
            if (pageId === 'home') {
                initHeroBackground();
            }
            
            window.scrollTo(0, 0);
            return;
        }
        
        // 执行切换动画
        currentPage.style.opacity = '0';
        if (footer) {
            footer.style.opacity = '0';
        }
        
        setTimeout(() => {
            // 隐藏当前页面
            currentPage.classList.remove('active');
            
            // 显示目标页面
            if (targetPage) {
                targetPage.classList.add('active');
                
                targetPage.style.opacity = '0';
                targetPage.offsetHeight; // 触发重排
                targetPage.style.opacity = '1';
                
                setTimeout(() => {
                    targetPage.style.opacity = '';
                }, 300);
            }
            
            // 如果是首页，重新初始化背景
            if (pageId === 'home') {
                initHeroBackground();
            }
            
            window.scrollTo(0, 0);
            
            // 页脚淡入
            if (footer) {
                footer.offsetHeight; // 触发重排
                footer.style.opacity = '1';
            }
        }, 300);
        
        // 更新浏览器历史记录
        const pageTitle = getPageTitle(pageId);
        history.pushState({page: pageId}, pageTitle, `/${getPagePath(pageId)}`);
        
        // 更新页面标题
        document.title = pageTitle;
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
        // 首先检查是否有从404页面重定向过来的路径
        var redirectPath = sessionStorage.getItem('githubPagesRedirectPath');
        if (redirectPath) {
            // 清除sessionStorage中的重定向路径
            sessionStorage.removeItem('githubPagesRedirectPath');
            
            // 解析路径获取页面ID
            const pageId = getPageIdFromPath(redirectPath);
            
            // 切换到相应页面
            await switchPage(pageId);
            
            // 更新浏览器历史记录
            const pageTitle = getPageTitle(pageId);
            history.replaceState({page: pageId}, pageTitle, redirectPath);
            
            // 更新页面标题
            document.title = pageTitle;
            
            return;
        }
        
        // 如果没有重定向路径，则从当前URL路径获取页面ID
        const path = window.location.pathname;
        const pageId = getPageIdFromPath(path);
        await switchPage(pageId);
    }
    
    // 检查初始页面
    checkInitialPage();
    
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
    document.querySelectorAll('footer a[data-page]').forEach(link => {
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

// 页面加载后检查是否有重定向路径需要处理
// 注意：路由处理逻辑已移至DOMContentLoaded事件中，此处仅保留背景图片初始化和页面滚动
window.addEventListener('load', function() {
    // 添加loaded类到body，使页面内容显示
    document.body.classList.add('loaded');
    
    // 初始化背景图片
    initHeroBackground();
    
});

// 初始化背景图片
function initHeroBackground() {
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        // 获取已存在的背景元素
        const heroBg = heroSection.querySelector('.hero-bg');
        const heroBgLayer = heroSection.querySelector('.hero-bg-layer');
        
        // 设置背景图片
        if (heroBg) {
            heroBg.style.backgroundImage = "url('images/EF13DDC8136672FB8AB3C77429A5FE14.jpg')";
            heroBg.style.backgroundSize = 'cover';
            heroBg.style.backgroundPosition = 'center';
            heroBg.style.backgroundRepeat = 'no-repeat';
        }
        
        // 延迟一点时间后开始渐显效果
        setTimeout(() => {
            if (heroBg) heroBg.style.opacity = '1';
            if (heroBgLayer) heroBgLayer.style.opacity = '1';
        }, 100);
    }
}

// 移动端导航菜单切换
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// 点击导航链接时关闭移动端菜单
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

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

// 页面加载动画
window.addEventListener('load', () => {
    // 添加loaded类到body，使页面内容显示
    document.body.classList.add('loaded');
    
    // 初始化背景图片
    initHeroBackground();
    
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
    navigator.clipboard.writeText(serverIP).then(() => {
        showNotification('服务器IP已复制到剪贴板！');
    }).catch(err => {
        console.error('复制失败:', err);
        // 降级方案
        const textArea = document.createElement('textarea');
        textArea.value = serverIP;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('服务器IP已复制到剪贴板！');
    });
}

// 复制QQ群号功能
function copyQQGroup() {
    const qqGroup = '823557774';
    navigator.clipboard.writeText(qqGroup).then(() => {
        showNotification('QQ群号已复制到剪贴板！');
    }).catch(err => {
        console.error('复制失败:', err);
        // 降级方案
        const textArea = document.createElement('textarea');
        textArea.value = qqGroup;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('QQ群号已复制到剪贴板！');
    });
}

// 通用文本复制功能
function copyText(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('已复制到剪贴板！');
    }).catch(err => {
        console.error('复制失败:', err);
        // 降级方案
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('已复制到剪贴板！');
    });
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

// 为服务器IP和QQ群添加点击复制功能
document.addEventListener('DOMContentLoaded', () => {
    const serverIPElement = document.querySelector('.server-ip');
    const qqGroupElement = document.querySelector('.server-qq');
    
    if (serverIPElement) {
        serverIPElement.style.cursor = 'pointer';
        serverIPElement.addEventListener('click', copyServerIP);
        serverIPElement.title = '点击复制服务器IP';
    }
    
    if (qqGroupElement) {
        qqGroupElement.style.cursor = 'pointer';
        qqGroupElement.addEventListener('click', copyQQGroup);
        qqGroupElement.title = '点击复制QQ群号';
    }
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
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.status-item, .news-card');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// 背景图片切换功能
let currentBgIndex = 0;
const backgroundImages = [
    'images/EF13DDC8136672FB8AB3C77429A5FE14.jpg',
    'images/38B32115FF628DB757ECA3562B2178AB.jpg',
    'images/2E0A6A054B80D94AA1FE5A5D45A17F6D.jpg',
    'images/6A7AC902334C0E90B0E5568DF4FBEEB6.jpg',
    '%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202025-05-18%20130428.png'
];

function changeBackground() {
    const heroSection = document.querySelector('.hero');
    const heroBg = heroSection ? heroSection.querySelector('.hero-bg') : null;
    
    if (heroSection && heroBg) {
        // 先淡出当前背景
        heroBg.style.transition = 'opacity 1s ease-in-out';
        heroBg.style.opacity = '0';
        
        // 在淡出完成后切换图片并淡入
        setTimeout(() => {
            currentBgIndex = (currentBgIndex + 1) % backgroundImages.length;
            heroBg.style.backgroundImage = `url('${backgroundImages[currentBgIndex]}')`;
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