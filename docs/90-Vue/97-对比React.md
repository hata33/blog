# Vue vs React 对比

## 1. 核心思想

### Vue
- 渐进式框架
- 模板语法
- 响应式系统
- 双向绑定

### React
- UI = f(state)
- JSX
- 单向数据流
- 虚拟DOM

## 2. 状态管理

### Vue
```js
// Pinia
const store = defineStore('counter', {
  state: () => ({ count: 0 }),
  actions: {
    increment() {
      this.count++
    }
  }
})
```

### React
```js
// Redux
const counterSlice = createSlice({
  name: 'counter',
  initialState: { count: 0 },
  reducers: {
    increment: state => {
      state.count += 1
    }
  }
})
```

## 3. 生命周期对比

| Vue3 | React |
|------|--------|
| setup() | constructor |
| onBeforeMount | componentWillMount |
| onMounted | componentDidMount |
| onBeforeUpdate | componentWillUpdate |
| onUpdated | componentDidUpdate |
| onBeforeUnmount | componentWillUnmount |
| onUnmounted | componentDidUnmount | 