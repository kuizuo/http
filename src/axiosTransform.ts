/**
 * Data processing class, can be configured according to the project
 */
import type { AHttpRequestConfig, AHttpResponse } from './types'

export abstract class AxiosTransform {
  /**
   * @description: Process configuration before request
   */
  beforeRequestHook?: (config: AHttpRequestConfig) => AHttpRequestConfig

  /**
   * @description: Request successfully processed
   */
  afterRequestHook?: (res: AHttpResponse<any>) => AHttpResponse<any>

  /**
   * @description: 请求之前的拦截器
   */
  requestInterceptors?: (config: AHttpRequestConfig) => AHttpRequestConfig

  /**
   * @description: 请求之后的拦截器
   */
  responseInterceptors?: (res: AHttpResponse<any>) => AHttpResponse<any>

  /**
   * @description: 请求失败处理
   */
  requestCatchHook?: (error: Error) => Promise<any>

  /**
   * @description: 请求之前的拦截器错误处理
   */
  requestInterceptorsCatch?: (error: Error) => void

  /**
   * @description: 请求之后的拦截器错误处理
   */
  responseInterceptorsCatch?: (error: Error) => void
}
