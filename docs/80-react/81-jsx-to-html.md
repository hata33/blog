# React JSX 到真实 DOM 的渲染过程

React 是一个用于构建用户界面的 JavaScript 库，其核心是将 JSX 转换为真实 DOM，并在页面上渲染。以下是这一过程的详细解析。

---

## 1. JSX 是什么？
JSX 是 JavaScript 的语法扩展，允许在 JavaScript 代码中编写类似 HTML 的结构。例如：
```javascript
const element = <h1>Hello, World!</h1>;
```
JSX 并不是真实的 HTML，它最终会被编译为 JavaScript 代码。

---

## 2. JSX 的编译
React 使用 Babel 将 JSX 编译为 React.createElement 函数调用。例如：
```javascript
const element = <h1 className="title">Hello, World!</h1>;
```
会被编译为：
```javascript
const element = React.createElement('h1', { className: 'title' }, 'Hello, World!');
```
React.createElement 会返回一个 React 元素（即虚拟 DOM 节点）。

---

## 3. React 元素（虚拟 DOM）
React.createElement 返回的对象是一个轻量级的 JavaScript 对象，称为 React 元素。它描述了真实 DOM 的结构。例如：
``` javascript
{
  type: 'h1',
  props: {
    className: 'title',
    children: 'Hello, World!'
  }
}
```
React 元素是虚拟 DOM 的一部分，虚拟 DOM 是真实 DOM 的轻量级表示。

---

## 4. 虚拟 DOM 的生成
React 会将多个 React 元素组合成一个虚拟 DOM 树。例如：
```javascript
const element = (
  <div>
    <h1>Hello, World!</h1>
    <p>This is a React example.</p>
  </div>
);
```
会被转换为虚拟 DOM 树：
```
{
  type: 'div',
  props: {
    children: [
      {
        type: 'h1',
        props: {
          children: 'Hello, World!'
        }
      },
      {
        type: 'p',
        props: {
          children: 'This is a React example.'
        }
      }
    ]
  }
}
```
---

## 5. 虚拟 DOM 的渲染（详细源码分析）

React 的渲染过程分为两个主要阶段：**Render 阶段** 和 **Commit 阶段**。这两个阶段的核心是通过 **Fiber 架构** 实现的，Fiber 是 React 16 引入的一种新的数据结构，用于更精细地控制渲染过程。

---

### **Render 阶段**
Render 阶段的主要任务是构建 Fiber 树，并确定哪些节点需要更新。这一阶段是异步的，可以被中断和恢复。以下是 Render 阶段的详细过程：

#### 1. **beginWork**
`beginWork` 是 React 对每个 Fiber 节点进行处理的入口函数。它的主要职责是根据 Fiber 节点的类型调用不同的处理逻辑。

- **函数组件**：调用函数组件，获取其返回的 React 元素，并递归处理子节点。
- **类组件**：实例化类组件，调用其 `render` 方法，获取 React 元素，并递归处理子节点。
- **HostComponent（原生 DOM 节点）**：创建对应的 DOM 节点，并设置属性（如 `className`、`style` 等）。
- **HostText（文本节点）**：创建文本节点。

`beginWork` 的核心逻辑：
```javascript
function beginWork(current, workInProgress, renderLanes) {
  switch (workInProgress.tag) {
    case FunctionComponent:
      return updateFunctionComponent(current, workInProgress, ...);
    case ClassComponent:
      return updateClassComponent(current, workInProgress, ...);
    case HostComponent:
      return updateHostComponent(current, workInProgress, ...);
    case HostText:
      return updateHostText(current, workInProgress, ...);
    // 其他类型...
  }
}
```

#### 2. completeWork
completeWork 是 React 对每个 Fiber 节点完成处理的函数。它的主要职责是将生成的 DOM 节点挂载到父节点上。

HostComponent：将生成的 DOM 节点挂载到父节点。

HostText：将生成的文本节点挂载到父节点。

completeWork 的核心逻辑：

```javascript
function completeWork(current, workInProgress, renderLanes) {
  const newProps = workInProgress.pendingProps;
  switch (workInProgress.tag) {
    case HostComponent:
      // 创建 DOM 节点
      const instance = createInstance(workInProgress.type, newProps);
      // 将子节点挂载到当前节点
      appendAllChildren(instance, workInProgress);
      // 设置属性
      finalizeInitialChildren(instance, newProps);
      workInProgress.stateNode = instance;
      break;
    case HostText:
      // 创建文本节点
      const textInstance = createTextInstance(newProps);
      workInProgress.stateNode = textInstance;
      break;
    // 其他类型...
  }
}
```
#### 3. **reconcileChildren**
reconcileChildren 是 React 对 Fiber 节点的子节点进行处理的函数。它的主要职责是根据子节点的类型调用不同的处理逻辑。
### Commit 阶段
Commit 阶段的主要任务是将 Render 阶段生成的 DOM 树提交到页面上。这一阶段是同步的，不可中断。以下是 Commit 阶段的详细过程：

1. BeforeMutation
在 DOM 更新之前，React 会执行一些生命周期方法和副作用。

调用 getSnapshotBeforeUpdate 生命周期方法。

调度 useEffect 的清理函数。

2. Mutation
在 Mutation 阶段，React 会将生成的 DOM 节点插入到页面中，更新 DOM 树。

插入节点：将新创建的 DOM 节点插入到父节点中。

更新节点：更新已有 DOM 节点的属性和子节点。

删除节点：将不再需要的 DOM 节点从页面中移除。

commitMutationEffects 的核心逻辑：

```javascript 
function commitMutationEffects(root, renderPriority) {
  while (nextEffect !== null) {
    const effectTag = nextEffect.effectTag;
    if (effectTag & Placement) {
      // 插入节点
      commitPlacement(nextEffect);
    }
    if (effectTag & Update) {
      // 更新节点
      commitWork(nextEffect);
    }
    if (effectTag & Deletion) {
      // 删除节点
      commitDeletion(nextEffect);
    }
    nextEffect = nextEffect.nextEffect;
  }
}
```
3. Layout
在 DOM 更新之后，React 会执行一些生命周期方法和副作用。

调用 componentDidMount 和 componentDidUpdate 生命周期方法。

调度 useEffect 的回调函数。

commitLayoutEffects 的核心逻辑：

```javascript 
function commitLayoutEffects(root, renderPriority) {
  while (nextEffect !== null) {
    const effectTag = nextEffect.effectTag;
    if (effectTag & Update) {
      // 调用生命周期方法
      commitLifeCycles(root, nextEffect);
    }
    if (effectTag & Callback) {
      // 调度 useEffect 回调
      commitHookEffectListMount(nextEffect);
    }
    nextEffect = nextEffect.nextEffect;
  }
}
```

#### 总结
Render 阶段通过 beginWork 和 completeWork 构建 Fiber 树并生成 DOM 节点，Commit 阶段通过 commitMutationEffects 和 commitLayoutEffects 将 DOM 节点提交到页面。整个过程通过 Fiber 架构实现了高效的渲染和更新。

## 6. 更新与重渲染
当组件的状态或属性发生变化时，React 会重新生成虚拟 DOM 树，并通过 Diff 算法比较新旧虚拟 DOM 的差异，只更新发生变化的部分。这个过程称为协调（Reconciliation）。

### Diff 算法的关键点：
- 同级比较：React 会逐层比较虚拟 DOM 树，不会跨层级比较。
- Key 的作用：为列表项设置 key 可以帮助 React 识别哪些元素是新增、删除或移动的。

---

## 7. 总结
React 的渲染过程可以概括为以下步骤：
1. JSX 编译：JSX 被编译为 React.createElement 调用。
2. 生成虚拟 DOM：React.createElement 返回 React 元素，组成虚拟 DOM 树。
3. 渲染真实 DOM：ReactDOM 将虚拟 DOM 转换为真实 DOM 并挂载到页面。
4. 更新与优化：通过 Diff 算法高效更新 DOM。

通过虚拟 DOM，React 实现了高效的 UI 更新和渲染，提升了应用性能。