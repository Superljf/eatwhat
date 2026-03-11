# 吃什么 EatWhat

一款面向年轻人的「吃什么」随机选择 APP，解决选择困难症。

## 功能

- **转盘随机**：点击「开转！」随机选中一个餐点
- **添加餐点**：支持添加想吃的地方（如麦当劳、肯德基），区分午餐/晚餐
- **列表管理**：查看、编辑、左滑删除已添加的餐点
- **筛选**：按全部/午餐/晚餐筛选

## 技术栈

- React Native + Expo
- TypeScript
- Zustand（状态管理）
- AsyncStorage（本地持久化）
- Expo Router（路由）
- react-native-reanimated（转盘动画）
- expo-haptics（触觉反馈）
- expo-blur / expo-linear-gradient（年轻化 UI）

## 运行

```bash
npm install
npm start
```

然后按 `w` 启动 Web，按 `a` 启动 Android，或扫码用 Expo Go 在真机预览。

**详细说明**：参见 [运行指南.md](./运行指南.md)，包含环境准备、四种运行方式、常见问题等。

## 项目结构

```
app/           # Expo Router 页面
  (tabs)/      # Tab 导航（转盘、列表）
  add.tsx      # 添加/编辑餐点
src/
  components/  # RouletteWheel、MealItem
  stores/      # mealStore
  types/       # Meal 类型
  utils/       # storage
  constants/   # theme
```
