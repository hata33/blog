# Axios

## 什么是 Axios

Axios 是一个基于 Promise 的 HTTP 客户端，可以用在浏览器和 node.js 中。它具有以下特征：

- 从浏览器创建 XMLHttpRequests
- 从 node.js 创建 http 请求
- 支持 Promise API
- 拦截请求和响应
- 转换请求和响应数据
- 自动转换 JSON 数据
- 客户端支持防止 CSRF/XSRF

## 基本用法

### 安装

```bash
npm install axios
```

### 发起请求

```js
// GET 请求
axios.get('/user?ID=12345')
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });

// POST 请求
axios.post('/user', {
  firstName: 'Fred',
  lastName: 'Flintstone'
})
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
```

### 请求配置

```js
// 发起请求时的配置选项
const config = {
  // `url` 是请求的服务器地址
  url: '/user',

  // `method` 是请求的方法
  method: 'get', // 默认值

  // `baseURL` 将自动加在 `url` 前面
  baseURL: 'https://api.example.com',

  // `transformRequest` 允许在向服务器发送前，修改请求数据
  transformRequest: [function (data, headers) {
    // 对发送的 data 进行任意转换处理
    return data;
  }],

  // `transformResponse` 在传递给 then/catch 前，允许修改响应数据
  transformResponse: [function (data) {
    // 对接收的 data 进行任意转换处理
    return data;
  }],

  // `headers` 是即将被发送的自定义请求头
  headers: {'X-Requested-With': 'XMLHttpRequest'},

  // `params` 是即将与请求一起发送的 URL 参数
  params: {
    ID: 12345
  },

  // `data` 是作为请求主体被发送的数据
  data: {
    firstName: 'Fred'
  },

  // `timeout` 指定请求超时的毫秒数
  timeout: 1000,

  // `withCredentials` 表示跨域请求时是否需要使用凭证
  withCredentials: false, // 默认值

  // `responseType` 表示浏览器将要响应的数据类型
  responseType: 'json', // 默认值

  // `validateStatus` 定义了是否解析或拒绝给定的状态码
  validateStatus: function (status) {
    return status >= 200 && status < 300; // 默认值
  }
};
```

## 高级特性

### 创建实例

```js
const instance = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 1000,
  headers: {'X-Custom-Header': 'foobar'}
});
```

### 拦截器

```js
// 添加请求拦截器
axios.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
axios.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    return response;
  },
  function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);
```

### 错误处理

```js
axios.get('/user/12345')
  .catch(function (error) {
    if (error.response) {
      // 请求已发出，但服务器响应的状态码不在 2xx 范围内
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      console.log(error.request);
    } else {
      // 设置请求时发生了一些事情，触发了一个错误
      console.log('Error', error.message);
    }
    console.log(error.config);
  });
```

## 实践封装

```js
import axios from 'axios';

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在请求发送之前做一些处理
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    // 处理请求错误
    console.log(error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;
    
    // 根据自定义错误码判断请求是否成功
    if (res.code !== 20000) {
      // 处理错误
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // 重新登录
      }
      return Promise.reject(new Error(res.message || 'Error'));
    } else {
      return res;
    }
  },
  error => {
    console.log('err' + error);
    return Promise.reject(error);
  }
);

// 封装请求方法
export function request(config) {
  return service(config);
}

export function get(url, params) {
  return request({
    method: 'get',
    url,
    params
  });
}

export function post(url, data) {
  return request({
    method: 'post',
    url,
    data
  });
}

// 使用示例
export function getUserInfo(userId) {
  return get(`/user/${userId}`);
}

export function updateUser(data) {
  return post('/user/update', data);
}
```

## 最佳实践

1. 创建统一的API管理文件

```js
// api/user.js
import { get, post } from '@/utils/request';

export const userApi = {
  getInfo: (id) => get(`/user/${id}`),
  update: (data) => post('/user/update', data),
  delete: (id) => post(`/user/delete/${id}`)
};

// api/index.js
export * from './user';
export * from './other-modules';
```

2. 统一错误处理

```js
// utils/error-handler.js
export const errorHandler = (error) => {
  const { response } = error;
  if (response && response.status) {
    const errorText = {
      400: '请求错误',
      401: '未授权',
      403: '拒绝访问',
      404: '请求地址不存在',
      500: '服务器错误',
      502: '网关错误',
      503: '服务不可用',
      504: '网关超时',
    }[response.status];
    
    // 显示错误信息
    console.error(errorText);
  } else if (!response) {
    // 网络错误
    console.error('网络异常');
  }
  return Promise.reject(error);
};
```

3. 请求取消

```js
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

axios.get('/user/12345', {
  cancelToken: source.token
}).catch(function(thrown) {
  if (axios.isCancel(thrown)) {
    console.log('Request canceled', thrown.message);
  } else {
    // 处理错误
  }
});

// 取消请求（message 参数是可选的）
source.cancel('Operation canceled by the user.');
```

4. 并发请求

```js
function getUserAccount() {z
  return axios.get('/user/12345');
}

function getUserPermissions() {
  return axios.get('/user/12345/permissions');
}

Promise.all([getUserAccount(), getUserPermissions()])
  .then(axios.spread(function (acct, perms) {
    // 两个请求现在都执行完成
  }));
``` 