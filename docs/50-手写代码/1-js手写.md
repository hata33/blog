### 1.数组去重、扁平、最值

#### 去重

```js
function uniqueArray(arr) {
  return [...new Set(arr)];
}
const array = [2, 3, 4, 4, 3, 2, 1];
const unique = uniqueArray(array);
console.log(unique); // 输出: [1, 2, 3, 4]
```

##### 根据对象 id 去重数组中对象的方法

```js
// 可以使用Map,Set,filter, forEach 组合一个判重逻辑，来实现去重
const array = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 1, name: "Alice" },
  { id: 3, name: "Charlie" },
];

const uniqueArray1 = Array.from(
  new Map(array.map((item) => [item.id, item])).values()
);

const uniqueArray2 = Array.from(
  new Set(array.map((item) => JSON.stringify(item)))
).map((item) => JSON.parse(item));

const uniqueArray3 = array.filter(
  (item, index, self) => index === self.findIndex((obj) => obj.id === item.id)
);

const uniqueArray4 = [];
array.forEach((item) => {
  if (!uniqueArray4.some((obj) => obj.id === item.id)) {
    uniqueArray4.push(item);
  }
});
```

#### 扁平

```js
const flat = (array) => {
  let result = [];
  for (let i = 0; i < array.length; i++) {
    if (Array.isArray(array[i])) {
      result = [...result, ...flat(array[i])];
    } else {
      result.push(array[i]);
    }
  }
  return result;
};
```

使用 reduce 简化

```js
const flat = (array) => {
  return array.reduce(
    (target, current) =>
      Array.isArray(current)
        ? target.concat(flat(current))
        : target.concat(current),
    []
  );
};
```

#### 最值

```js
array.reduce((c, n) => Math.max(c, n));

const array = [3, 2, 1, 4, 5];
Math.max.apply(null, array);
Math.max(...array);
```

根据指定深度扁平数组

```js
const flattenByDeep = (array, deep = 1) => {
  return array.reduce(
    (target, current) =>
      Array.isArray(current) && deep > 1
        ? target.concat(flat(current, deep - 1))
        : target.concat(current),
    []
  );
};
```

### 2. 防抖和节流

#### 防抖

##### 原理及使用场景

防抖函数的原理主要是通过控制函数的执行频率来减少不必要的调用。用于限制高频率事件（如输入、滚动、调整窗口大小等）对某个函数的调用。

原理：防抖函数接受一个函数和延迟时间。每当事件触发时，防抖函数会清除上一个计时器（clearTimeout），重新启动新的计时器。如果在延迟时间内没有再次触发事件，计时器到期后，传入的函数才会被执行。

```js
function debounce(fn, wait) {
  let timeout;
  return function () {
    const args = arguments;
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(function () {
      fn.apply(this, args);
    }, wait);
  };
}

// 使用示例
const myEfficientFn = debounce(function () {
  // 需要防抖执行的函数
  console.log("执行Function");
}, 250);
window.addEventListener("resize", myEfficientFn);
```

ts 版本

```ts
type Callback = (...args: any[]) => void;

const debounce = (fn: Callback, wait: number): Callback => {
  let timeout: NodeJS.Timeout | undefined;

  return function (...args: any[]) {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      fn.apply(this, args);
    }, wait);
  };
};
```

当你调用防抖函数返回的函数时，this 会指向调用它的上下文。如果你在某个对象的方法中使用防抖函数，this 会指向该对象。

如果你在防抖函数内部使用了箭头函数（如 setTimeout 中），箭头函数不会有自己的 this，它会从外部作用域继承 this。这通常是我们希望的行为，以保持上下文。

在 React 中自定义的 useDebounce 钩子实现，用于处理防抖逻辑

```js
import { useState, useEffect } from "react";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // 设置定时器
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 清除定时器
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
```

> 踩坑，在 react 中使用 lodash 的 debounce 函数不生效

原因及解决办法：

由于 debounce 函数在每次渲染时都被重新创建，导致它不持久化。为了解决这个问题，可以使用 useCallback 来确保防抖函数在组件的生命周期中保持一致。

示例：

```jsx
import React, { useCallback, useEffect } from "react";
import { debounce } from "lodash";

const DebouncedButton = () => {
  const handleClick = (message) => {
    console.log(message);
  };

  // 使用 useCallback 创建防抖函数
  const debouncedClick = useCallback(debounce(handleClick, 1000), []);

  useEffect(() => {
    return () => {
      debouncedClick.cancel(); // 清理防抖函数
    };
  }, [debouncedClick]);

  return (
    <button onClick={() => debouncedClick("Button clicked!")}>Click me</button>
  );
};

export default DebouncedButton;
```

#### 节流

节流（Throttling）是一种控制函数执行频率的技术，节流会定期执行函数，旨在限制某个函数在特定时间内的执行次数。

#### 原理及使用场景

节流会在设定的时间间隔内，只执行一次函数。例如，如果设定为每 1000 毫秒执行一次，那么在 1000 毫秒内，即使事件被触发多次，函数也只会被执行一次。

使用场景：

- 处理滚动事件（如无限滚动或滚动加载）。
- 处理窗口大小调整（resize）。
- 节制按钮点击、API 请求等高频操作。

实现：

```js
function throttle(fn, limit) {
  let lastCall = 0;
  return function () {
    const args = arguments;
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}

const myEfficientFn = throttle(function () {
  // 需要节流执行的函数
  console.log("执行节流函数");
}, 250);

window.addEventListener("scroll", myEfficientFn);
```

ts 版本

```js
function throttle<T extends (...args: any[]) => void>(fn: T, limit: number) {
    let lastCall: number | null = null;

    return function (...args: Parameters<T>) {
        const now = Date.now();
        if (lastCall === null || now - (lastCall as number) >= limit) {
            lastCall = now;
            fn.apply(this, args);
        }
    };
}

export default throttle;
```

useThrottle

```js
import { useState, useEffect, useCallback } from "react";

function useThrottle(value, delay) {
  const [throttledValue, setThrottledValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setThrottledValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return throttledValue;
}

export default useThrottle;
```

同样节流函数在 React 中也会面临每次渲染时被重新创建的问题，这可能会导致其不持久化，影响性能和预期行为。

使用示例：

```js
import React, { useCallback, useEffect } from "react";
import { throttle } from "lodash";

const ThrottledButton = () => {
  const handleClick = (message) => {
    console.log(message);
  };

  // 使用 useCallback 创建节流函数
  const throttledClick = useCallback(throttle(handleClick, 1000), []);

  useEffect(() => {
    return () => {
      throttledClick.cancel(); // 清理节流函数
    };
  }, [throttledClick]);

  return (
    <button onClick={() => throttledClick("Button clicked!")}>Click me</button>
  );
};

export default ThrottledButton;
```

### 3.深浅拷贝

#### 浅拷贝

浅拷贝可以通过扩展运算符（...）或者 Object.assign()方法来实现

```js
const obj = { a: 1 };
function shallowCopy(obj) {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }
  return Object.assign({}, obj);
}
const shallowCopeObj = { ...Obj };
```

#### 深拷贝

深拷贝：将一个对象从内存中完整的拷贝一份出来,从堆内存中开辟一个新的区域存放新对象,且修改新对象不会影响原对象

```js
const mapTag = "[object Map]";
const setTag = "[object Set]";
const arrayTag = "[object Array]";
const objectTag = "[object Object]";
const argsTag = "[object Arguments]";

const boolTag = "[object Boolean]";
const dateTag = "[object Date]";
const numberTag = "[object Number]";
const stringTag = "[object String]";
const symbolTag = "[object Symbol]";
const errorTag = "[object Error]";
const regexpTag = "[object RegExp]";
const funcTag = "[object Function]";

const deepTag = [mapTag, setTag, arrayTag, objectTag, argsTag];

function isObject(target) {
  const type = typeof target;
  return target !== null && (type === "object" || type === "function");
}

function getType(target) {
  return Object.prototype.toString.call(target);
}

function getInit(target) {
  const Ctor = target.constructor;
  return new Ctor();
}

function cloneSymbol(targe) {
  return Object(Symbol.prototype.valueOf.call(targe));
}

function cloneReg(targe) {
  const reFlags = /\w*$/;
  const result = new targe.constructor(targe.source, reFlags.exec(targe));
  result.lastIndex = targe.lastIndex;
  return result;
}

function cloneFunction(func) {
  const bodyReg = /(?<={)(.|\n)+(?=})/m;
  const paramReg = /(?<=\().+(?=\)\s+{)/;
  const funcString = func.toString();
  if (func.prototype) {
    const param = paramReg.exec(funcString);
    const body = bodyReg.exec(funcString);
    if (body) {
      if (param) {
        const paramArr = param[0].split(",");
        return new Function(...paramArr, body[0]);
      } else {
        return new Function(body[0]);
      }
    } else {
      return null;
    }
  } else {
    return eval(funcString);
  }
}

function cloneOtherType(targe, type) {
  const Ctor = targe.constructor;
  switch (type) {
    case boolTag:
    case numberTag:
    case stringTag:
    case errorTag:
    case dateTag:
      return new Ctor(targe);
    case regexpTag:
      return cloneReg(targe);
    case symbolTag:
      return cloneSymbol(targe);
    case funcTag:
      return cloneFunction(targe);
    default:
      return null;
  }
}

function deepCopy(target, hash = new WeakMap()) {
  // 克隆原始类型
  if (!isObject(target)) {
    return target;
  }

  // 初始化
  const type = getType(target);
  let cloneTarget;
  if (deepTag.includes(type)) {
    cloneTarget = getInit(target, type);
  } else {
    return cloneOtherType(target, type);
  }

  // 防止循环引用
  if (map.get(target)) {
    return target;
  }
  map.set(target, cloneTarget);

  // 克隆 set
  if (type === setTag) {
    target.forEach((value) => {
      cloneTarget.add(deepClone(value));
    });
    return cloneTarget;
  }

  // 克隆map
  if (type === mapTag) {
    target.forEach((value, key) => {
      cloneTarget.set(key, deepClone(value));
    });
    return cloneTarget;
  }

  // 克隆对象和数组
  if (type === objectTag) {
    const cloneTarget = {};
    const keys = Object.keys(target);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      cloneTarget[i] = deepClone(target[key], map);
    }
    return cloneTarget;
  }

  // 克隆数组
  if (type === arrayTag) {
    const cloneTarget = [];
    for (let i = 0; i < target.length; i++) {
      cloneTarget[i] = deepClone(target[i], map);
    }
    return cloneTarget;
  }
}
```
