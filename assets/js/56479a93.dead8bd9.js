"use strict";(self.webpackChunkblog=self.webpackChunkblog||[]).push([[1979],{3467:(n,e,t)=>{t.r(e),t.d(e,{assets:()=>r,contentTitle:()=>o,default:()=>u,frontMatter:()=>l,metadata:()=>s,toc:()=>d});const s=JSON.parse('{"id":"react/hooks","title":"React Hooks \u8be6\u89e3","description":"\u4e3a\u4ec0\u4e48\u9700\u8981 Hooks","source":"@site/docs/80-react/82-hooks.md","sourceDirName":"80-react","slug":"/react/hooks","permalink":"/blog/docs/react/hooks","draft":false,"unlisted":false,"tags":[],"version":"current","sidebarPosition":82,"frontMatter":{},"sidebar":"defaultSidebar","previous":{"title":"React JSX \u5230\u771f\u5b9e DOM \u7684\u6e32\u67d3\u8fc7\u7a0b","permalink":"/blog/docs/react/jsx-to-html"},"next":{"title":"React \u51fd\u6570\u7ec4\u4ef6\u6027\u80fd\u4f18\u5316","permalink":"/blog/docs/react/\u6027\u80fd\u4f18\u5316"}}');var i=t(4848),c=t(8453);const l={},o="React Hooks \u8be6\u89e3",r={},d=[{value:"\u4e3a\u4ec0\u4e48\u9700\u8981 Hooks",id:"\u4e3a\u4ec0\u4e48\u9700\u8981-hooks",level:2},{value:"\u57fa\u7840 Hooks",id:"\u57fa\u7840-hooks",level:2},{value:"useState",id:"usestate",level:3},{value:"useState \u7684\u8fdb\u9636\u7528\u6cd5",id:"usestate-\u7684\u8fdb\u9636\u7528\u6cd5",level:4},{value:"useEffect",id:"useeffect",level:3},{value:"useEffect \u7684\u4f9d\u8d56\u9879",id:"useeffect-\u7684\u4f9d\u8d56\u9879",level:4},{value:"useContext",id:"usecontext",level:3},{value:"\u989d\u5916\u7684 Hooks",id:"\u989d\u5916\u7684-hooks",level:2},{value:"useReducer",id:"usereducer",level:3},{value:"useCallback",id:"usecallback",level:3},{value:"useMemo",id:"usememo",level:3},{value:"useRef",id:"useref",level:3},{value:"\u81ea\u5b9a\u4e49 Hooks",id:"\u81ea\u5b9a\u4e49-hooks",level:2},{value:"Hooks \u4f7f\u7528\u89c4\u5219",id:"hooks-\u4f7f\u7528\u89c4\u5219",level:2},{value:"\u5e38\u89c1\u95ee\u9898\u548c\u89e3\u51b3\u65b9\u6848",id:"\u5e38\u89c1\u95ee\u9898\u548c\u89e3\u51b3\u65b9\u6848",level:2},{value:"1. \u65e0\u9650\u5faa\u73af\u95ee\u9898",id:"1-\u65e0\u9650\u5faa\u73af\u95ee\u9898",level:3},{value:"2. \u4f9d\u8d56\u9879\u5904\u7406",id:"2-\u4f9d\u8d56\u9879\u5904\u7406",level:3},{value:"3. \u72b6\u6001\u66f4\u65b0\u95ee\u9898",id:"3-\u72b6\u6001\u66f4\u65b0\u95ee\u9898",level:3}];function a(n){const e={code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",header:"header",li:"li",ol:"ol",p:"p",pre:"pre",ul:"ul",...(0,c.R)(),...n.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(e.header,{children:(0,i.jsx)(e.h1,{id:"react-hooks-\u8be6\u89e3",children:"React Hooks \u8be6\u89e3"})}),"\n",(0,i.jsx)(e.h2,{id:"\u4e3a\u4ec0\u4e48\u9700\u8981-hooks",children:"\u4e3a\u4ec0\u4e48\u9700\u8981 Hooks"}),"\n",(0,i.jsx)(e.p,{children:"\u5728 Hooks \u51fa\u73b0\u4e4b\u524d\uff0cReact \u5b58\u5728\u4ee5\u4e0b\u95ee\u9898\uff1a"}),"\n",(0,i.jsxs)(e.ol,{children:["\n",(0,i.jsx)(e.li,{children:"\u7ec4\u4ef6\u4e4b\u95f4\u590d\u7528\u72b6\u6001\u903b\u8f91\u5f88\u96be"}),"\n",(0,i.jsx)(e.li,{children:"\u590d\u6742\u7ec4\u4ef6\u53d8\u5f97\u96be\u4ee5\u7406\u89e3"}),"\n",(0,i.jsx)(e.li,{children:"\u96be\u4ee5\u7406\u89e3\u7684 class \u7ec4\u4ef6"}),"\n",(0,i.jsx)(e.li,{children:"this \u7684\u6307\u5411\u95ee\u9898"}),"\n"]}),"\n",(0,i.jsx)(e.h2,{id:"\u57fa\u7840-hooks",children:"\u57fa\u7840 Hooks"}),"\n",(0,i.jsx)(e.h3,{id:"usestate",children:"useState"}),"\n",(0,i.jsx)(e.p,{children:"useState \u662f React \u6700\u57fa\u7840\u7684 Hook\uff0c\u7528\u4e8e\u5728\u51fd\u6570\u7ec4\u4ef6\u4e2d\u6dfb\u52a0\u72b6\u6001\u7ba1\u7406\u3002\u5b83\u8fd4\u56de\u4e00\u4e2a\u6570\u7ec4\uff0c\u5305\u542b\uff1a"}),"\n",(0,i.jsxs)(e.ol,{children:["\n",(0,i.jsx)(e.li,{children:"\u5f53\u524d\u72b6\u6001\u503c"}),"\n",(0,i.jsx)(e.li,{children:"\u66f4\u65b0\u72b6\u6001\u7684\u51fd\u6570"}),"\n"]}),"\n",(0,i.jsx)(e.p,{children:"useState \u7684\u7279\u70b9\uff1a"}),"\n",(0,i.jsxs)(e.ul,{children:["\n",(0,i.jsx)(e.li,{children:"\u53ef\u4ee5\u591a\u6b21\u8c03\u7528\uff0c\u7ba1\u7406\u591a\u4e2a\u72b6\u6001"}),"\n",(0,i.jsx)(e.li,{children:"\u72b6\u6001\u66f4\u65b0\u662f\u5f02\u6b65\u7684"}),"\n",(0,i.jsx)(e.li,{children:"\u72b6\u6001\u66f4\u65b0\u4f1a\u89e6\u53d1\u7ec4\u4ef6\u91cd\u65b0\u6e32\u67d3"}),"\n",(0,i.jsx)(e.li,{children:"\u521d\u59cb\u503c\u53ea\u5728\u7ec4\u4ef6\u9996\u6b21\u6e32\u67d3\u65f6\u4f7f\u7528"}),"\n"]}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-tsx",children:"import { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  \n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>+</button>\n      <button onClick={() => setCount(count - 1)}>-</button>\n    </div>\n  );\n}\n"})}),"\n",(0,i.jsx)(e.h4,{id:"usestate-\u7684\u8fdb\u9636\u7528\u6cd5",children:"useState \u7684\u8fdb\u9636\u7528\u6cd5"}),"\n",(0,i.jsxs)(e.ol,{children:["\n",(0,i.jsx)(e.li,{children:"\u51fd\u6570\u5f0f\u66f4\u65b0"}),"\n"]}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-tsx",children:"function Counter() {\n  const [count, setCount] = useState(0);\n  \n  // \u63a8\u8350\uff1a\u4f7f\u7528\u51fd\u6570\u5f0f\u66f4\u65b0\n  // \u4e3b\u8981\u662f\u4e3a\u4e86\u89e3\u51b3 \u72b6\u6001\u66f4\u65b0\u7684\u5f02\u6b65\u6027\u548c\u4f9d\u8d56\u6027\u95ee\u9898\n  const increment = () => {\n    setCount(prevCount => prevCount + 1);\n  };\n  \n  // \u4e0d\u63a8\u8350\uff1a\u76f4\u63a5\u4f7f\u7528\u5f53\u524d\u503c\n  const decrement = () => {\n    setCount(count - 1);\n  };\n}\n"})}),"\n",(0,i.jsxs)(e.ol,{start:"2",children:["\n",(0,i.jsx)(e.li,{children:"\u60f0\u6027\u521d\u59cb\u5316"}),"\n"]}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-tsx",children:"const [state, setState] = useState(() => {\n  const initialState = someExpensiveComputation();\n  return initialState;\n});\n"})}),"\n",(0,i.jsx)(e.h3,{id:"useeffect",children:"useEffect"}),"\n",(0,i.jsx)(e.p,{children:"\u7528\u4e8e\u5904\u7406\u526f\u4f5c\u7528\uff0c\u5982\u6570\u636e\u83b7\u53d6\u3001\u8ba2\u9605\u6216\u624b\u52a8\u4fee\u6539 DOM\u3002"}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-tsx",children:"import { useEffect, useState } from 'react';\n\nfunction UserProfile({ userId }) {\n  const [user, setUser] = useState(null);\n  \n  useEffect(() => {\n    // \u83b7\u53d6\u7528\u6237\u6570\u636e\n    const fetchUser = async () => {\n      const response = await fetch(`/api/users/${userId}`);\n      const data = await response.json();\n      setUser(data);\n    };\n    \n    fetchUser();\n    \n    // \u6e05\u7406\u51fd\u6570\n    return () => {\n      // \u5728\u7ec4\u4ef6\u5378\u8f7d\u65f6\u6267\u884c\u6e05\u7406\n    };\n  }, [userId]); // \u4f9d\u8d56\u6570\u7ec4\n  \n  if (!user) return <div>Loading...</div>;\n  \n  return <div>{user.name}</div>;\n}\n"})}),"\n",(0,i.jsx)(e.h4,{id:"useeffect-\u7684\u4f9d\u8d56\u9879",children:"useEffect \u7684\u4f9d\u8d56\u9879"}),"\n",(0,i.jsxs)(e.ol,{children:["\n",(0,i.jsx)(e.li,{children:"\u7a7a\u4f9d\u8d56\u6570\u7ec4\uff1a\u53ea\u5728\u7ec4\u4ef6\u6302\u8f7d\u548c\u5378\u8f7d\u65f6\u6267\u884c"}),"\n"]}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-tsx",children:"useEffect(() => {\n  // \u53ea\u5728\u6302\u8f7d\u65f6\u6267\u884c\n}, []);\n"})}),"\n",(0,i.jsxs)(e.ol,{start:"2",children:["\n",(0,i.jsx)(e.li,{children:"\u6709\u4f9d\u8d56\u9879\uff1a\u5728\u4f9d\u8d56\u9879\u53d8\u5316\u65f6\u6267\u884c"}),"\n"]}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-tsx",children:"useEffect(() => {\n  // \u5728 count \u53d8\u5316\u65f6\u6267\u884c\n}, [count]);\n"})}),"\n",(0,i.jsxs)(e.ol,{start:"3",children:["\n",(0,i.jsx)(e.li,{children:"\u6ca1\u6709\u4f9d\u8d56\u6570\u7ec4\uff1a\u6bcf\u6b21\u6e32\u67d3\u90fd\u6267\u884c"}),"\n"]}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-tsx",children:"useEffect(() => {\n  // \u6bcf\u6b21\u6e32\u67d3\u90fd\u6267\u884c\n});\n"})}),"\n",(0,i.jsx)(e.h3,{id:"usecontext",children:"useContext"}),"\n",(0,i.jsx)(e.p,{children:"\u7528\u4e8e\u8ba2\u9605 React \u7684 Context\u3002"}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-tsx",children:"import { createContext, useContext } from 'react';\n\nconst ThemeContext = createContext('light');\n\nfunction ThemedButton() {\n  const theme = useContext(ThemeContext);\n  \n  return <button className={theme}>Themed Button</button>;\n}\n"})}),"\n",(0,i.jsx)(e.h2,{id:"\u989d\u5916\u7684-hooks",children:"\u989d\u5916\u7684 Hooks"}),"\n",(0,i.jsx)(e.h3,{id:"usereducer",children:"useReducer"}),"\n",(0,i.jsx)(e.p,{children:"\u7528\u4e8e\u7ba1\u7406\u590d\u6742\u7684\u72b6\u6001\u903b\u8f91\u3002"}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-tsx",children:"import { useReducer } from 'react';\n\nconst initialState = { count: 0 };\n\nfunction reducer(state, action) {\n  switch (action.type) {\n    case 'increment':\n      return { count: state.count + 1 };\n    case 'decrement':\n      return { count: state.count - 1 };\n    default:\n      throw new Error();\n  }\n}\n\nfunction Counter() {\n  const [state, dispatch] = useReducer(reducer, initialState);\n  \n  return (\n    <div>\n      Count: {state.count}\n      <button onClick={() => dispatch({ type: 'increment' })}>+</button>\n      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>\n    </div>\n  );\n}\n"})}),"\n",(0,i.jsx)(e.h3,{id:"usecallback",children:"useCallback"}),"\n",(0,i.jsx)(e.p,{children:"useCallback \u4e3b\u8981\u7528\u4e8e\u6027\u80fd\u4f18\u5316\uff0c\u5b83\u53ef\u4ee5\u5e2e\u52a9\u6211\u4eec\u7f13\u5b58\u51fd\u6570\u5f15\u7528\uff0c\u907f\u514d\u5728\u6bcf\u6b21\u6e32\u67d3\u65f6\u90fd\u521b\u5efa\u65b0\u7684\u51fd\u6570\u3002\u4f7f\u7528\u573a\u666f\uff1a"}),"\n",(0,i.jsxs)(e.ol,{children:["\n",(0,i.jsx)(e.li,{children:"\u5f53\u51fd\u6570\u4f5c\u4e3a props \u4f20\u9012\u7ed9\u5b50\u7ec4\u4ef6\u65f6"}),"\n",(0,i.jsx)(e.li,{children:"\u5f53\u51fd\u6570\u5728 useEffect \u7684\u4f9d\u8d56\u6570\u7ec4\u4e2d\u4f7f\u7528\u65f6"}),"\n",(0,i.jsx)(e.li,{children:"\u5f53\u51fd\u6570\u521b\u5efa\u6210\u672c\u8f83\u9ad8\u65f6"}),"\n",(0,i.jsx)(e.li,{children:"\u5f53\u51fd\u6570\u9700\u8981\u4fdd\u6301\u5f15\u7528\u4e00\u81f4\u6027\u65f6"}),"\n"]}),"\n",(0,i.jsx)(e.p,{children:"\u7528\u4e8e\u7f13\u5b58\u56de\u8c03\u51fd\u6570\uff0c\u907f\u514d\u4e0d\u5fc5\u8981\u7684\u91cd\u6e32\u67d3\u3002"}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-tsx",children:"import { useCallback } from 'react';\n\nfunction ParentComponent() {\n  const [count, setCount] = useState(0);\n  \n  const handleClick = useCallback(() => {\n    setCount(c => c + 1);\n  }, []); // \u7a7a\u4f9d\u8d56\u6570\u7ec4\u8868\u793a\u8fd9\u4e2a\u51fd\u6570\u6c38\u8fdc\u4e0d\u4f1a\u6539\u53d8\n  \n  return <ChildComponent onClick={handleClick} />;\n}\n"})}),"\n",(0,i.jsx)(e.h3,{id:"usememo",children:"useMemo"}),"\n",(0,i.jsx)(e.p,{children:"useMemo \u7528\u4e8e\u7f13\u5b58\u8ba1\u7b97\u7ed3\u679c\uff0c\u9002\u7528\u4e8e\u4ee5\u4e0b\u573a\u666f\uff1a"}),"\n",(0,i.jsxs)(e.ol,{children:["\n",(0,i.jsx)(e.li,{children:"\u8ba1\u7b97\u91cf\u5927\u7684\u64cd\u4f5c"}),"\n",(0,i.jsx)(e.li,{children:"\u9700\u8981\u8fdb\u884c\u6df1\u6bd4\u8f83\u7684\u5bf9\u8c61"}),"\n",(0,i.jsx)(e.li,{children:"\u4f5c\u4e3a\u5176\u4ed6 hook \u7684\u4f9d\u8d56\u9879"}),"\n",(0,i.jsx)(e.li,{children:"\u9632\u6b62\u5b50\u7ec4\u4ef6\u4e0d\u5fc5\u8981\u7684\u91cd\u6e32\u67d3"}),"\n"]}),"\n",(0,i.jsx)(e.p,{children:"\u7528\u4e8e\u7f13\u5b58\u8ba1\u7b97\u7ed3\u679c\u3002"}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-tsx",children:"import { useMemo } from 'react';\n\nfunction ExpensiveComponent({ data }) {\n  const processedData = useMemo(() => {\n    return data.map(item => expensiveOperation(item));\n  }, [data]); // \u53ea\u5728 data \u53d8\u5316\u65f6\u91cd\u65b0\u8ba1\u7b97\n  \n  return <div>{processedData}</div>;\n}\n"})}),"\n",(0,i.jsx)(e.h3,{id:"useref",children:"useRef"}),"\n",(0,i.jsx)(e.p,{children:"useRef \u5728 React \u4e2d\u6709\u4e24\u4e2a\u4e3b\u8981\u7528\u9014\uff1a"}),"\n",(0,i.jsxs)(e.ol,{children:["\n",(0,i.jsxs)(e.li,{children:["\u8bbf\u95ee DOM \u8282\u70b9\u6216 React \u5143\u7d20","\n",(0,i.jsxs)(e.ul,{children:["\n",(0,i.jsx)(e.li,{children:"\u83b7\u53d6\u8f93\u5165\u6846\u7126\u70b9"}),"\n",(0,i.jsx)(e.li,{children:"\u6d4b\u91cf DOM \u8282\u70b9\u7684\u5c3a\u5bf8"}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(e.li,{children:["\u4fdd\u5b58\u53ef\u53d8\u503c","\n",(0,i.jsxs)(e.ul,{children:["\n",(0,i.jsx)(e.li,{children:"\u5b58\u50a8\u5b9a\u65f6\u5668 ID"}),"\n",(0,i.jsx)(e.li,{children:"\u4fdd\u5b58\u4e0a\u4e00\u6b21\u7684\u503c"}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(e.p,{children:"\u7528\u4e8e\u4fdd\u5b58\u53ef\u53d8\u503c\uff0c\u4e0d\u4f1a\u89e6\u53d1\u91cd\u6e32\u67d3\u3002"}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-tsx",children:"import { useRef, useEffect } from 'react';\n\nfunction TextInputWithFocus() {\n  const inputRef = useRef(null);\n  \n  useEffect(() => {\n    // \u7ec4\u4ef6\u6302\u8f7d\u65f6\u81ea\u52a8\u805a\u7126\n    inputRef.current.focus();\n  }, []);\n  \n  return <input ref={inputRef} type=\"text\" />;\n}\n"})}),"\n",(0,i.jsx)(e.h2,{id:"\u81ea\u5b9a\u4e49-hooks",children:"\u81ea\u5b9a\u4e49 Hooks"}),"\n",(0,i.jsx)(e.p,{children:"\u53ef\u4ee5\u521b\u5efa\u81ea\u5b9a\u4e49 Hooks \u6765\u590d\u7528\u72b6\u6001\u903b\u8f91\u3002"}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-tsx",children:"function useWindowSize() {\n  const [size, setSize] = useState({\n    width: window.innerWidth,\n    height: window.innerHeight\n  });\n  \n  useEffect(() => {\n    const handleResize = () => {\n      setSize({\n        width: window.innerWidth,\n        height: window.innerHeight\n      });\n    };\n    \n    window.addEventListener('resize', handleResize);\n    return () => window.removeEventListener('resize', handleResize);\n  }, []);\n  \n  return size;\n}\n\n// \u4f7f\u7528\u81ea\u5b9a\u4e49 Hook\nfunction App() {\n  const size = useWindowSize();\n  return <div>Window size: {size.width}x{size.height}</div>;\n}\n"})}),"\n",(0,i.jsx)(e.h2,{id:"hooks-\u4f7f\u7528\u89c4\u5219",children:"Hooks \u4f7f\u7528\u89c4\u5219"}),"\n",(0,i.jsxs)(e.ol,{children:["\n",(0,i.jsxs)(e.li,{children:["\u53ea\u5728\u6700\u9876\u5c42\u4f7f\u7528 Hooks","\n",(0,i.jsxs)(e.ul,{children:["\n",(0,i.jsx)(e.li,{children:"\u4e0d\u8981\u5728\u5faa\u73af\u3001\u6761\u4ef6\u6216\u5d4c\u5957\u51fd\u6570\u4e2d\u8c03\u7528 Hooks"}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(e.li,{children:["\u53ea\u5728 React \u51fd\u6570\u7ec4\u4ef6\u4e2d\u8c03\u7528 Hooks","\n",(0,i.jsxs)(e.ul,{children:["\n",(0,i.jsx)(e.li,{children:"\u4e0d\u8981\u5728\u666e\u901a\u7684 JavaScript \u51fd\u6570\u4e2d\u8c03\u7528 Hooks"}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(e.li,{children:['\u81ea\u5b9a\u4e49 Hook \u5fc5\u987b\u4ee5 "use" \u5f00\u5934',"\n",(0,i.jsxs)(e.ul,{children:["\n",(0,i.jsx)(e.li,{children:"\u8fd9\u662f\u4e00\u4e2a\u547d\u540d\u7ea6\u5b9a\uff0c\u7528\u4e8e\u8bc6\u522b\u81ea\u5b9a\u4e49 Hook"}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(e.h2,{id:"\u5e38\u89c1\u95ee\u9898\u548c\u89e3\u51b3\u65b9\u6848",children:"\u5e38\u89c1\u95ee\u9898\u548c\u89e3\u51b3\u65b9\u6848"}),"\n",(0,i.jsx)(e.h3,{id:"1-\u65e0\u9650\u5faa\u73af\u95ee\u9898",children:"1. \u65e0\u9650\u5faa\u73af\u95ee\u9898"}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-tsx",children:"// \u9519\u8bef\u793a\u4f8b\nuseEffect(() => {\n  setCount(count + 1);\n}, [count]); // \u8fd9\u4f1a\u5bfc\u81f4\u65e0\u9650\u5faa\u73af\n\n// \u6b63\u786e\u793a\u4f8b\nuseEffect(() => {\n  setCount(prevCount => prevCount + 1);\n}, []); // \u4f7f\u7528\u51fd\u6570\u5f0f\u66f4\u65b0\uff0c\u79fb\u9664\u4f9d\u8d56\n"})}),"\n",(0,i.jsx)(e.h3,{id:"2-\u4f9d\u8d56\u9879\u5904\u7406",children:"2. \u4f9d\u8d56\u9879\u5904\u7406"}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-tsx",children:"// \u9519\u8bef\u793a\u4f8b\nuseEffect(() => {\n  const handler = () => {\n    console.log(count);\n  };\n  window.addEventListener('resize', handler);\n  return () => window.removeEventListener('resize', handler);\n}, []); // \u7f3a\u5c11\u4f9d\u8d56\u9879\u8b66\u544a\n\n// \u6b63\u786e\u793a\u4f8b\nuseEffect(() => {\n  const handler = () => {\n    console.log(count);\n  };\n  window.addEventListener('resize', handler);\n  return () => window.removeEventListener('resize', handler);\n}, [count]); // \u6dfb\u52a0\u5fc5\u8981\u7684\u4f9d\u8d56\u9879\n"})}),"\n",(0,i.jsx)(e.h3,{id:"3-\u72b6\u6001\u66f4\u65b0\u95ee\u9898",children:"3. \u72b6\u6001\u66f4\u65b0\u95ee\u9898"}),"\n",(0,i.jsx)(e.pre,{children:(0,i.jsx)(e.code,{className:"language-tsx",children:"// \u9519\u8bef\u793a\u4f8b\nconst [state, setState] = useState({ count: 0, name: 'John' });\nsetState({ count: state.count + 1 }); // \u8fd9\u4f1a\u4e22\u5931 name \u5c5e\u6027\n\n// \u6b63\u786e\u793a\u4f8b\nsetState(prevState => ({\n  ...prevState,\n  count: prevState.count + 1\n}));\n"})})]})}function u(n={}){const{wrapper:e}={...(0,c.R)(),...n.components};return e?(0,i.jsx)(e,{...n,children:(0,i.jsx)(a,{...n})}):a(n)}},8453:(n,e,t)=>{t.d(e,{R:()=>l,x:()=>o});var s=t(6540);const i={},c=s.createContext(i);function l(n){const e=s.useContext(c);return s.useMemo((function(){return"function"==typeof n?n(e):{...e,...n}}),[e,n])}function o(n){let e;return e=n.disableParentContext?"function"==typeof n.components?n.components(i):n.components||i:l(n.components),s.createElement(c.Provider,{value:e},n.children)}}}]);