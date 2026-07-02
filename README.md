# 手机计算器 App

一个无依赖的移动端计算器 Web App，可直接在手机浏览器中打开，也支持以 PWA 方式添加到主屏幕。

## 功能

- 加、减、乘、除基础运算
- 小数输入、百分号、正负号切换
- 手机优先的响应式界面
- 键盘输入支持
- Service Worker 离线缓存

## 本地运行

直接用任意静态文件服务器打开项目根目录即可，例如：

```bash
python3 -m http.server 8080
```

然后访问 `http://localhost:8080`。

## 测试

```bash
npm test
```

## Android 打包

项目使用 Capacitor 将 Web App 封装为 Android 应用。

```bash
npm run build:android
```

生成的调试安装包位于：

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

把 APK 发送到 Android 手机后，允许“安装未知来源应用”即可安装。iPhone/iOS 安装包需要 Apple 开发者证书和 macOS/Xcode 环境。
