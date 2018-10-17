# CSS 优先级

我们在写 CSS 的时候都知道，CSS 会按优先级使用样式，例如 id 选择器 > class 类选择器，所以下面这段代码会显示红色。

```html
<style>
	#main {
        color: red;
	}
	
	.text {
        color: yellow;
	}
</style>
<p id="main" class="text">Hello World</p>
```

那这段代码会显示什么颜色呢？如果你不确定，请接着往下看。

```html
<style>
	p[data-text="hello"] {
        color: red;
	}
	
	.text {
        color: yellow;
	}
</style>
<p id="main" class="text" data-text="hello">Hello World</p>
```

## CSS Specificity

决定 CSS 优先级的是一个叫 CSS Specificity 的值，它由 3 个数值组成，可以表示为 `a,b,c`。

- `a` 为 **id 选择器**的个数
- `b` 为 **class 类选择器**、**属性选择器**、**伪类选择器**的个数
- `c` 为**元素选择器**、**伪元素选择器**的个数

CSS Specificity 是**从左到右依次比较**；左边的值越大，CSS Specificity 越大。例如 `1,0,0` > `0,2,0`。

**CSS Specificity 越大，样式的优先级越高。**

我们再来看上面那段代码：

```html
<style>
	p[data-text="hello"] {
        color: red;
	}
    /* 有一个元素选择器 p，和一个属性选择器 [data-text="hello"]，所以 CSS Specificity 的值为 0,1,1 */
	
	.text {
        color: yellow;
	}
    /* 只有一个类选择器 .text，所以 CSS Specificity 的值为 0,1,0 */
    
    /* 因为 0,1,1 > 0,1,0，所以最终文字的颜色为红色 */
</style>
<p id="main" class="text" data-text="hello">Hello World</p>
```

## CSS 优先级

所以结合下来，CSS 优先级从高到低依次为：

1. `!important` 样式
2. 内联样式
3. CSS Specificity 值大的样式
4. 覆盖的样式

## 一些特殊情况

1. **通配选择器**（`*`），**关系选择器**（`+`, `>`, `~`, `空格`）不参与 CSS Specificity 计算。

2. **否定伪类**（`:not`）不参与 CSS Specificity 计算，但内部声明的选择器是会参与计算。

   ```html
   <style>
   	.text:not(span) {
           color: red;
   	}
   	/* 有一个元素选择器 span，和一个类选择器 .text，所以 CSS Specificity 的值为 0,1,1 */
   </style>
   ```

3. `[id="main"]` 这样的写法是**属性选择器**，而不是 id 选择器。

4. 由于覆盖的原因，所以元素自身的样式 > 继承的样式。

   ```html
   <style>
       #main {
           color: red;
   	}
       /* 有一个 id 选择器 #main, 所以 CSS Specificity 的值为 1,0,0 */
   	
   	p {
           color: yellow;
   	}
       /* 只有一个元素选择器 p，所以 CSS Specificity 的值为 0,0,1 */
       
       /* 因为自身的样式会覆盖继承的样式，所以文字的颜色为黄色 */
   </style>
   <div id="main">
       <p>Yellow</p>
   </div>
   ```

## 参考资料

1. [CSS：层叠样式表 > 优先级](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Specificity)
2. [Selectors Level 3#specificity](https://www.w3.org/TR/selectors-3/#specificity)