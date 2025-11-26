// 现代页面加载和进度条管理 - 作为script.js的辅助脚本
(function() {
    // 全局变量
    let progress = 0;
    let progressInterval = null;
    let progressFill = null;
    let progressText = null;
    let resourceCountElement = null;
    let skipButton = null;
    let loadingIndicator = null;
    
    // 初始化函数
    function init() {
        // 获取DOM元素
        progressFill = document.getElementById('progressFill');
        progressText = document.getElementById('progressText');
        resourceCountElement = document.getElementById('resourceCount');
        skipButton = document.getElementById('skip-loading-btn');
        loadingIndicator = document.querySelector('.loading-indicator');
        
        // 确保加载指示器可见
        if (loadingIndicator) {
            loadingIndicator.style.display = 'flex';
        }
        
        // 启动进度更新
        startProgressUpdate();
        
        // 设置跳过按钮功能
        setupSkipButton();
        
        // 3秒后显示跳过按钮
        setTimeout(() => {
            showSkipButton();
        }, 3000);
        
        // 监听script.js中的finishLoading事件
        listenForFinishLoading();
    }
    
    // 更新进度条
    function updateProgress(percent) {
        if (progressFill && progressText) {
            // 确保进度至少为1%，不超过99%
            progress = Math.max(1, Math.min(99, percent));
            
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `${progress}%`;
        }
    }
    
    // 更新资源计数
    function updateResourceCount(loaded, total) {
        if (resourceCountElement) {
            resourceCountElement.textContent = `${loaded}/${total}`;
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
    
    // 显示跳过按钮
    function showSkipButton() {
        if (skipButton) {
            skipButton.classList.add('show');
        }
    }
    
    // 隐藏跳过按钮
    function hideSkipButton() {
        if (skipButton) {
            skipButton.classList.remove('show');
            setTimeout(() => {
                skipButton.style.display = 'none';
            }, 600);
        }
    }
    
    // 监听script.js中的finishLoading事件
    function listenForFinishLoading() {
        // 监听body的loaded类变化
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    if (document.body.classList.contains('loaded')) {
                        // script.js已经完成加载，隐藏加载指示器
                        finishLoading();
                        observer.disconnect();
                    }
                }
            });
        });
        
        observer.observe(document.body, { attributes: true });
        
        // 也监听window的load事件，作为备选方案
        window.addEventListener('load', () => {
            if (!document.body.classList.contains('loaded')) {
                finishLoading();
            }
        });
    }
    
    // 完成加载
    function finishLoading() {
        // 确保进度达到100%
        updateProgress(100);
        
        // 清除进度更新定时器
        if (progressInterval) {
            clearInterval(progressInterval);
            progressInterval = null;
        }
        
        // 延迟隐藏加载界面
        setTimeout(() => {
            hideLoadingIndicator();
        }, 800);
    }
    
    // 隐藏加载指示器
    function hideLoadingIndicator() {
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
                hideSkipButton();
                
                // 显示页面内容
                setTimeout(() => {
                    loadingIndicator.style.display = 'none';
                }, 600);
            }, 600);
        }
    }
    
    // 设置跳过按钮功能
    function setupSkipButton() {
        if (skipButton) {
            skipButton.addEventListener('click', () => {
                // 直接调用script.js中的finishLoading函数（如果存在）
                if (typeof finishLoading === 'function') {
                    finishLoading();
                } else {
                    // 否则手动完成加载
                    document.body.classList.add('loaded');
                    document.body.classList.remove('loading');
                    hideLoadingIndicator();
                }
            });
        }
    }
    
    // 在DOM加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
