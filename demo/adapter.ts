import Http from '../lib/index'
import httpAdapters from 'axios/lib/adapters/http'
let http = new Http()

http.instance.defaults.adapter = httpAdapters

http.get('https://www.baidu.com').then((res) => {
  console.log(res.data)
})
