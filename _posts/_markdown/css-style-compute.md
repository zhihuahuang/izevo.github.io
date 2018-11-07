# CSS 样式计算

CSS 是如何计算一个元素的样式的？

## 层叠（Cascading）

CSS 的全称是 Cascading Style Sheet（层叠样式表），层叠是计算样式中的关键。

什么是“层叠”？我的理解是这样的。

> 一层层的覆盖与叠加

例如下面这段代码：

```html
<style>
    p {
        color: red !important;
    }
    
    p {
        color: blue;
        background: green;
    }
</style>
<p>Hello World</p>
```

这段代码最终为绿底红字。`color: red !important` 覆盖了 `color: blue`，`background: green` 又叠加到了样式中。

## 层叠顺序 （Cascading Order）

按 W3C 定义，层叠顺序从高到低为：

1. 过渡声明（Transition declarations）
2. 重要浏览器声明（Important user agent declarations）
3. 重要用户声明（Important user declarations）
4. 重要作者声明（Important author declarations）
5. 动画声明（Animation declarations）
6. 普通作者声明（Normal author declarations）
7. 普通用户声明（Normal user declarations）
8. 普通浏览器声明（Normal user agent declarations）

简化一下，通俗来说，顺序从高到低为：

1. 浏览器的 `!important` 样式。
2. `!important` 的样式。
3. 普通样式。
4. 浏览器默认样式。

#### 重要浏览器声明

有一些样式被浏览器设置为 `!important`，例如：

```css
input[type=hidden i] { display: none !important; }
```

这些样式会比你写的 important 样式层级高，所以下面这段代码 input 仍然不会显示。

```html
<style>
	#input {
        display: block !important;
        width: 100px;
        height: 100px;
        background: red;
	}
</style>
<input id="input" type="hidden" />
```

#### 动画声明，过渡声明？

在 W3C 的定义中，过渡声明 > important 声明 > 动画声明。但实际在浏览器中并不是这样，经测试，层叠顺序大致为：

1. 浏览器的 `!important` 样式。
2. 动画（Animation）样式。
3. `!important` 的样式。
4. 过渡（Transition）样式。
5. 普通样式。
6. 浏览器默认样式。

#### 动画之间不会层叠

按之前的定义，层叠会有个叠加的过程。但在动画样式中，并不会叠加，只有覆盖。参考下面的代码：

```html
<style>
    @keyframes resize {
        from { width: 100px; }
        to { width: 200px; }
    }

    @keyframes resize {
        from { height: 100px; }
        to { height: 200px; }
    }

    div {
        width: 100px;
        height: 100px;
        animation: resize 1s;
        background: red;
    }
</style>
<div></div>
```

这段代码只有**高度**会变化，宽度不会变化，`@keyframes` 动画之间不会叠加样式。

## 特异性（Specificity）

层叠顺序的高低会覆盖样式，那同一个层级内的样式呢？考虑一下这段代码：

```html
<style>
    p[data-text="hello"] {
        color: red;
    }
    
    .text {
        color: yellow;
    }
</style>
<p class="text" data-text="hello">Hello World</p>
```

同一层级的代码由特异性决定。它由 4 个数值组成，可以表示为 `a,b,c,d` （W3C 定义是 3 个，即 `b,c,d`）。

- `a` 如果为内联样式（style=""）则为 1，否则为 0。
- `b` 为 **id 选择器**的个数。
- `c` 为 **class 类选择器**、**属性选择器**、**伪类选择器**的个数。
- `d` 为**元素选择器**、**伪元素选择器**的个数。

特异性是**从左到右依次比较**；左边的值越大，特异性越大。例如 `1,0,0,0` > `0,2,0,0`。最终会使用**特异性大**的样式。

我们再来看上面那段代码：

```html
<style>
    p[data-text="hello"] {
        color: red;
    }
    /* 有一个元素选择器 p，和一个属性选择器 [data-text="hello"]，所以特异性为 0,0,1,1 */
    
    .text {
        color: yellow;
    }
    /* 只有一个类选择器 .text，所以特异性为 0,0,1,0 */
    
    /* 因为 0,0,1,1 > 0,0,1,0，所以最终文字的颜色为红色 */
</style>
<p id="main" class="text" data-text="hello">Hello World</p>
```

### 一些特殊的计算规则

1. **通配选择器**（`*`），**关系选择器**（`+`, `>`, `~`, `空格`）不参与计算。

   ```html
   <style>
       p > span {
           color: red;
       }
       
       div span {
           color: yellow;
       }
       /* 文字颜色为黄色 */
   </style>
   <div>
       <p><span>Hello world</span></p>
   </div>
   ```

   

2. **否定伪类**（`:not`）不参与计算，但内部声明的选择器是会参与计算。

   ```html
   <style>
       .text:not(span) {
           color: red;
       }
       /* 有一个元素选择器 span，和一个类选择器 .text，所以 CSS Specificity 的值为 0,0,1,1 */
   </style>
   ```

3. `[id="main"]` 这样的写法是**属性选择器**，而不是 id 选择器。

## 继承（Inherit）

子元素会沿用父元素的样式。

### 继承低于特异性

考虑下面一段代码，`World` 的颜色为？

```html
<style>
	* {
        color: black;
	}
	
	p {
        color: red;
	}
</style>
<p>Hello <span>World</span>!</p>
```

黑色！虽然通配符（*）的特异性为 `0,0,0,0`，但它还是高于继承的样式。

### 不是所有属性都能继承

大部分盒模型的样式都不能继承（margin，border，padding...）。


## 参考资料

1. [CSS：层叠样式表 > 优先级](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Specificity)
2. [Selectors Level 3#specificity](https://www.w3.org/TR/selectors-3/#specificity)
3. [A Specificity Battle! (and other trickery)](https://css-tricks.com/a-specificity-battle/)
4. 《CSS 权威指南（第三版）》