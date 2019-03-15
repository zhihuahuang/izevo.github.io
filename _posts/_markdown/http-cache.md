# HTTP 缓存

## 简介

在 HTTP 中，客户端会发起请求，向服务端请求某些资源，例如图片。而这些图片通常很长一段时间不会发生变化，所以如果将这些资源缓存起来，下次再想获取这些资源时，就可以从缓存中获取。这样一是能减少网络请求的数据量，节省带宽；二是能减小服务端的压力。

那 HTTP 缓存的策略是怎么样的？谁来决定是否该缓存，又需要缓存多久，缓存又存储在哪呢？

## 缓存的存储

HTTP 的缓存通常是存储在客户端的，或者一些中间的代理服务器上。

## 缓存的策略

HTTP 缓存其实可以分为两大类：**强缓存**与**协商缓存**。

### 强缓存

客户端向服务端请求资源，服务端会在 **HTTP 响应**里告诉客户端这个资源应该缓存的时间；客户端在缓存时间过期之前，不再向服务端发起请求，直接从缓存中获取资源。

这种方法的缺点就是服务端资源更新了，客户端不能及时更新，除非等到缓存过期。

#### Expires（响应，HTTP 1.0）

`Expires` 响应头的值为一个 HTTP 日期时间，这个时间即时缓存的到期时间。

```
Expires: Wed, 21 Oct 2015 11:25:00 GMT
```

它的缺点是，客户端时间有可能跟服务端时间不同步，那么有可能缓存策略不会生效。

#### Pragma（响应，HTTP 1.0）

HTTP 1.0 中控制缓存策略的字段，由于它没有明确的规范，所以具体字段值及缓存策略依赖于实现方，已经被弃用。

#### Cache-Control（请求，响应，HTTP 1.1）

在 HTTP 1.1 版本中，引入了 `Cache-Control` 头。使用这个字段可以有效地解决上面的问题。

注意：这个头字段是可以出现在响应中，也可以出现在请求中。 

例如，在响应中设置缓存时间：

```
Cache-Control: max-age=86400
```

max-age 后面的值为一个整型数值，代表缓存的相对时间，单位为秒。即在相对于当前时间多少秒后缓存会过期，这里为 86400 秒，也就是 1 天后缓存过期。这就可以有效的解决客户端时间与服务端时间不同步的问题。

除了设置缓存相对时间外，`Cache-Control` 还有更多的控制策略。

##### 请求中的 Cache-Control

在请求中 `Cache-Control` 可以设置为以下值：

```
Cache-Control: max-age=<seconds>
Cache-Control: max-stale[=<seconds>]
Cache-Control: min-fresh=<seconds>
Cache-Control: no-cache 
Cache-Control: no-store
Cache-Control: no-transform
Cache-Control: only-if-cached
```

- max-age — 缓存的相对时间，单位为秒。
- no-cache — 使用协商缓存
- no-store — 不使用缓存

##### 响应中的 Cache-Contorl

响应中的 `Cache-Control` 可以设置为以下值：

```
Cache-Control: must-revalidate
Cache-Control: no-cache
Cache-Control: no-store
Cache-Control: no-transform
Cache-Control: public
Cache-Control: private
Cache-Control: proxy-revalidate
Cache-Control: max-age=<seconds>
Cache-Control: s-maxage=<seconds>
```

### 协商缓存

客户端请求资源，服务端在响应头中告诉告诉客户端这个资源的一个校验值，客户端会将这个资源缓存起来，但是下次客户端获取资源的时候，先向服务端发起一个请求，请求头中带上这个校验值，服务端会对这个校验值进行校验，判断服务端的资源是否存在更新，如果存在更新，则返回更新的资源，否则只会返回状态码 `304 Not Modified` 告诉客户端，你应该使用本地缓存的资源。

这种方案相比于强缓存的好处是，客户端能及时获取更新的资源。缺点就是哪怕使用缓存，也需要向服务端发送一次请求（但这次请求的数据量很小）。

#### Last-Modify（响应，HTTP 1.0）

`Last-Modify` 的值为服务端资源最后一次的修改时间。同样也是一个 HTTP 日期时间。

```
Last-Modify: Sat, 27 Jun 2015 16:48:38 GMT
```

#### If-Modified-Since（请求，HTTP 1.0）

客户端下次请求资源时，会请求中使用 `If-Modified-Since` 字段，将 `Last-Modify` 中的时间带上，以便服务端进行校验资源是否更新。

```
If-Modified-Since: Sat, 27 Jun 2015 16:48:38 GMT
```

#### E-Tag

E-Tag 的值为一个字符串，可以理解为资源的指纹（或者Hash值）。E-Tag 的生成算法没有明确指定，所以可以使用任何一种算法来计算资源的指纹，例如 MD5。

```
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
```

#### If-Match

同理，`If-Match` 会带上 E-Tag 中的值，以便服务端校验资源是否更新。

```
If-Match: "33a64df551425fcc55e4d42a148795d9f25f89d4"
```

注意：`ETag/If-Match` 的优先级会大于 `Last-Modify/If-Modified-Since`。



