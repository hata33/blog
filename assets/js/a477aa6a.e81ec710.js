"use strict";(self.webpackChunkblog=self.webpackChunkblog||[]).push([[1471],{9387:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>i,contentTitle:()=>l,default:()=>h,frontMatter:()=>d,metadata:()=>c,toc:()=>o});const c=JSON.parse('{"id":"Vue/\u5bf9\u6bd4React","title":"Vue vs React \u5bf9\u6bd4","description":"1. \u6838\u5fc3\u601d\u60f3","source":"@site/docs/90-Vue/97-\u5bf9\u6bd4React.md","sourceDirName":"90-Vue","slug":"/Vue/\u5bf9\u6bd4React","permalink":"/blog/docs/Vue/\u5bf9\u6bd4React","draft":false,"unlisted":false,"tags":[],"version":"current","sidebarPosition":97,"frontMatter":{},"sidebar":"defaultSidebar","previous":{"title":"Vue \u72b6\u6001\u7ba1\u7406","permalink":"/blog/docs/Vue/\u72b6\u6001\u7ba1\u7406"},"next":{"title":"\u524d\u7aef\u5b89\u5168","permalink":"/blog/docs/\u524d\u7aef\u5b89\u5168"}}');var r=t(4848),s=t(8453);const d={},l="Vue vs React \u5bf9\u6bd4",i={},o=[{value:"1. \u6838\u5fc3\u601d\u60f3",id:"1-\u6838\u5fc3\u601d\u60f3",level:2},{value:"Vue",id:"vue",level:3},{value:"React",id:"react",level:3},{value:"2. \u72b6\u6001\u7ba1\u7406",id:"2-\u72b6\u6001\u7ba1\u7406",level:2},{value:"Vue",id:"vue-1",level:3},{value:"React",id:"react-1",level:3},{value:"3. \u751f\u547d\u5468\u671f\u5bf9\u6bd4",id:"3-\u751f\u547d\u5468\u671f\u5bf9\u6bd4",level:2}];function a(e){const n={code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,s.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.header,{children:(0,r.jsx)(n.h1,{id:"vue-vs-react-\u5bf9\u6bd4",children:"Vue vs React \u5bf9\u6bd4"})}),"\n",(0,r.jsx)(n.h2,{id:"1-\u6838\u5fc3\u601d\u60f3",children:"1. \u6838\u5fc3\u601d\u60f3"}),"\n",(0,r.jsx)(n.h3,{id:"vue",children:"Vue"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"\u6e10\u8fdb\u5f0f\u6846\u67b6"}),"\n",(0,r.jsx)(n.li,{children:"\u6a21\u677f\u8bed\u6cd5"}),"\n",(0,r.jsx)(n.li,{children:"\u54cd\u5e94\u5f0f\u7cfb\u7edf"}),"\n",(0,r.jsx)(n.li,{children:"\u53cc\u5411\u7ed1\u5b9a"}),"\n"]}),"\n",(0,r.jsx)(n.h3,{id:"react",children:"React"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:"UI = f(state)"}),"\n",(0,r.jsx)(n.li,{children:"JSX"}),"\n",(0,r.jsx)(n.li,{children:"\u5355\u5411\u6570\u636e\u6d41"}),"\n",(0,r.jsx)(n.li,{children:"\u865a\u62dfDOM"}),"\n"]}),"\n",(0,r.jsx)(n.h2,{id:"2-\u72b6\u6001\u7ba1\u7406",children:"2. \u72b6\u6001\u7ba1\u7406"}),"\n",(0,r.jsx)(n.h3,{id:"vue-1",children:"Vue"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-js",children:"// Pinia\nconst store = defineStore('counter', {\n  state: () => ({ count: 0 }),\n  actions: {\n    increment() {\n      this.count++\n    }\n  }\n})\n"})}),"\n",(0,r.jsx)(n.h3,{id:"react-1",children:"React"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-js",children:"// Redux\nconst counterSlice = createSlice({\n  name: 'counter',\n  initialState: { count: 0 },\n  reducers: {\n    increment: state => {\n      state.count += 1\n    }\n  }\n})\n"})}),"\n",(0,r.jsx)(n.h2,{id:"3-\u751f\u547d\u5468\u671f\u5bf9\u6bd4",children:"3. \u751f\u547d\u5468\u671f\u5bf9\u6bd4"}),"\n",(0,r.jsxs)(n.table,{children:[(0,r.jsx)(n.thead,{children:(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.th,{children:"Vue3"}),(0,r.jsx)(n.th,{children:"React"})]})}),(0,r.jsxs)(n.tbody,{children:[(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"setup()"}),(0,r.jsx)(n.td,{children:"constructor"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"onBeforeMount"}),(0,r.jsx)(n.td,{children:"componentWillMount"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"onMounted"}),(0,r.jsx)(n.td,{children:"componentDidMount"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"onBeforeUpdate"}),(0,r.jsx)(n.td,{children:"componentWillUpdate"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"onUpdated"}),(0,r.jsx)(n.td,{children:"componentDidUpdate"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"onBeforeUnmount"}),(0,r.jsx)(n.td,{children:"componentWillUnmount"})]}),(0,r.jsxs)(n.tr,{children:[(0,r.jsx)(n.td,{children:"onUnmounted"}),(0,r.jsx)(n.td,{children:"componentDidUnmount"})]})]})]})]})}function h(e={}){const{wrapper:n}={...(0,s.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(a,{...e})}):a(e)}},8453:(e,n,t)=>{t.d(n,{R:()=>d,x:()=>l});var c=t(6540);const r={},s=c.createContext(r);function d(e){const n=c.useContext(s);return c.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:d(e.components),c.createElement(s.Provider,{value:n},e.children)}}}]);