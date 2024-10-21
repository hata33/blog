# git

### branch

```git
git branch testing // 新增
git branch -d hotfix // 删除
git checkout testing // 切出
git checkout -b feat/sass-v1 origin/feat/sass-v1 // 克隆远端分支feat/sass-v1到本地
git checkout -b feat/saas-0817 // 从当前分支新建一个分支feat/saas-0817
git merge [branchName] // 将branchName合并到当前分支
git merge [branchName] --squash // 将branchName合并到当前分支，并将branchName上的所有提交合并成一次提交
git push origin -D [branchName] 删除远端分支
```

### rebase branch

[git pull --rebase 的正确使用](https://juejin.cn/post/6844903895160881166?searchId=2024102111574970A6EAF3D162C75C7553)

```git
git pull --rebase origin [branchName] = git fetch + git rebase
git pull --rebase origin [branchName] //命令的作用是从远程仓库拉取最新的提交，并通过 rebase 的方式把这些提交应用到当前分支上。
git rebase master
```

- 执行 `git pull --rebase` 的时候必须保持本地目录干净。即：不能存在状态为 `modified` 的文件。（存在`Untracked files`是没关系的）
- 如果出现冲突，可以选择手动解决冲突后继续 `rebase`，也可以放弃本次 `rebase`

多人基于同一个远程分支开发的时候，如果想要顺利 push 又不自动生成 merge commit，建议在每次提交都按照如下顺序操作：

```git
# 把本地发生改动的文件贮藏一下
$ git stash

# 把远程最新的 commit 以变基的方式同步到本地
$ git pull --rebase

# 把本地的 commit 推送到远程
$ git push

# 把本地贮藏的文件弹出，继续修改
$ git stash pop

```

### git stash

[Git - 贮藏与清理](https://git-scm.com/book/zh/v2/Git-%E5%B7%A5%E5%85%B7-%E8%B4%AE%E8%97%8F%E4%B8%8E%E6%B8%85%E7%90%86)

```git
git stash 贮藏代码
git stash pop 恢复到工作区和缓存区，会移除stashid
git stash list 查看当前贮藏区
git stash apply [stashname] // 恢复某一次的stash
git stash drop <stashname> // 删除某一次的stash
```

### commit

```git
git commit -m "msg" --no-verify 强制提交不检查
git commit --amend 修改上次的提交信息，push后不会增加新的commit记录，但是会修改本次的commithash(也可以理解为删掉了最新的一次commit，重新又提交了一次)

git push -f 强制提交代码并以本地版本代码为主覆盖远程
git push -f是不安全的，git push --force-with-lease更安全，注意--force-with-lease失败后再执行一次也会强制提交覆盖
```

### reset

```git
reset回退

git log 查看提交日志
git reset 将所有暂存区回退到工作区
git checkout . 丢弃工作区所有的更改
git reset --hard [commit hash] 将从commithash(不包括此hash)之后的丢弃
git reset --hard 将暂存区、工作区所有内容丢弃
git reset --soft [commit hash] 将从commithash(不包括此hash)之后的提交回退到暂存区
git reset --soft HEAD~4 回退最近4次提交到暂存区
```

### remote repositories

```git
git fetch <remote> // 这个命令会访问远程仓库，从中拉取所有你还没有的数据。
//省略了 <remote> 参数时，Git 默认会从配置中的所有远程仓库拉取数据

```

### rebase cherry-pick

[Git - 维护项目](https://git-scm.com/book/zh/v2/%e5%88%86%e5%b8%83%e5%bc%8f-Git-%e7%bb%b4%e6%8a%a4%e9%a1%b9%e7%9b%ae#_rebase_cherry_pick)

挑选工作流，来合并代码

`git cherry-pick`命令用来获得在单个提交中引入的变更，然后尝试将作为一个新的提交引入到你当前分支上。 从一个分支单独一个或者两个提交而不是合并整个分支的所有变更是非常有用的。

```plain
cherry-pick
```

### scope

feat: 新功能、新特性

fix: 修改 bug

perf: 更改代码，以提高性能（在不影响代码内部行为的前提下，对程序性能进行优化）

refactor: 代码重构（重构，在不影响代码内部行为、功能下的代码修改）

docs: 文档修改

style: 代码格式修改, 注意不是 css 修改（例如分号修改）

test: 测试用例新增、修改

build: 影响项目构建或依赖项修改

revert: 恢复上一次提交

ci: 持续集成相关文件修改

chore: 其他修改（不在上述类型中的修改）

release: 发布新版本

workflow: 工作流相关文件修改
