# Fetch

## 什么是 Fetch

Fetch API 提供了一个 JavaScript 接口，用于访问和操作 HTTP 管道的一些具体部分，例如请求和响应。它还提供了一个全局 fetch() 方法，该方法提供了一种简单，合理的方式来跨网络异步获取资源。

## 基本用法

### GET 请求

```js
fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

### POST 请求

```js
fetch('https://api.example.com/data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data)
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

## 请求配置

Fetch 请求可以包含以下配置选项：

```js
fetch(url, {
  method: 'POST', // *GET, POST, PUT, DELETE, etc.
  mode: 'cors', // no-cors, *cors, same-origin
  cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
  credentials: 'same-origin', // include, *same-origin, omit
  headers: {
    'Content-Type': 'application/json'
  },
  redirect: 'follow', // manual, *follow, error
  referrerPolicy: 'no-referrer', // no-referrer, *client
  body: JSON.stringify(data) // body data type must match "Content-Type" header
});
```

## 处理响应

Fetch API 提供了多种方法来处理响应：

```js
fetch(url)
  .then(response => {
    // 检查响应状态
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    // 解析响应数据
    return response.json(); // 或 response.text(), response.blob() 等
  })
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

## 中断请求

使用 AbortController 来中断 Fetch 请求：

```js
const controller = new AbortController();
const signal = controller.signal;

fetch(url, { signal })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => {
    if (error.name === 'AbortError') {
      console.log('Fetch aborted');
    } else {
      console.error('Error:', error);
    }
  });

// 中断请求
controller.abort();
```

## 封装实践

```js
class HttpClient {
  async request(url, options = {}) {
    const defaultOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      // 其他默认配置...
    };

    const finalOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers
      }
    };

    try {
      const response = await fetch(url, finalOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Request failed:', error);
      throw error;
    }
  }

  // GET 请求
  get(url, options = {}) {
    return this.request(url, { ...options, method: 'GET' });
  }

  // POST 请求
  post(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // PUT 请求
  put(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // DELETE 请求
  delete(url, options = {}) {
    return this.request(url, { ...options, method: 'DELETE' });
  }
}

// 使用示例
const http = new HttpClient();

// GET 请求
http.get('https://api.example.com/data')
  .then(data => console.log(data))
  .catch(error => console.error(error));

// POST 请求
http.post('https://api.example.com/data', { name: 'John' })
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

## Fetch vs AJAX

### Fetch 的优点

1. 语法更简洁，基于Promise
2. 原生支持，不需要额外库
3. 支持 Service Workers
4. 提供了更细粒度的控制
5. 更好的模块化

### Fetch 的注意事项

1. 不会自动拒绝HTTP错误状态
2. 默认不发送cookies
3. 不支持直接设置请求超时
4. 不支持监听上传进度
5. 老版本浏览器可能需要polyfill 