import httpAdapters from 'axios/lib/adapters/http'
import Http from '../src/index'
const http = new Http()

http.instance.defaults.adapter = httpAdapters

http.get('https://www.baidu.com').then((res) => {
  console.log(res.data)
})
