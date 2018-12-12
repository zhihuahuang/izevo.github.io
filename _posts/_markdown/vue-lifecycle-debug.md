# 从 Debug 看 Vue 的生命周期

Vue 主框架的生命周期有 8 个如下

- beforeCreate
- created
- beforeMount
- mounted
- beforeUpdate
- update
- beforeDestroy
- destroyed

官方的图例也给的很详细

![vue-lifecycle](F:\person\zhihuahuang.github.io\assets\post\vue-lifecycle-debug\vue-lifecycle.png)

今天我们就从 debug 的角度去反观 Vue 的生命周期与框架执行流程。下面的代码是基于 `v2.5.20` 版本。我们需要用到的工具是 `debugger;` 语句与 Chrome DevTools 工具。基础代码如下：

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

## beforeCreate

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

![beforeCreate-call-stack](F:\person\zhihuahuang.github.io\assets\post\vue-lifecycle-debug\beforeCreate-call-stack.png)

我们就来逐层分析一下

### 1. callHook

![callHook](F:\person\zhihuahuang.github.io\assets\post\vue-lifecycle-debug\callHook.png)

#### callHook(vm, hook)

- `vm` — Vue 实例对象。
- `hook` — 字符串，当前为 beforeCreate。

![callHook-arguments](F:\person\zhihuahuang.github.io\assets\post\vue-lifecycle-debug\callHook-arguments.png)

通过上面的代码我们了解到，这个函数主要做了4件事：

```javascript
function callHook (vm, hook) {
    // 1. 执行 pushTarget/popTarget — push 和 pop 是栈操作。
    pushTarget();
    // 2. 从 $options 中获取当前生命周期函数，当前为 beforeCreate。注意 handlers 是一个数组。
    var handlers = vm.$options[hook];
    if (handlers) {
        for (var i = 0, j = handlers.length; i < j; i++) {
            try {
                // 3. 循环执行当前生命周期函数，因为调用了 call，所以生命周期里的 this 即为 vm。
                handlers[i].call(vm);
            } catch (e) {
                handleError(e, vm, (hook + " hook"));
            }
        }
    }
    if (vm._hasHookEvent) {
        // 4. 如果 _hasHookEvent 为真，则触发 hook:hookName 事件。
        vm.$emit('hook:' + hook);
    }
    popTarget();
}
```

不过分析的过程中我们也产生了一些新问题：

1. pushTarget/popTarget 是什么？
2. $options['beforeCreate'] 为什么是一个数组？
3. _hasHookEvent 什么时候为真，什么时候为假？

我们先把这些问题记在一旁，后面慢慢来分析。

### 2. Vue._init

![Vue._init](F:\person\zhihuahuang.github.io\assets\post\vue-lifecycle-debug\Vue._init.png)

Vue._init 是分析过程中最长，最复杂的函数。

- `options` — 新建 Vue 对象时传入的配置。

![Vue._init-arguments](F:\person\zhihuahuang.github.io\assets\post\vue-lifecycle-debug\Vue._init-arguments.png)

```javascript
var uid$3 = 0;

function initMixin (Vue) {
    Vue.prototype._init = function (options) {
        var vm = this;
        // 1. uid 自增
        vm._uid = uid$3++;

        // 2. 如果有 Vue.config.performace 配置，执行性能分析
        // 参考：
        // [1]. https://cn.vuejs.org/v2/api/#全局配置
        // [2]. https://cn.vuejs.org/v2/api/#performance
        var startTag, endTag;
        if (config.performance && mark) {
            startTag = "vue-perf-start:" + (vm._uid);
            endTag = "vue-perf-end:" + (vm._uid);
            mark(startTag);
        }

        vm._isVue = true;
        
        // 3. 处理组件 或者 合并配置
        if (options && options._isComponent) {
            initInternalComponent(vm, options);
        } else {
            vm.$options = mergeOptions(
                resolveConstructorOptions(vm.constructor),
                options || {},
                vm
            );
        }
        // 4. 初始化 Proxy
        {
            initProxy(vm);
        }

        vm._self = vm;
        // 6. 初始化生命周期
        initLifecycle(vm);
        // 7. 初始化事件
        initEvents(vm);
        // 8. 初始化渲染
        initRender(vm);
        // 9. 调用 beforeCreate 生命周期
        callHook(vm, 'beforeCreate');
        ...
    };
}
```

Vue._init