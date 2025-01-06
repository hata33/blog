# React Router 详解

## 1. 路由模式对比

### Hash 模式 vs History 模式

#### Hash 模式
```tsx
// URL 示例: http://example.com/#/home
import { HashRouter } from 'react-router-dom';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
      </Routes>
    </HashRouter>
  );
}
```

**特点：**
1. URL 中带有 `#` 号
2. 兼容性好，支持老版本浏览器
3. 不需要服务器配置
4. 刷新页面不会 404

**缺点：**
1. URL 不够美观
2. 对 SEO 不友好
3. 有些统计工具可能无法获取 URL 中 # 后面的内容

#### History 模式
```tsx
// URL 示例: http://example.com/home
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
```

**特点：**
1. URL 更加美观
2. 有利于 SEO
3. 可以使用浏览器的前进后退功能

**缺点：**
1. 需要服务器配置支持
2. 刷新页面可能会 404（需要服务器配置处理）

### 实现原理

#### Hash 模式原理
```tsx
class HashRouter {
  constructor() {
    // 监听 hash 变化
    window.addEventListener('hashchange', this.handleHashChange);
    // 初始化时也需要触发一次
    window.addEventListener('load', this.handleHashChange);
  }

  handleHashChange = () => {
    // 获取当前 hash 值，去除 # 号
    const hash = window.location.hash.slice(1);
    // 根据 hash 渲染对应组件
    this.render(hash);
  }

  // 手动更改 hash
  push(path: string) {
    window.location.hash = path;
  }
}
```

**工作原理：**
1. 通过监听 `hashchange` 事件来监测路由变化
2. URL 中 `#` 后面的内容发生变化时不会触发页面重新加载
3. 通过 `window.location.hash` 来获取和设置 hash 值
4. 兼容性好，因为 hash 变化不会导致页面刷新

#### History 模式原理
```tsx
class HistoryRouter {
  constructor() {
    // 监听 popstate 事件
    window.addEventListener('popstate', this.handlePopState);
    // 初始化时需要手动触发一次渲染
    this.handlePopState();
  }

  handlePopState = () => {
    // 获取当前路径
    const path = window.location.pathname;
    // 根据路径渲染对应组件
    this.render(path);
  }

  // 手动更改路由
  push(path: string, state = {}) {
    // 使用 History API 更改 URL
    window.history.pushState(state, '', path);
    // 手动触发渲染，因为 pushState 不会触发 popstate 事件
    this.handlePopState();
  }

  // 替换当前路由
  replace(path: string, state = {}) {
    window.history.replaceState(state, '', path);
    this.handlePopState();
  }
}
```

**工作原理：**
1. 使用 HTML5 的 History API 来管理路由
2. `pushState` 和 `replaceState` 方法改变 URL 但不会触发页面刷新
3. 通过监听 `popstate` 事件来检测浏览器前进/后退
4. 需要服务器配置支持，否则刷新页面会 404

#### 服务器配置示例

**Nginx 配置：**
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

**Node.js Express 配置：**
```javascript
const express = require('express');
const path = require('path');
const app = express();

// 所有请求都返回 index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
```

#### 两种模式的区别

| 特性 | Hash 模式 | History 模式 |
|------|-----------|--------------|
| URL 格式 | `/#/path` | `/path` |
| 服务器配置 | 不需要 | 需要 |
| 兼容性 | 好 | 仅 HTML5 |
| SEO | 不友好 | 友好 |
| 事件监听 | hashchange | popstate |
| 状态管理 | 仅 hash 部分 | 完整 state 对象 |
| 刷新页面 | 不会 404 | 可能 404 |

## 2. 基本路由配置

### 路由定义

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 基础路由 */}
        <Route path="/" element={<Home />} />
        
        {/* 带参数的路由 */}
        <Route path="/user/:id" element={<UserProfile />} />
        
        {/* 嵌套路由 */}
        <Route path="/settings" element={<Settings />}>
          <Route path="profile" element={<Profile />} />
          <Route path="account" element={<Account />} />
        </Route>
        
        {/* 404 页面 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### 路由参数获取

```tsx
import { useParams, useSearchParams } from 'react-router-dom';

function UserProfile() {
  // 获取路径参数
  const { id } = useParams<{ id: string }>();
  
  // 获取查询参数
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab');
  
  return (
    <div>
      <h1>User ID: {id}</h1>
      <p>Current Tab: {tab}</p>
    </div>
  );
}
```

## 3. 路由导航

### 声明式导航

```tsx
import { Link, NavLink } from 'react-router-dom';

function Navigation() {
  return (
    <nav>
      {/* 基础链接 */}
      <Link to="/home">Home</Link>
      
      {/* 带状态的链接 */}
      <Link 
        to="/dashboard"
        state={{ from: 'navigation' }}
      >
        Dashboard
      </Link>
      
      {/* 带激活样式的链接 */}
      <NavLink 
        to="/profile"
        className={({ isActive }) => isActive ? 'active' : ''}
      >
        Profile
      </NavLink>
    </nav>
  );
}
```

### 编程式导航

```tsx
import { useNavigate, useLocation } from 'react-router-dom';

function LoginButton() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogin = async () => {
    const success = await login();
    if (success) {
      // 基础跳转
      navigate('/dashboard');
      
      // 带状态跳转
      navigate('/dashboard', { 
        state: { from: location.pathname } 
      });
      
      // 替换当前历史记录
      navigate('/dashboard', { replace: true });
      
      // 返回上一页
      navigate(-1);
    }
  };
  
  return <button onClick={handleLogin}>Login</button>;
}
```

## 4. 路由守卫

### 权限控制

```tsx
import { Navigate, useLocation } from 'react-router-dom';

// 受保护的路由组件
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const auth = useAuth(); // 自定义 hook 获取认证状态
  const location = useLocation();
  
  if (!auth.isAuthenticated) {
    // 重定向到登录页，并记录来源页面
    return <Navigate 
      to="/login" 
      state={{ from: location.pathname }}
      replace 
    />;
  }
  
  return <>{children}</>;
}

// 使用示例
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
```

## 5. 路由数据加载

### 使用 loader

```tsx
import { 
  createBrowserRouter, 
  RouterProvider,
  useLoaderData 
} from 'react-router-dom';

// 定义数据加载函数
async function userLoader({ params }) {
  const response = await fetch(`/api/users/${params.id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }
  return response.json();
}

// 使用 loader 的组件
function UserProfile() {
  const user = useLoaderData();
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}

// 路由配置
const router = createBrowserRouter([
  {
    path: "/user/:id",
    element: <UserProfile />,
    loader: userLoader,
    errorElement: <ErrorBoundary />
  }
]);

// 应用入口
function App() {
  return <RouterProvider router={router} />;
}
```

## 6. 最佳实践

### 1. 路由组织

```tsx
// routes/index.tsx
import { RouteObject } from 'react-router-dom';
import { mainRoutes } from './main';
import { authRoutes } from './auth';
import { adminRoutes } from './admin';

export const routes: RouteObject[] = [
  ...mainRoutes,
  ...authRoutes,
  ...adminRoutes
];

// routes/main.tsx
export const mainRoutes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '', element: <Home /> },
      { path: 'about', element: <About /> }
    ]
  }
];
```

### 2. 懒加载路由

```tsx
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <Routes>
      <Route
        path="/dashboard/*"
        element={
          <Suspense fallback={<Loading />}>
            <Dashboard />
          </Suspense>
        }
      />
    </Routes>
  );
}
```

### 3. 类型安全的路由

```tsx
// routes/types.ts
export type AppRoutes = {
  home: '/';
  user: '/user/:id';
  settings: '/settings';
};

// hooks/useTypedNavigate.ts
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from '../routes/types';

export function useTypedNavigate() {
  const navigate = useNavigate();
  
  return {
    toUser: (id: string) => navigate(`/user/${id}`),
    toSettings: () => navigate('/settings'),
    toHome: () => navigate('/')
  };
}
``` 