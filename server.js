// 简单的Node.js服务器，支持SPA路由
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 9000;
const PUBLIC_DIR = '.';

// 支持的文件类型及其MIME类型
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'font/eot'
};

// 创建HTTP服务器
const server = http.createServer((req, res) => {
  console.log(`请求: ${req.url}`);
  
  // 构建文件路径
  let filePath = path.join(PUBLIC_DIR, req.url);
  
  // 检查文件是否存在
  fs.stat(filePath, (err, stats) => {
    // 如果文件不存在或不是文件（可能是目录）
    if (err || !stats.isFile()) {
      // SPA路由：所有未找到的路径都返回index.html
      filePath = path.join(PUBLIC_DIR, 'index.html');
    }
    
    // 读取文件
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end(`服务器错误: ${err.code}`);
        return;
      }
      
      // 设置MIME类型
      const extname = path.extname(filePath);
      const contentType = MIME_TYPES[extname] || 'application/octet-stream';
      
      // 返回文件内容
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  });
});

// 启动服务器
server.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log('SPA路由已启用：所有未找到的路径将返回index.html');
});