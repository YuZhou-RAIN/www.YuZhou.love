// 单页应用页面切换功能
document.addEventListener('DOMContentLoaded', () => {
    // 获取所有导航链接和页面内容
    const navLinks = document.querySelectorAll('.nav-link[data-page]');
    const pageContents = document.querySelectorAll('.page-content');
    
    // 页面切换函数
    function switchPage(pageId) {
        // 获取当前激活的页面
        const currentPage = document.querySelector('.page-content.active');
        const targetPage = document.getElementById(`${pageId}-content`);
        
        // 如果目标页面就是当前页面，直接返回
        if (currentPage === targetPage) return;
        
        // 移除所有导航链接的active类
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // 添加active类到目标导航链接
        const targetLink = document.querySelector(`.nav-link[data-page="${pageId}"]`);
        if (targetLink) {
            targetLink.classList.add('active');
        }
        
        // 如果没有当前页面，直接显示目标页面
        if (!currentPage) {
            if (targetPage) {
                targetPage.classList.add('active');
            }
            // 如果切换到首页，重新初始化背景图片
            if (pageId === 'home') {
                initHeroBackground();
            }
            return;
        }
        
        // 添加淡出效果
        currentPage.style.opacity = '0';
        
        // 延迟一段时间后隐藏当前页面并显示新页面
        setTimeout(() => {
            // 隐藏当前页面
            currentPage.classList.remove('active');
            
            // 显示目标页面
            if (targetPage) {
                targetPage.classList.add('active');
                
                // 先设置透明度为0，然后逐渐增加到1
                targetPage.style.opacity = '0';
                targetPage.style.transition = 'opacity 0.3s ease';
                
                // 触发重排
                targetPage.offsetHeight;
                
                // 淡入效果
                targetPage.style.opacity = '1';
                
                // 清除内联样式
                setTimeout(() => {
                    targetPage.style.opacity = '';
                    targetPage.style.transition = '';
                }, 300);
            }
            
            // 如果切换到首页，重新初始化背景图片
            if (pageId === 'home') {
                initHeroBackground();
            }
        }, 300);
    }
    
    // 为导航链接添加点击事件
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('data-page');
            switchPage(pageId);
            
            // 关闭移动端菜单
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // 为带有data-page属性的按钮添加点击事件
    document.querySelectorAll('.btn[data-page]').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = button.getAttribute('data-page');
            switchPage(pageId);
        });
    });
    
    // 为页脚链接添加点击事件
    document.querySelectorAll('footer a[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('data-page');
            switchPage(pageId);
        });
    });
    
    // 为logo区域添加点击事件，切换到首页
    const logoArea = document.querySelector('.logo');
    if (logoArea) {
        logoArea.addEventListener('click', (e) => {
            e.preventDefault();
            switchPage('home');
            
            // 关闭移动端菜单
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    }
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
    
    // 页面刷新后自动跳转到顶部
    window.scrollTo(0, 0);
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
    'images/202025-05-18 130428.png'
];

function changeBackground() {
    const heroSection = document.querySelector('.hero');
    const heroBg = heroSection.querySelector('.hero-bg');
    
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