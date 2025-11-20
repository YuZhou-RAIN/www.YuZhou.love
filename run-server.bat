@echo off

REM 启动HTTP服务器，配置SPA模式（所有不存在的路径重定向到index.html）
http-server -p 8000 -c-1 --proxy http://localhost:8000?

REM -p 8000: 使用端口8000
REM -c-1: 禁用缓存
REM --proxy: 设置代理，使所有未找到的路径都重定向到index.html

pause