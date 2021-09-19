import Http from '../lib/index'
import * as iconv from 'iconv-lite'

let http = new Http()
http.get(`https://www.ip138.com/`, {
  responseType: 'arraybuffer',
  transformResponse: [
    function (data) {
      return iconv.decode(data, 'gbk')
    }
  ]
}).then((res) => {
  console.log(res.data)
})