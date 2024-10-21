# tsconfig.json

tsconfig.json 是 TypeScript 项目的配置文件，放在项目的根目录。tsconfig.json 文件主要供 tsc 编译器使用，它的命令行参数--project 或-p 可以指定 tsconfig.json 的位置（目录或文件皆可）

## 一级属性

1. compilerOptions 定制编译行为
2. exclude 排除的文件
3. include 包含的文件
4. extends 继承另一个 tsconfig.json 文件的配置，或者继承已发布的 npm 模块里面的 tsconfig 文件。
5. files 编译的文件列表，推荐使用 include 和 exclude 属性
6. references 用于实现 TypeScript 的项目间引用，支持模块化开发

## compilerOptions

### target

指定 ECMAScript 目标版本，如 "ES6" 或 "ESNext"。

### module

指定模块系统，如 "commonjs"、"esnext" 等。

### strict

启用所有严格类型检查选项。

### baseUrl

设置模块解析的基础路径，通常用于相对路径导入，方便管理。

### paths

设置路径的映射关系，通常在开启了 webpack 的 resolve.alias 时需要进行设置

### allowJs

允许在 TypeScript 项目中使用 JavaScript 文件。

### jsx

设置 JSX 代码的处理方式为 React，适用于 React 项目。
