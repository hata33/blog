"use strict";(self.webpackChunkblog=self.webpackChunkblog||[]).push([[22],{9455:(n,e,r)=>{r.r(e),r.d(e,{assets:()=>c,contentTitle:()=>i,default:()=>u,frontMatter:()=>t,metadata:()=>a,toc:()=>l});var s=r(4848),o=r(8453);const t={},i="Axios",a={id:"JavaScript/\u7f51\u7edc\u8bf7\u6c42/axios",title:"Axios",description:"\u4ec0\u4e48\u662f Axios",source:"@site/docs/10-JavaScript/13-\u7f51\u7edc\u8bf7\u6c42/03-axios.md",sourceDirName:"10-JavaScript/13-\u7f51\u7edc\u8bf7\u6c42",slug:"/JavaScript/\u7f51\u7edc\u8bf7\u6c42/axios",permalink:"/blog/docs/JavaScript/\u7f51\u7edc\u8bf7\u6c42/axios",draft:!1,unlisted:!1,tags:[],version:"current",sidebarPosition:3,frontMatter:{},sidebar:"defaultSidebar",previous:{title:"Fetch",permalink:"/blog/docs/JavaScript/\u7f51\u7edc\u8bf7\u6c42/fetch"},next:{title:"\u539f\u578b\u548c\u539f\u578b\u94fe\u53ca\u7ee7\u627f",permalink:"/blog/docs/JavaScript/\u539f\u578b\u548c\u539f\u578b\u94fe\u53ca\u7ee7\u627f"}},c={},l=[{value:"\u4ec0\u4e48\u662f Axios",id:"\u4ec0\u4e48\u662f-axios",level:2},{value:"\u57fa\u672c\u7528\u6cd5",id:"\u57fa\u672c\u7528\u6cd5",level:2},{value:"\u5b89\u88c5",id:"\u5b89\u88c5",level:3},{value:"\u53d1\u8d77\u8bf7\u6c42",id:"\u53d1\u8d77\u8bf7\u6c42",level:3},{value:"\u8bf7\u6c42\u914d\u7f6e",id:"\u8bf7\u6c42\u914d\u7f6e",level:3},{value:"\u9ad8\u7ea7\u7279\u6027",id:"\u9ad8\u7ea7\u7279\u6027",level:2},{value:"\u521b\u5efa\u5b9e\u4f8b",id:"\u521b\u5efa\u5b9e\u4f8b",level:3},{value:"\u62e6\u622a\u5668",id:"\u62e6\u622a\u5668",level:3},{value:"\u9519\u8bef\u5904\u7406",id:"\u9519\u8bef\u5904\u7406",level:3},{value:"\u5b9e\u8df5\u5c01\u88c5",id:"\u5b9e\u8df5\u5c01\u88c5",level:2},{value:"\u6700\u4f73\u5b9e\u8df5",id:"\u6700\u4f73\u5b9e\u8df5",level:2}];function d(n){const e={code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",ol:"ol",p:"p",pre:"pre",ul:"ul",...(0,o.R)(),...n.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(e.header,{children:(0,s.jsx)(e.h1,{id:"axios",children:"Axios"})}),"\n",(0,s.jsx)(e.h2,{id:"\u4ec0\u4e48\u662f-axios",children:"\u4ec0\u4e48\u662f Axios"}),"\n",(0,s.jsx)(e.p,{children:"Axios \u662f\u4e00\u4e2a\u57fa\u4e8e Promise \u7684 HTTP \u5ba2\u6237\u7aef\uff0c\u53ef\u4ee5\u7528\u5728\u6d4f\u89c8\u5668\u548c node.js \u4e2d\u3002\u5b83\u5177\u6709\u4ee5\u4e0b\u7279\u5f81\uff1a"}),"\n",(0,s.jsxs)(e.ul,{children:["\n",(0,s.jsx)(e.li,{children:"\u4ece\u6d4f\u89c8\u5668\u521b\u5efa XMLHttpRequests"}),"\n",(0,s.jsx)(e.li,{children:"\u4ece node.js \u521b\u5efa http \u8bf7\u6c42"}),"\n",(0,s.jsx)(e.li,{children:"\u652f\u6301 Promise API"}),"\n",(0,s.jsx)(e.li,{children:"\u62e6\u622a\u8bf7\u6c42\u548c\u54cd\u5e94"}),"\n",(0,s.jsx)(e.li,{children:"\u8f6c\u6362\u8bf7\u6c42\u548c\u54cd\u5e94\u6570\u636e"}),"\n",(0,s.jsx)(e.li,{children:"\u81ea\u52a8\u8f6c\u6362 JSON \u6570\u636e"}),"\n",(0,s.jsx)(e.li,{children:"\u5ba2\u6237\u7aef\u652f\u6301\u9632\u6b62 CSRF/XSRF"}),"\n"]}),"\n",(0,s.jsx)(e.h2,{id:"\u57fa\u672c\u7528\u6cd5",children:"\u57fa\u672c\u7528\u6cd5"}),"\n",(0,s.jsx)(e.h3,{id:"\u5b89\u88c5",children:"\u5b89\u88c5"}),"\n",(0,s.jsx)(e.pre,{children:(0,s.jsx)(e.code,{className:"language-bash",children:"npm install axios\n"})}),"\n",(0,s.jsx)(e.h3,{id:"\u53d1\u8d77\u8bf7\u6c42",children:"\u53d1\u8d77\u8bf7\u6c42"}),"\n",(0,s.jsx)(e.pre,{children:(0,s.jsx)(e.code,{className:"language-js",children:"// GET \u8bf7\u6c42\naxios.get('/user?ID=12345')\n  .then(function (response) {\n    console.log(response);\n  })\n  .catch(function (error) {\n    console.log(error);\n  });\n\n// POST \u8bf7\u6c42\naxios.post('/user', {\n  firstName: 'Fred',\n  lastName: 'Flintstone'\n})\n  .then(function (response) {\n    console.log(response);\n  })\n  .catch(function (error) {\n    console.log(error);\n  });\n"})}),"\n",(0,s.jsx)(e.h3,{id:"\u8bf7\u6c42\u914d\u7f6e",children:"\u8bf7\u6c42\u914d\u7f6e"}),"\n",(0,s.jsx)(e.pre,{children:(0,s.jsx)(e.code,{className:"language-js",children:"// \u53d1\u8d77\u8bf7\u6c42\u65f6\u7684\u914d\u7f6e\u9009\u9879\nconst config = {\n  // `url` \u662f\u8bf7\u6c42\u7684\u670d\u52a1\u5668\u5730\u5740\n  url: '/user',\n\n  // `method` \u662f\u8bf7\u6c42\u7684\u65b9\u6cd5\n  method: 'get', // \u9ed8\u8ba4\u503c\n\n  // `baseURL` \u5c06\u81ea\u52a8\u52a0\u5728 `url` \u524d\u9762\n  baseURL: 'https://api.example.com',\n\n  // `transformRequest` \u5141\u8bb8\u5728\u5411\u670d\u52a1\u5668\u53d1\u9001\u524d\uff0c\u4fee\u6539\u8bf7\u6c42\u6570\u636e\n  transformRequest: [function (data, headers) {\n    // \u5bf9\u53d1\u9001\u7684 data \u8fdb\u884c\u4efb\u610f\u8f6c\u6362\u5904\u7406\n    return data;\n  }],\n\n  // `transformResponse` \u5728\u4f20\u9012\u7ed9 then/catch \u524d\uff0c\u5141\u8bb8\u4fee\u6539\u54cd\u5e94\u6570\u636e\n  transformResponse: [function (data) {\n    // \u5bf9\u63a5\u6536\u7684 data \u8fdb\u884c\u4efb\u610f\u8f6c\u6362\u5904\u7406\n    return data;\n  }],\n\n  // `headers` \u662f\u5373\u5c06\u88ab\u53d1\u9001\u7684\u81ea\u5b9a\u4e49\u8bf7\u6c42\u5934\n  headers: {'X-Requested-With': 'XMLHttpRequest'},\n\n  // `params` \u662f\u5373\u5c06\u4e0e\u8bf7\u6c42\u4e00\u8d77\u53d1\u9001\u7684 URL \u53c2\u6570\n  params: {\n    ID: 12345\n  },\n\n  // `data` \u662f\u4f5c\u4e3a\u8bf7\u6c42\u4e3b\u4f53\u88ab\u53d1\u9001\u7684\u6570\u636e\n  data: {\n    firstName: 'Fred'\n  },\n\n  // `timeout` \u6307\u5b9a\u8bf7\u6c42\u8d85\u65f6\u7684\u6beb\u79d2\u6570\n  timeout: 1000,\n\n  // `withCredentials` \u8868\u793a\u8de8\u57df\u8bf7\u6c42\u65f6\u662f\u5426\u9700\u8981\u4f7f\u7528\u51ed\u8bc1\n  withCredentials: false, // \u9ed8\u8ba4\u503c\n\n  // `responseType` \u8868\u793a\u6d4f\u89c8\u5668\u5c06\u8981\u54cd\u5e94\u7684\u6570\u636e\u7c7b\u578b\n  responseType: 'json', // \u9ed8\u8ba4\u503c\n\n  // `validateStatus` \u5b9a\u4e49\u4e86\u662f\u5426\u89e3\u6790\u6216\u62d2\u7edd\u7ed9\u5b9a\u7684\u72b6\u6001\u7801\n  validateStatus: function (status) {\n    return status >= 200 && status < 300; // \u9ed8\u8ba4\u503c\n  }\n};\n"})}),"\n",(0,s.jsx)(e.h2,{id:"\u9ad8\u7ea7\u7279\u6027",children:"\u9ad8\u7ea7\u7279\u6027"}),"\n",(0,s.jsx)(e.h3,{id:"\u521b\u5efa\u5b9e\u4f8b",children:"\u521b\u5efa\u5b9e\u4f8b"}),"\n",(0,s.jsx)(e.pre,{children:(0,s.jsx)(e.code,{className:"language-js",children:"const instance = axios.create({\n  baseURL: 'https://api.example.com',\n  timeout: 1000,\n  headers: {'X-Custom-Header': 'foobar'}\n});\n"})}),"\n",(0,s.jsx)(e.h3,{id:"\u62e6\u622a\u5668",children:"\u62e6\u622a\u5668"}),"\n",(0,s.jsx)(e.pre,{children:(0,s.jsx)(e.code,{className:"language-js",children:"// \u6dfb\u52a0\u8bf7\u6c42\u62e6\u622a\u5668\naxios.interceptors.request.use(\n  function (config) {\n    // \u5728\u53d1\u9001\u8bf7\u6c42\u4e4b\u524d\u505a\u4e9b\u4ec0\u4e48\n    return config;\n  },\n  function (error) {\n    // \u5bf9\u8bf7\u6c42\u9519\u8bef\u505a\u4e9b\u4ec0\u4e48\n    return Promise.reject(error);\n  }\n);\n\n// \u6dfb\u52a0\u54cd\u5e94\u62e6\u622a\u5668\naxios.interceptors.response.use(\n  function (response) {\n    // \u5bf9\u54cd\u5e94\u6570\u636e\u505a\u70b9\u4ec0\u4e48\n    return response;\n  },\n  function (error) {\n    // \u5bf9\u54cd\u5e94\u9519\u8bef\u505a\u70b9\u4ec0\u4e48\n    return Promise.reject(error);\n  }\n);\n"})}),"\n",(0,s.jsx)(e.h3,{id:"\u9519\u8bef\u5904\u7406",children:"\u9519\u8bef\u5904\u7406"}),"\n",(0,s.jsx)(e.pre,{children:(0,s.jsx)(e.code,{className:"language-js",children:"axios.get('/user/12345')\n  .catch(function (error) {\n    if (error.response) {\n      // \u8bf7\u6c42\u5df2\u53d1\u51fa\uff0c\u4f46\u670d\u52a1\u5668\u54cd\u5e94\u7684\u72b6\u6001\u7801\u4e0d\u5728 2xx \u8303\u56f4\u5185\n      console.log(error.response.data);\n      console.log(error.response.status);\n      console.log(error.response.headers);\n    } else if (error.request) {\n      // \u8bf7\u6c42\u5df2\u53d1\u51fa\uff0c\u4f46\u6ca1\u6709\u6536\u5230\u54cd\u5e94\n      console.log(error.request);\n    } else {\n      // \u8bbe\u7f6e\u8bf7\u6c42\u65f6\u53d1\u751f\u4e86\u4e00\u4e9b\u4e8b\u60c5\uff0c\u89e6\u53d1\u4e86\u4e00\u4e2a\u9519\u8bef\n      console.log('Error', error.message);\n    }\n    console.log(error.config);\n  });\n"})}),"\n",(0,s.jsx)(e.h2,{id:"\u5b9e\u8df5\u5c01\u88c5",children:"\u5b9e\u8df5\u5c01\u88c5"}),"\n",(0,s.jsx)(e.pre,{children:(0,s.jsx)(e.code,{className:"language-js",children:"import axios from 'axios';\n\n// \u521b\u5efaaxios\u5b9e\u4f8b\nconst service = axios.create({\n  baseURL: process.env.VUE_APP_BASE_API,\n  timeout: 5000\n});\n\n// \u8bf7\u6c42\u62e6\u622a\u5668\nservice.interceptors.request.use(\n  config => {\n    // \u5728\u8bf7\u6c42\u53d1\u9001\u4e4b\u524d\u505a\u4e00\u4e9b\u5904\u7406\n    const token = localStorage.getItem('token');\n    if (token) {\n      config.headers['Authorization'] = `Bearer ${token}`;\n    }\n    return config;\n  },\n  error => {\n    // \u5904\u7406\u8bf7\u6c42\u9519\u8bef\n    console.log(error);\n    return Promise.reject(error);\n  }\n);\n\n// \u54cd\u5e94\u62e6\u622a\u5668\nservice.interceptors.response.use(\n  response => {\n    const res = response.data;\n    \n    // \u6839\u636e\u81ea\u5b9a\u4e49\u9519\u8bef\u7801\u5224\u65ad\u8bf7\u6c42\u662f\u5426\u6210\u529f\n    if (res.code !== 20000) {\n      // \u5904\u7406\u9519\u8bef\n      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {\n        // \u91cd\u65b0\u767b\u5f55\n      }\n      return Promise.reject(new Error(res.message || 'Error'));\n    } else {\n      return res;\n    }\n  },\n  error => {\n    console.log('err' + error);\n    return Promise.reject(error);\n  }\n);\n\n// \u5c01\u88c5\u8bf7\u6c42\u65b9\u6cd5\nexport function request(config) {\n  return service(config);\n}\n\nexport function get(url, params) {\n  return request({\n    method: 'get',\n    url,\n    params\n  });\n}\n\nexport function post(url, data) {\n  return request({\n    method: 'post',\n    url,\n    data\n  });\n}\n\n// \u4f7f\u7528\u793a\u4f8b\nexport function getUserInfo(userId) {\n  return get(`/user/${userId}`);\n}\n\nexport function updateUser(data) {\n  return post('/user/update', data);\n}\n"})}),"\n",(0,s.jsx)(e.h2,{id:"\u6700\u4f73\u5b9e\u8df5",children:"\u6700\u4f73\u5b9e\u8df5"}),"\n",(0,s.jsxs)(e.ol,{children:["\n",(0,s.jsx)(e.li,{children:"\u521b\u5efa\u7edf\u4e00\u7684API\u7ba1\u7406\u6587\u4ef6"}),"\n"]}),"\n",(0,s.jsx)(e.pre,{children:(0,s.jsx)(e.code,{className:"language-js",children:"// api/user.js\nimport { get, post } from '@/utils/request';\n\nexport const userApi = {\n  getInfo: (id) => get(`/user/${id}`),\n  update: (data) => post('/user/update', data),\n  delete: (id) => post(`/user/delete/${id}`)\n};\n\n// api/index.js\nexport * from './user';\nexport * from './other-modules';\n"})}),"\n",(0,s.jsxs)(e.ol,{start:"2",children:["\n",(0,s.jsx)(e.li,{children:"\u7edf\u4e00\u9519\u8bef\u5904\u7406"}),"\n"]}),"\n",(0,s.jsx)(e.pre,{children:(0,s.jsx)(e.code,{className:"language-js",children:"// utils/error-handler.js\nexport const errorHandler = (error) => {\n  const { response } = error;\n  if (response && response.status) {\n    const errorText = {\n      400: '\u8bf7\u6c42\u9519\u8bef',\n      401: '\u672a\u6388\u6743',\n      403: '\u62d2\u7edd\u8bbf\u95ee',\n      404: '\u8bf7\u6c42\u5730\u5740\u4e0d\u5b58\u5728',\n      500: '\u670d\u52a1\u5668\u9519\u8bef',\n      502: '\u7f51\u5173\u9519\u8bef',\n      503: '\u670d\u52a1\u4e0d\u53ef\u7528',\n      504: '\u7f51\u5173\u8d85\u65f6',\n    }[response.status];\n    \n    // \u663e\u793a\u9519\u8bef\u4fe1\u606f\n    console.error(errorText);\n  } else if (!response) {\n    // \u7f51\u7edc\u9519\u8bef\n    console.error('\u7f51\u7edc\u5f02\u5e38');\n  }\n  return Promise.reject(error);\n};\n"})}),"\n",(0,s.jsxs)(e.ol,{start:"3",children:["\n",(0,s.jsx)(e.li,{children:"\u8bf7\u6c42\u53d6\u6d88"}),"\n"]}),"\n",(0,s.jsx)(e.pre,{children:(0,s.jsx)(e.code,{className:"language-js",children:"const CancelToken = axios.CancelToken;\nconst source = CancelToken.source();\n\naxios.get('/user/12345', {\n  cancelToken: source.token\n}).catch(function(thrown) {\n  if (axios.isCancel(thrown)) {\n    console.log('Request canceled', thrown.message);\n  } else {\n    // \u5904\u7406\u9519\u8bef\n  }\n});\n\n// \u53d6\u6d88\u8bf7\u6c42\uff08message \u53c2\u6570\u662f\u53ef\u9009\u7684\uff09\nsource.cancel('Operation canceled by the user.');\n"})}),"\n",(0,s.jsxs)(e.ol,{start:"4",children:["\n",(0,s.jsx)(e.li,{children:"\u5e76\u53d1\u8bf7\u6c42"}),"\n"]}),"\n",(0,s.jsx)(e.pre,{children:(0,s.jsx)(e.code,{className:"language-js",children:"function getUserAccount() {z\n  return axios.get('/user/12345');\n}\n\nfunction getUserPermissions() {\n  return axios.get('/user/12345/permissions');\n}\n\nPromise.all([getUserAccount(), getUserPermissions()])\n  .then(axios.spread(function (acct, perms) {\n    // \u4e24\u4e2a\u8bf7\u6c42\u73b0\u5728\u90fd\u6267\u884c\u5b8c\u6210\n  }));\n"})})]})}function u(n={}){const{wrapper:e}={...(0,o.R)(),...n.components};return e?(0,s.jsx)(e,{...n,children:(0,s.jsx)(d,{...n})}):d(n)}},8453:(n,e,r)=>{r.d(e,{R:()=>i,x:()=>a});var s=r(6540);const o={},t=s.createContext(o);function i(n){const e=s.useContext(t);return s.useMemo((function(){return"function"==typeof n?n(e):{...e,...n}}),[e,n])}function a(n){let e;return e=n.disableParentContext?"function"==typeof n.components?n.components(o):n.components||o:i(n.components),s.createElement(t.Provider,{value:e},n.children)}}}]);