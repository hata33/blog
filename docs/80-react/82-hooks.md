# React Hooks 详解

## 为什么需要 Hooks

在 Hooks 出现之前，React 存在以下问题：
1. 组件之间复用状态逻辑很难
2. 复杂组件变得难以理解
3. 难以理解的 class 组件
4. this 的指向问题

## 基础 Hooks

### useState

useState 是 React 最基础的 Hook，用于在函数组件中添加状态管理。它返回一个数组，包含：
1. 当前状态值
2. 更新状态的函数

useState 的特点：
- 可以多次调用，管理多个状态
- 状态更新是异步的
- 状态更新会触发组件重新渲染
- 初始值只在组件首次渲染时使用

```tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
    </div>
  );
}
```

#### useState 的进阶用法

1. 函数式更新

```tsx
function Counter() {
  const [count, setCount] = useState(0);
  
  // 推荐：使用函数式更新
  // 主要是为了解决 状态更新的异步性和依赖性问题
  const increment = () => {
    setCount(prevCount => prevCount + 1);
  };
  
  // 不推荐：直接使用当前值
  const decrement = () => {
    setCount(count - 1);
  };
}
```

2. 惰性初始化

```tsx
const [state, setState] = useState(() => {
  const initialState = someExpensiveComputation();
  return initialState;
});
```

### useEffect

用于处理副作用，如数据获取、订阅或手动修改 DOM。

```tsx
import { useEffect, useState } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // 获取用户数据
    const fetchUser = async () => {
      const response = await fetch(`/api/users/${userId}`);
      const data = await response.json();
      setUser(data);
    };
    
    fetchUser();
    
    // 清理函数
    return () => {
      // 在组件卸载时执行清理
    };
  }, [userId]); // 依赖数组
  
  if (!user) return <div>Loading...</div>;
  
  return <div>{user.name}</div>;
}
```

#### useEffect 的依赖项

1. 空依赖数组：只在组件挂载和卸载时执行
```tsx
useEffect(() => {
  // 只在挂载时执行
}, []);
```

2. 有依赖项：在依赖项变化时执行
```tsx
useEffect(() => {
  // 在 count 变化时执行
}, [count]);
```

3. 没有依赖数组：每次渲染都执行
```tsx
useEffect(() => {
  // 每次渲染都执行
});
```

### useContext

用于订阅 React 的 Context。

```tsx
import { createContext, useContext } from 'react';

const ThemeContext = createContext('light');

function ThemedButton() {
  const theme = useContext(ThemeContext);
  
  return <button className={theme}>Themed Button</button>;
}
```

## 额外的 Hooks

### useReducer

用于管理复杂的状态逻辑。

```tsx
import { useReducer } from 'react';

const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return (
    <div>
      Count: {state.count}
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
    </div>
  );
}
```

### useCallback

useCallback 主要用于性能优化，它可以帮助我们缓存函数引用，避免在每次渲染时都创建新的函数。使用场景：

1. 当函数作为 props 传递给子组件时
2. 当函数在 useEffect 的依赖数组中使用时
3. 当函数创建成本较高时
4. 当函数需要保持引用一致性时

用于缓存回调函数，避免不必要的重渲染。

```tsx
import { useCallback } from 'react';

function ParentComponent() {
  const [count, setCount] = useState(0);
  
  const handleClick = useCallback(() => {
    setCount(c => c + 1);
  }, []); // 空依赖数组表示这个函数永远不会改变
  
  return <ChildComponent onClick={handleClick} />;
}
```

### useMemo

useMemo 用于缓存计算结果，适用于以下场景：

1. 计算量大的操作
2. 需要进行深比较的对象
3. 作为其他 hook 的依赖项
4. 防止子组件不必要的重渲染

用于缓存计算结果。

```tsx
import { useMemo } from 'react';

function ExpensiveComponent({ data }) {
  const processedData = useMemo(() => {
    return data.map(item => expensiveOperation(item));
  }, [data]); // 只在 data 变化时重新计算
  
  return <div>{processedData}</div>;
}
```

### useRef

useRef 在 React 中有两个主要用途：

1. 访问 DOM 节点或 React 元素
   - 获取输入框焦点
   - 测量 DOM 节点的尺寸
2. 保存可变值
   - 存储定时器 ID
   - 保存上一次的值

用于保存可变值，不会触发重渲染。

```tsx
import { useRef, useEffect } from 'react';

function TextInputWithFocus() {
  const inputRef = useRef(null);
  
  useEffect(() => {
    // 组件挂载时自动聚焦
    inputRef.current.focus();
  }, []);
  
  return <input ref={inputRef} type="text" />;
}
```

## 自定义 Hooks

可以创建自定义 Hooks 来复用状态逻辑。

```tsx
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return size;
}

// 使用自定义 Hook
function App() {
  const size = useWindowSize();
  return <div>Window size: {size.width}x{size.height}</div>;
}
```

## Hooks 使用规则

1. 只在最顶层使用 Hooks
   - 不要在循环、条件或嵌套函数中调用 Hooks
   
2. 只在 React 函数组件中调用 Hooks
   - 不要在普通的 JavaScript 函数中调用 Hooks
   
3. 自定义 Hook 必须以 "use" 开头
   - 这是一个命名约定，用于识别自定义 Hook

## 常见问题和解决方案

### 1. 无限循环问题

```tsx
// 错误示例
useEffect(() => {
  setCount(count + 1);
}, [count]); // 这会导致无限循环

// 正确示例
useEffect(() => {
  setCount(prevCount => prevCount + 1);
}, []); // 使用函数式更新，移除依赖
```

### 2. 依赖项处理

```tsx
// 错误示例
useEffect(() => {
  const handler = () => {
    console.log(count);
  };
  window.addEventListener('resize', handler);
  return () => window.removeEventListener('resize', handler);
}, []); // 缺少依赖项警告

// 正确示例
useEffect(() => {
  const handler = () => {
    console.log(count);
  };
  window.addEventListener('resize', handler);
  return () => window.removeEventListener('resize', handler);
}, [count]); // 添加必要的依赖项
```

### 3. 状态更新问题

```tsx
// 错误示例
const [state, setState] = useState({ count: 0, name: 'John' });
setState({ count: state.count + 1 }); // 这会丢失 name 属性

// 正确示例
setState(prevState => ({
  ...prevState,
  count: prevState.count + 1
}));
``` 