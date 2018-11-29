# CSS 变换矩阵（Transform Matrix）

CSS3 中的 transform 属性，让我们能轻松的操作变换元素。设置元素的 transform 属性可能大家都会，但是取值大家可能都没用到过。先看一下这段代码：

```html
<style>
div {
    width: 300px;
    height: 200px;
    background: blue;
    transition: transform 5s;
}
</style>
<div></div>
<script>
    window.onload = function() {
        let div = document.querySelector('div');
        div.style.transform = 'translate(100px, 50px)';
        setTimeout(() => {
            let transform = window.getComputedStyle(div).transform;
            console.log(transform);
        }, 1000);
    }
</script>
```

这段代码设置了一个 5 秒的过渡效果，从 (0, 0) 移动到 (100, 50)。那 1 秒后元素移动到了什么位置呢？

我们想取到 1 秒后的位置，于是我们打印出了 transform，没想到却得到了下个这样的一个结果。

```
matrix(1, 0, 0, 1, 30.2328, 15.1164)
```

这是什么玩意？我设置的不是平移 translate 吗？

这个就是 transform 中一个隐藏的变换，也是**所有变换的基础**，矩阵（matrix）变换。

## 2D 变换

我们先从最简单的 2D 平面变换的讲起，下面是 2D 的几种变换：

- `translate(x, y)` — 平移
- `scale(x, y)` — 缩放
- `rotate(angle)` — 旋转
- `skew(x-angle, y-angle)` — 拉伸

它们与矩阵变换又有什么关系呢？

### 0. 矩阵与变换

#### 矩阵

> 数学上，一个 m * n 的矩阵是一个由 m行（row） n列（column）元素排列成的矩形阵列。—— 维基百科

**矩阵**是线性代数中的重要元素，如果你没有接触过相关知识。你可以把矩阵简单的理解为一个表格。

2D 的变换矩阵可以表示为：
$$
\begin{bmatrix}
a & c & e\\ 
b & d & f\\ 
0 & 0 & 1 
\end{bmatrix}
$$

下面会涉及一些矩阵乘法、三角函数、坐标系的知识，如果你对这方面知识不是很了解，下面是一些参考资料。

1. [理解矩阵乘法](http://www.ruanyifeng.com/blog/2015/09/matrix-multiplication.html)

#### 变换

2D 变换其实本质是一个坐标点 *P* 变成一个新坐标点 *P'* 的过程。
$$
P(x,y)\rightarrow P'(x',y')
$$

我们可以把变换过程写成这样：

$$
\left\{\begin{matrix}
x'=ax+cy+e \\ 
y'=bx+dy+f
\end{matrix}\right.
$$

- 新坐标点 *P'* 的横坐标 *x'* 由 *a*，*c*，*e* 决定。
- 新坐标点 *P'* 的纵坐标 *y'* 由 *b*，*d*，*f* 决定。

用矩阵乘法表示为：
$$
\begin{bmatrix}
a & c & e\\ 
b & d & f\\ 
0 & 0 & 1
\end{bmatrix}\cdot \begin{bmatrix}
x \\
y \\
1
\end{bmatrix}= \begin{bmatrix}
ax+cy+e \\ 
bx+dy+f \\ 
0+0+1
\end{bmatrix}
$$

下面会举例说明每种变换对应的矩阵。

### 1. translate 平移

平移是最简单的一种，以下面这段代码为例，*x* 轴平移 100px，*y* 轴平移 50px。

```css
transform: translate(100px, 50px);
```

![translate](https://zhihuahuang.github.io/assets/post/css-transform-matrix/translate.png)

***注意 1： Y 轴的正方向是向下的，X 轴正方向向右。***

***注意 2：变换的基点默认为元素的中心，如果想要改变基点，可以 设置 transform-origin 属性。***

```css
transform-origin: left top; // 设置变换的基点为左上角。
```

![element](https://zhihuahuang.github.io/assets/post/css-transform-matrix/element.png)

很容易写出转换的公式，公式为：
$$
\left\{\begin{matrix}
x'=x+100 \\ 
y'=y+50
\end{matrix}\right.
$$

 等价于
$$
\left\{\begin{matrix}
x'=1*x+0*y+100 \\ 
y'=0*x+1*y+50
\end{matrix}\right.
$$

$$
\begin{bmatrix}
a=1 & c=0 & e=100\\ 
b=0 & d=1 & f=50\\ 
0 & 0 & 1 
\end{bmatrix}
$$

所以 CSS Transform 2D 矩阵为：

```css
transform: matrix(1, 0, 0, 1, 100, 50);
```

***注意 3：translate 中可以带单位，matrix 中不能带单位。***

下面 CSS 是等价的：

```css
transform: translate(x, y);
transform: matrix(1, 0, 0, 1, x, y);
```

### 2. scale 缩放

以下面这段代码为例，宽度缩放为原大小的50%，高度缩小为原大小的25%。

```css
transform: scale(0.5, 0.25);
```

![scale](https://zhihuahuang.github.io/assets/post/css-transform-matrix/scale.png)

转换的公式为：

$$
\left\{\begin{matrix}
x'=0.5*x \\ 
y'=0.25*y
\end{matrix}\right.
$$

整理后公式等价于：

$$
\left\{\begin{matrix}
x'=0.5*x+0*y+0 \\ 
y'=0*x+0.25*y+0
\end{matrix}\right.
$$

$$
\begin{bmatrix}
a=0.5 & c=0 & e=0\\ 
b=0 & d=0.25 & f=0\\ 
0 & 0 & 1 
\end{bmatrix}
$$

所以 CSS Transform 2D 矩阵为：

```css
transform: matrix(0.5, 0, 0, 0.25, 0, 0);
```

下面 CSS 是等价：

```css
transform: scale(x, y);
transform: matrix(x, 0, 0, y, 0, 0);
```

### 3. rotate 旋转

以下面这段代码为例，顺时针旋转 60°。

```css
transform: rotate(60deg);
```

![rotate](https://zhihuahuang.github.io/assets/post/css-transform-matrix/rotate.png)

以点 *A* 变换到 *A'* 为例，已知下面的条件

$$
\alpha =\angle A,O,M\\
\theta  =\angle A,O,A'=60^{\circ}=\frac{\pi}{3}\\
r=AO=A'O
$$
可以得到：
$$
\left\{\begin{matrix}
x'=\cos\left(\alpha +\theta \right )*r\\
y'=\sin\left(\alpha +\theta \right )*r
\end{matrix}\right.
$$
可以用三角函数和角公式展开：
$$
\sin \left ( \alpha + \beta  \right ) = \sin \alpha \cos \beta + \cos \alpha \sin \beta\\
\cos \left ( \alpha + \beta  \right ) = \cos \alpha \cos \beta - \sin \alpha \sin \beta
$$
得：
$$
\left\{\begin{matrix}
x'=\cos \alpha \cos \theta * r - \sin \alpha \sin \theta * r = \cos \theta * x - \sin \theta * y\\
y'=\sin \alpha \cos \theta * r + \cos \alpha \sin \theta * r = \cos \theta * y + \sin \theta * x
\end{matrix}\right.
$$
整理后公式等价为：
$$
\left\{\begin{matrix}
x'= \cos \theta * x - \sin \theta * y + 0\\
y'= \sin \theta * x + \cos \theta * y + 0
\end{matrix}\right.
$$

$$
\begin{bmatrix}
a=\cos \theta & c=-\sin \theta & e=0\\ 
b=\sin \theta & d=\cos \theta & f=0\\ 
0 & 0 & 1 
\end{bmatrix}
$$

将 *θ = 60°* 带入得转换矩阵为：

```css
transform: matrix(0.5, 0.866, -0.866, 0.5, 0, 0);
```

所以下面 CSS 是等价的：

```css
transform: roate(angle);
transform: matrix(cos(angle), sin(angle), -sin(angle), cos(angle), 0, 0);
```

### 4. 拉伸 skew

拉伸的公司比较特别，这里直接给出公式
$$
\left\{\begin{matrix}
x'= x+\tan (\theta x) * y + 0\\
y'= \tan\left( \theta y\right) * x + y + 0
\end{matrix}\right.
$$
所以下面的 CSS 是等价的：

```css
transform: skew(x-angle, y-angle);
transform: matrix(1, tan(y-angle), tan(x-angle), 1, 0, 0);
```

## 3D 变换

3D 变换是 2D 变换的升级版，加入了 Z 轴与透视（perspective）值 w，矩阵变成了 4*4 的矩阵。

```css
/* 3D 矩阵 */
transform: matrix3d(m11,m12,m13,m14,m21,m22,m23,m24,m31,m32,m33,mm34,m41,m42,m43,m44);
```

$$
\begin{bmatrix}
m11 & m21 & m31 & m41\\ 
m12 & m22 & m32 & m42\\ 
m13 & m23 & m33 & m43\\ 
m14 & m24 & m34 & m44\\ 
\end{bmatrix}
$$

$$
\begin{bmatrix}
m11 & m21 & m31 & m41\\ 
m12 & m22 & m32 & m42\\ 
m13 & m23 & m33 & m43\\ 
m14 & m24 & m34 & m44\\ 
\end{bmatrix}\cdot \begin{bmatrix}
x \\
y \\
z \\
w
\end{bmatrix}= \begin{bmatrix}
m11\cdot x+m21\cdot y+m31\cdot z+m41\cdot w\\ 
m12\cdot x+m22\cdot y+m32\cdot z+m42\cdot w\\ 
m13\cdot x+m23\cdot y+m33\cdot z+m43\cdot w\\ 
m14\cdot x+m24\cdot y+m34\cdot z+m44\cdot w\\ 
\end{bmatrix}
$$

### 向下兼容 2D矩阵

3D 矩阵其实可以兼容 2D 矩阵。在 2D 变换中，z 的值为 0（或 -0）。w 值为 1。
$$
\begin{bmatrix}
m11 & m21 & m31 & m41\\ 
m12 & m22 & m32 & m42\\ 
m13 & m23 & m33 & m43\\ 
m14 & m24 & m34 & m44\\ 
\end{bmatrix}\cdot \begin{bmatrix}
x \\
y \\
0 \\
1
\end{bmatrix}= \begin{bmatrix}
m11\cdot x+m21\cdot y+0+m41\\ 
m12\cdot x+m22\cdot y+0+m42\\ 
m13\cdot x+m23\cdot y+0+m43\\ 
m14\cdot x+m24\cdot y+0+m44\\ 
\end{bmatrix}
$$

所以我们和容易可以得到一个关系：

| 2D矩阵 | 3D矩阵 |
| ------ | ------ |
| a      | m11    |
| b      | m12    |
| c      | m21    |
| d      | m22    |
| e      | m41    |
| f      | m42    |

## JS 处理转换矩阵

了解了转换矩阵的基本知识，那我们的得到转换矩阵后，就从中可以解析出 x, y 的值。

其实有一个叫 `DOMMatrix` 的类让我们可以更方便的获取到值。在某些旧版本浏览器上它叫 `WebKitCSSMatrix`，它可以将字符串的矩阵转换成对象。

```javascript
let transform = window.getComputedStyle(el).transform;
const Matrix = DOMMatrix || WebKitCSSMatrix;
const matrix = new Matrix(transform);
// 获取 x, y
let x = matrix.e;
let y = matrix.f;
```

## 参考资料

1. [DOMMatrix](https://developer.mozilla.org/en-US/docs/Web/API/DOMMatrix)
2. [理解CSS3 transform中的Matrix(矩阵)](https://www.zhangxinxu.com/wordpress/2012/06/css3-transform-matrix-%E7%9F%A9%E9%98%B5/)
3. [dommatrix](https://drafts.fxtf.org/geometry/#dom-dommatrix)

