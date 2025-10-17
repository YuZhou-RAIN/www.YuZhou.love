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
    
    // 创建背景图片容器
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        // 创建背景图片元素
        const bgImage = document.createElement('div');
        bgImage.className = 'hero-bg-image';
        
        // 创建遮罩层元素
        const bgOverlay = document.createElement('div');
        bgOverlay.className = 'hero-bg-overlay';
        
        // 设置背景图片
        bgImage.style.backgroundImage = "url('images/EF13DDC8136672FB8AB3C77429A5FE14.jpg')";
        
        // 将背景图片和遮罩层添加到hero元素中
        heroSection.appendChild(bgImage);
        heroSection.appendChild(bgOverlay);
        
        // 延迟一点时间后开始渐显效果
        setTimeout(() => {
            bgImage.style.opacity = '1';
            bgOverlay.style.opacity = '1';
        }, 100);
    }
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

// 平滑滚动效果
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
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
    const animatedElements = document.querySelectorAll('.feature-card, .status-item, .news-card');
    
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
    'images/38B32115FF628DB757ECA3562B2178AB.jpg'
];

function changeBackground() {
    const heroSection = document.querySelector('.hero');
    const currentBgImage = heroSection.querySelector('.hero-bg-image');
    
    if (heroSection && currentBgImage) {
        currentBgIndex = (currentBgIndex + 1) % backgroundImages.length;
        
        // 创建新的背景图片元素
        const newBgImage = document.createElement('div');
        newBgImage.className = 'hero-bg-image';
        newBgImage.style.opacity = '0';
        
        // 设置新背景图片
        newBgImage.style.backgroundImage = `url('${backgroundImages[currentBgIndex]}')`;
        
        // 将新背景图片添加到hero元素中
        heroSection.appendChild(newBgImage);
        
        // 等待DOM更新后开始渐隐渐显效果
        setTimeout(() => {
            // 新背景图片渐显
            newBgImage.style.opacity = '1';
            
            // 旧背景图片渐隐
            currentBgImage.style.opacity = '0';
            
            // 渐隐渐显完成后移除旧背景图片
            setTimeout(() => {
                // 安全移除旧背景图片，检查是否仍然是hero的子元素
                if (currentBgImage.parentNode === heroSection) {
                    heroSection.removeChild(currentBgImage);
                }
            }, 2000);
        }, 50);
    }
}

// 每30秒切换一次背景图片
setInterval(changeBackground, 30000);

// 鼠标移动视差效果
document.addEventListener('mousemove', (e) => {
    const hero = document.querySelector('.hero');
    const heroBg = document.querySelector('.hero-bg');
    const heroBgLayer = document.querySelector('.hero-bg-layer');
    
    if (hero && heroBg && heroBgLayer) {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        // 主背景图移动（较小幅度）
        const moveX1 = (x - 0.5) * 15;
        const moveY1 = (y - 0.5) * 15;
        
        // 次背景层移动（较大幅度）
        const moveX2 = (x - 0.5) * 25;
        const moveY2 = (y - 0.5) * 25;
        
        // 应用移动效果
        heroBg.style.transform = `translate(${moveX1}px, ${moveY1}px)`;
        heroBgLayer.style.transform = `translate(${moveX2}px, ${moveY2}px)`;
    }
});