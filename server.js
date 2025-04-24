// server.js
const http = require('http');
const fs   = require('fs');
const path = require('path');

// 포트 설정 (Railway는 process.env.PORT 를 자동으로 지정해 줍니다)
const PORT = process.env.PORT || 3000;
// 빌드된 정적 파일이 있는 폴더 경로
const DIST = path.join(__dirname, 'dist');

const MIME = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
};

const server = http.createServer((req, res) => {
  // 요청 URL이 '/' 면 index.html 로
  let filePath = path.join(DIST, req.url === '/' ? 'index.html' : req.url);
  const ext = path.extname(filePath) || '.html';
  const type = MIME[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // 파일이 없으면 SPA 용으로 index.html 서빙
        fs.readFile(path.join(DIST, 'index.html'), (err2, data2) => {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(data2);
        });
      } else {
        // 그 외 서버 에러
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      // 정상적으로 파일 서빙
      res.writeHead(200, { 'Content-Type': type });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Static server running on port ${PORT}`);
});
