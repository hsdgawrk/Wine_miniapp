# 调酒小程序图标生成AI提示词

## 项目设计风格参考
- **主色调**: #667eea (蓝紫渐变)
- **辅助色**: #764ba2 (深紫色)
- **设计风格**: 现代简约、玻璃拟态效果
- **主题**: 调酒、鸡尾酒、现代酒吧
- **图标尺寸**: 建议生成 128x128px，然后缩放使用

---

## 📱 标签栏图标提示词

### 1. 首页图标 (tab-home.png) - 未激活状态

```
Create a minimalist home icon for a cocktail app tab bar. Design requirements:
- Style: Modern, clean, simple line art
- Color: Light gray (#666) or subtle outlined style
- Icon: House/home symbol with a subtle cocktail glass element
- Background: Transparent
- Size: 32x32px optimized for mobile tab bar
- Design: Thin stroke lines (2px), rounded corners
- Elements: Simple house outline with a small martini glass or cocktail shaker detail
- Aesthetic: Professional, minimal, not filled
```

**中文补充描述**: 简约线条风格的房屋图标，未激活灰色状态，融入微妙的鸡尾酒元素，线条粗细2px，圆角设计

### 2. 首页图标 (tab-home-active.png) - 激活状态

```
Create an active/selected home icon for a cocktail app tab bar. Design requirements:
- Style: Modern, filled with gradient
- Color: Blue-purple gradient (#667eea to #764ba2)
- Icon: House/home symbol with cocktail glass element, filled version
- Background: Transparent
- Size: 32x32px optimized for mobile tab bar
- Design: Filled shapes with subtle inner glow
- Elements: Filled house with integrated martini glass or cocktail shaker
- Aesthetic: Vibrant, premium, glass-morphism inspired
- Effects: Subtle gradient fill and minimal shadow
```

**中文补充描述**: 激活状态的房屋图标，蓝紫渐变填充，融入鸡尾酒元素，玻璃拟态风格，有微妙光泽效果

### 3. 添加图标 (tab-add.png) - 未激活状态

```
Create a minimalist add/plus icon for a cocktail app tab bar. Design requirements:
- Style: Modern, clean, simple line art
- Color: Light gray (#666) or subtle outlined style
- Icon: Plus symbol (+) with subtle cocktail mixing elements
- Background: Transparent
- Size: 32x32px optimized for mobile tab bar
- Design: Thin stroke lines (2px), rounded line caps
- Elements: Clean plus sign with tiny cocktail shaker or garnish details
- Aesthetic: Professional, minimal, not filled
- Optional: Integrate subtle bar spoon or olive pick elements
```

**中文补充描述**: 简约加号图标，未激活灰色线条状态，可融入微妙的调酒工具元素如吧勺

### 4. 添加图标 (tab-add-active.png) - 激活状态

```
Create an active/selected add icon for a cocktail app tab bar. Design requirements:
- Style: Modern, filled with gradient
- Color: Blue-purple gradient (#667eea to #764ba2)
- Icon: Plus symbol with cocktail mixing elements, filled version
- Background: Transparent
- Size: 32x32px optimized for mobile tab bar
- Design: Filled shapes with subtle inner glow
- Elements: Bold plus sign integrated with cocktail shaker or mixing tools
- Aesthetic: Vibrant, premium, glass-morphism inspired
- Effects: Gradient fill with minimal glow effect
- Optional: Subtle bubbles or sparkle effects around the plus
```

**中文补充描述**: 激活状态的加号图标，蓝紫渐变填充，融入调酒工具元素，玻璃拟态风格，可添加微妙气泡效果

---

## 🎨 通用设计指导原则

### 风格一致性要求
```
Universal design guidelines for all icons:
- Maintain consistent stroke width (2px for outline, bold for filled)
- Use rounded corners and caps throughout
- Apply glass-morphism aesthetic with subtle transparency effects
- Ensure high contrast for accessibility
- Follow iOS/Android design guidelines for tab bar icons
- Test visibility on both light and dark backgrounds
- Maintain visual hierarchy: active states should be more prominent
- Use micro-animations friendly designs (simple shapes)
```

### 颜色规范
- **未激活状态**: #666666 (中性灰)
- **激活状态**: 渐变 #667eea → #764ba2
- **背景**: 透明
- **描边**: 2px 粗细，圆角线帽

### 技术要求
- **格式**: PNG (支持透明背景)
- **尺寸**: 32x32px (标准) + 64x64px (高清) + 96x96px (超高清)
- **分辨率**: 至少72 DPI，建议144 DPI
- **透明度**: 完全透明背景
- **压缩**: 优化文件大小，保持视觉质量

---

## 🔧 AI工具特定提示

### 适用于 DALL-E 3
添加前缀: "Generate a mobile app tab bar icon,"

### 适用于 Midjourney  
添加参数: "--ar 1:1 --style raw --s 250 --v 6"

### 适用于 Stable Diffusion
添加负面提示: "blurry, pixelated, complex details, 3D effects, shadows, text, watermark"

---

## 📝 使用说明

1. **生成顺序**: 建议按照未激活 → 激活的顺序生成，保持一致性
2. **批量生成**: 可以在一个提示中要求生成同一图标的多个状态
3. **后期优化**: 生成后可能需要微调大小和对比度
4. **测试验证**: 在不同背景色下测试图标的可见性

### 生成后处理建议
- 确保图标在浅色和深色背景下都清晰可见
- 检查激活和未激活状态的对比度足够明显
- 优化文件大小，通常每个图标应小于10KB
- 生成多个尺寸版本以适应不同设备分辨率
