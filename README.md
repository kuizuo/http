基于 Axios 封装的 HTTP 类库

## Why

axios 无论对于浏览器还是Node端使用无疑是优秀的，但对于协议复现（爬虫）而言，还欠缺一些。例如 cookie 的存储，禁止重定向，以及一些特殊的协议头。而本库就是针对协议复现，对 axios 进行了一些封装，使其更易调用。


## Install

```
pnpm i @kuizuo/http
```

## Usage

```js
import { AHttp } from '@kuizuo/http'

const http = new AHttp()

http.get('https://www.example.com').then((res) => {
  console.log(res)
})
```

更多参见 [example](./example)

## Resolve

- Node 环境下自动封装响应中的 Set-Cookie 到 CookieJar 
- http 请求失败，自动重试
- 自动补全 referer 和 orgin 参数
- 可配置是否重定向(默认重定向)
- 完善的类型定义

## License

[MIT](./LICENSE) License © 2022-PRESENT [Kuizuo](https://github.com/kuizuo)
