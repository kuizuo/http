基于 Axios 封装的 HTTP 类库

## 安装

```
npm i @kuizuo/kz-http
```

## 测试

```
let http = New Http()

http.get('https://www.example.com').then((res) => {
    console.log(res);
});
```

## 解决什么

- Node环境下自动封装响应中的Set-Cookie，供下个请求使用
- http请求失败，自动重试
- 自动补全referer和orgin参数
- 禁止重定向

