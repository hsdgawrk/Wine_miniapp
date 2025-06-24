# 🚀 快速图标生成提示词

## 直接复制使用的AI提示词

### 1. 首页图标（未激活） - tab-home.png
```
Generate a mobile app tab bar home icon, minimalist line style, gray color #666, thin 2px strokes, rounded corners, simple house outline with tiny cocktail glass detail, transparent background, 32x32px, clean professional design
```

### 2. 首页图标（激活） - tab-home-active.png  
```
Generate a mobile app tab bar home icon, filled style with blue-purple gradient #667eea to #764ba2, house symbol with cocktail glass element, transparent background, 32x32px, premium glass-morphism aesthetic with subtle glow
```

### 3. 添加图标（未激活） - tab-add.png
```
Generate a mobile app tab bar plus/add icon, minimalist line style, gray color #666, thin 2px strokes, rounded line caps, simple plus sign with tiny cocktail shaker detail, transparent background, 32x32px, clean professional design
```

### 4. 添加图标（激活） - tab-add-active.png
```
Generate a mobile app tab bar plus/add icon, filled style with blue-purple gradient #667eea to #764ba2, plus symbol with cocktail mixing tools, transparent background, 32x32px, premium glass-morphism aesthetic with subtle glow
```

---

## ⚡ 一键生成版本

### 批量生成提示词（推荐）
```
Create a set of 4 mobile app tab bar icons for a cocktail application:

1. Home icon (inactive): Gray #666, line style, house with small cocktail glass
2. Home icon (active): Blue-purple gradient fill, same design
3. Add/Plus icon (inactive): Gray #666, line style, plus with cocktail shaker detail  
4. Add/Plus icon (active): Blue-purple gradient fill, same design

Style: Modern, minimalist, glass-morphism aesthetic, 32x32px, transparent background, 2px stroke width, rounded corners. Generate all 4 variations in one image grid.
```

---

## 🎯 备选简化版

如果AI无法理解复杂提示，使用这些超简化版本：

### 超简单版本
```
1. Gray outline home icon, 32px
2. Blue gradient filled home icon, 32px  
3. Gray outline plus icon, 32px
4. Blue gradient filled plus icon, 32px

Modern style, transparent background, for mobile app
```

---

## 📋 生成后检查清单

- [ ] 图标尺寸正确（32x32px或更大）  
- [ ] 背景透明
- [ ] 激活状态颜色为蓝紫渐变
- [ ] 未激活状态为灰色 #666
- [ ] 线条粗细一致
- [ ] 在浅色和深色背景下都清晰可见

## 🔄 生成图标后的操作

1. 将生成的图标文件保存到 `Wine_miniapp/images/` 目录
2. 文件命名：
   - `tab-home.png`
   - `tab-home-active.png` 
   - `tab-add.png`
   - `tab-add-active.png`
3. 在 `app.json` 中恢复标签栏配置（参考注释）

## 📱 恢复标签栏配置

图标准备好后，在 `app.json` 中的 `"comment"` 行后添加：

```json
"tabBar": {
  "color": "#666",
  "selectedColor": "#667eea", 
  "backgroundColor": "#ffffff",
  "borderStyle": "black",
  "position": "bottom",
  "list": [
    {
      "pagePath": "pages/index/index",
      "text": "首页", 
      "iconPath": "images/tab-home.png",
      "selectedIconPath": "images/tab-home-active.png"
    },
    {
      "pagePath": "pages/add-cocktail/add-cocktail",
      "text": "添加",
      "iconPath": "images/tab-add.png", 
      "selectedIconPath": "images/tab-add-active.png"
    }
  ]
}
