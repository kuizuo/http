
import Http from '../lib/index'

let http = new Http()
// http.setProxy('119.101.105.249:30076') // 设置后所有请求都将使用代理ip

const run = async () => {
  let res = await http.get(`https://2021.ip138.com/`)
  console.log(res.data)

  // 或单个请求使用代理ip
  let res1 = await http.get(`https://2021.ip138.com/`, {
    proxy: {
      host: '119.101.105.249',
      port: 30076
    }
  })
  console.log(res1.data)
}

run()