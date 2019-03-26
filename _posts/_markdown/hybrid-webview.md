# Hybrid WebView 技术总结

Hybrid WebView 技术是一种在 App 客户端（通常称为Native）上使用 WebView 展示 Web H5 网页的技术。这些 H5 通常由操作 Native 的能力，所以 H5 需要与 Native 进行通讯。它可以分为两个部分，一部分是 JS 向 Native 发送数据，一部分是 Native 向网页发送数据。

## 1. H5 调用 Native

### 1.1 console.log

JS 通过 `console.log` 向 Native 发送消息，Native 根据消息调用对应方法。

#### H5

```javascript
// Javascript 代码
console.log('{"width": "750"}');
```

#### Android

Android 是通过重写 [onConsoleMessage](https://developer.android.com/reference/android/webkit/WebChromeClient#onConsoleMessage(android.webkit.ConsoleMessage)) 方法来实现。

```java
// Java 代码
@Override
public void onConsoleMessage(String message, int lineNumber, String sourceID) {
    // message 即为 JS 传过来的消息，判断消息来决定调用方法
}
```

### 1.2 prompt

同 `console.log` 非常类似，通过重写 JS 环境中 [prompt(message, defaultValue)](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/prompt) 方法来接受 JS 传过来的消息。

#### H5

```javascript
// Javascript 代码
window.prompt('{"width“: "750"}');
```

#### Android

Android 是重写 [onJsPrompt](https://developer.android.com/reference/android/webkit/WebChromeClient#onJsPrompt(android.webkit.WebView,%20java.lang.String,%20java.lang.String,%20java.lang.String,%20android.webkit.JsPromptResult)) 方法。

```java
// Java 代码
@Override       
public boolean onJsPrompt(WebView view, String url, String message, String defaultValue, JsPromptResult result) {
    // message 即为 JS 传过来的消息
    result.confirm('returnValue'); // 这里代表点击了确定，同理 result.cancel() 代表点击了取消。confirm 可以传入返回值。
    return true;
} 
```

同理你可以重写 `alert` 或者 `confirm`，那为什么是 `prompt` 呢？因为 `prompt` 可以返回字符串，`alter` 不返回值，`confirm` 只返回 `true` 或 `false`。

### 1.3 Schema URL

JS 通过改变地址来向 Native 发消息

#### H5

```javascript
// Javascript
location.href = 'appschema://toast?message=test';
window.open('appschema://toast?message=test');
iframe.src = 'appschema://toast?message=test';
```

#### Android

通过重写 [shouldOverrideUrlLoading](https://developer.android.com/reference/android/webkit/WebViewClient#shouldOverrideUrlLoading(android.webkit.WebView,%20android.webkit.WebResourceRequest)) 来监测链接的变化。

```java
// Java
public boolean shouldOverrideUrlLoading(WebView view, String url) {
    // url 为传入的消息
    return true;
}
```

### 1.4 JSBridge

Native 向 JS 的环境的上下文（window）注入一个对象，以供 JS 调用。

#### H5

```javascript
window.WebViewJsBridge.showTost("test");
```

#### Android

Android Native 是通过 [addJavascriptInterface](https://developer.android.com/reference/android/webkit/WebView#addJavascriptInterface(java.lang.Object,%20java.lang.String)) 来注入对象的。

```java
// Java 类
public class JSBridge {
    public vold showToast(String message) {
        // Native
    }
}
```

然后在 webview 上把上面的类对象注入进 JS 环境。

```java
webView.addJavascriptInterface(new JSBridge(), "JsBridge");
```

Android 4.2 之前，通过这个对象运行 JS 访问 `JSBridge` 所有的 public 方法，因为 Java 继承的原因，可以拿到父类的 public 方法，存在巨大的漏洞；所以在 4.2 后，只有注解为 `@JavascriptInterface` 的方法才能被注入到 JS 环境中。

```java
// Java 类
public class JSBridge {
    @JavascriptInterface
    public vold showToast(String message) {
        // Native
    }
}
```

### iOS

## 2. Native 调用 H5

Native 调用 JS 主要是通过执行 JS 代码。

### Android

#### [loadUrl](https://developer.android.com/reference/android/webkit/WebView.html#loadUrl(java.lang.String))

```java
// Java 代码
webview.loadUrl("javascript:alert('test')");
```

#### [evaluateJavascript](https://developer.android.com/reference/android/webkit/WebView.html#evaluateJavascript(java.lang.String,%20android.webkit.ValueCallback%3Cjava.lang.String%3E))

```java
// Java 代码
webview.evaluateJavascript("Math.abs(-5)", new ValueCallback<String>() {
    @Override
    public void onReceiveValue(String value) {
        // value 为返回值
    }
});
```

### iOS

```objectc
// Object-C 代码
// 首先创建JSContext 对象（此处通过当前 webView 的键获取到 jscontext）
JSContext *context=[webView valueForKeyPath:@"documentView.webView.mainFrame.javaScriptContext"];
NSString *js=@"alert('test')"; //准备执行的 js 代码
[context evaluateScript:js]; //通过 object-c 调用js
```

## 参考资料

- [JSBridge的原理](https://juejin.im/post/5abca877f265da238155b6bc.2018-03-29), by 舞动乾坤

