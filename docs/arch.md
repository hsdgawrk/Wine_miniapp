# 调酒小程序架构文档

## 项目概览

这是一个基于微信小程序框架开发的调酒配方管理应用，主要功能包括配方展示、制作步骤指导、配方添加和分享功能。

### 核心特性
- 📱 原生微信小程序
- 🍸 鸡尾酒配方管理
- 📝 分步骤制作指导
- 🔍 配方搜索功能
- ➕ 自定义配方添加
- 📤 配方分享功能
- 🎨 现代化玻璃拟态UI设计

## 技术架构

### 技术栈
- **框架**: 微信小程序原生框架
- **样式**: WXSS (类CSS语法)
- **逻辑**: JavaScript ES6+
- **模板**: WXML (类HTML语法)
- **配置**: JSON配置文件

### 架构模式
- **MVC模式**: 页面级的Model-View-Controller架构
- **组件化**: 基于页面的组件化开发
- **数据驱动**: 使用setData进行数据绑定和视图更新

## 页面结构

### 页面层级关系
```
主页 (index)
├── 配方详情页 (cocktail-detail)
│   ├── 制作步骤页 (steps)
│   └── 分享页 (share)
└── 添加配方页 (add-cocktail)
```

### 页面功能详解

#### 1. 主页 (pages/index/)
**功能**: 应用入口，展示配方列表和搜索功能
- **数据结构**:
  ```javascript
  {
    randomCocktail: Object,      // 每日推荐
    searchQuery: String,         // 搜索关键词
    cocktails: Array,           // 全部配方
    filteredCocktails: Array    // 过滤后的配方
  }
  ```
- **核心功能**:
  - 配方搜索和过滤
  - 配方列表展示
  - 导航到详情页和添加页

#### 2. 配方详情页 (pages/cocktail-detail/)
**功能**: 展示单个配方的详细信息
- **数据结构**:
  ```javascript
  {
    cocktail: {
      name: String,        // 配方名称
      description: String, // 配方描述
      history: String     // 历史背景
    },
    steps: Array          // 制作步骤
  }
  ```
- **核心功能**:
  - 接收URL参数获取配方信息
  - 导航到制作步骤页
  - 导航到分享页

#### 3. 制作步骤页 (pages/steps/)
**功能**: 分步骤展示制作过程
- **数据结构**:
  ```javascript
  {
    steps: [{
      number: Number,      // 步骤编号
      instruction: String, // 步骤说明
      animation: String   // 动画类型
    }]
  }
  ```
- **核心功能**:
  - 步骤列表展示
  - 动画效果展示

#### 4. 添加配方页 (pages/add-cocktail/)
**功能**: 用户自定义添加新配方
- **数据结构**:
  ```javascript
  {
    cocktailName: String,        // 配方名称
    cocktailDescription: String, // 配方描述
    steps: [{
      number: Number,
      instruction: String,
      animation: String
    }]
  }
  ```
- **核心功能**:
  - 配方信息表单
  - 动态步骤管理
  - 表单验证和保存

#### 5. 分享页 (pages/share/)
**功能**: 配方分享功能
- **数据结构**:
  ```javascript
  {
    shareCode: String,      // 分享口令
    shareImageUrl: String,  // 二维码图片
    showCode: Boolean,      // 显示口令
    showQrCode: Boolean    // 显示二维码
  }
  ```
- **核心功能**:
  - 口令分享
  - 二维码分享
  - 分享方式切换

## 数据架构

### 全局数据 (app.js)
```javascript
globalData: {
  cocktails: [
    { name: String, description: String }
  ]
}
```

### 数据流向
1. **应用启动** → 全局数据初始化
2. **主页加载** → 从全局数据获取配方列表
3. **搜索操作** → 本地数据过滤
4. **页面跳转** → URL参数传递
5. **配方添加** → 本地数据更新（待实现持久化）

## 文件组织结构

```
Wine_miniapp/
├── app.js                 # 全局应用逻辑
├── app.json              # 全局配置文件
├── app.wxss              # 全局样式文件
├── project.config.json   # 项目配置
└── pages/                # 页面目录
    ├── index/            # 主页
    │   ├── index.js      # 页面逻辑
    │   ├── index.json    # 页面配置
    │   ├── index.wxml    # 页面结构
    │   └── index.wxss    # 页面样式
    ├── cocktail-detail/  # 配方详情页
    ├── steps/            # 制作步骤页
    ├── add-cocktail/     # 添加配方页
    └── share/            # 分享页
```

## 核心功能实现

### 1. 配方搜索
```javascript
onSearch(e) {
  const query = e.detail.value.toLowerCase();
  const filtered = this.data.cocktails.filter(cocktail => 
    cocktail.name.toLowerCase().includes(query) || 
    cocktail.description.toLowerCase().includes(query)
  );
  this.setData({ 
    searchQuery: query,
    filteredCocktails: filtered
  });
}
```

### 2. 页面导航
```javascript
// 带参数导航
navigateToCocktailDetail(e) {
  const name = e.currentTarget.dataset.name;
  wx.navigateTo({
    url: `/pages/cocktail-detail/cocktail-detail?name=${name}`
  });
}
```

### 3. 动态步骤管理
```javascript
addStep() {
  const newStep = { 
    number: this.data.steps.length + 1, 
    instruction: '', 
    animation: 'fadeIn'
  };
  this.setData({
    steps: [...this.data.steps, newStep]
  });
}
```

## UI/UX 设计特色

### 设计系统
- **色彩方案**: 渐变蓝紫色主题 (#667eea → #764ba2)
- **设计风格**: 玻璃拟态 (Glassmorphism)
- **交互效果**: 流畅的过渡动画和微交互
- **视觉层次**: 卡片式布局和深度阴影

### 响应式交互
- 按钮点击反馈
- 悬浮状态变化
- 页面切换动画
- 表单输入焦点效果

## 开发指南

### 环境要求
- 微信开发者工具
- 微信小程序开发者账号
- Node.js (可选，用于构建工具)

### 开发流程
1. 使用微信开发者工具打开项目
2. 预览和调试页面功能
3. 真机测试
4. 代码审核和发布

### 扩展建议
1. **数据持久化**: 集成云开发或本地存储
2. **用户系统**: 添加用户登录和个人中心
3. **社交功能**: 完善分享和收藏功能
4. **AI集成**: 添加智能推荐算法
5. **多媒体**: 支持视频教程和语音指导

## 性能优化

### 当前优化点
- 按需加载页面
- 图片懒加载占位
- 动画性能优化
- 减少setData调用频率

### 待优化项
- 数据缓存机制
- 图片压缩和CDN
- 分包加载策略
- 网络请求优化

## 维护说明

### 代码规范
- 使用ES6+语法
- 统一的命名规范
- 模块化组织代码
- 注释和文档完整

### 版本管理
- 功能分支开发
- 代码审查流程
- 自动化测试
- 持续集成部署

---

**文档版本**: v1.0  
**更新时间**: 2025-06-24  
**维护者**: 开发团队
