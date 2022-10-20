import qs from 'qs'
import axios from 'axios'
import type { AxiosError, AxiosInstance } from 'axios'
import type { AHttpRequestConfig, AHttpRequestHeader, AHttpResponse } from './types'
import { AxiosCanceler } from './axiosCancel'
import { cloneDeep, isFunction } from './utils'
import { ContentTypeEnum, MethodEnum } from './constants'

export class AHttp {
  public instance: AxiosInstance
  public options: AHttpRequestConfig

  constructor(options: AHttpRequestConfig = { }) {
    this.options = options
    this.instance = axios.create(options)
    this.setupInterceptors()
  }

  private getTransform() {
    const { transform } = this.options
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

  // support form-data
  supportFormData(config: AHttpRequestConfig) {
    const headers = config.headers || this.options.headers
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
    this.instance.interceptors.response.use((res: AHttpResponse<any>) => {
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
    let conf = cloneDeep(config)
    const transform = this.getTransform()

    const { beforeRequestHook, requestCatchHook, afterRequestHook }
      = transform || {}

    if (beforeRequestHook && isFunction(beforeRequestHook))
      conf = beforeRequestHook(conf)

    conf = this.supportFormData(conf)

    return new Promise((resolve, reject) => {
      this.instance
        .request<T, AHttpResponse<T>, D>(conf)
        .then((res: AHttpResponse<T>) => {
          if (afterRequestHook && isFunction(afterRequestHook)) {
            try {
              const ret = afterRequestHook(res)
              resolve(ret)
            }
            catch (err) {
              reject(err || new Error('request error!'))
            }
            return
          }
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

