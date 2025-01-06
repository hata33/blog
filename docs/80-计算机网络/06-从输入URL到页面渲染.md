# 从输入 URL 到页面渲染的全过程

## 1. URL 解析阶段

### 1.1 URL 解析
```javascript
const url = new URL('https://example.com/path?query=123');
console.log(url.protocol); // https:
console.log(url.hostname); // example.com
console.log(url.pathname); // /path
console.log(url.search);   // ?query=123
```

### 1.2 HSTS 检查
```javascript
// 服务端设置 HSTS
response.setHeader(
  'Strict-Transport-Security',
  'max-age=31536000; includeSubDomains'
);
```

## 2. DNS 解析阶段

### 2.1 DNS 预解析
```html
<!-- DNS 预解析 -->
<link rel="dns-prefetch" href="//example.com">

<!-- 预连接 -->
<link rel="preconnect" href="https://example.com">
```

### 2.2 DNS 缓存优化
```javascript
// 自定义 DNS 缓存
const dnsCacheMap = new Map();

async function resolveWithCache(domain) {
  if (dnsCacheMap.has(domain)) {
    return dnsCacheMap.get(domain);
  }
  const ip = await dns.resolve(domain);
  dnsCacheMap.set(domain, ip);
  return ip;
}
```

## 3. TCP 连接阶段

### 3.1 Connection 复用
```javascript
// 设置 keep-alive
fetch(url, {
  headers: {
    'Connection': 'keep-alive'
  }
});
```

### 3.2 并发连接控制
```javascript
// 限制并发请求数
class RequestQueue {
  constructor(maxConcurrent = 6) {
    this.maxConcurrent = maxConcurrent;
    this.queue = [];
    this.running = 0;
  }

  async add(request) {
    if (this.running >= this.maxConcurrent) {
      await new Promise(resolve => this.queue.push(resolve));
    }
    
    this.running++;
    try {
      return await request();
    } finally {
      this.running--;
      if (this.queue.length > 0) {
        this.queue.shift()();
      }
    }
  }
}
```

## 4. 发送 HTTP 请求

### 4.1 请求优化
```javascript
// 请求合并
async function batchRequest(urls) {
  const requests = urls.map(url => fetch(url));
  return Promise.all(requests);
}

// 请求缓存
const cache = new Map();
async function cachedFetch(url) {
  if (cache.has(url)) {
    return cache.get(url);
  }
  const response = await fetch(url);
  const data = await response.json();
  cache.set(url, data);
  return data;
}
```

### 4.2 HTTP 缓存策略
```javascript
// 服务端缓存控制
response.setHeader('Cache-Control', 'max-age=3600');
response.setHeader('ETag', '"33a64df551425fcc55e4d42a148795d9f25f89d4"');

// 客户端缓存验证
fetch(url, {
  headers: {
    'If-None-Match': '"33a64df551425fcc55e4d42a148795d9f25f89d4"'
  }
});
```

## 5. 接收响应数据

### 5.1 数据压缩
```javascript
// 服务端 Gzip 压缩
const compression = require('compression');
app.use(compression());

// 客户端请求压缩数据
fetch(url, {
  headers: {
    'Accept-Encoding': 'gzip, deflate, br'
  }
});
```

### 5.2 响应数据处理
```javascript
// 流式处理大数据
async function streamProcess(response) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  
  while (true) {
    const {done, value} = await reader.read();
    if (done) break;
    
    const chunk = decoder.decode(value);
    processChunk(chunk);
  }
}
```

## 6. 页面解析和渲染

### 6.1 资源预加载
```html
<!-- 预加载关键资源 -->
<link rel="preload" href="style.css" as="style">
<link rel="preload" href="main.js" as="script">
<link rel="preload" href="hero.jpg" as="image">

<!-- 预加载字体 -->
<link rel="preload" href="font.woff2" as="font" crossorigin>
```

### 6.2 CSS 优化
```html
<!-- 关键 CSS 内联 -->
<style>
  /* 首屏关键样式 */
  .header { ... }
  .hero { ... }
</style>

<!-- 异步加载非关键 CSS -->
<link rel="preload" href="non-critical.css" as="style" onload="this.rel='stylesheet'">
```

### 6.3 JavaScript 优化
```html
<!-- 异步加载 JS -->
<script async src="analytics.js"></script>
<script defer src="non-critical.js"></script>

<!-- 代码分割 -->
<script type="module">
  import('./feature.js').then(module => {
    module.init();
  });
</script>
```

### 6.4 图片优化
```html
<!-- 响应式图片 -->
<picture>
  <source media="(min-width: 800px)" srcset="large.jpg">
  <source media="(min-width: 400px)" srcset="medium.jpg">
  <img src="small.jpg" alt="responsive image">
</picture>

<!-- 懒加载 -->
<img loading="lazy" src="image.jpg" alt="lazy load">
```

## 7. 页面交互优化

### 7.1 性能监控
```javascript
// 性能指标监控
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.entryType === 'largest-contentful-paint') {
      console.log('LCP:', entry.startTime);
    }
  }
});

observer.observe({ entryTypes: ['largest-contentful-paint'] });
```

### 7.2 渲染优化
```javascript
// 防抖
function debounce(fn, delay) {
  let timer = null;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// 节流
function throttle(fn, delay) {
  let last = 0;
  return function(...args) {
    const now = Date.now();
    if (now - last > delay) {
      fn.apply(this, args);
      last = now;
    }
  };
}

// 虚拟列表
class VirtualList {
  constructor(container, items, itemHeight) {
    this.container = container;
    this.items = items;
    this.itemHeight = itemHeight;
    this.visibleCount = Math.ceil(container.clientHeight / itemHeight);
    this.startIndex = 0;
    this.endIndex = this.startIndex + this.visibleCount;
    
    this.container.addEventListener('scroll', this.onScroll.bind(this));
    this.render();
  }
  
  onScroll() {
    this.startIndex = Math.floor(this.container.scrollTop / this.itemHeight);
    this.endIndex = this.startIndex + this.visibleCount;
    this.render();
  }
  
  render() {
    const visibleItems = this.items.slice(this.startIndex, this.endIndex);
    // 渲染可见项
  }
}
```

### 7.3 离线缓存
```javascript
// Service Worker 注册
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(registration => {
      console.log('SW registered:', registration);
    })
    .catch(error => {
      console.log('SW registration failed:', error);
    });
}

// Service Worker 缓存策略
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
``` 