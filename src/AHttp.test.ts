import axios from 'axios'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { AHttp } from './AHttp'

interface Data {
  name: string
}

interface Result {
  code: number
  data: Data
}

const result = {
  code: 200,
  message: 'success',
  data: {
    name: 'ahttp',
  },
}

const restHandlers = [
  // @ts-expect-error
  ...['get', 'post', 'put', 'delete'].map((m: 'get' | 'post' | 'put' | 'delete') => {
    return rest[m]('https://example.com/api/user', (req, res, ctx) => res(ctx.status(200), ctx.json(result), ctx.cookie('name', 'ahttp')))
  }),
]

const server = setupServer(...restHandlers)

// 在所有测试之前启动服务器
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

// 所有测试后关闭服务器
afterAll(() => server.close())

// 每次测试后重置处理程序 `对测试隔离很重要`
afterEach(() => server.resetHandlers())

describe('AHttp', () => {
  it('http constructor', async () => {
    const http = new AHttp({
      headers: { 'user-agent': 'ahttp' },
    })

    expect(http).toBeDefined()
    expect(http).toBeInstanceOf(AHttp)

    expect(http.config.headers!['user-agent']).toBe('ahttp')
  })

  it('http proxy', async () => {
    const http = new AHttp({
      proxy: {
        host: '127.0.0.1',
        port: 8888,
      },
    })

    expect(http.config.proxy).toBeDefined()
    expect(http.config.proxy!.host).toBe('127.0.0.1')
    expect(http.config.proxy!.port).toBe(8888)
  })

  it('http interceptor', async () => {
    const http = new AHttp({
      transform: {
        beforeRequestHook: (config) => {
          console.log('beforeRequestHook')
          return config
        },
        requestInterceptors: (config) => {
          console.log('requestInterceptors')
          return config
        },
        responseInterceptors: (res) => {
          console.log('responseInterceptors')
          return res
        },
        afterRequestHook: (res) => {
          console.log('afterRequestHook')
          return res
        },
      },
    })

    await http.get<Result>('https://example.com/api/user')

    expect(http.config.transform).toBeDefined()
    expect(http.config.transform!.beforeRequestHook).toBeDefined()
    expect(http.config.transform!.requestInterceptors).toBeDefined()
    expect(http.config.transform!.responseInterceptors).toBeDefined()
    expect(http.config.transform!.afterRequestHook).toBeDefined()
  })

  it('http cancel', async () => {
    const source = axios.CancelToken.source()
    const http = new AHttp({})

    http.get('/user/1', {
      cancelToken: source.token,
    }).catch((thrown) => {
      if (axios.isCancel(thrown)) {
        console.log('Request canceled', thrown.message)
      }
      else {
        // 处理错误
      }
    })

    // 取消请求（message 参数是可选的）
    source.cancel('cancel this request')
  })

  it('http cookie', async () => {
    // ensure config withCookie is true in new AHttp
    const http = new AHttp({ withCookie: true, unauthorized: true })

    expect(http.config.withCookie).to.true
    const res1 = await http.get('https://example.com/api/user')

    expect(res1.cookie).toEqual('name=ahttp')
    expect(http.getCookie()).toEqual('name=ahttp')
    expect(http.getCookie('name')).toEqual('ahttp')

    const res2 = await http.get('https://example.com/api/user')
    expect(res2.cookie).toEqual('name=ahttp')
  })
})

describe('http request method', () => {
  const http = new AHttp()

  it('request', async () => {
    const res = await http.request<Result>({ url: 'https://example.com/api/user' })

    expect(http.request).toBeDefined()
    expect(res.status).toBe(200)
    expect(res.data.data.name).toBe('ahttp')
  })

  it('get', async () => {
    const res = await http.get<Result>('https://example.com/api/user')

    expect(http.request).toBeDefined()
    expect(res.status).toBe(200)
    expect(res.data.data.name).toBe('ahttp')
  })

  it('post', async () => {
    const data: Data = { name: 'ahttp' }
    const res = await http.post<Result, Data>('https://example.com/api/user', data)

    expect(http.post).toBeDefined()
    expect(JSON.parse((res.config.data))).toEqual(data)
    expect(res.status).toBe(200)
    expect(res.data.data.name).toBe('ahttp')
  })

  it('put', async () => {
    const data: Data = { name: 'ahttp' }
    const res = await http.put<Result, Data>('https://example.com/api/user', data)

    expect(http.put).toBeDefined()
    expect(JSON.parse((res.config.data))).toEqual(data)
    expect(res.status).toBe(200)
    expect(res.data.data.name).toBe('ahttp')
  })

  it('delete', async () => {
    const res = await http.delete<Result>('https://example.com/api/user')

    expect(http.delete).toBeDefined()
    expect(res.status).toBe(200)
  })

  // it.skip('get', async () => {
  //   const spy = await vi.spyOn(http, 'get').mockResolvedValue(result)
  //   const res = await http.get<Result>('user')

  //   expect(http.get).toBeDefined()
  //   expect(res).toBe(result)
  //   expect(spy).toHaveBeenCalled()
  //   expect(spy).toHaveReturnedWith(result)

  //   expect(http.request).toBeDefined()
  //   expect(res.status).toBe(200)
  //   expect(res.data.data.name).toBe('ahttp')
  // })
})

