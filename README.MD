# 插件文档

使用主题 [vuepress-theme-vdoing](https://github.com/xugaoyi/vuepress-theme-vdoing)。

## 本地调试

构建并运行
```shell
yarn
# 如果是Linux运行
yarn dev
# 如果是Windows运行
yarn dev:win
```

## 平台构建命令

目前部署在 Cloudflare Pages 上面，构建命令如下
```shell
git fetch --unshallow origin main && npm run build
```
构建输出目录为 `docs/.vuepress/dist`
