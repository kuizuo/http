import type { AxiosProxyConfig, AxiosRequestConfig, AxiosResponse, AxiosResponseHeaders, RawAxiosResponseHeaders } from 'axios'
import type { AxiosTransform } from './axiosTransform'

export type Cookie = Record<string, string>

type AHttpHeaderValue = string | string[] | number | boolean | null

export type AHttpRequestHeader = Record<string, AHttpHeaderValue> & {
  'user-agent'?: string
  'content-type'?: string
  'referer'?: string
  'origin'?: string
  'connection'?: string
  'accept-encoding'?: string
  'accept-language'?: string
  'accept'?: string
  'cookie'?: string
}

export interface AHttpRequestConfig<D = any> extends AxiosRequestConfig {
  data?: D
  redirect?: boolean
  headers?: AHttpRequestHeader
  proxy?: AxiosProxyConfig
  transform?: AxiosTransform
  ignoreCancelToken?: boolean
}

export interface AHttpResponse<T = any, D = any> extends AxiosResponse {
  data: T
  status: number
  statusText: string
  headers: RawAxiosResponseHeaders | AxiosResponseHeaders & { location?: string }
  config: AHttpRequestConfig<D>
  request?: any
  location?: string
  cookie?: Cookie
}
