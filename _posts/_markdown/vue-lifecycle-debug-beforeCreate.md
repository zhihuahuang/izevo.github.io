# Debug 分析 Vue 的生命周期（一）— beforeCreate

> beforeCreate在实例初始化之后，数据观测 (data observer) 和 event/watcher 事件配置之前被调用。— [Vue#beforeCreate](https://cn.vuejs.org/v2/api/#beforeCreate) 

![vue-lifecycle-beforeCreate](F:\person\zhihuahuang.github.io\assets\post\vue-lifecycle-debug-beforeCreate\beforeCreate.png)

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
        beforeCreate() {
            debugger;
        }
    });
</script>
```

通过 Chrome DevTools 我们可以得到调用栈如下图：

![beforeCreate-call-stack](F:\person\zhihuahuang.github.io\assets\post\vue-lifecycle-debug-beforeCreate\call-stack.png)

下面我们就根据调用顺序（从栈底到栈顶），逐步分析一下：

### Vue

Vue 函数的源码如下图：

![Vue](F:\person\zhihuahuang.github.io\assets\post\vue-lifecycle-debug-beforeCreate\Vue.png)

这个函数非常简单，就做了 2 件事情：

1. 判断是否是通过 new 操作符调用。
2. 调用了 _init 方法。

### Vue._init

Vue._init 是分析过程中最复杂也是最重要的一个函数。从下图可以看出，到调用 beforeCreate 生命周期钩子前，Vue 做了 7 件事。下面我们会逐步来分析。

![Vue._init](F:\person\zhihuahuang.github.io\assets\post\vue-lifecycle-debug-beforeCreate\Vue._init.png)

#### 1. uid 自增

#### 2. 性能分析

这里对应的是 [Vue.config.performance](https://cn.vuejs.org/v2/api/#performance) 的全局配置。mark 函数其实就是 [`performance.mark`](https://developer.mozilla.org/en-US/docs/Web/API/Performance/mark)。关于 performance 的知识，这里就不展开说明。

![mark](F:\person\zhihuahuang.github.io\assets\post\vue-lifecycle-debug-beforeCreate\mark.png)

#### 3. 初始化内部组件 或者 合并配置

由于没有用到组件，所以这里暂时不讨论组件的初始化。我们先只分析 3.2 合并配置。

![call-mergeOptions](F:\person\zhihuahuang.github.io\assets\post\vue-lifecycle-debug-beforeCreate\call-mergeOptions.png)

3.2 合并配置调用了 mergeOptions 函数，并传入了 3 个参数，对应形参的 parent, child, vm。可以看出 child 参数为我们传入的 options，parent 参数这里先不做分析，vm 参数为当前 Vue 实例对象。最终会把合并后的配置赋值到 $options 上。

下面我们来看看 mergeOptions 的源码，尽管它做了很多操作，但我们重点看其中的 mergeField 函数。从下面的 debug 截图可以分析出，到对 child 行为 mergeField 操作时，child 对象未做改变，仍然是我们传入的 options 对象。然后它会对 options 中每个 key 调用 mergeField 方法。

![mergeOptions](F:\person\zhihuahuang.github.io\assets\post\vue-lifecycle-debug-beforeCreate\mergeOptions.png)

mergeField 实际上是调用 strat 方法，即 strasts[key]，strats 其实就是 [Vue.config.optionsMergeStrategies](https://cn.vuejs.org/v2/api/#optionMergeStrategies) 全局配置。

![strats](F:\person\zhihuahuang.github.io\assets\post\vue-lifecycle-debug-beforeCreate\strats.png)

如果当前 key 为 beforeCreate，则 strat 为 mergeHook 函数。可以看出 mergeHook 最终会将钩子函数转换成数组。

![mergeHook](F:\person\zhihuahuang.github.io\assets\post\vue-lifecycle-debug-beforeCreate\mergeHook.png)

#### 4. 初始化 Proxy（initProxy）

initProxy 只是为 vm 实例设置了 _renderProxy 属性的值，这里就暂时略过。

![initProxy](F:\person\zhihuahuang.github.io\assets\post\vue-lifecycle-debug-beforeCreate\initProxy.png)

#### 5. 初始化生命周期（initLifecycle）

同样是为 vm 实例设置一些属性。先略过。

![initLifecycle](F:\person\zhihuahuang.github.io\assets\post\vue-lifecycle-debug-beforeCreate\initLifecycle.png)

#### 6. 初始化事件（initEvents）

同上。

![initEvents](F:\person\zhihuahuang.github.io\assets\post\vue-lifecycle-debug-beforeCreate\initEvents.png)

#### 7. 初始化渲染（initRender）

同上。

![initRender](F:\person\zhihuahuang.github.io\assets\post\vue-lifecycle-debug-beforeCreate\initRender.png)

#### 8.   调用生命周期钩子

调用 callHook(vm, 'beforeCreate')。

### callHook

这个函数是实际调用生命周期的函数。它大概做了 3 件事。

![callHook](F:\person\zhihuahuang.github.io\assets\post\vue-lifecycle-debug-beforeCreate\callHook.png)

#### 1. pushTarget/popTarget

这里暂时不展开说明，先略过。

#### 2. 循环调用当前生命周期钩子函数

在 Vue._init 合并配置中提到过，合并配置的过程中，会将生命周期钩子函数转换成一个数组。在这里会循环遍历这个数组，依次调用。因为是通过 call 调用，所以生命周期中的 this 就是 Vue 的实例对象 vm。

#### 3. 触发 hook 生命周期事件

当 _hasHookEvent 为 true 时，会触发 hook 事件。在 initEvents 里我们看到，初始的时候是被设置为 false 的，所以这里是不会去触发的。那它什么时候会设置为 true 呢？答案是在 $on 的时候，也就是说，当你尝试去监听 hook 事件的时候，才会将其设置为 true。这是 Vue 做的一个小优化。

![$on-hook](F:\person\zhihuahuang.github.io\assets\post\vue-lifecycle-debug-beforeCreate\$on-hook.png)

## 总结

总结下来，调用 beforeCreate 之前，Vue 主要做了下面一些事情

1. 合并配置 — 将你传入的配置和默认配置进行合并转化。
2. 初始化属性 — 会通过各种 init 方法在实例对象 vm 上设置一些属性值。