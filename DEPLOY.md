# 部署到 GitHub Pages · 完整命令清单

> 适用环境：Windows + Git Bash（或 PowerShell / CMD 均可）。
> 把命令中的 `<你的用户名>` 和 `my-blog` 替换成你自己的即可。

---

## 0. 前置检查

```bash
git --version                      # 确认 Git 已安装，能看到版本号即可
```

准备好两样东西：
- 已在 GitHub 创建一个**空仓库**（不要勾 Add a README），拿到地址：
  `https://github.com/<你的用户名>/my-blog.git`
- 本机项目目录：`D:/刘唐泽/自我提升系列/计算机/BlogWeb`

---

## 1. 一次性配置（只需做一次）

> 你本机尚未配置，**必须先做这一步**，否则 commit 会报错。
> 邮箱建议用注册 GitHub 时用的那个。

```bash
git config --global user.name  "你的名字或昵称"
git config --global user.email "你的邮箱@example.com"

# 让中文文件名正常显示（Windows 建议）
git config --global core.quotepath false

# 检查是否配置成功
git config --global --list
```

---

## 2. 初始化本地仓库并提交

```bash
# 进入项目目录
cd "D:/刘唐泽/自我提升系列/计算机/BlogWeb"

# 初始化仓库
git init

# 先把所有文件加入暂存区
git add .

# 查看将要提交的文件（确认没有多余文件）
git status

# 提交
git commit -m "init: 初始化个人博客"
```

```bash
# 把默认分支改名为 main（与 GitHub 一致）
git branch -M main
```

---

## 3. 关联远程仓库

```bash
# 把 <你的用户名> 换成你的 GitHub 用户名
git remote add origin https://github.com/<你的用户名>/my-blog.git

# 确认远程地址已正确添加
git remote -v
```

---

## 4. 推送到 GitHub

```bash
git push -u origin main
```

首次推送会**弹出一个浏览器窗口让你登录 GitHub**（Git Credential Manager 自动处理），
登录授权后就会自动开始上传。看到 `branch 'main' set up to track ...` 即成功。

> 如果没弹窗、而是提示输入用户名密码：切记 **密码处不能填账号密码**，
> 要填 **Personal Access Token（PAT）**。生成方法见文末「常见报错」。

---

## 5. 开启 GitHub Pages

1. 打开仓库页面 → **Settings**
2. 左侧菜单找到 **Pages**
3. **Source** 选择 `Deploy from a branch`
4. **Branch** 选择 `main`，目录选 `/ (root)`
5. 点 **Save**
6. 等待 1~2 分钟，访问：
   `https://<你的用户名>.github.io/my-blog/`

---

## 6. 以后如何更新（日常流程）

每次写完新文章后，只需三步：

```bash
cd "D:/刘唐泽/自我提升系列/计算机/BlogWeb"

# 1) 生成文章索引（加了新 md 一定要跑）
node scripts/build-index.js

# 2) 提交
git add .
git commit -m "post: 新增一篇文章"

# 3) 推送
git push
```

推送后 GitHub Pages 会自动重新部署，一两分钟后线上即更新。

---

## 常见报错排查

### ① 提示 `Author identity unknown` / 要求配置邮箱
第 1 步没做或没生效，重新执行：
```bash
git config --global user.name  "你的名字"
git config --global user.email "你的邮箱@example.com"
```

### ② 提示 `Authentication failed` / 需要 Token
GitHub 已不支持账号密码推送。两种解决方式：

- **推荐**：让 Git Credential Manager 弹窗登录（首次 push 通常自动弹出）。
  若没弹，可执行一次 `git config --global credential.helper manager` 后再 push。
- **或用 PAT**：GitHub → 右上角头像 → `Settings` → `Developer settings`
  → `Personal access tokens` → `Tokens (classic)` → `Generate new token`
  → 勾选 `repo` 权限 → 生成后复制（只显示一次）。
  再 push 时：用户名填 GitHub 用户名，**密码处粘贴这个 Token**。

### ③ 提示 `remote origin already exists`
说明已经加过远程地址了，改成更新即可：
```bash
git remote set-url origin https://github.com/<你的用户名>/my-blog.git
```

### ④ 推送被拒：`failed to push some refs` / `non-fast-forward`
多半是创建仓库时勾了 README，远程有本地没有的提交。先合并再推：
```bash
git pull --rebase origin main
git push -u origin main
```

### ⑤ 中文显示成 `\346\226\207...` 乱码
执行一次即可修复：
```bash
git config --global core.quotepath false
```

### ⑥ 网络超时 / 连接被重置
可先配置代理（把端口换成你自己的），或改用 SSH 方式：
```bash
# 生成密钥并添加公钥到 GitHub → Settings → SSH and GPG keys
ssh-keygen -t ed25519 -C "你的邮箱@example.com"

# 然后在关联远程时改用 SSH 地址
git remote set-url origin git@github.com:<你的用户名>/my-blog.git
```

---

完成以上步骤，你的博客就正式上线了 🎉
