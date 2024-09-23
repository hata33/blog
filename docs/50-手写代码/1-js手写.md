### 1.数组去重

#### Set

```js
function uniqueArray(arr) {
  return [...new Set(arr)];
}
const array = [2, 3, 4, 4, 3, 2, 1];
const unique = uniqueArray(array);
console.log(unique); // 输出: [1, 2, 3, 4]
```
