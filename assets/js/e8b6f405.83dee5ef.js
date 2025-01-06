"use strict";(self.webpackChunkblog=self.webpackChunkblog||[]).push([[3283],{3413:(e,n,l)=>{l.r(n),l.d(n,{assets:()=>c,contentTitle:()=>t,default:()=>o,frontMatter:()=>r,metadata:()=>i,toc:()=>h});const i=JSON.parse('{"id":"\u8ba1\u7b97\u673a\u7f51\u7edc/HTTP\u534f\u8bae","title":"HTTP \u534f\u8bae\u8be6\u89e3","description":"1. HTTP/1.1 \u57fa\u7840","source":"@site/docs/80-\u8ba1\u7b97\u673a\u7f51\u7edc/03-HTTP\u534f\u8bae.md","sourceDirName":"80-\u8ba1\u7b97\u673a\u7f51\u7edc","slug":"/\u8ba1\u7b97\u673a\u7f51\u7edc/HTTP\u534f\u8bae","permalink":"/blog/docs/\u8ba1\u7b97\u673a\u7f51\u7edc/HTTP\u534f\u8bae","draft":false,"unlisted":false,"tags":[],"version":"current","sidebarPosition":3,"frontMatter":{},"sidebar":"defaultSidebar","previous":{"title":"TCP/IP \u534f\u8bae\u8be6\u89e3","permalink":"/blog/docs/\u8ba1\u7b97\u673a\u7f51\u7edc/TCP-IP\u534f\u8bae"},"next":{"title":"\u7f51\u7edc\u5b89\u5168","permalink":"/blog/docs/\u8ba1\u7b97\u673a\u7f51\u7edc/\u7f51\u7edc\u5b89\u5168"}}');var d=l(4848),s=l(8453);const r={},t="HTTP \u534f\u8bae\u8be6\u89e3",c={},h=[{value:"1. HTTP/1.1 \u57fa\u7840",id:"1-http11-\u57fa\u7840",level:2},{value:"1.1 \u8bf7\u6c42\u65b9\u6cd5",id:"11-\u8bf7\u6c42\u65b9\u6cd5",level:3},{value:"1.2 \u72b6\u6001\u7801\u8be6\u89e3",id:"12-\u72b6\u6001\u7801\u8be6\u89e3",level:3},{value:"1xx - \u4fe1\u606f\u6027\u72b6\u6001\u7801",id:"1xx---\u4fe1\u606f\u6027\u72b6\u6001\u7801",level:4},{value:"2xx - \u6210\u529f\u72b6\u6001\u7801",id:"2xx---\u6210\u529f\u72b6\u6001\u7801",level:4},{value:"3xx - \u91cd\u5b9a\u5411\u72b6\u6001\u7801",id:"3xx---\u91cd\u5b9a\u5411\u72b6\u6001\u7801",level:4},{value:"4xx - \u5ba2\u6237\u7aef\u9519\u8bef\u72b6\u6001\u7801",id:"4xx---\u5ba2\u6237\u7aef\u9519\u8bef\u72b6\u6001\u7801",level:4},{value:"5xx - \u670d\u52a1\u5668\u9519\u8bef\u72b6\u6001\u7801",id:"5xx---\u670d\u52a1\u5668\u9519\u8bef\u72b6\u6001\u7801",level:4},{value:"1.3 \u8bf7\u6c42\u5934\u8be6\u89e3",id:"13-\u8bf7\u6c42\u5934\u8be6\u89e3",level:3},{value:"1.4 \u54cd\u5e94\u5934\u8be6\u89e3",id:"14-\u54cd\u5e94\u5934\u8be6\u89e3",level:3},{value:"2. HTTP \u7f13\u5b58\u673a\u5236",id:"2-http-\u7f13\u5b58\u673a\u5236",level:2},{value:"2.1 \u5f3a\u7f13\u5b58",id:"21-\u5f3a\u7f13\u5b58",level:3},{value:"2.2 \u534f\u5546\u7f13\u5b58",id:"22-\u534f\u5546\u7f13\u5b58",level:3},{value:"3. HTTP/2 \u65b0\u7279\u6027",id:"3-http2-\u65b0\u7279\u6027",level:2},{value:"3.1 \u4e8c\u8fdb\u5236\u5206\u5e27\u5c42",id:"31-\u4e8c\u8fdb\u5236\u5206\u5e27\u5c42",level:3},{value:"3.2 \u591a\u8def\u590d\u7528",id:"32-\u591a\u8def\u590d\u7528",level:3},{value:"3.3 \u670d\u52a1\u5668\u63a8\u9001",id:"33-\u670d\u52a1\u5668\u63a8\u9001",level:3},{value:"3.4 \u5934\u90e8\u538b\u7f29",id:"34-\u5934\u90e8\u538b\u7f29",level:3},{value:"4. \u5b89\u5168\u76f8\u5173\u7684\u54cd\u5e94\u5934",id:"4-\u5b89\u5168\u76f8\u5173\u7684\u54cd\u5e94\u5934",level:2},{value:"4.1 \u5185\u5bb9\u5b89\u5168\u7b56\u7565 (CSP)",id:"41-\u5185\u5bb9\u5b89\u5168\u7b56\u7565-csp",level:3},{value:"4.2 \u8de8\u57df\u8d44\u6e90\u5171\u4eab (CORS)",id:"42-\u8de8\u57df\u8d44\u6e90\u5171\u4eab-cors",level:3},{value:"4.3 \u5176\u4ed6\u5b89\u5168\u5934",id:"43-\u5176\u4ed6\u5b89\u5168\u5934",level:3}];function x(e){const n={code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",header:"header",li:"li",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,s.R)(),...e.components};return(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(n.header,{children:(0,d.jsx)(n.h1,{id:"http-\u534f\u8bae\u8be6\u89e3",children:"HTTP \u534f\u8bae\u8be6\u89e3"})}),"\n",(0,d.jsx)(n.h2,{id:"1-http11-\u57fa\u7840",children:"1. HTTP/1.1 \u57fa\u7840"}),"\n",(0,d.jsx)(n.h3,{id:"11-\u8bf7\u6c42\u65b9\u6cd5",children:"1.1 \u8bf7\u6c42\u65b9\u6cd5"}),"\n",(0,d.jsxs)(n.table,{children:[(0,d.jsx)(n.thead,{children:(0,d.jsxs)(n.tr,{children:[(0,d.jsx)(n.th,{children:"\u65b9\u6cd5"}),(0,d.jsx)(n.th,{children:"\u63cf\u8ff0"}),(0,d.jsx)(n.th,{children:"\u662f\u5426\u5e42\u7b49"}),(0,d.jsx)(n.th,{children:"\u662f\u5426\u5b89\u5168"})]})}),(0,d.jsxs)(n.tbody,{children:[(0,d.jsxs)(n.tr,{children:[(0,d.jsx)(n.td,{children:"GET"}),(0,d.jsx)(n.td,{children:"\u83b7\u53d6\u8d44\u6e90"}),(0,d.jsx)(n.td,{children:"\u662f"}),(0,d.jsx)(n.td,{children:"\u662f"})]}),(0,d.jsxs)(n.tr,{children:[(0,d.jsx)(n.td,{children:"POST"}),(0,d.jsx)(n.td,{children:"\u63d0\u4ea4\u6570\u636e"}),(0,d.jsx)(n.td,{children:"\u5426"}),(0,d.jsx)(n.td,{children:"\u5426"})]}),(0,d.jsxs)(n.tr,{children:[(0,d.jsx)(n.td,{children:"PUT"}),(0,d.jsx)(n.td,{children:"\u4e0a\u4f20/\u66f4\u65b0\u8d44\u6e90"}),(0,d.jsx)(n.td,{children:"\u662f"}),(0,d.jsx)(n.td,{children:"\u5426"})]}),(0,d.jsxs)(n.tr,{children:[(0,d.jsx)(n.td,{children:"DELETE"}),(0,d.jsx)(n.td,{children:"\u5220\u9664\u8d44\u6e90"}),(0,d.jsx)(n.td,{children:"\u662f"}),(0,d.jsx)(n.td,{children:"\u5426"})]}),(0,d.jsxs)(n.tr,{children:[(0,d.jsx)(n.td,{children:"HEAD"}),(0,d.jsx)(n.td,{children:"\u83b7\u53d6\u62a5\u5934"}),(0,d.jsx)(n.td,{children:"\u662f"}),(0,d.jsx)(n.td,{children:"\u662f"})]}),(0,d.jsxs)(n.tr,{children:[(0,d.jsx)(n.td,{children:"OPTIONS"}),(0,d.jsx)(n.td,{children:"\u8be2\u95ee\u652f\u6301\u7684\u65b9\u6cd5"}),(0,d.jsx)(n.td,{children:"\u662f"}),(0,d.jsx)(n.td,{children:"\u662f"})]}),(0,d.jsxs)(n.tr,{children:[(0,d.jsx)(n.td,{children:"PATCH"}),(0,d.jsx)(n.td,{children:"\u90e8\u5206\u66f4\u65b0\u8d44\u6e90"}),(0,d.jsx)(n.td,{children:"\u5426"}),(0,d.jsx)(n.td,{children:"\u5426"})]}),(0,d.jsxs)(n.tr,{children:[(0,d.jsx)(n.td,{children:"TRACE"}),(0,d.jsx)(n.td,{children:"\u8ffd\u8e2a\u8def\u5f84"}),(0,d.jsx)(n.td,{children:"\u662f"}),(0,d.jsx)(n.td,{children:"\u5426"})]})]})]}),"\n",(0,d.jsx)(n.h3,{id:"12-\u72b6\u6001\u7801\u8be6\u89e3",children:"1.2 \u72b6\u6001\u7801\u8be6\u89e3"}),"\n",(0,d.jsx)(n.h4,{id:"1xx---\u4fe1\u606f\u6027\u72b6\u6001\u7801",children:"1xx - \u4fe1\u606f\u6027\u72b6\u6001\u7801"}),"\n",(0,d.jsxs)(n.ul,{children:["\n",(0,d.jsx)(n.li,{children:"100 Continue\uff1a\u7ee7\u7eed\u53d1\u9001\u8bf7\u6c42"}),"\n",(0,d.jsx)(n.li,{children:"101 Switching Protocols\uff1a\u5207\u6362\u534f\u8bae"}),"\n",(0,d.jsx)(n.li,{children:"102 Processing\uff1a\u5904\u7406\u4e2d"}),"\n"]}),"\n",(0,d.jsx)(n.h4,{id:"2xx---\u6210\u529f\u72b6\u6001\u7801",children:"2xx - \u6210\u529f\u72b6\u6001\u7801"}),"\n",(0,d.jsxs)(n.ul,{children:["\n",(0,d.jsx)(n.li,{children:"200 OK\uff1a\u8bf7\u6c42\u6210\u529f"}),"\n",(0,d.jsx)(n.li,{children:"201 Created\uff1a\u5df2\u521b\u5efa"}),"\n",(0,d.jsx)(n.li,{children:"202 Accepted\uff1a\u5df2\u63a5\u53d7"}),"\n",(0,d.jsx)(n.li,{children:"204 No Content\uff1a\u65e0\u5185\u5bb9"}),"\n",(0,d.jsx)(n.li,{children:"206 Partial Content\uff1a\u90e8\u5206\u5185\u5bb9\uff08\u65ad\u70b9\u7eed\u4f20\uff09"}),"\n"]}),"\n",(0,d.jsx)(n.h4,{id:"3xx---\u91cd\u5b9a\u5411\u72b6\u6001\u7801",children:"3xx - \u91cd\u5b9a\u5411\u72b6\u6001\u7801"}),"\n",(0,d.jsxs)(n.ul,{children:["\n",(0,d.jsx)(n.li,{children:"300 Multiple Choices\uff1a\u591a\u79cd\u9009\u62e9"}),"\n",(0,d.jsx)(n.li,{children:"301 Moved Permanently\uff1a\u6c38\u4e45\u91cd\u5b9a\u5411"}),"\n",(0,d.jsx)(n.li,{children:"302 Found\uff1a\u4e34\u65f6\u91cd\u5b9a\u5411"}),"\n",(0,d.jsx)(n.li,{children:"303 See Other\uff1a\u67e5\u770b\u5176\u4ed6\u4f4d\u7f6e"}),"\n",(0,d.jsx)(n.li,{children:"304 Not Modified\uff1a\u672a\u4fee\u6539\uff08\u534f\u5546\u7f13\u5b58\uff09"}),"\n",(0,d.jsx)(n.li,{children:"307 Temporary Redirect\uff1a\u4e34\u65f6\u91cd\u5b9a\u5411\uff08\u4fdd\u6301\u65b9\u6cd5\uff09"}),"\n",(0,d.jsx)(n.li,{children:"308 Permanent Redirect\uff1a\u6c38\u4e45\u91cd\u5b9a\u5411\uff08\u4fdd\u6301\u65b9\u6cd5\uff09"}),"\n"]}),"\n",(0,d.jsx)(n.h4,{id:"4xx---\u5ba2\u6237\u7aef\u9519\u8bef\u72b6\u6001\u7801",children:"4xx - \u5ba2\u6237\u7aef\u9519\u8bef\u72b6\u6001\u7801"}),"\n",(0,d.jsxs)(n.ul,{children:["\n",(0,d.jsx)(n.li,{children:"400 Bad Request\uff1a\u8bf7\u6c42\u8bed\u6cd5\u9519\u8bef"}),"\n",(0,d.jsx)(n.li,{children:"401 Unauthorized\uff1a\u672a\u8ba4\u8bc1"}),"\n",(0,d.jsx)(n.li,{children:"403 Forbidden\uff1a\u88ab\u7981\u6b62"}),"\n",(0,d.jsx)(n.li,{children:"404 Not Found\uff1a\u672a\u627e\u5230"}),"\n",(0,d.jsx)(n.li,{children:"405 Method Not Allowed\uff1a\u65b9\u6cd5\u4e0d\u5141\u8bb8"}),"\n",(0,d.jsx)(n.li,{children:"406 Not Acceptable\uff1a\u4e0d\u63a5\u53d7"}),"\n",(0,d.jsx)(n.li,{children:"408 Request Timeout\uff1a\u8bf7\u6c42\u8d85\u65f6"}),"\n",(0,d.jsx)(n.li,{children:"409 Conflict\uff1a\u51b2\u7a81"}),"\n",(0,d.jsx)(n.li,{children:"413 Payload Too Large\uff1a\u8bf7\u6c42\u4f53\u8fc7\u5927"}),"\n",(0,d.jsx)(n.li,{children:"414 URI Too Long\uff1a\u8bf7\u6c42URL\u8fc7\u957f"}),"\n",(0,d.jsx)(n.li,{children:"415 Unsupported Media Type\uff1a\u4e0d\u652f\u6301\u7684\u5a92\u4f53\u7c7b\u578b"}),"\n",(0,d.jsx)(n.li,{children:"429 Too Many Requests\uff1a\u8bf7\u6c42\u8fc7\u591a"}),"\n"]}),"\n",(0,d.jsx)(n.h4,{id:"5xx---\u670d\u52a1\u5668\u9519\u8bef\u72b6\u6001\u7801",children:"5xx - \u670d\u52a1\u5668\u9519\u8bef\u72b6\u6001\u7801"}),"\n",(0,d.jsxs)(n.ul,{children:["\n",(0,d.jsx)(n.li,{children:"500 Internal Server Error\uff1a\u670d\u52a1\u5668\u5185\u90e8\u9519\u8bef"}),"\n",(0,d.jsx)(n.li,{children:"501 Not Implemented\uff1a\u672a\u5b9e\u73b0"}),"\n",(0,d.jsx)(n.li,{children:"502 Bad Gateway\uff1a\u9519\u8bef\u7f51\u5173"}),"\n",(0,d.jsx)(n.li,{children:"503 Service Unavailable\uff1a\u670d\u52a1\u4e0d\u53ef\u7528"}),"\n",(0,d.jsx)(n.li,{children:"504 Gateway Timeout\uff1a\u7f51\u5173\u8d85\u65f6"}),"\n",(0,d.jsx)(n.li,{children:"505 HTTP Version Not Supported\uff1aHTTP\u7248\u672c\u4e0d\u652f\u6301"}),"\n"]}),"\n",(0,d.jsx)(n.h3,{id:"13-\u8bf7\u6c42\u5934\u8be6\u89e3",children:"1.3 \u8bf7\u6c42\u5934\u8be6\u89e3"}),"\n",(0,d.jsx)(n.pre,{children:(0,d.jsx)(n.code,{className:"language-http",children:"# \u5e38\u89c1\u8bf7\u6c42\u5934\nAccept: text/html,application/xhtml+xml\nAccept-Encoding: gzip, deflate, br\nAccept-Language: zh-CN,zh;q=0.9,en;q=0.8\nCache-Control: no-cache\nConnection: keep-alive\nCookie: session=xxx; user=john\nHost: www.example.com\nUser-Agent: Mozilla/5.0\nOrigin: https://www.example.com\nReferer: https://www.example.com/page\nAuthorization: Bearer xxx\nContent-Type: application/json\n"})}),"\n",(0,d.jsx)(n.h3,{id:"14-\u54cd\u5e94\u5934\u8be6\u89e3",children:"1.4 \u54cd\u5e94\u5934\u8be6\u89e3"}),"\n",(0,d.jsx)(n.pre,{children:(0,d.jsx)(n.code,{className:"language-http",children:'# \u5e38\u89c1\u54cd\u5e94\u5934\nAccess-Control-Allow-Origin: *\nCache-Control: max-age=3600\nContent-Type: text/html; charset=utf-8\nContent-Length: 1234\nContent-Encoding: gzip\nETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"\nLast-Modified: Wed, 21 Oct 2015 07:28:00 GMT\nSet-Cookie: name=value; expires=Wed, 21 Oct 2015 07:28:00 GMT\nX-Frame-Options: DENY\nX-XSS-Protection: 1; mode=block\n'})}),"\n",(0,d.jsx)(n.h2,{id:"2-http-\u7f13\u5b58\u673a\u5236",children:"2. HTTP \u7f13\u5b58\u673a\u5236"}),"\n",(0,d.jsx)(n.h3,{id:"21-\u5f3a\u7f13\u5b58",children:"2.1 \u5f3a\u7f13\u5b58"}),"\n",(0,d.jsx)(n.pre,{children:(0,d.jsx)(n.code,{className:"language-http",children:"# Expires\uff08HTTP/1.0\uff09\nExpires: Wed, 21 Oct 2015 07:28:00 GMT\n\n# Cache-Control\uff08HTTP/1.1\uff09\nCache-Control: max-age=3600\nCache-Control: no-cache\nCache-Control: no-store\n"})}),"\n",(0,d.jsx)(n.h3,{id:"22-\u534f\u5546\u7f13\u5b58",children:"2.2 \u534f\u5546\u7f13\u5b58"}),"\n",(0,d.jsx)(n.pre,{children:(0,d.jsx)(n.code,{className:"language-http",children:'# Last-Modified / If-Modified-Since\nLast-Modified: Wed, 21 Oct 2015 07:28:00 GMT\nIf-Modified-Since: Wed, 21 Oct 2015 07:28:00 GMT\n\n# ETag / If-None-Match\nETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"\nIf-None-Match: "33a64df551425fcc55e4d42a148795d9f25f89d4"\n'})}),"\n",(0,d.jsx)(n.h2,{id:"3-http2-\u65b0\u7279\u6027",children:"3. HTTP/2 \u65b0\u7279\u6027"}),"\n",(0,d.jsx)(n.h3,{id:"31-\u4e8c\u8fdb\u5236\u5206\u5e27\u5c42",children:"3.1 \u4e8c\u8fdb\u5236\u5206\u5e27\u5c42"}),"\n",(0,d.jsx)(n.pre,{children:(0,d.jsx)(n.code,{children:"HTTP/1.1:\nGET /resource HTTP/1.1\nHost: example.com\n\nHTTP/2:\nHEADERS frame\nDATA frame\n"})}),"\n",(0,d.jsx)(n.h3,{id:"32-\u591a\u8def\u590d\u7528",children:"3.2 \u591a\u8def\u590d\u7528"}),"\n",(0,d.jsxs)(n.ul,{children:["\n",(0,d.jsx)(n.li,{children:"\u5355\u4e2a TCP \u8fde\u63a5\u4e0a\u53ef\u4ee5\u5e76\u884c\u591a\u4e2a\u8bf7\u6c42"}),"\n",(0,d.jsx)(n.li,{children:"\u89e3\u51b3\u4e86 HTTP/1.1 \u7684\u961f\u5934\u963b\u585e\u95ee\u9898"}),"\n",(0,d.jsx)(n.li,{children:"\u63d0\u9ad8\u4e86\u7f51\u9875\u52a0\u8f7d\u901f\u5ea6"}),"\n"]}),"\n",(0,d.jsx)(n.h3,{id:"33-\u670d\u52a1\u5668\u63a8\u9001",children:"3.3 \u670d\u52a1\u5668\u63a8\u9001"}),"\n",(0,d.jsx)(n.pre,{children:(0,d.jsx)(n.code,{className:"language-http",children:"Link: </styles.css>; rel=preload; as=style\nLink: </scripts.js>; rel=preload; as=script\n"})}),"\n",(0,d.jsx)(n.h3,{id:"34-\u5934\u90e8\u538b\u7f29",children:"3.4 \u5934\u90e8\u538b\u7f29"}),"\n",(0,d.jsxs)(n.ul,{children:["\n",(0,d.jsx)(n.li,{children:"HPACK \u538b\u7f29\u7b97\u6cd5"}),"\n",(0,d.jsx)(n.li,{children:"\u9759\u6001\u5b57\u5178"}),"\n",(0,d.jsx)(n.li,{children:"\u52a8\u6001\u5b57\u5178"}),"\n",(0,d.jsx)(n.li,{children:"Huffman \u7f16\u7801"}),"\n"]}),"\n",(0,d.jsx)(n.h2,{id:"4-\u5b89\u5168\u76f8\u5173\u7684\u54cd\u5e94\u5934",children:"4. \u5b89\u5168\u76f8\u5173\u7684\u54cd\u5e94\u5934"}),"\n",(0,d.jsx)(n.h3,{id:"41-\u5185\u5bb9\u5b89\u5168\u7b56\u7565-csp",children:"4.1 \u5185\u5bb9\u5b89\u5168\u7b56\u7565 (CSP)"}),"\n",(0,d.jsx)(n.pre,{children:(0,d.jsx)(n.code,{className:"language-http",children:"Content-Security-Policy: default-src 'self';\nscript-src 'self' 'unsafe-inline';\nstyle-src 'self' 'unsafe-inline';\nimg-src 'self' data: https:;\n"})}),"\n",(0,d.jsx)(n.h3,{id:"42-\u8de8\u57df\u8d44\u6e90\u5171\u4eab-cors",children:"4.2 \u8de8\u57df\u8d44\u6e90\u5171\u4eab (CORS)"}),"\n",(0,d.jsx)(n.pre,{children:(0,d.jsx)(n.code,{className:"language-http",children:"Access-Control-Allow-Origin: https://example.com\nAccess-Control-Allow-Methods: GET, POST, PUT\nAccess-Control-Allow-Headers: Content-Type\nAccess-Control-Max-Age: 86400\n"})}),"\n",(0,d.jsx)(n.h3,{id:"43-\u5176\u4ed6\u5b89\u5168\u5934",children:"4.3 \u5176\u4ed6\u5b89\u5168\u5934"}),"\n",(0,d.jsx)(n.pre,{children:(0,d.jsx)(n.code,{className:"language-http",children:"# \u9632\u6b62\u70b9\u51fb\u52ab\u6301\nX-Frame-Options: DENY\n\n# XSS \u4fdd\u62a4\nX-XSS-Protection: 1; mode=block\n\n# \u5185\u5bb9\u7c7b\u578b\u55c5\u63a2\nX-Content-Type-Options: nosniff\n\n# HSTS\nStrict-Transport-Security: max-age=31536000; includeSubDomains\n"})})]})}function o(e={}){const{wrapper:n}={...(0,s.R)(),...e.components};return n?(0,d.jsx)(n,{...e,children:(0,d.jsx)(x,{...e})}):x(e)}},8453:(e,n,l)=>{l.d(n,{R:()=>r,x:()=>t});var i=l(6540);const d={},s=i.createContext(d);function r(e){const n=i.useContext(s);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function t(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(d):e.components||d:r(e.components),i.createElement(s.Provider,{value:n},e.children)}}}]);