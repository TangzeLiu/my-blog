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

> ⚠️ **注意别走错入口**：GitHub 有**两个 Settings**——
> ① 右上角头像 → `Settings`（账号级，里面的 Pages 只管绑定自定义域名，**不是**这里）；
> ② 仓库页面顶部标签栏的 `Settings`（仓库级，**要开网站用这个**）。
> 最省事：直接打开 `https://github.com/<你的用户名>/my-blog/settings/pages`

1. 打开仓库页面 → 点**仓库顶部标签栏**的 **Settings**（不是头像里的那个）
2. 左侧菜单在 **Code and automation** 分组下找到 **Pages**
3. **Build and deployment** 区块：
   - **Source** 选择 `Deploy from a branch`
   - **Branch** 选择 `main`，目录选 `/ (root)`
4. 点 **Save**
5. 等待 1~2 分钟，页面顶部会显示：
   `Your site is live at https://<你的用户名>.github.io/my-blog/`

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

## 7. 修改域名（可选）

分两种情况，先想清楚要哪种。

### 路线 A：改默认的 github.io 地址（免费）

默认地址结构是：`https://<用户名>.github.io/<仓库名>/`

- **只改 `/仓库名/` 那段**：仓库 → `Settings` → `General` → 最上方 **Repository name** 改名。
  改完记得同步本地远程地址：
  ```bash
  git remote set-url origin https://github.com/<用户名>/<新仓库名>.git
  ```
- **变成根地址（去掉后面的仓库名）**：把仓库名改成 `<用户名>.github.io`，
  例如 `TangzeLiu.github.io`。这是 GitHub 的「用户站点」特殊仓库，地址会变为
  `https://tangzeliu.github.io/`（根路径）。
- **`<用户名>` 那段**：属于账号级操作（头像 → `Settings` → `Account` → `Change username`），
  改动会导致所有仓库地址和旧链接失效，**慎用**。

### 路线 B：绑定自己的域名（需先买域名）

1. **买域名**：阿里云 / 腾讯云 / Cloudflare / Namecheap 等，几十元/年。
2. **填域名**：仓库 → `Settings` → `Pages` → **Custom domain** 填你的域名
   （apex 域名填 `example.com`，不要填 `www.example.com`）→ `Save`。
   保存后 GitHub 会自动在仓库根目录提交一个 `CNAME` 文件。
3. **配 DNS**：到域名商的 DNS 管理页添加记录：

   **根域名（example.com）—— 添加 4 条 A 记录：**

   | 类型 | 主机记录 | 记录值 |
   |---|---|---|
   | A | `@` | `185.199.108.153` |
   | A | `@` | `185.199.109.153` |
   | A | `@` | `185.199.110.153` |
   | A | `@` | `185.199.111.153` |

   **（可选）IPv6 —— 4 条 AAAA 记录：**
   `2606:50c0:8000::153` / `2606:50c0:8001::153` / `2606:50c0:8002::153` / `2606:50c0:8003::153`

   **想同时用 www.example.com —— 加 1 条 CNAME 记录：**

   | 类型 | 主机记录 | 记录值 |
   |---|---|---|
   | CNAME | `www` | `<用户名>.github.io` |

   > ⚠️ CNAME 的值**只填 `<用户名>.github.io`，不要带仓库名**；
   > 也**不要**用通配符 `*` 记录，存在域名被他人接管的风险。

4. **等待生效**：通常几分钟到几小时。可验证：
   ```bash
   dig example.com +noall +answer -t A
   # 应看到 185.199.108~111.153 这几条
   ```
5. **开启 HTTPS**：DNS 生效后回到 `Settings → Pages`，勾选 **Enforce HTTPS**。

> 修改域名后，博客代码里的链接都是相对路径，**无需改动任何页面代码**。
> 若提示「域名已被占用」，说明该域名曾被另一个仓库绑定，需先去那个仓库删除自定义域。

---

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

### ⑥ 网络超时 / `Recv failure: Connection was reset`
**现象**：`fatal: unable to access 'https://github.com/...': Recv failure: Connection was reset`
或 `Connection timed out`。这是本机直连 GitHub 被中断导致的，**与命令无关**。

**排查思路**：先看本机是否已经在跑代理（如 Clash / v2ray 等），再让 Git 走它。

```bash
# 1) 看看常见代理端口有没有在监听（7890 是 Clash 默认端口）
netstat -ano | grep LISTENING | grep -E ":(7890|7891|10809|1080)"

# 2) 用代理测试能否访问 GitHub（有返回 200 就说明代理可用）
curl -I -x http://127.0.0.1:7890 https://github.com
```

**解决**：把代理端口写成 Git 的代理配置（端口按你实际的填，Clash 通常是 7890）：

```bash
git config --global http.proxy  http://127.0.0.1:7890
git config --global https.proxy http://127.0.0.1:7890

# 验证一下（能列出分支即通）
git ls-remote --heads origin

# 然后重新推送
git push -u origin main
```

**注意**：代理关闭后 Git 会连不上，届时可临时取消代理：

```bash
git config --global --unset http.proxy
git config --global --unset https.proxy
```

**备选方案 · 改用 SSH**（若代理也不稳）：
```bash
# 生成密钥并添加公钥到 GitHub → Settings → SSH and GPG keys
ssh-keygen -t ed25519 -C "你的邮箱@example.com"

# 关联远程时改用 SSH 地址
git remote set-url origin git@github.com:<你的用户名>/my-blog.git
```

> 小技巧：GitHub 的 22 端口在部分网络下也会被拦，可改用 443 端口走 SSH：
> 在 `~/.ssh/config` 中加入
> ```
> Host github.com
>   HostName ssh.github.com
>   Port 443
>   User git
> ```

---

完成以上步骤，你的博客就正式上线了 🎉
