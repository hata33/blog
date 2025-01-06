# AJAX

## 什么是 AJAX

AJAX（Asynchronous JavaScript and XML）是一种使用现有标准的新方法，用于在不重新加载整个页面的情况下与服务器交换数据并更新部分网页内容。

## 工作原理

1. 创建 XMLHttpRequest 对象
2. 配置请求参数（方法、URL等）
3. 发送请求
4. 接收并处理服务器响应

## 基本用法

### 创建XMLHttpRequest对象

```js
var xhr = new XMLHttpRequest();
```

### 配置请求

```js
xhr.open(method, url, async);
// method: GET、POST、PUT、DELETE等
// url: 请求地址
// async: 是否异步，默认true
```

### 设置请求头

```js
xhr.setRequestHeader("Content-Type", "application/json");
```

### 发送请求

```js
xhr.send(data); // data可选，POST请求时使用
```

### 处理响应

```js
xhr.onreadystatechange = function() {
  if (xhr.readyState === 4) { // 请求完成
    if (xhr.status === 200) { // 请求成功
      console.log(xhr.responseText);
    }
  }
};
```

## 完整示例

```js
function ajax(options) {
  return new Promise((resolve, reject) => {
    // 创建xhr对象
    const xhr = new XMLHttpRequest();
    
    // 初始化参数
    options = options || {};
    options.type = (options.type || 'GET').toUpperCase();
    options.dataType = options.dataType || 'json';
    const params = options.data;
    
    // 设置请求头
    if (options.type === 'GET') {
      xhr.open('GET', options.url + '?' + params, true);
      xhr.send(null);
    } else if (options.type === 'POST') {
      xhr.open('POST', options.url, true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.send(params);
    }
    
    // 接收响应
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        let status = xhr.status;
        if (status >= 200 && status < 300) {
          resolve(xhr.responseText);
        } else {
          reject(status);
        }
      }
    };
  });
}
```

## XMLHttpRequest的属性和方法

### 重要属性

- readyState: 请求状态
  - 0: 未初始化
  - 1: 启动，已调用open()
  - 2: 发送，已调用send()
  - 3: 接收，已接收到部分响应数据
  - 4: 完成，已接收到全部响应数据
- status: HTTP状态码
- statusText: HTTP状态描述
- responseType: 响应类型
- response: 响应内容
- responseText: 响应文本

### 重要方法

- open(): 初始化请求
- send(): 发送请求
- setRequestHeader(): 设置请求头
- getResponseHeader(): 获取响应头
- abort(): 终止请求

## 优缺点

### 优点

1. 无需刷新页面即可更新数据
2. 异步通信，提升用户体验
3. 减少服务器负担和带宽占用

### 缺点

1. 可能破坏浏览器后退按钮的正常功能
2. 存在跨域限制
3. 对搜索引擎不友好 