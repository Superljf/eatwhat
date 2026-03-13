# 本地 APK 打包与手机安装指南（Windows）

目标：先生成可安装的 `.apk`，再在你自己的 Android 手机上安装测试。  
适用于当前 Expo 项目（当前仓库还没有 `android` 原生目录）。

---

## 1. 前置准备

### 1.1 安装工具

- Node.js（建议 LTS）
- JDK 17
- Android Studio（安装 SDK、Platform-Tools、Build-Tools）

### 1.2 配置环境变量（Windows）

至少保证以下命令可用：

```powershell
java -version
adb version
```

如果 `adb` 不可用，把 `platform-tools` 路径加入 `Path`，例如：

`C:\Users\你的用户名\AppData\Local\Android\Sdk\platform-tools`

---

## 2. 生成 Android 原生工程（首次）

在项目根目录执行：

```powershell
npm install
npx expo prebuild -p android
```

执行后会出现 `android` 目录。

---

## 3. 打包 Release APK（本地）

进入 Android 工程目录并打包：

```powershell
cd android
.\gradlew.bat assembleRelease
```

打包成功后，APK 默认路径：

`android\app\build\outputs\apk\release\app-release.apk`

---

## 4. 手机安装 APK（两种方式）

## 方式 A：USB + ADB 安装（推荐）

1. 手机开启「开发者选项」和「USB 调试」
2. USB 连接电脑
3. 执行：

```powershell
adb devices
adb install -r "D:\2026Code\eatwhat\android\app\build\outputs\apk\release\app-release.apk"
```

说明：

- `-r` 表示覆盖安装（保留应用数据）

## 方式 B：手动拷贝安装

1. 把 `app-release.apk` 传到手机（微信/QQ/数据线/网盘）
2. 手机上点击安装
3. 若提示“禁止安装未知应用”，给当前文件管理器授权

---

## 5. 常见问题

## 5.1 `SDK location not found`

在 `android/local.properties` 写入 SDK 路径（示例）：

```properties
sdk.dir=C:\\Users\\你的用户名\\AppData\\Local\\Android\\Sdk
```

## 5.2 安装时报 `INSTALL_FAILED_VERSION_DOWNGRADE`

卸载旧包后重装：

```powershell
adb uninstall 你的包名
adb install "D:\2026Code\eatwhat\android\app\build\outputs\apk\release\app-release.apk"
```

## 5.3 打包太慢或失败

- 先执行 `.\gradlew.bat clean`
- 确认 JDK 17
- 关闭占用内存较高的软件后重试

---

## 6. 一键命令（从项目根目录）

```powershell
npm install
npx expo prebuild -p android
cd android
.\gradlew.bat assembleRelease
adb install -r "D:\2026Code\eatwhat\android\app\build\outputs\apk\release\app-release.apk"
```

---

如果你要，我下一步可以直接给你补一个 `package.json` 脚本（如 `npm run apk`），以后一条命令就能本地打包。
