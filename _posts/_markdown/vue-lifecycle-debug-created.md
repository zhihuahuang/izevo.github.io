# Debug 分析 Vue 的生命周期（二）- created

> 在实例创建完成后被立即调用。在这一步，实例已完成以下的配置：数据观测 (data observer)，属性和方法的运算，watch/event 事件回调。然而，挂载阶段还没开始，$el 属性目前不可见。

![created](F:\person\zhihuahuang.github.io\assets\post\vue-lifecycle-debug-created\created.png)

## Debug 分析

```html
<div id="app">
    {{ message }}
</div>
<script>
    let app = new Vue({
        el: '#app',
        data: {
            message: 'Hello Vue!'
        },
        created() {
            debugger;
        }
    });
</script>
```

通过 Chrome DevTools 我们可以得到调用栈如下图：

![beforeCreate-call-stack](F:\person\zhihuahuang.github.io\assets\post\vue-lifecycle-debug-created\call-stack.png)

可以看到 created 的调用栈与 beforeCreate 的调用栈一致。Vue 与 callHook 函数上一篇有讲过，这里就不再说明了。下面来继续分析 Vue._init 。看在调用 beforeCreate 之后，created 之前发什么了什么。

![Vue._init](F:\person\zhihuahuang.github.io\assets\post\vue-lifecycle-debug-created\Vue._init.png)

可以看到，beforeCreate 之后又调用了 4 步。

### 1. 初始化 Inject

这个函数对应的是 Vue 的 [provide/inject](https://cn.vuejs.org/v2/api/#provide-inject)，这是 v2.2.0 后新增的特性。官方文档上提到：

> provide 和 inject 主要为高阶插件/组件库提供用例。并不推荐直接用于应用程序代码中。

它在平时开发中不一定会用到，所以这里就不做说明了。

### 2. 初始化 State

#### initData

vm._data 初始 data

getData() - call 调用

判断 data 是不是 纯对象，不是纯对象就警告

判断 props 和 methods 中是否有同名属性，如果有，则警告

#####

### 3. 初始化 Provide

同 *1. 初始化 Inject*

### 4. 调用 created 生命周期钩子

callHook 我们在 beforeCreated 生命周期中分析过，这里就不再说明了。
