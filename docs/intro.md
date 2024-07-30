---
sidebar_position: 1
---
# 自动化部署前端静态站点

### 使用github actions + github pages 实现

前端部署项目比较简单，通常将打包产物（index.html、.js、.css文件等）放在web 服务器下就ok，这种叫做静态资源托管，成本低，也有免费的静态资源托管方案，如：GitHub Pages、Gitee Pages、Vercel等。



### 具体步骤

1. 首先在项目里创建`.github`文件夹，然后创建`workflows`文件夹
2. 在`workflows`文件夹下创建一个`.yml`文件，任意名字都行，例如叫`deploy.yml`
3. 在刚才创建的`.yml`编写打包部署的代码

示例模板：

``` yaml
name: build to my blog-pages

on:
  push:
    branches:
      - main

permissions:
  contents: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v4.0.2
        with:
          node-version: 18.18.0
      - run: yarn install
      - name: Build
        run: yarn build
        
      - name: Deploy 🚀
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder:  build
```

逐行解释：

``` yaml
# 这段 GitHub Actions 配置文件用于在推送到 main 分支时自动构建和部署项目。
# 定义了这个 GitHub Actions 工作流程的名称。
name: build to my blog-pages

# 当代码被push推送到 main 分支时，触发这个工作流程。
on:
  push:
    branches:
      - main

# 设置工作流对内容的写入权限，以便能够部署到 GitHub Pages。
permissions:
  contents: write
  
# 定义了一个名为 deploy 的工作任务。
jobs:
  deploy:
    # 指定这个任务运行在最新版本的 Ubuntu 操作系统环境中。
    runs-on: ubuntu-latest
    # 定义了这个任务的步骤。
    steps:
      # 使用 actions/checkout v2 动作，从仓库中检出代码。
      - uses: actions/checkout@v2
      # 使用 actions/setup-node v4.0.2 动作，设置 Node.js 环境。
      - uses: actions/setup-node@v4.0.2
      # with: node-version: 18.18.0 指定 Node.js 版本为 18.18.0。
        with:
          node-version: 18.18.0
      # 运行 yarn install yarn build 命令，安装项目依赖。
      - run: yarn install
      # 定义一个步骤名称为 "Build"
      - name: Build
      # 运行 yarn build 命令，构建项目。
        run: yarn build
        
      # 定义一个步骤名称为 "Deploy 🚀"。
      - name: Deploy 🚀
        # 使用 JamesIves/github-pages-deploy-action 这个 action，将构建好的项目部署到 GitHub Pages。
        uses: JamesIves/github-pages-deploy-action@v4
        # 提供动作所需的配置参数
        with: 
          # 指定要部署的文件夹，这里是 build 文件夹，它是前面 yarn build 命令生成的。 
          folder:  build
```

其中使用了多个 Action 包含，及其简介参考链接：

[actions/checkout@v2](Checkout · Actions · GitHub Marketplace)


[setup-node](https://github.com/marketplace/actions/setup-node-js-environment)

[actions-gh-pages](https://github.com/marketplace/actions/github-pages-action)


参考链接：

github pages 简介：https://docs.github.com/zh/pages

github pages 简介：https://docs.github.com/zh/actions

参考博客：https://www.cnblogs.com/jiujiubashiyi/p/18151965