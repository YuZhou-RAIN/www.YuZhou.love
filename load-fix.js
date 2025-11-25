// 现代页面加载和进度条管理
(function() {
    // 全局变量
    let progress = 0;
    let progressInterval = null;
    let progressFill = null;
    let progressText = null;
    let resourceCountElement = null;
    let totalResources = 0;
    let loadedResources = 0;
    let skipButton = null;
    
    // 初始化函数
    function init() {
        // 获取DOM元素
        progressFill = document.getElementById('progressFill');
        progressText = document.getElementById('progressText');
        resourceCountElement = document.getElementById('resourceCount');
        skipButton = document.getElementById('skip-loading-btn');
        
        // 启动进度更新
        startProgressUpdate();
        
        // 启动资源加载
        loadResources();
        
        // 设置跳过按钮功能
        setupSkipButton();
        
        // 3秒后显示跳过按钮
        setTimeout(() => {
            showSkipButton();
        }, 3000);
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
    
    // 资源加载
    function loadResources() {
        // 资源列表
        const resources = [
            'images/主页背景图/1.jpg',
            'images/主页背景图/2.jpg',
            'images/主页背景图/3.jpg',
            'images/主页背景图/4.jpg',
            'images/loading.avif',
            'images/雨州logo.svg',
            'pages/home.html',
            'pages/features.html',
            'pages/join.html',
            'pages/about.html'
        ];
        
        totalResources = resources.length;
        loadedResources = 0;
        
        // 初始化资源计数
        updateResourceCount(0, totalResources);
        
        // 加载单个资源
        function loadResource(resource) {
            return new Promise((resolve) => {
                if (resource.endsWith('.jpg') || resource.endsWith('.avif') || resource.endsWith('.svg')) {
                    // 图片资源
                    const img = new Image();
                    img.onload = () => {
                        loadedResources++;
                        updateResourceCount(loadedResources, totalResources);
                        updateProgress((loadedResources / totalResources) * 70); // 图片资源占70%进度
                        resolve();
                    };
                    img.onerror = () => {
                        loadedResources++;
                        updateResourceCount(loadedResources, totalResources);
                        updateProgress((loadedResources / totalResources) * 70);
                        resolve(); // 失败时也继续
                    };
                    img.src = resource;
                } else if (resource.endsWith('.html')) {
                    // 页面资源
                    fetch(resource)
                        .then(() => {
                            loadedResources++;
                            updateResourceCount(loadedResources, totalResources);
                            updateProgress(70 + (loadedResources / totalResources) * 30); // 页面资源占30%进度
                            resolve();
                        })
                        .catch(() => {
                            loadedResources++;
                            updateResourceCount(loadedResources, totalResources);
                            updateProgress(70 + (loadedResources / totalResources) * 30);
                            resolve(); // 失败时也继续
                        });
                } else {
                    // 其他资源
                    loadedResources++;
                    updateResourceCount(loadedResources, totalResources);
                    resolve();
                }
            });
        }
        
        // 加载所有资源
        Promise.all(resources.map(loadResource))
            .then(() => {
                // 所有资源加载完成
                finishLoading();
            })
            .catch(() => {
                // 加载过程中出现错误，仍需完成加载
                finishLoading();
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
        const loadingIndicator = document.querySelector('.loading-indicator');
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
                    document.body.classList.remove('loading');
                    document.body.classList.add('loaded');
                }, 600);
            }, 600);
        }
    }
    
    // 设置跳过按钮功能
    function setupSkipButton() {
        if (skipButton) {
            skipButton.addEventListener('click', () => {
                hideLoadingIndicator();
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
