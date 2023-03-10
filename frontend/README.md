## 项目简介

> 博客前端工程，基于 vue2.6 + typescript

## 系统启动

### 本地环境开发

常规端口：8080，ssr 端口：3000

```bash
npm run dev
```

### 生产环境打包

windows 环境打包

```bash
npm run build
```

linux 环境打包

```bash
npm run build:linux
```

## 功能清单

- [x] 个人中心
  - [x] 注册(QQ 邮箱)
  - [x] 登录
- [x] 文章模块
  - [x] 发布
  - [x] 修改
  - [x] 删除
  - [x] 评论
  - [x] 标签分类
  - [x] 推荐首页
- [x] 照片墙模块
  - [x] 上传
  - [x] 点赞
  - [x] 删除

## 系统优化

- [x] SSR
- [x] 公共静态资源分离，CDN 加速

## 更新记录

### 2020-04-01

1. 完成域名管局、公安备案，域名解析等，底部栏添加备案号。

2. 静态资源，图片等资源推到 七牛云 CDN 加速

### 2020-03 以前

完成系统页面的开发，完成功能测试。
