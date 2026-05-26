# 调酒小程序架构文档

## 项目概览

这是一个基于微信小程序框架开发的调酒配方管理应用，主要功能包括配方展示、制作步骤指导、配方添加和单条自定义配方导入导出。

### 核心特性
- 📱 原生微信小程序
- 🍸 鸡尾酒配方管理
- 📝 分步骤制作指导
- 🔍 配方搜索功能
- ➕ 自定义配方添加
- 📤 单条自定义配方导入导出
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

### 底部 Tab
- 首页 (pages/index/index): 浏览、搜索和每日推荐
- 添加 (pages/add-cocktail/add-cocktail): 创建自定义配方
- 我的 (pages/mine/mine，待新增): 本机数据、导入导出、设置和未来账号入口

### 页面层级关系
```
主页 (index)
├── 配方详情页 (cocktail-detail)
│   └── 制作步骤页 (steps)
├── 添加配方页 (add-cocktail)
└── 我的页 (mine，待新增)
    └── 导入导出页 (share，待改造或改名)
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
  - 为自定义配方提供导出入口，内置配方不显示导出入口

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
**功能**: 用户创建或编辑自定义配方
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
  - 复用同一套配方信息表单支持添加模式和编辑模式
  - 动态步骤管理
  - 表单验证和保存

#### 5. 我的页 (pages/mine/，待新增)
**功能**: 本机个人空间，承载导入导出、设置和未来账号入口等二级功能；当前不展示账号、头像、登录态或未登录提示
- **核心功能**:
  - 展示本机自定义配方数量等本地概览
  - 提供配方导入入口
  - 提供自定义配方管理入口，支持创建、查看、编辑、单条删除和批量删除自定义配方
  - 自定义配方管理列表默认按最近修改时间倒序展示，最后编辑的配方排在最前面
  - 自定义配方管理列表后续支持按修改时间排序和按名称拼音排序
  - 自定义配方管理列表支持搜索，搜索范围包括名称、简介、分类、难度和成分，但只搜索自定义配方
  - 批量删除采用购物车式管理模式：进入管理后多选配方，支持全选/取消全选，底部显示“删除所选”操作
  - 删除自定义配方前必须二次确认，删除后不提供回收站或恢复
  - 提供设置、数据管理和未来账号能力入口

#### 6. 导入导出页 (pages/share/，待改造或改名)
**功能**: 单条自定义配方导入导出
- **数据结构**:
  ```javascript
  {
    importCode: String,     // 配方导入码
    importText: String,     // 用户粘贴的导入内容
    importPreview: Object,  // 校验后的导入预览
    targetName: String,     // 导入后名称
    error: String           // 导入导出错误提示
  }
  ```
- **核心功能**:
  - 从自定义配方详情页进入后，将当前自定义配方导出为配方导入码
  - V1 配方导入码采用 `COCKTAIL_V1:<Base64(JSON)>` 编码，JSON 使用 `name`、`description`、`category`、`difficulty`、`time`、`ingredients`、`steps` 等可读字段名
  - 以复制和粘贴文本的方式传递配方导入码
  - 导出后展示配方导入码，并提供复制按钮；导入码过长时应折叠或放入可滚动文本区域
  - 从我的页进入后，粘贴文本形式的配方导入码并校验
  - 导入时提供手动粘贴文本框和“从剪贴板读取”按钮；剪贴板读取失败或未授权时保留手动粘贴兜底
  - 导入内容校验复用添加配方草稿校验口径，名称长度统一为 20 个字符，成分和步骤都最多 30 个
  - 校验通过后展示导入预览，由用户确认后保存
  - 重名时在导入预览阶段提醒用户改名
  - 导入码中的制作步骤只传递步骤说明文本，编号和动画由本机规则生成

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
4. **页面跳转** → 通过配方 ID 优先传递配方身份，名称仅用于展示和兼容入口
5. **配方添加** → 添加配方草稿校验后保存为自定义配方，并通过本地存储持久化
6. **进入我的** → 用户从底部 Tab 进入本机个人空间，访问导入导出和设置类二级功能
7. **配方编辑** → 复用添加配方页的编辑模式加载自定义配方，校验后保存修改，成功后返回该配方详情页
8. **自定义配方管理** → 用户创建、查看、编辑、单条删除或批量删除当前设备上的自定义配方；新增、导入和编辑都不应产生与内置配方或自定义配方重名的配方，导入重名时建议递增名称，新增和编辑重名时提示用户修改，删除前必须二次确认；批量删除确认时显示所选数量；从详情页删除后回到我的页自定义配方管理列表，从列表删除后留在列表并刷新
9. **配方导出** → 配方库把单条自定义配方转换为 `COCKTAIL_V1:<Base64(JSON)>` 格式的文本配方导入码
10. **配方导入** → 用户手动粘贴或从剪贴板读取文本配方导入码，按添加配方草稿的校验口径校验后生成导入预览
11. **确认导入** → 保存为当前设备上的自定义配方且不覆盖已有配方
12. **导入完成** → 跳转到新导入的自定义配方详情页，便于用户核对、制作或继续编辑
13. **应用重启** → 配方库读取自定义配方并与内置配方合并

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
    ├── mine/             # 我的页（待新增）
    └── share/            # 导入导出页（待改造或改名）
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
1. **数据持久化**: 当前以本地存储为主，后续如需云同步应重新评估云开发 Adapter
2. **用户系统**: 未来如需云同步，再在我的页中评估用户登录和账号资料
3. **社交功能**: 在文本配方导入导出之外，另行评估好友关系、公开页面、二维码、小程序码或云端链接；不考虑文件形式导入导出
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
