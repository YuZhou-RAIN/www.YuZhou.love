// 缓存名称 - 更改此值以刷新缓存
const CACHE_NAME = 'yuzhou-cache-v1';

// 需要缓存的资源列表
const CACHE_ASSETS = [
    'images/loading.avif'
];

// 安装事件 - 预缓存关键资源
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('打开缓存');
                return cache.addAll(CACHE_ASSETS);
            })
            .then(() => self.skipWaiting()) // 立即激活新的service worker
    );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        // 删除未在白名单中的缓存
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim()) // 立即控制所有客户端
    );
});

// 拦截网络请求
self.addEventListener('fetch', (event) => {
    // 对于loading.avif图片，优先从缓存获取
    if (event.request.url.includes('images/loading.avif')) {
        event.respondWith(
            caches.match(event.request)
                .then((response) => {
                    // 如果缓存中有，则返回缓存的资源
                    if (response) {
                        return response;
                    }
                    // 否则从网络获取并缓存
                    return fetch(event.request)
                        .then((networkResponse) => {
                            if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                                // 克隆响应，因为响应流只能使用一次
                                const responseToCache = networkResponse.clone();
                                caches.open(CACHE_NAME)
                                    .then((cache) => {
                                        cache.put(event.request, responseToCache);
                                    });
                            }
                            return networkResponse;
                        });
                })
        );
    } else {
        // 对于其他资源，使用标准的缓存策略
        event.respondWith(
            fetch(event.request).catch(() => {
                // 网络请求失败时，尝试从缓存获取
                return caches.match(event.request);
            })
        );
    }
});