# HTTP 协议详解

## 1. HTTP/1.1 基础

### 1.1 请求方法
| 方法 | 描述 | 是否幂等 | 是否安全 |
|------|------|----------|----------|
| GET | 获取资源 | 是 | 是 |
| POST | 提交数据 | 否 | 否 |
| PUT | 上传/更新资源 | 是 | 否 |
| DELETE | 删除资源 | 是 | 否 |
| HEAD | 获取报头 | 是 | 是 |
| OPTIONS | 询问支持的方法 | 是 | 是 |
| PATCH | 部分更新资源 | 否 | 否 |
| TRACE | 追踪路径 | 是 | 否 |

### 1.2 状态码详解

#### 1xx - 信息性状态码
- 100 Continue：继续发送请求
- 101 Switching Protocols：切换协议
- 102 Processing：处理中

#### 2xx - 成功状态码
- 200 OK：请求成功
- 201 Created：已创建
- 202 Accepted：已接受
- 204 No Content：无内容
- 206 Partial Content：部分内容（断点续传）

#### 3xx - 重定向状态码
- 300 Multiple Choices：多种选择
- 301 Moved Permanently：永久重定向
- 302 Found：临时重定向
- 303 See Other：查看其他位置
- 304 Not Modified：未修改（协商缓存）
- 307 Temporary Redirect：临时重定向（保持方法）
- 308 Permanent Redirect：永久重定向（保持方法）

#### 4xx - 客户端错误状态码
- 400 Bad Request：请求语法错误
- 401 Unauthorized：未认证
- 403 Forbidden：被禁止
- 404 Not Found：未找到
- 405 Method Not Allowed：方法不允许
- 406 Not Acceptable：不接受
- 408 Request Timeout：请求超时
- 409 Conflict：冲突
- 413 Payload Too Large：请求体过大
- 414 URI Too Long：请求URL过长
- 415 Unsupported Media Type：不支持的媒体类型
- 429 Too Many Requests：请求过多

#### 5xx - 服务器错误状态码
- 500 Internal Server Error：服务器内部错误
- 501 Not Implemented：未实现
- 502 Bad Gateway：错误网关
- 503 Service Unavailable：服务不可用
- 504 Gateway Timeout：网关超时
- 505 HTTP Version Not Supported：HTTP版本不支持

### 1.3 请求头详解

```http
# 常见请求头
Accept: text/html,application/xhtml+xml
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-CN,zh;q=0.9,en;q=0.8
Cache-Control: no-cache
Connection: keep-alive
Cookie: session=xxx; user=john
Host: www.example.com
User-Agent: Mozilla/5.0
Origin: https://www.example.com
Referer: https://www.example.com/page
Authorization: Bearer xxx
Content-Type: application/json
```

### 1.4 响应头详解

```http
# 常见响应头
Access-Control-Allow-Origin: *
Cache-Control: max-age=3600
Content-Type: text/html; charset=utf-8
Content-Length: 1234
Content-Encoding: gzip
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
Last-Modified: Wed, 21 Oct 2015 07:28:00 GMT
Set-Cookie: name=value; expires=Wed, 21 Oct 2015 07:28:00 GMT
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
```

## 2. HTTP 缓存机制

### 2.1 强缓存
```http
# Expires（HTTP/1.0）
Expires: Wed, 21 Oct 2015 07:28:00 GMT

# Cache-Control（HTTP/1.1）
Cache-Control: max-age=3600
Cache-Control: no-cache
Cache-Control: no-store
```

### 2.2 协商缓存
```http
# Last-Modified / If-Modified-Since
Last-Modified: Wed, 21 Oct 2015 07:28:00 GMT
If-Modified-Since: Wed, 21 Oct 2015 07:28:00 GMT

# ETag / If-None-Match
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
If-None-Match: "33a64df551425fcc55e4d42a148795d9f25f89d4"
```

## 3. HTTP/2 新特性

### 3.1 二进制分帧层
```
HTTP/1.1:
GET /resource HTTP/1.1
Host: example.com

HTTP/2:
HEADERS frame
DATA frame
```

### 3.2 多路复用
- 单个 TCP 连接上可以并行多个请求
- 解决了 HTTP/1.1 的队头阻塞问题
- 提高了网页加载速度

### 3.3 服务器推送
```http
Link: </styles.css>; rel=preload; as=style
Link: </scripts.js>; rel=preload; as=script
```

### 3.4 头部压缩
- HPACK 压缩算法
- 静态字典
- 动态字典
- Huffman 编码

## 4. 安全相关的响应头

### 4.1 内容安全策略 (CSP)
```http
Content-Security-Policy: default-src 'self';
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
```

### 4.2 跨域资源共享 (CORS)
```http
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: Content-Type
Access-Control-Max-Age: 86400
```

### 4.3 其他安全头
```http
# 防止点击劫持
X-Frame-Options: DENY

# XSS 保护
X-XSS-Protection: 1; mode=block

# 内容类型嗅探
X-Content-Type-Options: nosniff

# HSTS
Strict-Transport-Security: max-age=31536000; includeSubDomains
``` 