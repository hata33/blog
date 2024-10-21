"use strict";(self.webpackChunkblog=self.webpackChunkblog||[]).push([[797],{805:(e,r,s)=>{s.r(r),s.d(r,{assets:()=>h,contentTitle:()=>c,default:()=>d,frontMatter:()=>t,metadata:()=>a,toc:()=>l});var n=s(4848),i=s(8453);const t={},c="git",a={id:"git",title:"git",description:"branch",source:"@site/docs/60-git.md",sourceDirName:".",slug:"/git",permalink:"/blog/docs/git",draft:!1,unlisted:!1,tags:[],version:"current",sidebarPosition:60,frontMatter:{},sidebar:"defaultSidebar",previous:{title:"js\u624b\u5199",permalink:"/blog/docs/\u624b\u5199\u4ee3\u7801/js\u624b\u5199"},next:{title:"\u9762\u8bd5\u9898",permalink:"/blog/docs/\u9762\u8bd5\u9898/js\u9762\u8bd5\u9898"}},h={},l=[{value:"branch",id:"branch",level:3},{value:"rebase branch",id:"rebase-branch",level:3},{value:"git stash",id:"git-stash",level:3},{value:"commit",id:"commit",level:3},{value:"reset",id:"reset",level:3},{value:"remote repositories",id:"remote-repositories",level:3},{value:"rebase cherry-pick",id:"rebase-cherry-pick",level:3},{value:"scope",id:"scope",level:3}];function o(e){const r={a:"a",code:"code",h1:"h1",h3:"h3",header:"header",li:"li",p:"p",pre:"pre",ul:"ul",...(0,i.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(r.header,{children:(0,n.jsx)(r.h1,{id:"git",children:"git"})}),"\n",(0,n.jsx)(r.h3,{id:"branch",children:"branch"}),"\n",(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:"language-git",children:"git branch testing // \u65b0\u589e\r\ngit branch -d hotfix // \u5220\u9664\r\ngit checkout testing // \u5207\u51fa\r\ngit checkout -b feat/sass-v1 origin/feat/sass-v1 // \u514b\u9686\u8fdc\u7aef\u5206\u652ffeat/sass-v1\u5230\u672c\u5730\r\ngit checkout -b feat/saas-0817 // \u4ece\u5f53\u524d\u5206\u652f\u65b0\u5efa\u4e00\u4e2a\u5206\u652ffeat/saas-0817\r\ngit merge [branchName] // \u5c06branchName\u5408\u5e76\u5230\u5f53\u524d\u5206\u652f\r\ngit merge [branchName] --squash // \u5c06branchName\u5408\u5e76\u5230\u5f53\u524d\u5206\u652f\uff0c\u5e76\u5c06branchName\u4e0a\u7684\u6240\u6709\u63d0\u4ea4\u5408\u5e76\u6210\u4e00\u6b21\u63d0\u4ea4\r\ngit push origin -D [branchName] \u5220\u9664\u8fdc\u7aef\u5206\u652f\n"})}),"\n",(0,n.jsx)(r.h3,{id:"rebase-branch",children:"rebase branch"}),"\n",(0,n.jsx)(r.p,{children:(0,n.jsx)(r.a,{href:"https://juejin.cn/post/6844903895160881166?searchId=2024102111574970A6EAF3D162C75C7553",children:"git pull --rebase \u7684\u6b63\u786e\u4f7f\u7528"})}),"\n",(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:"language-git",children:"git pull --rebase origin [branchName] = git fetch + git rebase\r\ngit pull --rebase origin [branchName] //\u547d\u4ee4\u7684\u4f5c\u7528\u662f\u4ece\u8fdc\u7a0b\u4ed3\u5e93\u62c9\u53d6\u6700\u65b0\u7684\u63d0\u4ea4\uff0c\u5e76\u901a\u8fc7 rebase \u7684\u65b9\u5f0f\u628a\u8fd9\u4e9b\u63d0\u4ea4\u5e94\u7528\u5230\u5f53\u524d\u5206\u652f\u4e0a\u3002\r\ngit rebase master\n"})}),"\n",(0,n.jsxs)(r.ul,{children:["\n",(0,n.jsxs)(r.li,{children:["\u6267\u884c ",(0,n.jsx)(r.code,{children:"git pull --rebase"})," \u7684\u65f6\u5019\u5fc5\u987b\u4fdd\u6301\u672c\u5730\u76ee\u5f55\u5e72\u51c0\u3002\u5373\uff1a\u4e0d\u80fd\u5b58\u5728\u72b6\u6001\u4e3a ",(0,n.jsx)(r.code,{children:"modified"})," \u7684\u6587\u4ef6\u3002\uff08\u5b58\u5728",(0,n.jsx)(r.code,{children:"Untracked files"}),"\u662f\u6ca1\u5173\u7cfb\u7684\uff09"]}),"\n",(0,n.jsxs)(r.li,{children:["\u5982\u679c\u51fa\u73b0\u51b2\u7a81\uff0c\u53ef\u4ee5\u9009\u62e9\u624b\u52a8\u89e3\u51b3\u51b2\u7a81\u540e\u7ee7\u7eed ",(0,n.jsx)(r.code,{children:"rebase"}),"\uff0c\u4e5f\u53ef\u4ee5\u653e\u5f03\u672c\u6b21 ",(0,n.jsx)(r.code,{children:"rebase"})]}),"\n"]}),"\n",(0,n.jsx)(r.p,{children:"\u591a\u4eba\u57fa\u4e8e\u540c\u4e00\u4e2a\u8fdc\u7a0b\u5206\u652f\u5f00\u53d1\u7684\u65f6\u5019\uff0c\u5982\u679c\u60f3\u8981\u987a\u5229 push \u53c8\u4e0d\u81ea\u52a8\u751f\u6210 merge commit\uff0c\u5efa\u8bae\u5728\u6bcf\u6b21\u63d0\u4ea4\u90fd\u6309\u7167\u5982\u4e0b\u987a\u5e8f\u64cd\u4f5c\uff1a"}),"\n",(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:"language-git",children:"# \u628a\u672c\u5730\u53d1\u751f\u6539\u52a8\u7684\u6587\u4ef6\u8d2e\u85cf\u4e00\u4e0b\r\n$ git stash\r\n\r\n# \u628a\u8fdc\u7a0b\u6700\u65b0\u7684 commit \u4ee5\u53d8\u57fa\u7684\u65b9\u5f0f\u540c\u6b65\u5230\u672c\u5730\r\n$ git pull --rebase\r\n\r\n# \u628a\u672c\u5730\u7684 commit \u63a8\u9001\u5230\u8fdc\u7a0b\r\n$ git push\r\n\r\n# \u628a\u672c\u5730\u8d2e\u85cf\u7684\u6587\u4ef6\u5f39\u51fa\uff0c\u7ee7\u7eed\u4fee\u6539\r\n$ git stash pop\r\n\n"})}),"\n",(0,n.jsx)(r.h3,{id:"git-stash",children:"git stash"}),"\n",(0,n.jsx)(r.p,{children:(0,n.jsx)(r.a,{href:"https://git-scm.com/book/zh/v2/Git-%E5%B7%A5%E5%85%B7-%E8%B4%AE%E8%97%8F%E4%B8%8E%E6%B8%85%E7%90%86",children:"Git - \u8d2e\u85cf\u4e0e\u6e05\u7406"})}),"\n",(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:"language-git",children:"git stash \u8d2e\u85cf\u4ee3\u7801\r\ngit stash pop \u6062\u590d\u5230\u5de5\u4f5c\u533a\u548c\u7f13\u5b58\u533a\uff0c\u4f1a\u79fb\u9664stashid\r\ngit stash list \u67e5\u770b\u5f53\u524d\u8d2e\u85cf\u533a\r\ngit stash apply [stashname] // \u6062\u590d\u67d0\u4e00\u6b21\u7684stash\r\ngit stash drop <stashname> // \u5220\u9664\u67d0\u4e00\u6b21\u7684stash\n"})}),"\n",(0,n.jsx)(r.h3,{id:"commit",children:"commit"}),"\n",(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:"language-git",children:'git commit -m "msg" --no-verify \u5f3a\u5236\u63d0\u4ea4\u4e0d\u68c0\u67e5\r\ngit commit --amend \u4fee\u6539\u4e0a\u6b21\u7684\u63d0\u4ea4\u4fe1\u606f\uff0cpush\u540e\u4e0d\u4f1a\u589e\u52a0\u65b0\u7684commit\u8bb0\u5f55\uff0c\u4f46\u662f\u4f1a\u4fee\u6539\u672c\u6b21\u7684commithash(\u4e5f\u53ef\u4ee5\u7406\u89e3\u4e3a\u5220\u6389\u4e86\u6700\u65b0\u7684\u4e00\u6b21commit\uff0c\u91cd\u65b0\u53c8\u63d0\u4ea4\u4e86\u4e00\u6b21)\r\n\r\ngit push -f \u5f3a\u5236\u63d0\u4ea4\u4ee3\u7801\u5e76\u4ee5\u672c\u5730\u7248\u672c\u4ee3\u7801\u4e3a\u4e3b\u8986\u76d6\u8fdc\u7a0b\r\ngit push -f\u662f\u4e0d\u5b89\u5168\u7684\uff0cgit push --force-with-lease\u66f4\u5b89\u5168\uff0c\u6ce8\u610f--force-with-lease\u5931\u8d25\u540e\u518d\u6267\u884c\u4e00\u6b21\u4e5f\u4f1a\u5f3a\u5236\u63d0\u4ea4\u8986\u76d6\n'})}),"\n",(0,n.jsx)(r.h3,{id:"reset",children:"reset"}),"\n",(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:"language-git",children:"reset\u56de\u9000\r\n\r\ngit log \u67e5\u770b\u63d0\u4ea4\u65e5\u5fd7\r\ngit reset \u5c06\u6240\u6709\u6682\u5b58\u533a\u56de\u9000\u5230\u5de5\u4f5c\u533a\r\ngit checkout . \u4e22\u5f03\u5de5\u4f5c\u533a\u6240\u6709\u7684\u66f4\u6539\r\ngit reset --hard [commit hash] \u5c06\u4ececommithash(\u4e0d\u5305\u62ec\u6b64hash)\u4e4b\u540e\u7684\u4e22\u5f03\r\ngit reset --hard \u5c06\u6682\u5b58\u533a\u3001\u5de5\u4f5c\u533a\u6240\u6709\u5185\u5bb9\u4e22\u5f03\r\ngit reset --soft [commit hash] \u5c06\u4ececommithash(\u4e0d\u5305\u62ec\u6b64hash)\u4e4b\u540e\u7684\u63d0\u4ea4\u56de\u9000\u5230\u6682\u5b58\u533a\r\ngit reset --soft HEAD~4 \u56de\u9000\u6700\u8fd14\u6b21\u63d0\u4ea4\u5230\u6682\u5b58\u533a\n"})}),"\n",(0,n.jsx)(r.h3,{id:"remote-repositories",children:"remote repositories"}),"\n",(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:"language-git",children:"git fetch <remote> // \u8fd9\u4e2a\u547d\u4ee4\u4f1a\u8bbf\u95ee\u8fdc\u7a0b\u4ed3\u5e93\uff0c\u4ece\u4e2d\u62c9\u53d6\u6240\u6709\u4f60\u8fd8\u6ca1\u6709\u7684\u6570\u636e\u3002\r\n//\u7701\u7565\u4e86 <remote> \u53c2\u6570\u65f6\uff0cGit \u9ed8\u8ba4\u4f1a\u4ece\u914d\u7f6e\u4e2d\u7684\u6240\u6709\u8fdc\u7a0b\u4ed3\u5e93\u62c9\u53d6\u6570\u636e\r\n\n"})}),"\n",(0,n.jsx)(r.h3,{id:"rebase-cherry-pick",children:"rebase cherry-pick"}),"\n",(0,n.jsx)(r.p,{children:(0,n.jsx)(r.a,{href:"https://git-scm.com/book/zh/v2/%e5%88%86%e5%b8%83%e5%bc%8f-Git-%e7%bb%b4%e6%8a%a4%e9%a1%b9%e7%9b%ae#_rebase_cherry_pick",children:"Git - \u7ef4\u62a4\u9879\u76ee"})}),"\n",(0,n.jsx)(r.p,{children:"\u6311\u9009\u5de5\u4f5c\u6d41\uff0c\u6765\u5408\u5e76\u4ee3\u7801"}),"\n",(0,n.jsxs)(r.p,{children:[(0,n.jsx)(r.code,{children:"git cherry-pick"}),"\u547d\u4ee4\u7528\u6765\u83b7\u5f97\u5728\u5355\u4e2a\u63d0\u4ea4\u4e2d\u5f15\u5165\u7684\u53d8\u66f4\uff0c\u7136\u540e\u5c1d\u8bd5\u5c06\u4f5c\u4e3a\u4e00\u4e2a\u65b0\u7684\u63d0\u4ea4\u5f15\u5165\u5230\u4f60\u5f53\u524d\u5206\u652f\u4e0a\u3002 \u4ece\u4e00\u4e2a\u5206\u652f\u5355\u72ec\u4e00\u4e2a\u6216\u8005\u4e24\u4e2a\u63d0\u4ea4\u800c\u4e0d\u662f\u5408\u5e76\u6574\u4e2a\u5206\u652f\u7684\u6240\u6709\u53d8\u66f4\u662f\u975e\u5e38\u6709\u7528\u7684\u3002"]}),"\n",(0,n.jsx)(r.pre,{children:(0,n.jsx)(r.code,{className:"language-plain",children:"cherry-pick\n"})}),"\n",(0,n.jsx)(r.h3,{id:"scope",children:"scope"}),"\n",(0,n.jsx)(r.p,{children:"feat: \u65b0\u529f\u80fd\u3001\u65b0\u7279\u6027"}),"\n",(0,n.jsx)(r.p,{children:"fix: \u4fee\u6539 bug"}),"\n",(0,n.jsx)(r.p,{children:"perf: \u66f4\u6539\u4ee3\u7801\uff0c\u4ee5\u63d0\u9ad8\u6027\u80fd\uff08\u5728\u4e0d\u5f71\u54cd\u4ee3\u7801\u5185\u90e8\u884c\u4e3a\u7684\u524d\u63d0\u4e0b\uff0c\u5bf9\u7a0b\u5e8f\u6027\u80fd\u8fdb\u884c\u4f18\u5316\uff09"}),"\n",(0,n.jsx)(r.p,{children:"refactor: \u4ee3\u7801\u91cd\u6784\uff08\u91cd\u6784\uff0c\u5728\u4e0d\u5f71\u54cd\u4ee3\u7801\u5185\u90e8\u884c\u4e3a\u3001\u529f\u80fd\u4e0b\u7684\u4ee3\u7801\u4fee\u6539\uff09"}),"\n",(0,n.jsx)(r.p,{children:"docs: \u6587\u6863\u4fee\u6539"}),"\n",(0,n.jsx)(r.p,{children:"style: \u4ee3\u7801\u683c\u5f0f\u4fee\u6539, \u6ce8\u610f\u4e0d\u662f css \u4fee\u6539\uff08\u4f8b\u5982\u5206\u53f7\u4fee\u6539\uff09"}),"\n",(0,n.jsx)(r.p,{children:"test: \u6d4b\u8bd5\u7528\u4f8b\u65b0\u589e\u3001\u4fee\u6539"}),"\n",(0,n.jsx)(r.p,{children:"build: \u5f71\u54cd\u9879\u76ee\u6784\u5efa\u6216\u4f9d\u8d56\u9879\u4fee\u6539"}),"\n",(0,n.jsx)(r.p,{children:"revert: \u6062\u590d\u4e0a\u4e00\u6b21\u63d0\u4ea4"}),"\n",(0,n.jsx)(r.p,{children:"ci: \u6301\u7eed\u96c6\u6210\u76f8\u5173\u6587\u4ef6\u4fee\u6539"}),"\n",(0,n.jsx)(r.p,{children:"chore: \u5176\u4ed6\u4fee\u6539\uff08\u4e0d\u5728\u4e0a\u8ff0\u7c7b\u578b\u4e2d\u7684\u4fee\u6539\uff09"}),"\n",(0,n.jsx)(r.p,{children:"release: \u53d1\u5e03\u65b0\u7248\u672c"}),"\n",(0,n.jsx)(r.p,{children:"workflow: \u5de5\u4f5c\u6d41\u76f8\u5173\u6587\u4ef6\u4fee\u6539"})]})}function d(e={}){const{wrapper:r}={...(0,i.R)(),...e.components};return r?(0,n.jsx)(r,{...e,children:(0,n.jsx)(o,{...e})}):o(e)}},8453:(e,r,s)=>{s.d(r,{R:()=>c,x:()=>a});var n=s(6540);const i={},t=n.createContext(i);function c(e){const r=n.useContext(t);return n.useMemo((function(){return"function"==typeof e?e(r):{...r,...e}}),[r,e])}function a(e){let r;return r=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:c(e.components),n.createElement(t.Provider,{value:r},e.children)}}}]);