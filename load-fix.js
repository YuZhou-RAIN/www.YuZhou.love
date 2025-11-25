// 简化的页面加载和进度条管理
(function() {
    // 全局变量
    let progress = 0;
    let progressInterval = null;
    let consoleLog = null;
    let progressFill = null;
    let progressText = null;
    
    // 初始化函数
    function init() {
        // 获取DOM元素
        consoleLog = document.getElementById('consoleLog');
        progressFill = document.getElementById('progressFill');
        progressText = document.getElementById('progressText');
        
        // 添加初始日志
        addConsoleLog('正在初始化加载程序...');
        addConsoleLog('开始预加载资源...');
        
        // 启动进度更新
        startProgressUpdate();
        
        // 启动资源加载
        loadResources();
        
        // 设置跳过按钮功能
        setupSkipButton();
    }
    
    // 添加控制台日志
    function addConsoleLog(message) {
        if (consoleLog) {
            const logLine = document.createElement('div');
            logLine.className = 'log-line';
            logLine.textContent = `> ${message}`;
            consoleLog.appendChild(logLine);
            consoleLog.scrollTop = consoleLog.scrollHeight;
        }
    }
    
    // 更新进度条
    function updateProgress(percent) {
        if (progressFill && progressText) {
            // 确保进度至少为1%，不超过99%
            progress = Math.max(1, Math.min(99, percent));
            
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `${progress}%`;
            
            addConsoleLog(`加载进度: ${progress}%`);
        }
    }
    
    // 启动进度更新
    function startProgressUpdate() {
        // 每500ms更新一次进度
        progressInterval = setInterval(() => {
            // 简单的进度增长逻辑
            progress += Math.random() * 5;
            updateProgress(progress);
            
            // 如果进度接近100%，停止自动更新
            if (progress >= 95) {
                clearInterval(progressInterval);
            }
        }, 500);
    }
    
    // 模拟资源加载
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
        
        let loadedCount = 0;
        
        // 加载单个资源
        function loadResource(resource) {
            return new Promise((resolve) => {
                if (resource.endsWith('.jpg') || resource.endsWith('.avif') || resource.endsWith('.svg')) {
                    // 图片资源
                    const img = new Image();
                    img.onload = () => {
                        loadedCount++;
                        updateProgress((loadedCount / resources.length) * 70); // 图片资源占70%进度
                        addConsoleLog(`图片加载完成: ${resource}`);
                        resolve();
                    };
                    img.onerror = () => {
                        loadedCount++;
                        updateProgress((loadedCount / resources.length) * 70);
                        addConsoleLog(`图片加载失败: ${resource}`);
                        resolve(); // 失败时也继续
                    };
                    img.src = resource;
                } else if (resource.endsWith('.html')) {
                    // 页面资源
                    fetch(resource)
                        .then(() => {
                            loadedCount++;
                            updateProgress(70 + (loadedCount / resources.length) * 30); // 页面资源占30%进度
                            addConsoleLog(`页面预加载完成: ${resource}`);
                            resolve();
                        })
                        .catch(() => {
                            loadedCount++;
                            updateProgress(70 + (loadedCount / resources.length) * 30);
                            addConsoleLog(`页面预加载失败: ${resource}`);
                            resolve(); // 失败时也继续
                        });
                } else {
                    // 其他资源
                    loadedCount++;
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
        
        // 添加完成日志
        addConsoleLog('所有资源加载完成');
        addConsoleLog('正在初始化页面...');
        
        // 延迟隐藏加载界面
        setTimeout(() => {
            hideLoadingIndicator();
        }, 1000);
    }
    
    // 隐藏加载指示器
    function hideLoadingIndicator() {
        const loadingIndicator = document.querySelector('.loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.style.opacity = '0';
            setTimeout(() => {
                loadingIndicator.style.display = 'none';
                // 显示页面内容
                document.body.classList.remove('loading');
                document.body.classList.add('loaded');
            }, 300);
        }
        
        // 隐藏跳过按钮
        const skipButton = document.getElementById('skip-loading-btn');
        if (skipButton) {
            skipButton.style.display = 'none';
        }
    }
    
    // 设置跳过按钮功能
    function setupSkipButton() {
        const skipButton = document.getElementById('skip-loading-btn');
        if (skipButton) {
            skipButton.addEventListener('click', () => {
                addConsoleLog('用户点击了"不等了，先看文字"按钮，跳过加载...');
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
