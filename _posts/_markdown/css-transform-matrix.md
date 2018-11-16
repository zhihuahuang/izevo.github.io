# CSS 变换矩阵（Transform Matrix）

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
            console.log(transform); // matrix(1, 0, 0, 1, 30.2328, 15.1164)
        }, 1000);
    }
</script>
```

## 2D 变换

- `translate(x, y)` — 平移
- `scale(x, y)` — 缩放
- `rotate(angle)` — 旋转
- `skew(x-angle, y-angle)` — 拉伸
- `matrix(a, b, c, d, e, f)` — 矩阵变换

前 4 种大家可能都用过，但最后一种矩阵变换可能就没几个人用过了。其实所有的变换都可以写成矩阵变换。

### 0. 矩阵变换

> 数学上，一个 m * n 的矩阵是一个由 m行（row） n列（column）元素排列成的矩形阵列。—— 维基百科

**矩阵**是线性代数中的重要元素，如果你没有接触过相关知识。你可以把矩阵简单的理解为一个表格。上面的矩阵可以表示为：

$$
\begin{bmatrix}
a & c & e\\ 
b & d & f\\ 
0 & 0 & 1 
\end{bmatrix}
$$

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

![translate](F:\person\zhihuahuang.github.io\assets\post\css-transform-matrix\translate.png)

***注意 1： Y 轴的正方向是向下的，X 轴正方向向右。***

***注意 2：变换的基点默认为元素的中心，如果想要改变基点，可以 设置 transform-origin 属性。***

```css
transform-origin: left top; // 设置变换的基点为左上角。
```

![element](F:\person\zhihuahuang.github.io\assets\post\css-transform-matrix\element.png)

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

### 2. scale 缩放

以下面这段代码为例，宽度缩放为原大小的50%，高度缩小为原大小的25%。

```css
transform: scale(0.5, 0.25);
```

![scale](F:\person\zhihuahuang.github.io\assets\post\css-transform-matrix\scale.png)

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

### 3. rotate 旋转

以下面这段代码为例，顺时针旋转 60°。

```css
transform: rotate(60deg);
```

![rotate](F:\person\zhihuahuang.github.io\assets\post\css-transform-matrix\rotate.png)

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

### 4. 拉伸 skew



## 3D 变换

3D 变换是 2D 变换的升级版，加入了 Z 轴，矩阵变成了 4*4 的矩阵。

```css
/* 3D 矩阵 */
transform: matrix3d(m11,m12,m13,m14,m21,m22,m23,m24,m31,m32,m33,mm34,m41,m42,m43,m44);
```

$$
\begin{bmatrix}
m11 & m12 & m13 & m14\\ 
m21 & m22 & m23 & m24\\ 
m31 & m32 & m33 & m34\\ 
m41 & m42 & m43 & m44\\ 
\end{bmatrix}
$$

