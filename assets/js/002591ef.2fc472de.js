"use strict";(self.webpackChunkblog=self.webpackChunkblog||[]).push([[599],{5187:(n,e,r)=>{r.r(e),r.d(e,{assets:()=>t,contentTitle:()=>c,default:()=>h,frontMatter:()=>i,metadata:()=>d,toc:()=>a});var l=r(4848),s=r(8453);const i={},c="ES6+ \u65b0\u7279\u6027",d={id:"JavaScript/ES6-\u65b0\u7279\u6027",title:"ES6+ \u65b0\u7279\u6027",description:"\u962e\u4e00\u5cf0 ES6 \u5165\u95e8",source:"@site/docs/10-JavaScript/53-ES6-\u65b0\u7279\u6027.md",sourceDirName:"10-JavaScript",slug:"/JavaScript/ES6-\u65b0\u7279\u6027",permalink:"/blog/docs/JavaScript/ES6-\u65b0\u7279\u6027",draft:!1,unlisted:!1,tags:[],version:"current",sidebarPosition:53,frontMatter:{},sidebar:"defaultSidebar",previous:{title:"\u5f02\u6b65\u5355\u7ebf\u7a0b",permalink:"/blog/docs/JavaScript/\u5f02\u6b65\u548c\u5355\u7ebf\u7a0b"},next:{title:"\u9762\u8bd5\u9898",permalink:"/blog/docs/JavaScript/\u9762\u8bd5\u9898"}},t={},a=[{value:"\u6982\u62ec",id:"\u6982\u62ec",level:2},{value:"\u5728\u9879\u76ee\u4e2d\u4f7f\u7528",id:"\u5728\u9879\u76ee\u4e2d\u4f7f\u7528",level:2},{value:"let const",id:"let-const",level:3},{value:"\u8ba9\u4e00\u4e2a const \u58f0\u660e\u7684\u5bf9\u8c61\u6216\u6570\u7ec4\u4e0d\u53ef\u53d8\u7684\u65b9\u6cd5\uff1a",id:"\u8ba9\u4e00\u4e2a-const-\u58f0\u660e\u7684\u5bf9\u8c61\u6216\u6570\u7ec4\u4e0d\u53ef\u53d8\u7684\u65b9\u6cd5",level:4},{value:"\u89e3\u6784\u8d4b\u503c",id:"\u89e3\u6784\u8d4b\u503c",level:3},{value:"\u65b0\u589e\u7684\u8fd0\u7b97\u7b26",id:"\u65b0\u589e\u7684\u8fd0\u7b97\u7b26",level:3},{value:"\u6a21\u677f\u5b57\u7b26\u4e32",id:"\u6a21\u677f\u5b57\u7b26\u4e32",level:3},{value:"\u5185\u7f6e\u5bf9\u8c61\u65b0\u589e\u4e86\u65b9\u6cd5",id:"\u5185\u7f6e\u5bf9\u8c61\u65b0\u589e\u4e86\u65b9\u6cd5",level:3},{value:"\u5b57\u7b26\u4e32\u6269\u5c55",id:"\u5b57\u7b26\u4e32\u6269\u5c55",level:4},{value:"\u6b63\u5219\u6269\u5c55",id:"\u6b63\u5219\u6269\u5c55",level:4},{value:"\u6570\u503c\u6269\u5c55",id:"\u6570\u503c\u6269\u5c55",level:4},{value:"\u51fd\u6570\u6269\u5c55",id:"\u51fd\u6570\u6269\u5c55",level:4},{value:"\u6570\u7ec4\u6269\u5c55",id:"\u6570\u7ec4\u6269\u5c55",level:4},{value:"\u5bf9\u8c61\u6269\u5c55",id:"\u5bf9\u8c61\u6269\u5c55",level:4},{value:"Symbol \u548c BigInt",id:"symbol-\u548c-bigint",level:3},{value:"Symbol\uff1a",id:"symbol",level:4},{value:"BigInt\uff1a",id:"bigint",level:4},{value:"Map Set \u6570\u636e\u7ed3\u6784",id:"map-set-\u6570\u636e\u7ed3\u6784",level:3},{value:"Map \u6570\u636e\u7ed3\u6784",id:"map-\u6570\u636e\u7ed3\u6784",level:4},{value:"Set \u6570\u636e\u7ed3\u6784",id:"set-\u6570\u636e\u7ed3\u6784",level:4},{value:"Proxy Reflect",id:"proxy-reflect",level:3},{value:"\u7bad\u5934\u51fd\u6570",id:"\u7bad\u5934\u51fd\u6570",level:3},{value:"\u7bad\u5934\u51fd\u6570\u548c\u666e\u901a\u51fd\u6570\u7684\u533a\u522b",id:"\u7bad\u5934\u51fd\u6570\u548c\u666e\u901a\u51fd\u6570\u7684\u533a\u522b",level:4},{value:"generator",id:"generator",level:3},{value:"promise",id:"promise",level:3},{value:"async await",id:"async-await",level:3},{value:"class",id:"class",level:3},{value:"\u7ee7\u627f",id:"\u7ee7\u627f",level:4},{value:"ESModules",id:"esmodules",level:3},{value:"\u5bfc\u51fa\uff08Export\uff09",id:"\u5bfc\u51faexport",level:4},{value:"\u5bfc\u5165\uff08Import\uff09",id:"\u5bfc\u5165import",level:4},{value:"\u9ed8\u8ba4\u5bfc\u51fa",id:"\u9ed8\u8ba4\u5bfc\u51fa",level:4},{value:"\u6a21\u5757\u7684\u7279\u70b9",id:"\u6a21\u5757\u7684\u7279\u70b9",level:4},{value:"\u4f7f\u7528\u573a\u666f",id:"\u4f7f\u7528\u573a\u666f",level:4},{value:"ECMAScript \u89c4\u8303\u53d1\u5e03\u6d41\u7a0b\u5982\u4e0b\uff1a",id:"ecmascript-\u89c4\u8303\u53d1\u5e03\u6d41\u7a0b\u5982\u4e0b",level:3}];function o(n){const e={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",header:"header",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,s.R)(),...n.components};return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(e.header,{children:(0,l.jsx)(e.h1,{id:"es6-\u65b0\u7279\u6027",children:"ES6+ \u65b0\u7279\u6027"})}),"\n",(0,l.jsx)(e.p,{children:(0,l.jsx)(e.a,{href:"https://es6.ruanyifeng.com/",children:"\u962e\u4e00\u5cf0 ES6 \u5165\u95e8"})}),"\n",(0,l.jsx)(e.h2,{id:"\u6982\u62ec",children:"\u6982\u62ec"}),"\n",(0,l.jsx)(e.p,{children:"\u6982\u62ec\u4e00\u4e0b\u5c31\u662f\u8fd9\u4e9b\uff1a"}),"\n",(0,l.jsx)(e.p,{children:"let const"}),"\n",(0,l.jsx)(e.p,{children:"\u89e3\u6784\u8d4b\u503c"}),"\n",(0,l.jsx)(e.p,{children:"\u65b0\u589e\u8fd0\u7b97\u7b26 ... ?. ??"}),"\n",(0,l.jsx)(e.p,{children:"\u6a21\u677f\u5b57\u7b26\u4e32"}),"\n",(0,l.jsx)(e.p,{children:"\u5185\u7f6e\u5bf9\u8c61\u65b0\u589e\u4e86\u65b9\u6cd5"}),"\n",(0,l.jsx)(e.p,{children:"Symbol \u548c BigInt"}),"\n",(0,l.jsx)(e.p,{children:"Map Set \u6570\u636e\u7ed3\u6784"}),"\n",(0,l.jsx)(e.p,{children:"Proxy Reflect"}),"\n",(0,l.jsx)(e.p,{children:"\u7bad\u5934\u51fd\u6570"}),"\n",(0,l.jsx)(e.p,{children:"generator"}),"\n",(0,l.jsx)(e.p,{children:"promise"}),"\n",(0,l.jsx)(e.p,{children:"async await"}),"\n",(0,l.jsx)(e.p,{children:"class"}),"\n",(0,l.jsx)(e.p,{children:"ESModules"}),"\n",(0,l.jsx)(e.h2,{id:"\u5728\u9879\u76ee\u4e2d\u4f7f\u7528",children:"\u5728\u9879\u76ee\u4e2d\u4f7f\u7528"}),"\n",(0,l.jsx)(e.h3,{id:"let-const",children:"let const"}),"\n",(0,l.jsxs)(e.ol,{children:["\n",(0,l.jsxs)(e.li,{children:["\n",(0,l.jsx)(e.p,{children:"let \u548c const \u90fd\u5177\u6709\u5757\u7ea7\u4f5c\u7528\u57df\uff0c\u56e0\u6b64\u5728\u5faa\u73af\u6216\u6761\u4ef6\u8bed\u53e5\u4e2d\u4f7f\u7528\u65f6\uff0c\u8981\u6ce8\u610f\u53d8\u91cf\u7684\u4f5c\u7528\u57df\u3002"}),"\n"]}),"\n",(0,l.jsxs)(e.li,{children:["\n",(0,l.jsx)(e.p,{children:"let \u548c const \u90fd\u5b58\u5728\u201c\u6682\u65f6\u6027\u6b7b\u533a\u201d\uff08Temporal Dead Zone, TDZ\uff09\u7684\u95ee\u9898\u3002\u5728\u58f0\u660e\u4e4b\u524d\uff0c\u5c1d\u8bd5\u8bbf\u95ee\u8fd9\u4e9b\u53d8\u91cf\u4f1a\u5bfc\u81f4\u9519\u8bef\u3002"}),"\n"]}),"\n",(0,l.jsxs)(e.li,{children:["\n",(0,l.jsx)(e.p,{children:"\u4f7f\u7528 let \u548c const \u58f0\u660e\u7684\u53d8\u91cf\u4e0d\u80fd\u88ab\u91cd\u590d\u58f0\u660e\u3002\u8fd9\u907f\u514d\u4e86\u53d8\u91cf\u540d\u51b2\u7a81\u3002"}),"\n"]}),"\n",(0,l.jsxs)(e.li,{children:["\n",(0,l.jsx)(e.p,{children:"const \u7528\u4e8e\u58f0\u660e\u5e38\u91cf\uff0c\u8868\u793a\u53d8\u91cf\u7684\u7ed1\u5b9a\u4e0d\u53ef\u66f4\u6539\uff0c\u4f46\u5bf9\u8c61\u7684\u5c5e\u6027\u4ecd\u7136\u53ef\u4ee5\u4fee\u6539\uff0c\u56e0\u6b64\u8981\u6ce8\u610f\u6df1\u6d45\u62f7\u8d1d\u95ee\u9898\u3002"}),"\n"]}),"\n",(0,l.jsxs)(e.li,{children:["\n",(0,l.jsx)(e.p,{children:"const \u5728\u58f0\u660e\u65f6\u5fc5\u987b\u521d\u59cb\u5316\uff0c\u800c let \u53ef\u4ee5\u5148\u58f0\u660e\u540e\u8d4b\u503c\u3002"}),"\n"]}),"\n",(0,l.jsxs)(e.li,{children:["\n",(0,l.jsx)(e.p,{children:"\u5c3d\u91cf\u907f\u514d\u5728\u5168\u5c40\u4f5c\u7528\u57df\u4e2d\u4f7f\u7528 let \u548c const\uff0c\u63a8\u8350\u5728\u51fd\u6570\u6216\u6a21\u5757\u4e2d\u4f7f\u7528\uff0c\u4ee5\u51cf\u5c11\u547d\u540d\u51b2\u7a81\u3002"}),"\n"]}),"\n"]}),"\n",(0,l.jsx)(e.h4,{id:"\u8ba9\u4e00\u4e2a-const-\u58f0\u660e\u7684\u5bf9\u8c61\u6216\u6570\u7ec4\u4e0d\u53ef\u53d8\u7684\u65b9\u6cd5",children:"\u8ba9\u4e00\u4e2a const \u58f0\u660e\u7684\u5bf9\u8c61\u6216\u6570\u7ec4\u4e0d\u53ef\u53d8\u7684\u65b9\u6cd5\uff1a"}),"\n",(0,l.jsxs)(e.ol,{children:["\n",(0,l.jsx)(e.li,{children:"\u4f7f\u7528 Object.freeze()"}),"\n"]}),"\n",(0,l.jsx)(e.pre,{children:(0,l.jsx)(e.code,{className:"language-js",children:'const obj = Object.freeze({ key: "value" });\r\nobj.key = "newValue"; // \u4e0d\u4f1a\u6539\u53d8\u539f\u5bf9\u8c61\r\n\r\n// \u51bb\u7ed3\u5bf9\u8c61\r\nconst arr = Object.freeze([\r\n  Object.freeze({ key: "value" }),\r\n  Object.freeze({ key: "anotherValue" }),\r\n]);\n'})}),"\n",(0,l.jsxs)(e.ol,{start:"2",children:["\n",(0,l.jsx)(e.li,{children:"\u6df1\u5ea6\u51bb\u7ed3"}),"\n"]}),"\n",(0,l.jsx)(e.p,{children:"\u5982\u679c\u5bf9\u8c61\u5305\u542b\u5d4c\u5957\u5bf9\u8c61\uff0c\u9700\u8981\u4f7f\u7528\u9012\u5f52\u51bb\u7ed3\u3002"}),"\n",(0,l.jsx)(e.pre,{children:(0,l.jsx)(e.code,{className:"language-js",children:'function deepFreeze(obj) {\r\n  Object.freeze(obj);\r\n  Object.keys(obj).forEach((key) => {\r\n    if (obj[key] && typeof obj[key] === "object") {\r\n      deepFreeze(obj[key]);\r\n    }\r\n  });\r\n}\r\n\r\nconst nestedObj = { key: { subKey: "value" } };\r\ndeepFreeze(nestedObj);\n'})}),"\n",(0,l.jsxs)(e.ol,{start:"3",children:["\n",(0,l.jsx)(e.li,{children:"\u4f7f\u7528 Immutable.js \u6216\u7c7b\u4f3c\u5e93"}),"\n"]}),"\n",(0,l.jsx)(e.p,{children:"\u4f7f\u7528\u5e93\u5982 Immutable.js \u521b\u5efa\u4e0d\u53ef\u53d8\u7684\u6570\u636e\u7ed3\u6784\u3002"}),"\n",(0,l.jsx)(e.pre,{children:(0,l.jsx)(e.code,{className:"language-js",children:'const { List, Map } = require("immutable");\r\nconst immutableList = List([Map({ key: "value" })]);\n'})}),"\n",(0,l.jsxs)(e.ol,{start:"4",children:["\n",(0,l.jsx)(e.li,{children:"\u4f7f\u7528 ES6 \u7684\u5c55\u5f00\u8fd0\u7b97\u7b26\uff1a"}),"\n"]}),"\n",(0,l.jsx)(e.p,{children:"\u5bf9\u4e8e\u6570\u7ec4\uff0c\u53ef\u4ee5\u4f7f\u7528\u5c55\u5f00\u8fd0\u7b97\u7b26\u521b\u5efa\u65b0\u7684\u6570\u7ec4\u526f\u672c\uff0c\u800c\u4e0d\u76f4\u63a5\u4fee\u6539\u539f\u6570\u7ec4\u3002"}),"\n",(0,l.jsx)(e.pre,{children:(0,l.jsx)(e.code,{className:"language-js",children:"const arr = [1, 2, 3];\r\nconst newArr = [...arr]; // \u521b\u5efa\u65b0\u6570\u7ec4\n"})}),"\n",(0,l.jsx)(e.h3,{id:"\u89e3\u6784\u8d4b\u503c",children:"\u89e3\u6784\u8d4b\u503c"}),"\n",(0,l.jsxs)(e.ol,{children:["\n",(0,l.jsx)(e.li,{children:"\u6570\u7ec4\u7684\u7ed3\u6784\u8d4b\u503c"}),"\n"]}),"\n",(0,l.jsx)(e.pre,{children:(0,l.jsx)(e.code,{className:"language-js",children:"const arr = [1, 2, 3];\r\n\r\n// \u57fa\u672c\u7528\u6cd5\r\nconst [a, b] = arr; // a = 1, b = 2\r\n\r\n// \u8df3\u8fc7\u5143\u7d20\r\nconst [first, , third] = arr; // first = 1, third = 3\r\n\r\n// \u5269\u4f59\u53c2\u6570\r\nconst [x, ...rest] = arr; // x = 1, rest = [2, 3]\n"})}),"\n",(0,l.jsxs)(e.ol,{start:"2",children:["\n",(0,l.jsx)(e.li,{children:"\u5bf9\u8c61\u7684\u7ed3\u6784\u8d4b\u503c"}),"\n"]}),"\n",(0,l.jsx)(e.pre,{children:(0,l.jsx)(e.code,{className:"language-js",children:"const obj = { name: \"Alice\", age: 25 };\r\n\r\n// \u57fa\u672c\u7528\u6cd5\r\nconst { name, age } = obj; // name = 'Alice', age = 25\r\n\r\n// \u91cd\u547d\u540d\u53d8\u91cf\r\nconst { name: fullName } = obj; // fullName = 'Alice'\r\n\r\n// \u9ed8\u8ba4\u503c\r\nconst { height = 180 } = obj; // height = 180, \u56e0\u4e3a obj \u4e2d\u6ca1\u6709 height\n"})}),"\n",(0,l.jsxs)(e.ol,{start:"3",children:["\n",(0,l.jsx)(e.li,{children:"\u5d4c\u5957\u7ed3\u6784\u8d4b\u503c"}),"\n"]}),"\n",(0,l.jsx)(e.pre,{children:(0,l.jsx)(e.code,{className:"language-js",children:"const nested = { a: 1, b: { c: 2 } };\r\n\r\n// \u5bf9\u8c61\u5d4c\u5957\r\nconst {\r\n  b: { c },\r\n} = nested; // c = 2\r\n\r\nconst arrNested = [\r\n  [1, 2],\r\n  [3, 4],\r\n];\r\nconst [[one, two], [three, four]] = arrNested; // one = 1, two = 2\n"})}),"\n",(0,l.jsxs)(e.ol,{start:"4",children:["\n",(0,l.jsx)(e.li,{children:"\u89e3\u6784\u8d4b\u503c\u4e0e\u51fd\u6570\u53c2\u6570"}),"\n"]}),"\n",(0,l.jsx)(e.pre,{children:(0,l.jsx)(e.code,{className:"language-js",children:'function display({ name, age }) {\r\n  console.log(`Name: ${name}, Age: ${age}`);\r\n}\r\n\r\nconst person = { name: "Bob", age: 30 };\r\ndisplay(person); // \u8f93\u51fa: Name: Bob, Age: 30\n'})}),"\n",(0,l.jsxs)(e.ol,{start:"5",children:["\n",(0,l.jsx)(e.li,{children:"\u4ea4\u6362\u53d8\u91cf\u503c"}),"\n"]}),"\n",(0,l.jsx)(e.pre,{children:(0,l.jsx)(e.code,{className:"language-js",children:"let a = 1;\r\nlet b = 2;\r\n[a, b] = [b, a]; // a = 2, b = 1\n"})}),"\n",(0,l.jsxs)(e.ol,{start:"6",children:["\n",(0,l.jsx)(e.li,{children:"\u7ed3\u6784\u8d4b\u503c\u91cd\u547d\u540d"}),"\n"]}),"\n",(0,l.jsx)(e.pre,{children:(0,l.jsx)(e.code,{className:"language-js",children:'const person = { name: "Alice", age: 25 };\r\n\r\n// \u91cd\u547d\u540d\r\nconst { name: fullName, age: years } = person;\n'})}),"\n",(0,l.jsx)(e.h3,{id:"\u65b0\u589e\u7684\u8fd0\u7b97\u7b26",children:"\u65b0\u589e\u7684\u8fd0\u7b97\u7b26"}),"\n",(0,l.jsxs)(e.ol,{children:["\n",(0,l.jsxs)(e.li,{children:["\u6269\u5c55\u8fd0\u7b97\u7b26 (",(0,l.jsx)(e.code,{children:"..."}),")"]}),"\n"]}),"\n",(0,l.jsxs)(e.p,{children:[(0,l.jsx)(e.strong,{children:"\u4f5c\u7528"}),"\uff1a"]}),"\n",(0,l.jsxs)(e.ul,{children:["\n",(0,l.jsx)(e.li,{children:"\u5728\u6570\u7ec4\u6216\u5bf9\u8c61\u4e2d\u5c55\u5f00\u5143\u7d20\u3002"}),"\n"]}),"\n",(0,l.jsxs)(e.p,{children:[(0,l.jsx)(e.strong,{children:"\u4f7f\u7528\u573a\u666f"}),"\uff1a"]}),"\n",(0,l.jsxs)(e.ul,{children:["\n",(0,l.jsx)(e.li,{children:"\u5408\u5e76\u6570\u7ec4\u6216\u5bf9\u8c61\u3002"}),"\n",(0,l.jsx)(e.li,{children:"\u590d\u5236\u6570\u7ec4\u6216\u5bf9\u8c61\u3002"}),"\n",(0,l.jsx)(e.li,{children:"\u51fd\u6570\u53c2\u6570\u6536\u96c6\u3002"}),"\n"]}),"\n",(0,l.jsx)(e.pre,{children:(0,l.jsx)(e.code,{className:"language-javascript",children:"// \u6570\u7ec4\r\nconst arr1 = [1, 2, 3];\r\nconst arr2 = [...arr1, 4, 5]; // \u5408\u5e76\u6570\u7ec4\r\n\r\n// \u5bf9\u8c61\r\nconst obj1 = { a: 1, b: 2 };\r\nconst obj2 = { ...obj1, c: 3 }; // \u5408\u5e76\u5bf9\u8c61\r\n\r\n// \u51fd\u6570\u53c2\u6570\u6536\u96c6\r\nfunction sum(...numbers) {\r\n  return numbers.reduce((total, num) => total + num, 0);\r\n}\r\nconsole.log(sum(1, 2, 3)); // 6\n"})}),"\n",(0,l.jsxs)(e.ol,{start:"2",children:["\n",(0,l.jsxs)(e.li,{children:["\u53ef\u9009\u94fe\u8fd0\u7b97\u7b26 (",(0,l.jsx)(e.code,{children:"?."}),")"]}),"\n"]}),"\n",(0,l.jsx)(e.p,{children:(0,l.jsx)(e.strong,{children:"\u4f5c\u7528\uff1a"})}),"\n",(0,l.jsxs)(e.ul,{children:["\n",(0,l.jsx)(e.li,{children:"\u5141\u8bb8\u5b89\u5168\u5730\u8bbf\u95ee\u5bf9\u8c61\u7684\u6df1\u5c42\u5c5e\u6027\uff0c\u907f\u514d\u56e0\u8bbf\u95ee\u672a\u5b9a\u4e49\u7684\u5c5e\u6027\u800c\u5bfc\u81f4\u7684\u9519\u8bef\u3002"}),"\n"]}),"\n",(0,l.jsx)(e.p,{children:(0,l.jsx)(e.strong,{children:"\u4f7f\u7528\u573a\u666f\uff1a"})}),"\n",(0,l.jsxs)(e.ul,{children:["\n",(0,l.jsx)(e.li,{children:"\u5f53\u4e0d\u786e\u5b9a\u67d0\u4e2a\u5bf9\u8c61\u7684\u67d0\u4e2a\u5c5e\u6027\u662f\u5426\u5b58\u5728\u65f6\uff0c\u53ef\u4ee5\u907f\u514d\u624b\u52a8\u68c0\u67e5\u6bcf\u4e2a\u5c42\u7ea7\u3002"}),"\n"]}),"\n",(0,l.jsx)(e.pre,{children:(0,l.jsx)(e.code,{className:"language-javascript",children:"const user = {\r\n  profile: {\r\n    name: \"Alice\",\r\n  },\r\n};\r\n\r\n// \u5b89\u5168\u8bbf\u95ee\r\nconst userName = user.profile?.name; // 'Alice'\r\nconst userAge = user.profile?.age; // undefined\n"})}),"\n",(0,l.jsxs)(e.ol,{start:"3",children:["\n",(0,l.jsxs)(e.li,{children:["\u7a7a\u503c\u5408\u5e76\u8fd0\u7b97\u7b26 (",(0,l.jsx)(e.code,{children:"??"}),")"]}),"\n"]}),"\n",(0,l.jsx)(e.p,{children:(0,l.jsx)(e.strong,{children:"\u4f5c\u7528\uff1a"})}),"\n",(0,l.jsxs)(e.ul,{children:["\n",(0,l.jsxs)(e.li,{children:["\n",(0,l.jsx)(e.p,{children:"\u8fd4\u56de\u5176\u5de6\u4fa7\u64cd\u4f5c\u6570\uff0c\u5982\u679c\u5176\u4e3a null \u6216 undefined\uff0c\u5219\u8fd4\u56de\u53f3\u4fa7\u64cd\u4f5c\u6570\u3002\r\n\u4f7f\u7528\u573a\u666f\uff1a"}),"\n"]}),"\n",(0,l.jsxs)(e.li,{children:["\n",(0,l.jsx)(e.p,{children:"\u5728\u8d4b\u503c\u65f6\u63d0\u4f9b\u9ed8\u8ba4\u503c\uff0c\u7279\u522b\u662f\u5904\u7406\u53ef\u80fd\u4e3a\u7a7a\u7684\u503c\u3002"}),"\n"]}),"\n"]}),"\n",(0,l.jsx)(e.pre,{children:(0,l.jsx)(e.code,{className:"language-javascript",children:"const value1 = null;\r\nconst value2 = 5;\r\nconst result = value1 ?? value2; // 5\r\n\r\nconst value3 = 0;\r\nconst result2 = value3 ?? 10; // 0\uff0c\u56e0\u4e3a 0 \u4e0d\u662f null \u6216 undefined\n"})}),"\n",(0,l.jsxs)(e.ol,{start:"4",children:["\n",(0,l.jsx)(e.li,{children:"\u903b\u8f91\u8d4b\u503c\u8fd0\u7b97\u7b26"}),"\n"]}),"\n",(0,l.jsx)(e.pre,{children:(0,l.jsx)(e.code,{className:"language-javascript",children:"// \u6216\u8d4b\u503c\u8fd0\u7b97\u7b26\r\nx ||= y;\r\n// \u7b49\u540c\u4e8e\r\nx || (x = y);\r\n\r\n// \u4e0e\u8d4b\u503c\u8fd0\u7b97\u7b26\r\nx &&= y;\r\n// \u7b49\u540c\u4e8e\r\nx && (x = y);\r\n\r\n// Null \u8d4b\u503c\u8fd0\u7b97\u7b26\r\nx ??= y;\r\n// \u7b49\u540c\u4e8e\r\nx ?? (x = y);\n"})}),"\n",(0,l.jsx)(e.h3,{id:"\u6a21\u677f\u5b57\u7b26\u4e32",children:"\u6a21\u677f\u5b57\u7b26\u4e32"}),"\n",(0,l.jsx)(e.p,{children:"\u6a21\u677f\u5b57\u7b26\u4e32\uff08template string\uff09\u662f\u589e\u5f3a\u7248\u7684\u5b57\u7b26\u4e32\uff0c\u7528\u53cd\u5f15\u53f7\uff08`\uff09\u6807\u8bc6\u3002"}),"\n",(0,l.jsxs)(e.p,{children:["\u6a21\u677f\u5b57\u7b26\u4e32\u4f7f\u7528\u53cd\u5f15\u53f7\uff08",(0,l.jsx)(e.code,{children:" "}),"\uff09\u5305\u88f9\uff0c\u53ef\u4ee5\u8de8\u591a\u884c\u4e66\u5199\u5b57\u7b26\u4e32\u3002"]}),"\n",(0,l.jsx)(e.p,{children:"\u5982\u679c\u5728\u6a21\u677f\u5b57\u7b26\u4e32\u4e2d\u9700\u8981\u4f7f\u7528\u53cd\u5f15\u53f7\uff0c\u5219\u524d\u9762\u8981\u7528\u53cd\u659c\u6760\u8f6c\u4e49\u3002"}),"\n",(0,l.jsxs)(e.p,{children:["\u6a21\u677f\u5b57\u7b26\u4e32\u4e2d\u5d4c\u5165\u53d8\u91cf\uff0c\u9700\u8981\u5c06\u53d8\u91cf\u540d\u5199\u5728$","\u4e4b\u4e2d\u3002\u5927\u62ec\u53f7\u5185\u90e8\u53ef\u4ee5\u653e\u5165\u4efb\u610f\u7684 JavaScript \u8868\u8fbe\u5f0f\uff0c\u53ef\u4ee5\u8fdb\u884c\u8fd0\u7b97\uff0c\u4ee5\u53ca\u5f15\u7528\u5bf9\u8c61\u5c5e\u6027\u3002"]}),"\n",(0,l.jsx)(e.p,{children:"\u6a21\u677f\u5b57\u7b26\u4e32\u4e4b\u4e2d\u8fd8\u80fd\u8c03\u7528\u51fd\u6570\u3002"}),"\n",(0,l.jsx)(e.pre,{children:(0,l.jsx)(e.code,{className:"language-js",children:'let name = "Bob",\r\n  time = "today";\r\nconsole.log(`Hello ${name}, how are you ${time}?`);\r\n\r\nfunction fn() {\r\n  return "Hello World";\r\n}\r\n\r\nconsole.log(`foo ${fn()} bar`);\n'})}),"\n",(0,l.jsx)(e.h3,{id:"\u5185\u7f6e\u5bf9\u8c61\u65b0\u589e\u4e86\u65b9\u6cd5",children:"\u5185\u7f6e\u5bf9\u8c61\u65b0\u589e\u4e86\u65b9\u6cd5"}),"\n",(0,l.jsx)(e.h4,{id:"\u5b57\u7b26\u4e32\u6269\u5c55",children:"\u5b57\u7b26\u4e32\u6269\u5c55"}),"\n",(0,l.jsx)(e.h4,{id:"\u6b63\u5219\u6269\u5c55",children:"\u6b63\u5219\u6269\u5c55"}),"\n",(0,l.jsx)(e.h4,{id:"\u6570\u503c\u6269\u5c55",children:"\u6570\u503c\u6269\u5c55"}),"\n",(0,l.jsx)(e.h4,{id:"\u51fd\u6570\u6269\u5c55",children:"\u51fd\u6570\u6269\u5c55"}),"\n",(0,l.jsx)(e.h4,{id:"\u6570\u7ec4\u6269\u5c55",children:"\u6570\u7ec4\u6269\u5c55"}),"\n",(0,l.jsx)(e.h4,{id:"\u5bf9\u8c61\u6269\u5c55",children:"\u5bf9\u8c61\u6269\u5c55"}),"\n",(0,l.jsx)(e.h3,{id:"symbol-\u548c-bigint",children:"Symbol \u548c BigInt"}),"\n",(0,l.jsx)(e.h4,{id:"symbol",children:"Symbol\uff1a"}),"\n",(0,l.jsx)(e.p,{children:"\u7528\u4e8e\u521b\u5efa\u552f\u4e00\u7684\u6807\u8bc6\u7b26\uff0c\u907f\u514d\u547d\u540d\u51b2\u7a81\uff0c\u9002\u7528\u4e8e\u5bf9\u8c61\u5c5e\u6027\u3002"}),"\n",(0,l.jsx)(e.p,{children:"Symbol \u4f7f\u7528\u573a\u666f\r\n\u5bf9\u8c61\u5c5e\u6027\uff1a\u53ef\u4ee5\u4f7f\u7528 Symbol \u4f5c\u4e3a\u5bf9\u8c61\u7684\u5c5e\u6027\u952e\uff0c\u4ee5\u907f\u514d\u5c5e\u6027\u51b2\u7a81\u3002"}),"\n",(0,l.jsx)(e.pre,{children:(0,l.jsx)(e.code,{className:"language-js",children:'const uniqueKey = Symbol("key");\r\nconst obj = {\r\n  [uniqueKey]: "value",\r\n};\r\n\r\nconsole.log(obj[uniqueKey]); // \'value\'\n'})}),"\n",(0,l.jsx)(e.p,{children:"Symbol \u8fd8\u53ef\u4ee5\u7528\u4e8e\u5b9a\u4e49\u81ea\u5b9a\u4e49\u7684\u8fed\u4ee3\u5668\uff0c\u4f8b\u5982\u5b9e\u73b0 Symbol.iterator \u65b9\u6cd5\u3002"}),"\n",(0,l.jsx)(e.pre,{children:(0,l.jsx)(e.code,{className:"language-js",children:"const myIterable = {\r\n  [Symbol.iterator]() {\r\n    let step = 0;\r\n    return {\r\n      next() {\r\n        step++;\r\n        return step <= 3 ? { value: step, done: false } : { done: true };\r\n      },\r\n    };\r\n  },\r\n};\r\n\r\nfor (const value of myIterable) {\r\n  console.log(value); // 1, 2, 3\r\n}\n"})}),"\n",(0,l.jsx)(e.h4,{id:"bigint",children:"BigInt\uff1a"}),"\n",(0,l.jsx)(e.p,{children:"\u7528\u4e8e\u8868\u793a\u4efb\u610f\u7cbe\u5ea6\u7684\u6574\u6570\uff0c\u9002\u7528\u4e8e\u5927\u6570\u8ba1\u7b97\uff0c\u7279\u522b\u662f\u5728\u9700\u8981\u8d85\u51fa\u5b89\u5168\u6574\u6570\u8303\u56f4\u65f6\u3002"}),"\n",(0,l.jsx)(e.pre,{children:(0,l.jsx)(e.code,{className:"language-js",children:"const bigInt1 = BigInt(123456789012345678901234567890);\r\nconst bigInt2 = 123456789012345678901234567890n;\r\n\r\nconsole.log(bigInt1); // 123456789012345678901234567890n\r\nconsole.log(bigInt1 === bigInt2); // true\n"})}),"\n",(0,l.jsx)(e.p,{children:"\u6ce8\u610f\u4e8b\u9879\r\nBigInt \u4e0d\u80fd\u4e0e Number \u76f4\u63a5\u8fdb\u884c\u8fd0\u7b97\uff0c\u5fc5\u987b\u8fdb\u884c\u7c7b\u578b\u8f6c\u6362\u3002"}),"\n",(0,l.jsx)(e.pre,{children:(0,l.jsx)(e.code,{className:"language-js",children:"const num = 5;\r\nconst bigNum = 10n;\r\n\r\n// \u4e0b\u9762\u7684\u4ee3\u7801\u4f1a\u629b\u51fa\u9519\u8bef\r\n// console.log(num + bigNum);\r\n\r\n// \u6b63\u786e\u65b9\u5f0f\r\nconsole.log(num + Number(bigNum)); // 15\n"})}),"\n",(0,l.jsx)(e.h3,{id:"map-set-\u6570\u636e\u7ed3\u6784",children:"Map Set \u6570\u636e\u7ed3\u6784"}),"\n",(0,l.jsx)(e.h4,{id:"map-\u6570\u636e\u7ed3\u6784",children:"Map \u6570\u636e\u7ed3\u6784"}),"\n",(0,l.jsx)(e.p,{children:"Map \u5bf9\u8c61\u4fdd\u5b58\u952e\u503c\u5bf9\uff0c\u5e76\u4e14\u80fd\u591f\u8bb0\u4f4f\u952e\u7684\u539f\u59cb\u63d2\u5165\u987a\u5e8f\u3002\u4efb\u4f55\u503c\uff08\u5bf9\u8c61\u6216\u8005\u57fa\u672c\u7c7b\u578b\uff09\u90fd\u53ef\u4ee5\u4f5c\u4e3a\u4e00\u4e2a\u952e\u6216\u4e00\u4e2a\u503c\u3002"}),"\n",(0,l.jsx)(e.h4,{id:"set-\u6570\u636e\u7ed3\u6784",children:"Set \u6570\u636e\u7ed3\u6784"}),"\n",(0,l.jsx)(e.p,{children:"Set \u5bf9\u8c61\u5141\u8bb8\u4f60\u5b58\u50a8\u4efb\u4f55\u7c7b\u578b\u7684\u552f\u4e00\u503c\uff0c\u65e0\u8bba\u662f\u539f\u59cb\u503c\u6216\u8005\u662f\u5bf9\u8c61\u5f15\u7528\u3002"}),"\n",(0,l.jsx)(e.h3,{id:"proxy-reflect",children:"Proxy Reflect"}),"\n",(0,l.jsx)(e.p,{children:"Proxy(\u4ee3\u7406) \u662f ES6 \u4e2d\u65b0\u589e\u7684\u4e00\u4e2a\u7279\u6027\u3002Proxy \u8ba9\u6211\u4eec\u80fd\u591f\u4ee5\u7b80\u6d01\u6613\u61c2\u7684\u65b9\u5f0f\u63a7\u5236\u5916\u90e8\u5bf9\u5bf9\u8c61\u7684\u8bbf\u95ee\u3002\u5176\u529f\u80fd\u975e\u5e38\u7c7b\u4f3c\u4e8e\u8bbe\u8ba1\u6a21\u5f0f\u4e2d\u7684\u4ee3\u7406\u6a21\u5f0f\u3002\r\nReflect \u662f\u4e00\u4e2a\u5185\u7f6e\u7684\u5bf9\u8c61\uff0c\u5b83\u63d0\u4f9b\u62e6\u622a JavaScript \u64cd\u4f5c\u7684\u65b9\u6cd5\u3002\u8fd9\u4e9b\u65b9\u6cd5\u4e0e proxy handler \u7684\u65b9\u6cd5\u76f8\u540c\u3002Reflect \u4e0d\u662f\u4e00\u4e2a\u51fd\u6570\u5bf9\u8c61\uff0c\u56e0\u6b64\u5b83\u662f\u4e0d\u53ef\u6784\u9020\u7684\u3002"}),"\n",(0,l.jsx)(e.p,{children:"\u4e0e\u5927\u591a\u6570\u5168\u5c40\u5bf9\u8c61\u4e0d\u540c Reflect \u5e76\u975e\u4e00\u4e2a\u6784\u9020\u51fd\u6570\uff0c\u6240\u4ee5\u4e0d\u80fd\u901a\u8fc7 new \u8fd0\u7b97\u7b26\u5bf9\u5176\u8fdb\u884c\u8c03\u7528\uff0c\u6216\u8005\u5c06 Reflect \u5bf9\u8c61\u4f5c\u4e3a\u4e00\u4e2a\u51fd\u6570\u6765\u8c03\u7528\u3002Reflect \u7684\u6240\u6709\u5c5e\u6027\u548c\u65b9\u6cd5\u90fd\u662f\u9759\u6001\u7684\uff08\u5c31\u50cf Math \u5bf9\u8c61\uff09\u3002"}),"\n",(0,l.jsx)(e.h3,{id:"\u7bad\u5934\u51fd\u6570",children:"\u7bad\u5934\u51fd\u6570"}),"\n",(0,l.jsx)(e.p,{children:"\u7bad\u5934\u51fd\u6570\u7684 this \u6307\u5411\u58f0\u660e\u65f6\u6240\u5728\u4f5c\u7528\u57df\u4e0b\u7684 this \u503c\u3002"}),"\n",(0,l.jsx)(e.h4,{id:"\u7bad\u5934\u51fd\u6570\u548c\u666e\u901a\u51fd\u6570\u7684\u533a\u522b",children:"\u7bad\u5934\u51fd\u6570\u548c\u666e\u901a\u51fd\u6570\u7684\u533a\u522b"}),"\n",(0,l.jsxs)(e.p,{children:["\u8bed\u6cd5\uff1a \u7bad\u5934\u51fd\u6570\u4f7f\u7528 ()=>"," \uff0c\u666e\u901a\u51fd\u6570\u4f7f\u7528 function \u5173\u952e\u5b57\u6765\u5b9a\u4e49\u51fd\u6570\u3002"]}),"\n",(0,l.jsx)(e.p,{children:"\u7bad\u5934\u51fd\u6570\u6ca1\u6709\u81ea\u5df1\u7684 this\uff0c\u5b83\u4f1a\u7ee7\u627f\u5176\u6240\u5728\u4f5c\u7528\u57df\u7684 this \u503c\u3002\u800c\u666e\u901a\u51fd\u6570\u7684 this \u5219\u7531\u51fd\u6570\u8c03\u7528\u65f6\u7684\u4e0a\u4e0b\u6587\u51b3\u5b9a\uff0c\u53ef\u4ee5\u901a\u8fc7 call\u3001apply\u3001bind \u65b9\u6cd5\u6765\u6539\u53d8\u3002"}),"\n",(0,l.jsx)(e.p,{children:"\u7bad\u5934\u51fd\u6570\u6ca1\u6709\u81ea\u5df1\u7684 arguments \u5bf9\u8c61\uff0c\u5b83\u53ef\u4ee5\u901a\u8fc7 rest \u53c2\u6570\u8bed\u6cd5\u6765\u63a5\u6536\u4e0d\u5b9a\u6570\u91cf\u7684\u53c2\u6570\u3002\u800c\u666e\u901a\u51fd\u6570\u5219\u6709\u81ea\u5df1\u7684 arguments \u5bf9\u8c61\uff0c\u5b83\u53ef\u4ee5\u63a5\u6536\u4efb\u610f\u6570\u91cf\u7684\u53c2\u6570\u3002"}),"\n",(0,l.jsx)(e.p,{children:"\u7bad\u5934\u51fd\u6570\u4e0d\u80fd\u4f5c\u4e3a\u6784\u9020\u51fd\u6570\u4f7f\u7528\uff0c\u4e0d\u80fd\u4f7f\u7528 new \u6765\u5b9e\u4f8b\u5316\uff0c\u56e0\u4e3a\u5b83\u6ca1\u6709\u81ea\u5df1\u7684 this\uff0c\u800c\u666e\u901a\u51fd\u6570\u53ef\u4ee5\u7528 new \u6765\u521b\u5efa\u65b0\u7684\u5bf9\u8c61\u3002"}),"\n",(0,l.jsx)(e.p,{children:"\u7bad\u5934\u51fd\u6570\u4e0d\u80fd\u4f7f\u7528 yield \u5173\u952e\u5b57\u6765\u5b9a\u4e49\u751f\u6210\u5668\u51fd\u6570\uff0c\u800c\u666e\u901a\u51fd\u6570\u53ef\u4ee5\u3002"}),"\n",(0,l.jsx)(e.p,{children:"\u7bad\u5934\u51fd\u6570\u4e0d\u652f\u6301 call()/apply()\u51fd\u6570\u7279\u6027"}),"\n",(0,l.jsx)(e.p,{children:"\u7bad\u5934\u51fd\u6570\u6ca1\u6709 prototype \u5c5e\u6027"}),"\n",(0,l.jsx)(e.p,{children:"\u539f\u578b\u51fd\u6570\u4e0d\u80fd\u5b9a\u4e49\u6210\u7bad\u5934\u51fd\u6570"}),"\n",(0,l.jsx)(e.h3,{id:"generator",children:"generator"}),"\n",(0,l.jsx)(e.p,{children:"\u751f\u6210\u5668\u662f\u4e00\u79cd\u7279\u6b8a\u7684\u51fd\u6570\uff0c\u53ef\u4ee5\u6682\u505c\u6267\u884c\u5e76\u5728\u540e\u7eed\u65f6\u95f4\u7ee7\u7eed\u6267\u884c\u3002\u751f\u6210\u5668\u5728\u8c03\u7528\u65f6\u4e0d\u4f1a\u7acb\u5373\u6267\u884c\uff0c\u800c\u662f\u8fd4\u56de\u4e00\u4e2a\u8fed\u4ee3\u5668\u5bf9\u8c61\uff0c\u53ef\u4ee5\u901a\u8fc7\u8be5\u5bf9\u8c61\u9010\u6b65\u6267\u884c\u751f\u6210\u5668\u4e2d\u7684\u4ee3\u7801\u3002"}),"\n",(0,l.jsxs)(e.p,{children:["\u751f\u6210\u5668\u4f7f\u7528 ",(0,l.jsx)(e.code,{children:"function*"})," \u8bed\u6cd5\u5b9a\u4e49\uff0c\u5185\u90e8\u53ef\u4ee5\u4f7f\u7528 ",(0,l.jsx)(e.code,{children:"yield"})," \u5173\u952e\u5b57\u6765\u6682\u505c\u6267\u884c\u5e76\u8fd4\u56de\u503c\u3002"]}),"\n",(0,l.jsx)(e.pre,{children:(0,l.jsx)(e.code,{className:"language-javascript",children:"function* myGenerator() {\r\n  yield 1;\r\n  yield 2;\r\n  yield 3;\r\n}\r\n\r\nconst gen = myGenerator();\r\n\r\nconsole.log(gen.next()); // { value: 1, done: false }\r\nconsole.log(gen.next()); // { value: 2, done: false }\r\nconsole.log(gen.next()); // { value: 3, done: false }\r\nconsole.log(gen.next()); // { value: undefined, done: true }\n"})}),"\n",(0,l.jsx)(e.p,{children:(0,l.jsx)(e.strong,{children:"\u751f\u6210\u5668\u7684\u7279\u70b9"})}),"\n",(0,l.jsx)(e.p,{children:"\u53ef\u6682\u505c\u6267\u884c\uff1a\u751f\u6210\u5668\u53ef\u4ee5\u5728\u6267\u884c\u8fc7\u7a0b\u4e2d\u6682\u505c\u548c\u6062\u590d\u3002"}),"\n",(0,l.jsx)(e.p,{children:"\u8fed\u4ee3\u5668\u534f\u8bae\uff1a\u751f\u6210\u5668\u81ea\u52a8\u5b9e\u73b0\u4e86\u8fed\u4ee3\u5668\u63a5\u53e3\uff0c\u53ef\u4ee5\u4e0e for...of \u5faa\u73af\u4e00\u8d77\u4f7f\u7528\u3002"}),"\n",(0,l.jsx)(e.p,{children:(0,l.jsx)(e.strong,{children:"\u751f\u6210\u5668\u7684\u5e94\u7528\u573a\u666f"})}),"\n",(0,l.jsx)(e.p,{children:"\u5f02\u6b65\u7f16\u7a0b\uff1a\u751f\u6210\u5668\u53ef\u4ee5\u4e0e Promise \u7ed3\u5408\u4f7f\u7528\uff0c\u7b80\u5316\u5f02\u6b65\u4ee3\u7801\u7684\u5199\u6cd5\u3002"}),"\n",(0,l.jsx)(e.p,{children:"\u72b6\u6001\u673a\uff1a\u751f\u6210\u5668\u53ef\u4ee5\u7528\u6765\u6784\u5efa\u72b6\u6001\u673a\uff0c\u901a\u8fc7 yield \u6682\u505c\u548c\u6062\u590d\u72b6\u6001\u3002"}),"\n",(0,l.jsx)(e.p,{children:"\u751f\u6210\u5668\u662f JavaScript \u4e2d\u4e00\u4e2a\u5f3a\u5927\u7684\u7279\u6027\uff0c\u63d0\u4f9b\u4e86\u4e00\u79cd\u4f18\u96c5\u7684\u65b9\u5f0f\u6765\u5904\u7406\u8fed\u4ee3\u548c\u5f02\u6b65\u7f16\u7a0b\u3002\u5b83\u4eec\u901a\u8fc7\u6682\u505c\u548c\u6062\u590d\u6267\u884c\uff0c\u4f7f\u5f97\u4ee3\u7801\u66f4\u52a0\u7075\u6d3b\u548c\u53ef\u8bfb\u3002"}),"\n",(0,l.jsx)(e.h3,{id:"promise",children:"promise"}),"\n",(0,l.jsx)(e.h3,{id:""}),"\n",(0,l.jsx)(e.h3,{id:"async-await",children:"async await"}),"\n",(0,l.jsx)(e.h3,{id:"-1"}),"\n",(0,l.jsx)(e.h3,{id:"class",children:"class"}),"\n",(0,l.jsx)(e.p,{children:"ES6 \u7684 class \u53ef\u4ee5\u770b\u4f5c\u53ea\u662f\u4e00\u4e2a\u8bed\u6cd5\u7cd6\uff0c\u5b83\u7684\u7edd\u5927\u90e8\u5206\u529f\u80fd\uff0cES5 \u90fd\u53ef\u4ee5\u505a\u5230\uff0c\u65b0\u7684 class \u5199\u6cd5\u53ea\u662f\u8ba9\u5bf9\u8c61\u539f\u578b\u7684\u5199\u6cd5\u66f4\u52a0\u6e05\u6670\u3001\u66f4\u50cf\u9762\u5411\u5bf9\u8c61\u7f16\u7a0b\u7684\u8bed\u6cd5\u800c\u5df2\u3002"}),"\n",(0,l.jsx)(e.pre,{children:(0,l.jsx)(e.code,{className:"language-js",children:'function Point(x, y) {\r\n  this.x = x;\r\n  this.y = y;\r\n}\r\n\r\nPoint.prototype.toString = function () {\r\n  return "(" + this.x + ", " + this.y + ")";\r\n};\r\n\r\nvar p = new Point(1, 2);\r\n\r\n// es6 \u5199\u6cd5\r\nclass Point {\r\n  constructor(x, y) {\r\n    this.x = x;\r\n    this.y = y;\r\n  }\r\n\r\n  toString() {\r\n    return "(" + this.x + ", " + this.y + ")";\r\n  }\r\n}\n'})}),"\n",(0,l.jsx)(e.h4,{id:"\u7ee7\u627f",children:"\u7ee7\u627f"}),"\n",(0,l.jsx)(e.pre,{children:(0,l.jsx)(e.code,{className:"language-js",children:'class Point {\r\n  /* ... */\r\n}\r\n\r\nclass ColorPoint extends Point {\r\n  constructor(x, y, color) {\r\n    super(x, y); // \u8c03\u7528\u7236\u7c7b\u7684constructor(x, y)\r\n    this.color = color;\r\n  }\r\n\r\n  toString() {\r\n    return this.color + " " + super.toString(); // \u8c03\u7528\u7236\u7c7b\u7684toString()\r\n  }\r\n}\n'})}),"\n",(0,l.jsx)(e.h3,{id:"esmodules",children:"ESModules"}),"\n",(0,l.jsx)(e.p,{children:"ES Modules\uff08ECMAScript \u6a21\u5757\uff09\u662f JavaScript \u7684\u6a21\u5757\u5316\u673a\u5236\uff0c\u5141\u8bb8\u5c06\u4ee3\u7801\u5206\u5272\u6210\u5c0f\u7684\u3001\u53ef\u91cd\u7528\u7684\u6a21\u5757\u3002\u5b83\u63d0\u4f9b\u4e86\u4e00\u79cd\u6807\u51c6\u5316\u7684\u65b9\u6cd5\u6765\u5bfc\u5165\u548c\u5bfc\u51fa\u4ee3\u7801\uff0c\u4ece\u800c\u5b9e\u73b0\u6a21\u5757\u4e4b\u95f4\u7684\u4f9d\u8d56\u7ba1\u7406\u3002"}),"\n",(0,l.jsx)(e.h4,{id:"\u5bfc\u51faexport",children:"\u5bfc\u51fa\uff08Export\uff09"}),"\n",(0,l.jsxs)(e.p,{children:["\u4f7f\u7528 ",(0,l.jsx)(e.code,{children:"export"})," \u5173\u952e\u5b57\u6765\u5bfc\u51fa\u6a21\u5757\u4e2d\u7684\u53d8\u91cf\u3001\u51fd\u6570\u6216\u7c7b\u3002"]}),"\n",(0,l.jsx)(e.pre,{children:(0,l.jsx)(e.code,{className:"language-javascript",children:'// module.js\r\nexport const name = "Alice";\r\nexport function greet() {\r\n  console.log("Hello, " + name);\r\n}\n'})}),"\n",(0,l.jsx)(e.h4,{id:"\u5bfc\u5165import",children:"\u5bfc\u5165\uff08Import\uff09"}),"\n",(0,l.jsx)(e.p,{children:"\u4f7f\u7528 import \u5173\u952e\u5b57\u6765\u5bfc\u5165\u5176\u4ed6\u6a21\u5757\u7684\u5bfc\u51fa\u3002"}),"\n",(0,l.jsx)(e.pre,{children:(0,l.jsx)(e.code,{className:"language-javascript",children:"// main.js\r\nimport { name, greet } from \"./module.js\";\r\n\r\nconsole.log(name); // 'Alice'\r\ngreet(); // 'Hello, Alice'\n"})}),"\n",(0,l.jsx)(e.h4,{id:"\u9ed8\u8ba4\u5bfc\u51fa",children:"\u9ed8\u8ba4\u5bfc\u51fa"}),"\n",(0,l.jsx)(e.p,{children:"\u6a21\u5757\u53ef\u4ee5\u6709\u4e00\u4e2a\u9ed8\u8ba4\u5bfc\u51fa\uff0c\u4f7f\u7528 export default \u8bed\u6cd5\u3002"}),"\n",(0,l.jsx)(e.pre,{children:(0,l.jsx)(e.code,{className:"language-javascript",children:'// module.js\r\nconst defaultFunction = () => {\r\n  console.log("This is the default function");\r\n};\r\nexport default defaultFunction;\n'})}),"\n",(0,l.jsx)(e.pre,{children:(0,l.jsx)(e.code,{className:"language-javascript",children:"// main.js\r\nimport defaultFunc from \"./module.js\";\r\ndefaultFunc(); // 'This is the default function'\n"})}),"\n",(0,l.jsx)(e.h4,{id:"\u6a21\u5757\u7684\u7279\u70b9",children:"\u6a21\u5757\u7684\u7279\u70b9"}),"\n",(0,l.jsx)(e.p,{children:"\u9759\u6001\u5206\u6790\uff1aES Modules \u5728\u7f16\u8bd1\u65f6\u89e3\u6790\uff0c\u652f\u6301\u66f4\u597d\u7684\u4f18\u5316\u548c\u9519\u8bef\u68c0\u6d4b\u3002"}),"\n",(0,l.jsx)(e.p,{children:"\u4f5c\u7528\u57df\uff1a\u6bcf\u4e2a\u6a21\u5757\u90fd\u6709\u81ea\u5df1\u7684\u4f5c\u7528\u57df\uff0c\u907f\u514d\u5168\u5c40\u547d\u540d\u51b2\u7a81\u3002"}),"\n",(0,l.jsx)(e.p,{children:"\u5f02\u6b65\u52a0\u8f7d\uff1a\u652f\u6301\u5f02\u6b65\u52a0\u8f7d\u6a21\u5757\uff0c\u6709\u52a9\u4e8e\u6027\u80fd\u4f18\u5316\u3002"}),"\n",(0,l.jsx)(e.h4,{id:"\u4f7f\u7528\u573a\u666f",children:"\u4f7f\u7528\u573a\u666f"}),"\n",(0,l.jsx)(e.p,{children:"\u4ee3\u7801\u5206\u79bb\uff1a\u5c06\u529f\u80fd\u6a21\u5757\u5316\uff0c\u63d0\u5347\u4ee3\u7801\u7684\u53ef\u7ef4\u62a4\u6027\u3002"}),"\n",(0,l.jsx)(e.p,{children:"\u5e93\u7684\u5f00\u53d1\uff1a\u5728\u5f00\u53d1\u5171\u4eab\u5e93\u65f6\uff0c\u53ef\u4ee5\u901a\u8fc7 ES Modules \u5bfc\u51fa\u63a5\u53e3\u3002"}),"\n",(0,l.jsx)(e.p,{children:"ES Modules \u63d0\u4f9b\u4e86\u4e00\u79cd\u6e05\u6670\u3001\u7b80\u6d01\u7684\u65b9\u5f0f\u6765\u7ec4\u7ec7 JavaScript \u4ee3\u7801\uff0c\u4f7f\u5f97\u6a21\u5757\u7684\u521b\u5efa\u548c\u4f7f\u7528\u66f4\u52a0\u76f4\u89c2\u3002\u5b83\u5728\u73b0\u4ee3 JavaScript \u5f00\u53d1\u4e2d\u88ab\u5e7f\u6cdb\u4f7f\u7528\uff0c\u652f\u6301\u66f4\u597d\u7684\u4ee3\u7801\u7ba1\u7406\u548c\u4f18\u5316\u3002"}),"\n",(0,l.jsx)(e.h3,{id:"ecmascript-\u89c4\u8303\u53d1\u5e03\u6d41\u7a0b\u5982\u4e0b",children:"ECMAScript \u89c4\u8303\u53d1\u5e03\u6d41\u7a0b\u5982\u4e0b\uff1a"}),"\n",(0,l.jsx)(e.p,{children:"ECMAScript \u89c4\u8303\u662f\u7531 ECMA \u56fd\u9645\uff08ECMA International\uff09\u7ef4\u62a4\u7684 JavaScript \u6807\u51c6\u3002\u5176\u53d1\u5e03\u6d41\u7a0b\u6d89\u53ca\u591a\u4e2a\u6b65\u9aa4\uff0c\u4ee5\u786e\u4fdd\u89c4\u8303\u7684\u8d28\u91cf\u548c\u7a33\u5b9a\u6027\u3002"}),"\n",(0,l.jsxs)(e.ol,{children:["\n",(0,l.jsxs)(e.li,{children:["\n",(0,l.jsx)(e.p,{children:"\u63d0\u6848\u9636\u6bb5\uff1a\u4efb\u4f55\u4eba\u53ef\u4ee5\u63d0\u51fa\u65b0\u7279\u6027\uff0c\u5206\u4e3a\u4e94\u4e2a\u9636\u6bb5\uff1aStage 0\uff08\u8349\u6848\uff09\u3001Stage 1\uff08\u521d\u6b65\uff09\u3001Stage 2\uff08\u5b9e\u73b0\uff09\u3001Stage 3\uff08\u89c4\u8303\uff09\u3001Stage 4\uff08\u5b8c\u6210\uff09\u3002"}),"\n"]}),"\n",(0,l.jsxs)(e.li,{children:["\n",(0,l.jsx)(e.p,{children:"\u6280\u672f\u59d4\u5458\u4f1a\uff08TC39\uff09\uff1a\u7531\u4e13\u5bb6\u548c\u5f00\u53d1\u8005\u7ec4\u6210\uff0c\u5b9a\u671f\u4f1a\u8bae\u8bc4\u4f30\u63d0\u6848\uff0c\u51b3\u5b9a\u662f\u5426\u63a8\u8fdb\u3002"}),"\n"]}),"\n",(0,l.jsxs)(e.li,{children:["\n",(0,l.jsx)(e.p,{children:"\u89c4\u8303\u6587\u6863\uff1a\u63d0\u6848\u8fdb\u5165 Stage 3 \u540e\u8fdb\u884c\u7f16\u8f91\u548c\u5ba1\u6838\uff0c\u53d1\u5e03\u8349\u6848\u4f9b\u516c\u4f17\u53cd\u9988\u3002"}),"\n"]}),"\n",(0,l.jsxs)(e.li,{children:["\n",(0,l.jsx)(e.p,{children:"\u6b63\u5f0f\u53d1\u5e03\uff1a\u7ecf\u8fc7\u5ba1\u67e5\u540e\u7eb3\u5165\u4e0b\u4e00\u4e2a ECMAScript \u7248\u672c\uff0c\u6807\u8bb0\u7248\u672c\u53f7\uff08\u5982 ES6, ES2015\uff09\u3002"}),"\n"]}),"\n",(0,l.jsxs)(e.li,{children:["\n",(0,l.jsx)(e.p,{children:"\u53cd\u9988\u4e0e\u6539\u8fdb\uff1a\u65b0\u7248\u672c\u53d1\u5e03\u540e\u6536\u96c6\u793e\u533a\u53cd\u9988\uff0c\u6301\u7eed\u6539\u8fdb\u89c4\u8303\u548c\u7279\u6027\u3002"}),"\n"]}),"\n"]}),"\n",(0,l.jsx)(e.p,{children:"ECMAScript \u89c4\u8303\u53d1\u5e03\u6d41\u7a0b\u901a\u8fc7\u591a\u4e2a\u9636\u6bb5\u548c\u6280\u672f\u59d4\u5458\u4f1a\u7684\u5ba1\u67e5\uff0c\u786e\u4fdd\u65b0\u7279\u6027\u5728\u8d28\u91cf\u548c\u5b9e\u7528\u6027\u4e0a\u7684\u7a33\u5b9a\u3002\u8fd9\u4e2a\u8fc7\u7a0b\u5f3a\u8c03\u793e\u533a\u53c2\u4e0e\u548c\u6301\u7eed\u6539\u8fdb\uff0c\u4ee5\u9002\u5e94\u4e0d\u65ad\u53d8\u5316\u7684\u5f00\u53d1\u9700\u6c42\u3002"})]})}function h(n={}){const{wrapper:e}={...(0,s.R)(),...n.components};return e?(0,l.jsx)(e,{...n,children:(0,l.jsx)(o,{...n})}):o(n)}},8453:(n,e,r)=>{r.d(e,{R:()=>c,x:()=>d});var l=r(6540);const s={},i=l.createContext(s);function c(n){const e=l.useContext(i);return l.useMemo((function(){return"function"==typeof n?n(e):{...e,...n}}),[e,n])}function d(n){let e;return e=n.disableParentContext?"function"==typeof n.components?n.components(s):n.components||s:c(n.components),l.createElement(i.Provider,{value:e},n.children)}}}]);