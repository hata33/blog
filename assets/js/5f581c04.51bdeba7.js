"use strict";(self.webpackChunkblog=self.webpackChunkblog||[]).push([[789],{2466:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>o,contentTitle:()=>c,default:()=>h,frontMatter:()=>s,metadata:()=>i,toc:()=>l});var t=r(4848),a=r(8453);const s={},c="\u5f02\u6b65\u51fd\u6570",i={id:"JavaScript/promsie/await",title:"\u5f02\u6b65\u51fd\u6570",description:"\u5f02\u6b65\u51fd\u6570\uff0c\u4e5f\u79f0\u4e3a\u201casync/await\u201d\uff08\u8bed\u6cd5\u5173\u952e\u5b57\uff09",source:"@site/docs/10-JavaScript/11-promsie/await.md",sourceDirName:"10-JavaScript/11-promsie",slug:"/JavaScript/promsie/await",permalink:"/blog/docs/JavaScript/promsie/await",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{},sidebar:"defaultSidebar",previous:{title:"Promise",permalink:"/blog/docs/JavaScript/promsie/promise"},next:{title:"BOM",permalink:"/blog/docs/JavaScript/BOM"}},o={},l=[{value:"why",id:"why",level:2},{value:"what",id:"what",level:2},{value:"how",id:"how",level:2}];function d(e){const n={code:"code",h1:"h1",h2:"h2",header:"header",li:"li",ol:"ol",p:"p",pre:"pre",...(0,a.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.header,{children:(0,t.jsx)(n.h1,{id:"\u5f02\u6b65\u51fd\u6570",children:"\u5f02\u6b65\u51fd\u6570"})}),"\n",(0,t.jsx)(n.p,{children:"\u5f02\u6b65\u51fd\u6570\uff0c\u4e5f\u79f0\u4e3a\u201casync/await\u201d\uff08\u8bed\u6cd5\u5173\u952e\u5b57\uff09"}),"\n",(0,t.jsx)(n.h2,{id:"why",children:"why"}),"\n",(0,t.jsxs)(n.p,{children:["\u8ba9\u4ee5\u540c\u6b65\u65b9\u5f0f\u5199\u7684\u4ee3\u7801\u80fd\u591f\u540c\u6b65\u6267\u884c\uff0c\u4f7f\u4ee3\u7801\u66f4\u52a0\u76f4\u89c2\u548c\u6613\u8bfb\uff0c\u907f\u514d\u4e86\u5d4c\u5957\u56de\u8c03\u548c\u590d\u6742\u7684 Promise \u94fe\u5f0f\u8c03\u7528\uff0c\u4ee5\u53ca\u4f7f\u9519\u8bef\u5904\u7406\u66f4\u7b80\u6d01\uff0c\u53ef\u4ee5\u4f7f\u7528",(0,t.jsx)(n.code,{children:"try/catch"}),"\u8bed\u53e5\u5904\u7406\u9519\u8bef\u3002"]}),"\n",(0,t.jsx)(n.h2,{id:"what",children:"what"}),"\n",(0,t.jsx)(n.p,{children:"async/await \u662f JavaScript \u4e2d\u5904\u7406\u5f02\u6b65\u64cd\u4f5c\u7684\u8bed\u6cd5\u7cd6\uff0c\u5b83\u4eec\u7684\u5b9e\u73b0\u4f9d\u8d56\u4e8e\u751f\u6210\u5668\u548c\u8fed\u4ee3\u5668\u3002async \u7528\u6765\u58f0\u660e\u4e00\u4e2a\u5f02\u6b65\u51fd\u6570\uff0c\u800c await \u7528\u4e8e\u6682\u505c\u8be5\u51fd\u6570\u7684\u6267\u884c\uff0c\u7b49\u5f85\u5f02\u6b65\u64cd\u4f5c\u5b8c\u6210\u5e76\u8fd4\u56de\u7ed3\u679c\u3002\u901a\u8fc7\u8fd9\u79cd\u65b9\u5f0f\uff0casync/await \u63d0\u4f9b\u4e86\u4e00\u79cd\u66f4\u7b80\u6d01\u548c\u53ef\u8bfb\u7684\u65b9\u5f0f\u6765\u5904\u7406\u5f02\u6b65\u4ee3\u7801\u3002"}),"\n",(0,t.jsx)(n.h2,{id:"how",children:"how"}),"\n",(0,t.jsx)(n.p,{children:"\u5b9e\u73b0 async/await"}),"\n",(0,t.jsxs)(n.p,{children:["\u9996\u5148\uff0c\u751f\u6210\u5668\u51fd\u6570\u4e0e\u8fed\u4ee3\u5668\u7684\u7ed3\u5408\uff0c\u4e3a ",(0,t.jsx)(n.code,{children:"async/await"})," \u7684\u5b9e\u73b0\u63d0\u4f9b\u4e86\u57fa\u7840\u3002\r\n\u751f\u6210\u5668:\u662f\u4e00\u79cd\u53ef\u4ee5\u5728\u6267\u884c\u8fc7\u7a0b\u4e2d\u6682\u505c\u548c\u6062\u590d\u7684\u51fd\u6570\u3002\u751f\u6210\u5668\u51fd\u6570\u4f7f\u7528 ",(0,t.jsx)(n.code,{children:"function"}),"* \u58f0\u660e\uff0c\u5e76\u4f7f\u7528 ",(0,t.jsx)(n.code,{children:"yield"})," \u5173\u952e\u5b57\u6765\u6682\u505c\u51fd\u6570\u7684\u6267\u884c\u3002"]}),"\n",(0,t.jsxs)(n.p,{children:["\u8fed\u4ee3\u5668:\u662f\u4e00\u4e2a\u5bf9\u8c61\uff0c\u5b83\u5b9e\u73b0\u4e86\u4e00\u4e2a ",(0,t.jsx)(n.code,{children:"next()"})," \u65b9\u6cd5\uff0c\u8be5\u65b9\u6cd5\u8fd4\u56de\u4e00\u4e2a\u5f62\u5982 ",(0,t.jsx)(n.code,{children:"{ value: any, done: boolean }"})," \u7684\u5bf9\u8c61\u3002"]}),"\n",(0,t.jsx)(n.p,{children:"\u5728\u5904\u7406\u5f02\u6b65\u65f6\uff0c\u751f\u6210\u5668\u51fd\u6570\u53ef\u4ee5\u5728\u6267\u884c\u8fc7\u7a0b\u4e2d\u6682\u505c (yield) \u5e76\u6062\u590d\uff08next()\uff09\uff0c\u53ef\u4ee5\u5728\u5f02\u6b65\u64cd\u4f5c\u5b8c\u6210\u540e\u6062\u590d\u6267\u884c\u3002\u4f7f\u7528\u751f\u6210\u5668\u51fd\u6570\uff0c\u53ef\u4ee5\u66f4\u5bb9\u6613\u5730\u7ba1\u7406\u5f02\u6b65\u64cd\u4f5c\u7684\u6267\u884c\u987a\u5e8f\u548c\u63a7\u5236\u6d41\u3002"}),"\n",(0,t.jsx)(n.p,{children:"\u5b9e\u73b0\u601d\u8def\uff1a"}),"\n",(0,t.jsxs)(n.ol,{children:["\n",(0,t.jsx)(n.li,{children:"\u4f7f\u7528\u751f\u6210\u5668\u51fd\u6570\u4e0e\u8fed\u4ee3\u5668\u7ed3\u5408\u7528\u6765\u7ec4\u7ec7\u5f02\u6b65\u51fd\u6570\u3002"}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-js",children:'function* testG() {\r\n  // await\u88ab\u7f16\u8bd1\u6210\u4e86yield\r\n  const data = yield getData();\r\n  console.log("data: ", data);\r\n  const data2 = yield getData();\r\n  console.log("data2: ", data2);\r\n  return "success";\r\n}\n'})}),"\n",(0,t.jsxs)(n.ol,{start:"2",children:["\n",(0,t.jsx)(n.li,{children:"\u7f16\u5199\u81ea\u52a8\u6267\u884c\u7684\u51fd\u6570\uff0c\u8ba9 generator \u51fd\u6570\u5b9e\u73b0 async \u51fd\u6570\u7684\u529f\u80fd\u3002"}),"\n"]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-js",children:'function GeneratorToAsync(genFunc) {\r\n  return function () {\r\n    const gen = genFunc.apply(this, arguments);\r\n    return new Promise((resolve, reject) => {\r\n      function step(key, arg) {\r\n        let generatorResult;\r\n        try {\r\n          generatorResult = gen[key](arg);\r\n        } catch (error) {\r\n          return reject(error);\r\n        }\r\n        const { value, done } = generatorResult;\r\n        if (done) {\r\n          return resolve(value);\r\n        } else {\r\n          return Promise.resolve(value).then(\r\n            (val) => step("next", val),\r\n            (err) => step("throw", err)\r\n          );\r\n        }\r\n      }\r\n      step("next");\r\n    });\r\n  };\r\n}\n'})}),"\n",(0,t.jsx)(n.p,{children:"async/await \u80cc\u540e\u7684\u5b9e\u73b0"}),"\n",(0,t.jsx)(n.p,{children:"\u5b9e\u9645\u4e0a\uff0casync/await \u5c31\u662f\u57fa\u4e8e\u751f\u6210\u5668\u548c\u8fed\u4ee3\u5668\u6a21\u5f0f\u7684\u4e00\u79cd\u66f4\u9ad8\u7ea7\u7684\u62bd\u8c61\u3002JavaScript \u5f15\u64ce\u5728\u9047\u5230 async \u51fd\u6570\u65f6\uff0c\u4f1a\u5c06\u5176\u8f6c\u6362\u4e3a\u751f\u6210\u5668\u51fd\u6570\uff0c\u5e76\u4f7f\u7528\u7c7b\u4f3c\u4e0a\u9762\u7684\u673a\u5236\u6765\u5904\u7406 await \u8868\u8fbe\u5f0f\uff0c\u4ece\u800c\u5b9e\u73b0\u5f02\u6b65\u64cd\u4f5c\u7684\u6682\u505c\u548c\u6062\u590d\u3002"})]})}function h(e={}){const{wrapper:n}={...(0,a.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(d,{...e})}):d(e)}},8453:(e,n,r)=>{r.d(n,{R:()=>c,x:()=>i});var t=r(6540);const a={},s=t.createContext(a);function c(e){const n=t.useContext(s);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function i(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:c(e.components),t.createElement(s.Provider,{value:n},e.children)}}}]);