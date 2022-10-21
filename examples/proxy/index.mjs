import { AHttp } from '@kuizuo/http'

const http = new AHttp()

const res1 = await http.get('https://2022.ip138.com/')
console.log(res1.data)

const res2 = await http.get('https://2022.ip138.com/', {
  proxy: {
    host: '127.0.0.1',
    port: 8888,
  },
})
console.log(res2.data)
