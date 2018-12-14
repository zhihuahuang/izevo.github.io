# Debug 分析 Vue 的生命周期（零）— 简介

Vue 主框架的[生命周期](https://cn.vuejs.org/v2/api/#%E9%80%89%E9%A1%B9-%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E9%92%A9%E5%AD%90)有 8 个，分别如下：

- beforeCreate
- created
- beforeMount
- mounted
- beforeUpdate
- update
- beforeDestroy
- destroyed

官方的图例也给的很详细

![vue-lifecycle](F:\person\zhihuahuang.github.io\assets\post\vue-lifecycle-debug-introducation\vue-lifecycle.png)

接下来我们就从 debug 的角度去反观 Vue 的生命周期与框架执行流程。下面的代码是基于 `v2.5.20` 版本。我们需要用到的 JS 语句是 [`debugger`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/debugger) 语句，工具是 Chrome DevTools 工具。基础代码如下：

```html
<div id="app">
    {{ message }}
</div>
<script>
    let app = new Vue({
        el: '#app',
        data: {
            message: 'Hello Vue!'
        }
    });
</script>
```

1. [Debug 分析 Vue 的生命周期（一）— beforeCreate]()
2. Debug 分析 Vue 的生命周期（二）- created
3. Debug 分析 Vue 的生命周期（二）- beforeMount
4. Debug 分析 Vue 的生命周期（二）- mounted
5. Debug 分析 Vue 的生命周期（二）- beforeUpdate
6. Debug 分析 Vue 的生命周期（二）- update
7. Debug 分析 Vue 的生命周期（二）- beforeDestroy
8. Debug 分析 Vue 的生命周期（二）- destroyed
