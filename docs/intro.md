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
name: build to my github-pages

on:
  push:
    branches:
      - main

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
        
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v4
        with:
          deploy_key: ${{ secrets.ACTION_SECRET }}
          publish_dir: build
```

逐行解释：

``` yaml
# 这段 GitHub Actions 配置文件用于在推送到 main 分支时自动构建和部署项目。
# 定义了这个 GitHub Actions 工作流程的名称为 "github-pages"
name: build to my github-pages

# 当代码被push推送到 main 分支时，触发这个工作流程。
on:
  push:
    branches:
      - main

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
      # 运行 yarn install 命令，安装项目依赖。
      - run: yarn install
      # 定义一个步骤名称为 "Build"
      - name: Build
     	# 运行 yarn build 命令，构建项目。
        run: yarn build
        
      # 定义一个步骤名称为 "Deploy"
      - name: Deploy
      	# 使用 peaceiris/actions-gh-pages v4 动作，将构建的项目部署到 GitHub Pages
        uses: peaceiris/actions-gh-pages@v4
        # 提供动作所需的配置参数
        with:
          # 使用名为 ACTION_SECRET 的机密密钥进行部署
          deploy_key: ${{ secrets.ACTION_SECRET }}
          # 指定要发布的目录为 build，即构建输出的目录
          publish_dir: build
```

其中使用了多个 Action 包含，及其简介参考链接：

[actions/checkout@v2]([Checkout · Actions · GitHub Marketplace](https://github.com/marketplace/actions/checkout))

[setup-node](https://github.com/marketplace/actions/setup-node-js-environment)

[actions-gh-pages](https://github.com/marketplace/actions/github-pages-action)



参考链接：

github pages 简介：https://docs.github.com/zh/pages

github pages 简介：https://docs.github.com/zh/actions

参考博客：https://www.cnblogs.com/jiujiubashiyi/p/18151965