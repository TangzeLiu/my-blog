# Git 常用操作详解

> 配合本项目（BlogWeb）的实际使用场景整理。命令都在 Git Bash 中执行。

---

## 一、心智模型：四个区域

理解 Git，先记住文件会在这四个区域之间流动：

```
工作区  --git add-->  暂存区  --git commit-->  本地仓库  --git push-->  远程仓库
（你改的文件）        （待提交清单）      （本机提交历史）      （GitHub）

            <--git pull / git fetch--（把远程的更新拉回来）
```

| 区域 | 是什么 | 在哪 |
|---|---|---|
| **工作区** | 你正在编辑的文件 | 项目文件夹本身 |
| **暂存区** | 挑出来、准备这次提交的文件 | `.git/index` |
| **本地仓库** | 已完成的提交历史 | `.git/` |
| **远程仓库** | GitHub 上的备份 | github.com |

**关键理解**：`commit` 不是"保存文件"，而是"给当前这批改动拍一张快照，永久记进历史"。所以改完文件后，必须先 `add` 再 `commit`。

---

## 二、日常生活：三步曲

改完代码后，**永远只有这三步**：

```bash
git status              # ① 先看：我改了什么？
git add <文件>          # ② 挑出要提交的文件
git commit -m "说明"    # ③ 提交（拍快照）
git push                # ④ 推送到 GitHub
```

### 第 1 步 `git status` —— 最重要的一条命令

养成习惯：**动手前先 status**。它会告诉你：

- 哪些文件**被修改了**（modified）
- 哪些是**新增的、还没被 Git 管理**（untracked）
- 哪些已经**放进暂存区**（staged，绿色）
- 当前在哪个分支、和远程差多少

### 第 2 步 `git add` —— 把改动放进暂存区

```bash
git add .                       # 把当前目录下所有改动都加入（最常用）
git add posts/hello-world.md    # 只加某几个文件
git add posts/                  # 只加某个目录
git add -A                      # 包括删除的文件，全部加入
```

> `git add .` 很方便，但**提交前一定用 `git status` 确认**没有把不该提交的文件加进去。

### 第 3 步 `git commit` —— 生成一次提交

```bash
git commit -m "post: 新增机器学习回归笔记"
```

> 说明写得清楚，将来才能查历史。推荐前缀：
> `feat:` 新功能 · `fix:` 修 bug · `post:` 新文章 · `docs:` 文档 · `style:` 样式

如果改了好几个文件又懒得分开 add，可以一条命令搞定（**跳过一次 add**）：

```bash
git commit -am "说明"     # 注意：只对"已跟踪"的文件生效，新增文件仍需先 add
```

### 第 4 步 `git push` —— 推送到 GitHub

```bash
git push                # 首次之后，直接 push 即可（已记住 origin main）
git push -u origin main # 第一次推送时需要这样写
```

---

## 三、查看类命令

```bash
git status              # 当前状态（工作区 + 暂存区）
git diff                # 看"工作区 vs 暂存区"的具体改动内容
git diff --stat         # 只看改动的统计（哪些文件、增删多少行）
git diff --staged       # 看"暂存区 vs 上次提交"的改动
git log                 # 提交历史（详细）
git log --oneline       # 提交历史（一行一条，清爽）
git log --oneline -5    # 只看最近 5 条
git show <提交号>        # 看某次提交改了什么
```

---

## 四、撤销 / 后悔药（按"后悔程度"排列）

### 1. 改乱了想还原这个文件（还没 add）
```bash
git restore posts/hello-world.md      # 丢弃工作区改动，恢复成上次提交的样子
```
⚠️ 这会**永久丢失**你未提交的修改，慎用。

### 2. 不小心 add 了，想从暂存区拿出来（但保留修改）
```bash
git restore --staged posts/hello-world.md
```
只是"取消暂存"，文件内容不动，重新变回"已修改未暂存"。

### 3. 提交信息写错了（还没 push）
```bash
git commit --amend -m "新的说明"
```
`--amend` 会把**这次提交替换掉**（不会新增一条）。

### 4. 想临时收起来，先去干别的
```bash
git stash              # 把当前未提交的改动收进抽屉
git stash list         # 看抽屉里有啥
git stash pop          # 拿出来并删除记录
git stash apply        # 拿出来但保留记录
```

### 5. 提交错了想回退
```bash
git revert <提交号>     # 生成一条"反向提交"来抵消，安全，推荐（尤其是已 push 的）
git reset --soft HEAD~1 # 撤销最近 1 次提交，改动回到暂存区（本地未 push 时用）
git reset --hard HEAD~1 # 撤销最近 1 次提交，改动彻底丢弃（危险！）
```

> 口诀：**已 push 的用 revert，只在本地没推的可以用 reset。**

---

## 五、分支（了解即可，本博客用不太到）

```bash
git branch                  # 看所有分支，* 号是当前分支
git branch 新分支名          # 新建分支
git switch 分支名            # 切换分支（旧写法 git checkout 分支名）
git switch -c 新分支名       # 新建并立即切换
git merge 分支名             # 把某分支合并进当前分支
git branch -d 分支名         # 删除分支
```

典型用途：想大改又怕搞坏，就开个分支折腾，满意了再合并回 `main`。

---

## 六、和远程仓库相关

```bash
git remote -v                              # 看远程地址
git remote add origin <地址>                # 关联远程（第一次）
git remote set-url origin <新地址>          # 修改远程地址（改了仓库名后用）
git fetch                                  # 只下载远程更新，不合并（安全）
git pull                                   # 下载并合并到当前分支
git push                                   # 推送本地提交
git push -u origin main                    # 首次推送并建立跟踪关系
```

> `fetch` 和 `pull` 的区别：`fetch` 只"看看远程有啥"，`pull` = `fetch` + `merge`（直接改你的代码）。

---

## 七、本项目的完整日常流程

以这个博客为例，每次写完文章要做的就是：

```bash
cd "D:/刘唐泽/自我提升系列/计算机/BlogWeb"

node scripts/build-index.js     # 0) 生成文章索引（非 git 命令，但每次都要跑）

git status                      # 1) 看看改了哪些文件
git add .                       # 2) 全部加入暂存区
git commit -m "post: 新增《XXX》一文"   # 3) 提交
git push                        # 4) 推送到 GitHub（记得开着代理软件！）
```

推送后 GitHub Pages 会在 1~2 分钟内自动重新部署。

---

## 八、常见坑

| 现象 | 原因 / 解决 |
|---|---|
| `Please tell me who you are` | 没配身份，执行 `git config --global user.name/email` |
| `Recv failure: Connection was reset` | 代理没开，确认代理软件运行中（本项目走 127.0.0.1:7890） |
| `nothing to commit` | 没有改动，或忘了先 `git add` |
| 提交里混进了不想传的文件 | 加进 `.gitignore`，再用 `git rm --cached <文件>` 停止跟踪 |
| `failed to push some refs` | 远程有你本地没有的提交，先 `git pull --rebase` 再 push |
| 想忽略的文件已经被跟踪了 | 光写 `.gitignore` 没用，要 `git rm --cached <文件>` 取消跟踪 |

---

## 九、一页速查

```bash
# 看
git status                  # 状态
git diff                    # 具体改了什么
git log --oneline -10       # 最近 10 条历史

# 提交
git add .                   # 加入暂存区
git commit -m "说明"         # 提交
git push                    # 推送

# 撤销
git restore <文件>                    # 丢弃未提交的改动
git restore --staged <文件>           # 取消暂存
git commit --amend -m "新说明"        # 改上次的提交信息
git stash / git stash pop            # 暂存与恢复
git revert <提交号>                   # 安全回退（已推送的用这个）
```
