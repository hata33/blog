# 异步函数

异步函数，也称为“async/await”（语法关键字）

## why

让以同步方式写的代码能够同步执行，使代码更加直观和易读，避免了嵌套回调和复杂的 Promise 链式调用，以及使错误处理更简洁，可以使用`try/catch`语句处理错误。

## what

async/await 是 JavaScript 中处理异步操作的语法糖，它们的实现依赖于生成器和迭代器。async 用来声明一个异步函数，而 await 用于暂停该函数的执行，等待异步操作完成并返回结果。通过这种方式，async/await 提供了一种更简洁和可读的方式来处理异步代码。

## how

实现 async/await

首先，生成器函数与迭代器的结合，为 `async/await` 的实现提供了基础。
生成器:是一种可以在执行过程中暂停和恢复的函数。生成器函数使用 `function`\* 声明，并使用 `yield` 关键字来暂停函数的执行。

迭代器:是一个对象，它实现了一个 `next()` 方法，该方法返回一个形如 `{ value: any, done: boolean }` 的对象。

在处理异步时，生成器函数可以在执行过程中暂停 (yield) 并恢复（next()），可以在异步操作完成后恢复执行。使用生成器函数，可以更容易地管理异步操作的执行顺序和控制流。

实现思路：

1. 使用生成器函数与迭代器结合用来组织异步函数。

```js
function* testG() {
  // await被编译成了yield
  const data = yield getData();
  console.log("data: ", data);
  const data2 = yield getData();
  console.log("data2: ", data2);
  return "success";
}
```

2. 编写自动执行的函数，让 generator 函数实现 async 函数的功能。

```js
function GeneratorToAsync(genFunc) {
  return function () {
    const gen = genFunc.apply(this, arguments);
    return new Promise((resolve, reject) => {
      function step(key, arg) {
        let generatorResult;
        try {
          generatorResult = gen[key](arg);
        } catch (error) {
          return reject(error);
        }
        const { value, done } = generatorResult;
        if (done) {
          return resolve(value);
        } else {
          return Promise.resolve(value).then(
            (val) => step("next", val),
            (err) => step("throw", err)
          );
        }
      }
      step("next");
    });
  };
}
```

async/await 背后的实现

实际上，async/await 就是基于生成器和迭代器模式的一种更高级的抽象。JavaScript 引擎在遇到 async 函数时，会将其转换为生成器函数，并使用类似上面的机制来处理 await 表达式，从而实现异步操作的暂停和恢复。
