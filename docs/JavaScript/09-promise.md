# Promise
## why
为了解决处理异步操作时，当有多个有顺序的异步操作时，会造成代码有多层嵌套回调，引发回调地狱的问题。代码可读性和可维护性差。
为什么有异步操作？
 JavaScript 在浏览器中是单线程运行的， 即只有一个线程负责执行所有的代码。
比传统的方式回调函数和事件相比的优点：
1. Promise 的链式调用避免了多层嵌套的问题，解决了回调地狱的问题，使代码更具可读性和维护性。
2. Promise 提供了统一的错误处理机制，通过 catch 方法捕获所有链式调用中的错误。
3. 通过Promise.all()Promise.race()等方法组合多个异步任务，提供了更强的并发能力。
4. 根据pending、fulfilled和rejected使异步状态管理清晰可控。
5. Promise链式调用代码结构线性直观，逻辑易于追踪和管理。
6. 与async/await结合，使异步代码看起来像同步代码，提升代码可读性和维护性。

## what
Promise 是异步编程的一种解决方案。简单来说是一个容器，包含了一个在未来会结束的事件的结果。
从语法上来说它是一个对象，可以捕获异步操作的消息。Promise 提供统一的 API，各种异步操作都可以用同样的方法进行处理。
有两个特点：
1. 对象的状态不受外界影响。Promise对象代表一个异步操作，有三种状态：pending（进行中）、fulfilled（已成功）和rejected（已失败）。
2. 一旦状态改变，就不能再发生变了。

## how
手写实现 promise
``` js
class myPromise {
  static PENDING = "pending";
  static FULFILLED = "fulfilled";
  static REJECTED = "rejected";

  constructor(func) {
    this.PromiseState = myPromise.PENDING;
    this.PromiseResult = null;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];
    try {
      func(this.resolve.bind(this), this.reject.bind(this));
    } catch (error) {
      this.reject(error);
    }
  }

  resolve(result) {
    if (this.PromiseState === myPromise.PENDING) {
      this.PromiseState = myPromise.FULFILLED;
      this.PromiseResult = result;
      while (this.onFulfilledCallbacks.length) {
        this.onFulfilledCallbacks.shift()(this.PromiseResult);
      }
    }
  }

  reject(reason) {
    if (this.PromiseState === myPromise.PENDING) {
      this.PromiseState = myPromise.REJECTED;
      this.PromiseResult = reason;
      while (this.onRejectedCallbacks.length) {
        this.onRejectedCallbacks.shift()(this.PromiseResult);
      }
    }
  }

  then(onFulfilled, onRejected) {
    let promise2 = new myPromise((resolve, reject) => {
      if (this.PromiseState === myPromise.FULFILLED) {
        setTimeout(() => {
          try {
            if (typeof onFulfilled !== "function") {
              resolve(this.PromiseResult);
            } else {
              let x = onFulfilled(this.PromiseResult);
              resolvePromise(promise2, x, resolve, reject);
            }
          } catch (e) {
            reject(e);
          }
        });
      } else if (this.PromiseState === myPromise.REJECTED) {
        setTimeout(() => {
          try {
            if (typeof onRejected !== "function") {
              reject(this.PromiseResult);
            } else {
              let x = onRejected(this.PromiseResult);
              resolvePromise(promise2, x, resolve, reject);
            }
          } catch (e) {
            reject(e);
          }
        });
      } else if (this.PromiseState === myPromise.PENDING) {
        this.onFulfilledCallbacks.push(() => {
          setTimeout(() => {
            try {
              if (typeof onFulfilled !== "function") {
                resolve(this.PromiseResult);
              } else {
                let x = onFulfilled(this.PromiseResult);
                resolvePromise(promise2, x, resolve, reject);
              }
            } catch (e) {
              reject(e);
            }
          });
        });
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              if (typeof onRejected !== "function") {
                reject(this.PromiseResult);
              } else {
                let x = onRejected(this.PromiseResult);
                resolvePromise(promise2, x, resolve, reject);
              }
            } catch (e) {
              reject(e);
            }
          });
        });
      }
    });

    return promise2;
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  if (x === promise2) {
    throw new TypeError("Chaining cycle detected for promise");
  }

  if (x instanceof myPromise) {
    x.then((y) => {
      resolvePromise(promise2, y, resolve, reject);
    }, reject);
  } else if (x !== null && (typeof x === "object" || typeof x === "function")) {
    try {
      var then = x.then;
    } catch (e) {
      return reject(e);
    }

    if (typeof then === "function") {
      let called = false;
      try {
        then.call(
          x,
          (y) => {
            if (called) return;
            called = true;
            resolvePromise(promise2, y, resolve, reject);
          },
          (r) => {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } catch (e) {
        if (called) return;
        called = true;

        reject(e);
      }
    } else {
      resolve(x);
    }
  } else {
    return resolve(x);
  }
}
```