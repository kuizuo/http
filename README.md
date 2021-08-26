基于 Axios 封装的 HTTP 类库

## 安装

```
npm i kz-http -S
```

## 测试

```js
import Http from 'kz-http';

let http = new Http();

http.get('https://www.example.com').then((res) => {
  console.log(res);
});
```

## 解决什么

- Node 环境下自动封装响应中的 Set-Cookie，供下个请求使用
- http 请求失败，自动重试
- 自动补全 referer 和 orgin 参数
- 禁止重定向
