/**
 * 代码审查控制台 - 本地代理服务器
 * 双击启动，浏览器直接访问 http://localhost:3456
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const PORT = 3456;
const OWNER = 'zzllcake';
const REPO = '-';
const GH_API = `https://api.github.com/repos/${OWNER}/${REPO}`;

// 获取 GitHub Token
function getToken() {
  const r = spawnSync('gh', ['auth', 'token'], { encoding: 'utf8', timeout: 5000 });
  if (r.status !== 0) {
    console.log('⚠️ 未登录 GitHub CLI，部分功能不可用');
    return '';
  }
  return r.stdout.trim();
}
const TOKEN = getToken();
const AUTH_HEADER = TOKEN ? `token ${TOKEN}` : '';

// 请求 GitHub API
function ghApi(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const url = `${GH_API}${path}`;
    const options = {
      method,
      headers: {
        'User-Agent': 'code-review-console/1.0',
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': AUTH_HEADER,
      }
    };
    if (body) {
      options.headers['Content-Type'] = 'application/json';
    }

    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    req.on('error', (e) => reject(e));
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// MIME 类型
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

// 服务静态文件
function serveStatic(res, filePath) {
  const ext = path.extname(filePath);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

// 处理 API 请求
async function handleAPI(req, res) {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const apiPath = url.pathname.replace('/api/', '/');

  if (!TOKEN) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'GitHub 未登录', hint: '运行 gh auth login' }));
    return;
  }

  try {
    let body = null;
    if (req.method === 'POST' || req.method === 'PATCH') {
      body = await new Promise((resolve) => {
        let data = '';
        req.on('data', c => data += c);
        req.on('end', () => resolve(data ? JSON.parse(data) : null));
      });
    }
    const result = await ghApi(apiPath, req.method, body);
    res.writeHead(result.status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result.data));
  } catch (e) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: e.message }));
  }
}

// 状态信息
function handleStatus(res) {
  const info = {
    authenticated: !!TOKEN,
    tokenPreview: TOKEN ? `${TOKEN.slice(0, 8)}...${TOKEN.slice(-4)}` : '',
    scopes: TOKEN ? 'repo, workflow' : '',
    repo: `${OWNER}/${REPO}`,
  };
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(info));
}

// 启动服务器
const server = http.createServer((req, res) => {
  // CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (url.pathname === '/api/status') {
    handleStatus(res);
  } else if (url.pathname.startsWith('/api/')) {
    handleAPI(req, res);
  } else if (url.pathname === '/' || url.pathname === '/index.html') {
    serveStatic(res, path.join(__dirname, 'index.html'));
  } else {
    serveStatic(res, path.join(__dirname, url.pathname));
  }
});

server.listen(PORT, () => {
  console.log('');
  console.log('  ╔═══════════════════════════════════════╗');
  console.log('  ║    🤖 代码审查控制台                   ║');
  console.log('  ║                                       ║');
  console.log(`  ║    打开: http://localhost:${PORT}         ║`);
  console.log(`  ║    仓库: ${OWNER}/${REPO}              ║`);
  console.log(`  ║    登录: ${TOKEN ? '✅ 已认证' : '❌ 未登录'}                    ║`);
  console.log('  ╚═══════════════════════════════════════╝');
  console.log('');
  console.log('  按 Ctrl+C 停止服务器');

  // 自动打开浏览器
  const { spawn } = require('child_process');
  const cmd = process.platform === 'win32' ? 'start' : 'xdg-open';
  const args = process.platform === 'win32' ? ['""', `http://localhost:${PORT}`] : [`http://localhost:${PORT}`];
  try { spawn(cmd, args, { shell: true }); } catch(e) {}
});
