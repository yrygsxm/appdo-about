# APPDO About

APPDO「关于我们」独立站，保留原页面的三语言内容、深浅主题、品牌生态、产品矩阵、合作品牌与商务联系模块。

## 最近更新

- 2026-07-29：在本地分支 `codex/blue-hero-local` 为首屏加入蓝色 Canvas2D 点阵与 WebGL 流体光带；生产分支保持不变。
- 2026-07-24：优化首屏资源加载、产品卡片指针事件及屏幕外动画调度，并为合作模块加入延迟加载的联系贴纸。
- 完整说明：[docs/更新说明-2026-07-24.md](docs/更新说明-2026-07-24.md)

## 本地运行

```bash
npm install
npm run dev
```

访问 `http://localhost:3000`。

## 构建

```bash
npm run build
```

项目使用 Next.js 静态导出，构建产物位于 `out/`，可直接部署到 Cloudflare Pages。

## Cloudflare Pages

- 构建命令：`npm run build`
- 输出目录：`out`
- Node.js：20 或更高版本

## 联系

- 网站：https://appdo.xyz
- Telegram：https://t.me/AppDoDo
- X：https://x.com/APPDOTG
- 邮箱：pr@appdo.xyz
