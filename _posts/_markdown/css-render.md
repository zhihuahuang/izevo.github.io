# 简析 CSS 渲染过程

CSS 渲染的过程如下：

1. CSS 文本生成 CSSOM 树。
2. CSSOM 树与 DOM 树合并生成渲染树（Render Tree）。
3. 布局（Layout）计算每个对象的位置和大小。
4. 绘制（Paint）最终像素到屏幕上。

## 渲染

### CSSOM

CSS 对象模型（CSS Object Model），它是一颗树状结构。

如果有下面一段 CSS 文本

```css
body { font-size: 16px }
p { font-weight: bold }
span { color: red }
p span { display: none }
img { float: right }
```

那么它生成的 CSSOM 树大致如下：

![](https://zhihuahuang.github.io/assets/post/css-render/cssom-tree.png)

但它还不是最终的 CSSOM 树。因为浏览器会提供一套默认样式（User Agent 样式），我们只是覆盖了默认的样式。

![](https://zhihuahuang.github.io/assets/post/css-render/user-agent-stylesheet.png)

### 生成成渲染树（Render Tree）

![](https://zhihuahuang.github.io/assets/post/css-render/render-tree-construction.png)

构建渲染树的过程大致如下：

从 DOM 树根节点开始遍历
1. 如果节点为不可见节点，如 `<meta>`，`<script>`，`<template> `等，则跳过。
2. 如果节点被 CSS 隐藏（display：none），则跳过。
3. 计算节点的部分样式。

**注意：**有一些元素可能会对应多个渲染节点。例如 `<select>`，它包含一个选中区域，一个下拉列表，一个下拉按钮。

### 布局（Layout）

计算渲染树中对象的位置和大小。当重新执行这个阶段时，它也被称为**重排**（Relayout）或者**回流**（Reflow）。

### 绘制（Paint）

将渲染树上的节点转换成屏幕上的像素。这个阶段也为称为栅格化。当重新执行这个阶段时，它也被称为**重绘**（Repaint）。

### Webkit VS Gecko

Webkit 渲染过程

![](https://zhihuahuang.github.io/assets/post/css-render/webkit-flow.png)

Gecko 渲染过程

![](https://zhihuahuang.github.io/assets/post/css-render/gecko-flow.jpg)


## 优化

由于样式表非常大，计算一个元素的样式会变得耗时，所以通常浏览器会做一些优化。

### 选择器哈希表

浏览器通常会建立一些 Hash Map：类表（class map）、ID 表（id map）、标签表（tag map），通用表（general map）等，在解析 CSS 的过程中，将 CSS 规则放到对应的表中，计算节点样式时，就能很快的从表中取出样式规则。

```css
p.content { color:red } /* 放入 class map 中 */
#text { color: blue } /* 放入 id map 中 */
div p { color: yellow } /* 放入 tag map 中 */
```

 对于下面这段 HTML 代码，浏览器会从 ID 表（id map） 和 标签表中（tag map）取出样式。最终计算决定元素的样式。

```html
<div>
    <p id="text">Hello World</p>
</div>
```

### 选择器从右到左匹配

对于一些层级的选择，CSS 其实是**从右到左**做匹配的。例如：

```css
div p span {
    color: red;
}
```

它其实以 `span`、`p`、`div` 的顺序匹配的。

考虑下面这一段代码

```html
<div>
	<p><b>Strong</b></p>
</div>
```

对比一下两种匹配的步骤：

| 标签  | 从左到右                                             | 从右到左 |
| ----- | ---------------------------------------------------- | -------- |
| `<div>` | 1. div 选择器，匹配。<br>2. p 选择器，不匹配，返回。 | 1. span 选择器，不匹配，返回。 |
| `<p>`   | 1. div 选择器，匹配。<br>1. div 选择器，匹配。2. p 选择器，匹配。<br>3. span 选择器，不匹配，返回。 | 1. span 选择器，不匹配，返回。 |
| `<b>`  | 1. div 选择器，匹配<br>2. p 选择器，匹配<br>3. span 选择器，不匹配，返回。| 1. span 选择器，不匹配，返回。 |

所以从右到左的匹配能大大减少，遍历树中的回溯操作。

对于下面这段样式，放入标签哈希表中的键为 `p`。

```css
div p {
    color: yellow
}
```

## 参考资料

1. [构建对象模型](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/constructing-the-object-model?hl=zh-cn)
2. [渲染树构建、布局及绘制](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-tree-construction?hl=zh-cn)
3. [阻塞渲染的 CSS](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-blocking-css?hl=zh-cn)
4. [浏览器的工作原理：新式网络浏览器幕后揭秘](https://www.html5rocks.com/zh/tutorials/internals/howbrowserswork/)
5. [Introducing the CSS Cascade](https://developer.mozilla.org/en-US/docs/Web/CSS/Cascade#Cascading_order)