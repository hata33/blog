# 从 JS 文件到 DOM 渲染的过程

## 1. JS 文件解析阶段

### 1.1 词法分析
```javascript
// 源代码
function add(a, b) {
  return a + b;
}

// 词法分析后的 Token 流
[
  { type: 'Keyword', value: 'function' },
  { type: 'Identifier', value: 'add' },
  { type: 'Punctuator', value: '(' },
  { type: 'Identifier', value: 'a' },
  { type: 'Punctuator', value: ',' },
  { type: 'Identifier', value: 'b' },
  { type: 'Punctuator', value: ')' },
  // ...
]
```

### 1.2 语法分析
```javascript
// AST (抽象语法树) 示例
{
  "type": "Program",
  "body": [{
    "type": "FunctionDeclaration",
    "id": {
      "type": "Identifier",
      "name": "add"
    },
    "params": [
      {
        "type": "Identifier",
        "name": "a"
      },
      {
        "type": "Identifier",
        "name": "b"
      }
    ],
    "body": {
      "type": "BlockStatement",
      "body": [{
        "type": "ReturnStatement",
        "argument": {
          "type": "BinaryExpression",
          "operator": "+",
          "left": { "type": "Identifier", "name": "a" },
          "right": { "type": "Identifier", "name": "b" }
        }
      }]
    }
  }]
}
```

## 2. React 代码解析

### 2.1 JSX 转换
```jsx
// JSX 代码
function App() {
  return (
    <div className="app">
      <h1>Hello</h1>
    </div>
  );
}

// 转换后的代码
function App() {
  return React.createElement(
    'div',
    { className: 'app' },
    React.createElement('h1', null, 'Hello')
  );
}
```

### 2.2 虚拟 DOM 创建
```javascript
// 虚拟 DOM 结构
{
  type: 'div',
  props: {
    className: 'app',
    children: [{
      type: 'h1',
      props: {
        children: 'Hello'
      }
    }]
  }
}
```

## 3. React 渲染流程

### 3.1 Fiber 树构建
```javascript
// Fiber 节点结构
{
  type: 'div',
  key: null,
  stateNode: HTMLDivElement,
  child: FiberNode,      // 第一个子节点
  sibling: FiberNode,    // 下一个兄弟节点
  return: FiberNode,     // 父节点
  pendingProps: {},      // 新的 props
  memoizedProps: {},     // 旧的 props
  updateQueue: [],       // 更新队列
  memoizedState: {},     // 状态
  flags: 0,             // 副作用标记
  alternate: FiberNode   // 另一棵树的对应节点
}
```

### 3.2 调度过程
```javascript
// 任务优先级示例
const priorities = {
  ImmediatePriority: 1,    // 最高优先级，同步
  UserBlockingPriority: 2, // 用户交互
  NormalPriority: 3,       // 普通优先级
  LowPriority: 4,          // 低优先级
  IdlePriority: 5          // 空闲优先级
};

// 调度任务
function scheduleCallback(priority, callback) {
  const currentTime = getCurrentTime();
  const timeout = computeTimeout(priority);
  const expirationTime = currentTime + timeout;
  
  const newTask = {
    callback,
    priority,
    expirationTime,
    next: null
  };
  
  // 加入任务队列
  enqueueTask(newTask);
  // 开始调度
  requestHostCallback(flushWork);
}
```

### 3.3 Reconciliation 过程
```javascript
function reconcileChildFibers(returnFiber, currentFirstChild, newChild) {
  // 单个元素
  if (typeof newChild === 'object' && newChild !== null) {
    switch (newChild.$$typeof) {
      case REACT_ELEMENT_TYPE:
        return placeSingleChild(
          reconcileSingleElement(
            returnFiber,
            currentFirstChild,
            newChild
          )
        );
    }
  }
  
  // 多个子元素
  if (Array.isArray(newChild)) {
    return reconcileChildrenArray(
      returnFiber,
      currentFirstChild,
      newChild
    );
  }
  
  // 文本节点
  if (typeof newChild === 'string' || typeof newChild === 'number') {
    return reconcileSingleTextNode(
      returnFiber,
      currentFirstChild,
      '' + newChild
    );
  }
  
  // 删除旧节点
  return deleteRemainingChildren(returnFiber, currentFirstChild);
}
```

### 3.4 Commit 阶段
```javascript
function commitRoot(root) {
  const finishedWork = root.finishedWork;
  
  // 提交前的准备工作
  prepareForCommit(root.containerInfo);
  
  // 提交所有副作用
  let firstEffect;
  if (finishedWork.flags > PerformedWork) {
    if (finishedWork.lastEffect !== null) {
      finishedWork.lastEffect.nextEffect = finishedWork;
      firstEffect = finishedWork.firstEffect;
    } else {
      firstEffect = finishedWork;
    }
  } else {
    firstEffect = finishedWork.firstEffect;
  }
  
  // 三个阶段的提交
  // 1. before mutation
  commitBeforeMutationEffects(firstEffect);
  
  // 2. mutation
  commitMutationEffects(root, firstEffect);
  
  // 3. layout
  root.current = finishedWork;
  commitLayoutEffects(firstEffect, root);
}
```

## 4. DOM 操作

### 4.1 创建 DOM 节点
```javascript
function createInstance(type, props, rootContainerInstance) {
  const domElement = document.createElement(type);
  precacheFiberNode(domElement);
  updateFiberProps(domElement, props);
  return domElement;
}
```

### 4.2 属性更新
```javascript
function updateDOMProperties(domElement, updatePayload) {
  for (let i = 0; i < updatePayload.length; i += 2) {
    const propKey = updatePayload[i];
    const propValue = updatePayload[i + 1];
    
    if (propKey === STYLE) {
      updateStyles(domElement, propValue);
    } else if (propKey === CHILDREN) {
      setTextContent(domElement, propValue);
    } else {
      setProp(domElement, propKey, propValue);
    }
  }
}
```

### 4.3 事件绑定
```javascript
function listenToNativeEvent(
  domEventName,
  isCapturePhaseListener,
  target
) {
  let eventSystemFlags = 0;
  if (isCapturePhaseListener) {
    eventSystemFlags |= IS_CAPTURE_PHASE;
  }
  addTrappedEventListener(
    target,
    domEventName,
    eventSystemFlags,
    isCapturePhaseListener
  );
}
```

## 5. 性能优化

### 5.1 批量更新
```javascript
function batchedUpdates(fn) {
  const previousIsBatchingUpdates = isBatchingUpdates;
  isBatchingUpdates = true;
  try {
    return fn();
  } finally {
    isBatchingUpdates = previousIsBatchingUpdates;
    if (!isBatchingUpdates && !isRendering) {
      performSyncWork();
    }
  }
}
```

### 5.2 时间分片
```javascript
function workLoopConcurrent() {
  while (workInProgress !== null && !shouldYield()) {
    workInProgress = performUnitOfWork(workInProgress);
  }
}

function shouldYield() {
  const currentTime = getCurrentTime();
  return currentTime >= deadline;
}
```

### 5.3 优先级调度
```javascript
function ensureRootIsScheduled(root) {
  const nextLanes = getNextLanes(
    root,
    root === workInProgressRoot ? workInProgressRootRenderLanes : NoLanes
  );
  
  if (nextLanes === NoLanes) {
    return;
  }
  
  const schedulerPriority = lanesToSchedulerPriority(nextLanes);
  
  const newCallbackNode = scheduleCallback(
    schedulerPriority,
    performConcurrentWorkOnRoot.bind(null, root)
  );
  
  root.callbackNode = newCallbackNode;
}
``` 