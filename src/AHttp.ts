import http from 'http'
import https from 'https'
import qs from 'qs'
import axios from 'axios'
import type { AxiosError, AxiosInstance } from 'axios'
import { CookieJar } from 'tough-cookie'
import { HttpCookieAgent, HttpsCookieAgent } from 'http-cookie-agent/http'
import type { AHttpRequestConfig, AHttpRequestHeader, AHttpResponse } from './types'
import { AxiosCanceler } from './axiosCancel'
import { cloneDeep, isFunction } from './utils'
import { ContentTypeEnum, MethodEnum } from './constants'

export class AHttp {
  public instance: AxiosInstance
  public config: AHttpRequestConfig
  public cookieJar!: CookieJar
  private currentUrl = ''

  constructor(config: AHttpRequestConfig = { }) {
    if (config.forbidRedirect)
      config.maxRedirects = 0

    this.config = config

    if (config.withCookie) {
      // new Store()
      this.cookieJar = new CookieJar()
      this.instance = axios.create({
        ...config,
        httpAgent: new HttpCookieAgent({ cookies: { jar: this.cookieJar } }),
        httpsAgent: new HttpsCookieAgent({ cookies: { jar: this.cookieJar } }),
      })
    }
    else { this.instance = axios.create(config) }

    this.setupInterceptors()
  }

  private getTransform() {
    const { transform } = this.config
    return transform
  }

  /**
   * @description: Set general header
   */
  setHeader(headers: AHttpRequestHeader): void {
    if (!this.instance)
      return

    Object.assign(this.instance.defaults.headers, headers)
  }

  /**
   * @description: Get general header
   */
  getHeader(): AHttpRequestHeader | {} {
    if (!this.instance)
      return {}

    return this.instance.defaults.headers
  }

  setCookie(cookie: string, url?: string) {
    if (!cookie)
      return this.cookieJar.removeAllCookiesSync()

    if (typeof cookie === 'string') {
      if (this.cookieJar && (url || this.currentUrl))
        this.cookieJar.setCookieSync(cookie, url || this.currentUrl)
    }
  }

  getCookie(key?: string, type?: 'json' | 'string', url?: string) {
    if (this.cookieJar && (url || this.currentUrl)) {
      if (key) {
        const cookie = this.cookieJar.getCookiesSync(url || this.currentUrl).find(c => c.key === key)
        return cookie ? cookie.value : ''
      }

      if (type === 'json')
        return this.cookieJar.getCookiesSync(url || this.currentUrl).map(c => ({ key: c.key, value: c.value }))

      else
        return this.cookieJar.getCookieStringSync(url || this.currentUrl)
    }

    return ''
  }

  // support form-data
  supportFormData(config: AHttpRequestConfig) {
    const headers = config.headers || this.config.headers
    const contentType = headers?.['Content-Type'] || headers?.['content-type']

    if (
      contentType !== ContentTypeEnum.FORM_URLENCODED
      || !Reflect.has(config, 'data')
      || config.method?.toUpperCase() === MethodEnum.GET
    )
      return config

    return {
      ...config,
      data: qs.stringify(config.data, { arrayFormat: 'brackets' }),
    }
  }

  /**
   * @description: Interceptor configuration
   */
  private setupInterceptors() {
    const transform = this.getTransform()
    if (!transform)
      return

    const {
      requestInterceptors,
      requestInterceptorsCatch,
      responseInterceptors,
      responseInterceptorsCatch,
    } = transform

    const axiosCanceler = new AxiosCanceler()

    // Request interceptor configuration processing
    this.instance.interceptors.request.use(
      // @ts-expect-error
      (config: AHttpRequestConfig) => {
        // If cancel repeat request is turned on, then cancel repeat request is prohibited
        const { ignoreCancelToken } = config

        !ignoreCancelToken && axiosCanceler.addPending(config)
        if (requestInterceptors && isFunction(requestInterceptors))
          config = requestInterceptors(config)

        return config
      },
      undefined,
    )

    // Request interceptor error capture
    requestInterceptorsCatch
      && isFunction(requestInterceptorsCatch)
      && this.instance.interceptors.request.use(
        undefined,
        requestInterceptorsCatch,
      )

    // Response result interceptor processing
    // @ts-expect-error
    this.instance.interceptors.response.use((res: AHttpResponse) => {
      res && axiosCanceler.removePending(res.config)
      if (responseInterceptors && isFunction(responseInterceptors))
        res = responseInterceptors(res)

      return res
    }, undefined)

    // Response result interceptor error capture
    responseInterceptorsCatch
      && isFunction(responseInterceptorsCatch)
      && this.instance.interceptors.response.use(
        undefined,
        responseInterceptorsCatch,
      )
  }

  async request<T = any, D = any, R = AHttpResponse<T>>(config: AHttpRequestConfig<D>): Promise<R> {
    let conf = cloneDeep({ ...this.config, ...config })
    const transform = this.getTransform()

    const { beforeRequestHook, requestCatchHook, afterRequestHook }
      = transform || {}

    if (beforeRequestHook && isFunction(beforeRequestHook))
      conf = beforeRequestHook(conf)

    conf = this.supportFormData(conf)

    const myConf: AHttpRequestConfig = {
      validateStatus: (status: number) => status < 500,
      httpAgent: this.config.withCookie
        ? new HttpCookieAgent({ keepAlive: true, cookies: { jar: this.cookieJar } })
        : new http.Agent({ keepAlive: true }),
      httpsAgent: this.config.withCookie
        ? new HttpsCookieAgent({ keepAlive: true, cookies: { jar: this.cookieJar }, rejectUnauthorized: !conf.unauthorized })
        : new https.Agent({ keepAlive: true, rejectUnauthorized: !conf.unauthorized }),
    }

    conf = { ...conf, ...myConf }

    this.currentUrl = conf.url || ''
    return new Promise((resolve, reject) => {
      this.instance
        .request<T, AHttpResponse<T>, D>(conf)
        .then(async (res: AHttpResponse<T>) => {
          if (afterRequestHook && isFunction(afterRequestHook)) {
            try {
              const ret = afterRequestHook(res)
              if (conf.withCookie)
                ret.cookie = await this.cookieJar?.getCookieString(conf.url || '') || ''

              resolve(ret as unknown as Promise<R>)
            }
            catch (err) {
              reject(err || new Error('request error!'))
            }
            return
          }
          if (conf.withCookie)
            res.cookie = await this.cookieJar?.getCookieString(conf.url || '') || ''
          resolve(res as unknown as Promise<R>)
        })
        .catch((e: Error | AxiosError) => {
          if (requestCatchHook && isFunction(requestCatchHook)) {
            reject(requestCatchHook(e))
            return
          }
          if (axios.isAxiosError(e)) {
            // rewrite error message from axios in here
          }
          reject(e)
        })
    })
  }

  async get<T = any, D = any, R = AHttpResponse<T>>(url: string, config?: AHttpRequestConfig<D>): Promise<R> {
    return this.request<T, D, R>({ ...config, url, method: 'GET' })
  }

  async post<T = any, D = any, R = AHttpResponse<T>>(url: string, data: D, config?: AHttpRequestConfig<D>): Promise<R> {
    return this.request<T, D, R>({ ...config, url, method: 'POST', data })
  }

  async put<T = any, D = any, R = AHttpResponse<T>>(url: string, data: D, config?: AHttpRequestConfig<D>): Promise<R> {
    return this.request<T, D, R>({ ...config, url, method: 'Put', data })
  }

  async delete<T = any, D = any, R = AHttpResponse<T>>(url: string, config?: AHttpRequestConfig<D>): Promise<R> {
    return this.request<T, D, R>({ ...config, url, method: 'Delete' })
  }
}

export const ahttp = new AHttp()
export const createHttp = (options: AHttpRequestConfig) => new AHttp(options)
