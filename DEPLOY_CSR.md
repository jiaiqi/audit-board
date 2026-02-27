# CSR (纯客户端静态渲染) 部署指南

当前 Nuxt 3 项目由于已经在 `nuxt.config.ts` 中配置了 `ssr: false`，本质上是一个纯客户端单页应用 (SPA)。

但请注意，如果您执行 `pnpm build`，Nuxt 依然会打包出一个带有 Node.js 运行时的轻量服务（即 `node-server` 模式）。
为了实现脱离 Node.js、**完全依靠 Nginx 的纯静态 (CSR) 部署**，您需要遵循本指南使用 `generate` 命令。

---

## 一、 构建打包

1. 确保安装了最新依赖：
   ```bash
   pnpm install
   ```

2. 执行生成静态文件的打包命令：
   ```bash
   pnpm generate
   ```
   > ⚠️ **一定要用 `pnpm generate` 而不是 `pnpm build`**。 
   > 执行完成后，根目录会生成一个 `.output/public` 文件夹，这里面的所有内容就是我们要部署的纯 HTML/CSS/JS 静态文件。

---

## 二、 服务器部署 (Nginx 配置)

将 `.output/public` 里的所有文件上传到您的服务器目标目录中（例如 `/usr/share/nginx/html/board`）。

> **注意：前端存在 baseURL**
> 根据 `nuxt.config.ts`，当前项目的应用根路径（baseURL）被设置为了 `/board`。这意味着无论是访问网页还是获取资源，都会带有 `/board` 前缀。

请在 Nginx 的配置文件（如 `nginx.conf` 或 `conf.d/default.conf`）中添加如下代理：

```nginx
server {
    listen 80;
    server_name your_domain_or_ip;

    # 针对 /board 路径的配置
    location /board {
        # 将此处替换为您实际上传在服务器侧的具体路径
        alias /usr/share/nginx/html/board;
        index index.html;
        
        # SPA (单页应用) 路由刷新兜底策略：找不到对应的文件时返回 index.html
        try_files $uri $uri/ /board/index.html;
    }

    # （可选）如果有需要解决接口跨域，可以在这里使用反向代理
    # location /aud/select/ {
    #     proxy_pass http://30.61.1.21:180;
    #     proxy_set_header Host $host;
    #     proxy_set_header X-Real-IP $remote_addr;
    # }
}
```

修改完成后，重载 Nginx 以生效：
```bash
nginx -s reload
```

---

## 三、 动态修改后端接口（黑盒环境）

由于我们已采取 CSR 构建，Vue 代码被编译为了难以阅读的机器压缩码。
考虑到实施人员通常需要在部署现场动态调整对应的网络接口地址，我们在代码结构里为其保留了配置文件兜底支持：

1. 在您部署好的目录下，找到 `config.js` 文件 (例如 `/usr/share/nginx/html/board/config.js`)。
2. 直接用文本编辑器修改它即可，无需重新打包编译！
   
```javascript
// config.js 示例
window.__APP_CONFIG__ = {
  // 修改此处为您实际生产环境的后端服务根地址
  apiBase: 'http://30.61.1.21:180',
  // （可选）配置您的超时时间
  apiTimeout: 10000 
}
```

这套配置会在浏览器打开看板网页时被最先读取，因此它享有最高优先级，并会覆盖前端代码里原本写死的值。
