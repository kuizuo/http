/**
 * @description: request method
 */
declare enum MethodEnum {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"
}
/**
 * @description: contentType
 */
declare enum ContentTypeEnum {
    JSON = "application/json;charset=UTF-8",
    FORM_URLENCODED = "application/x-www-form-urlencoded;charset=UTF-8",
    FORM_DATA = "multipart/form-data;charset=UTF-8"
}

declare const isFunction: <T extends Function>(val: any) => val is T;
declare const cloneDeep: <T>(val: T) => T;
/**
 *
 * @returns {string} - The fake ip
 */
declare const fakeIp: () => string;

// TypeScript Version: 4.1
type AxiosHeaderValue = AxiosHeaders | string | string[] | number | boolean | null;
type RawAxiosHeaders = Record<string, AxiosHeaderValue>;

type MethodsHeaders = {
  [Key in Method as Lowercase<Key>]: AxiosHeaders;
};

interface CommonHeaders  {
  common: AxiosHeaders;
}

type AxiosHeaderMatcher = (this: AxiosHeaders, value: string, name: string, headers: RawAxiosHeaders) => boolean;

type AxiosHeaderSetter = (value: AxiosHeaderValue, rewrite?: boolean | AxiosHeaderMatcher) => AxiosHeaders;

type AxiosHeaderGetter = ((parser?: RegExp) => RegExpExecArray | null) |
    ((matcher?: AxiosHeaderMatcher) => AxiosHeaderValue);

type AxiosHeaderTester = (matcher?: AxiosHeaderMatcher) => boolean;

declare class AxiosHeaders {
  constructor(
      headers?: RawAxiosHeaders | AxiosHeaders,
      defaultHeaders?: RawAxiosHeaders | AxiosHeaders
  );

  set(headerName?: string, value?: AxiosHeaderValue, rewrite?: boolean | AxiosHeaderMatcher): AxiosHeaders;
  set(headers?: RawAxiosHeaders | AxiosHeaders, rewrite?: boolean): AxiosHeaders;

  get(headerName: string, parser: RegExp): RegExpExecArray | null;
  get(headerName: string, matcher?: true | AxiosHeaderMatcher): AxiosHeaderValue;

  has(header: string, matcher?: true | AxiosHeaderMatcher): boolean;

  delete(header: string | string[], matcher?: AxiosHeaderMatcher): boolean;

  clear(): boolean;

  normalize(format: boolean): AxiosHeaders;

  toJSON(asStrings?: boolean): RawAxiosHeaders;

  static from(thing?: AxiosHeaders | RawAxiosHeaders | string): AxiosHeaders;

  static accessor(header: string | string[]): AxiosHeaders;

  setContentType: AxiosHeaderSetter;
  getContentType: AxiosHeaderGetter;
  hasContentType: AxiosHeaderTester;

  setContentLength: AxiosHeaderSetter;
  getContentLength: AxiosHeaderGetter;
  hasContentLength: AxiosHeaderTester;

  setAccept: AxiosHeaderSetter;
  getAccept: AxiosHeaderGetter;
  hasAccept: AxiosHeaderTester;

  setUserAgent: AxiosHeaderSetter;
  getUserAgent: AxiosHeaderGetter;
  hasUserAgent: AxiosHeaderTester;

  setContentEncoding: AxiosHeaderSetter;
  getContentEncoding: AxiosHeaderGetter;
  hasContentEncoding: AxiosHeaderTester;
}

type RawAxiosRequestHeaders = Partial<RawAxiosHeaders & MethodsHeaders & CommonHeaders>;

type AxiosRequestHeaders = Partial<RawAxiosHeaders & MethodsHeaders & CommonHeaders> & AxiosHeaders;

type RawAxiosResponseHeaders = Partial<Record<string, string> & {
  "set-cookie"?: string[]
}>;

type AxiosResponseHeaders = RawAxiosResponseHeaders & AxiosHeaders;

interface AxiosRequestTransformer {
  (this: AxiosRequestConfig, data: any, headers: AxiosRequestHeaders): any;
}

interface AxiosResponseTransformer {
  (this: AxiosRequestConfig, data: any, headers: AxiosResponseHeaders, status?: number): any;
}

interface AxiosAdapter {
  (config: AxiosRequestConfig): AxiosPromise;
}

interface AxiosBasicCredentials {
  username: string;
  password: string;
}

interface AxiosProxyConfig {
  host: string;
  port: number;
  auth?: {
    username: string;
    password: string;
  };
  protocol?: string;
}

type Method =
    | 'get' | 'GET'
    | 'delete' | 'DELETE'
    | 'head' | 'HEAD'
    | 'options' | 'OPTIONS'
    | 'post' | 'POST'
    | 'put' | 'PUT'
    | 'patch' | 'PATCH'
    | 'purge' | 'PURGE'
    | 'link' | 'LINK'
    | 'unlink' | 'UNLINK';

type ResponseType =
    | 'arraybuffer'
    | 'blob'
    | 'document'
    | 'json'
    | 'text'
    | 'stream';

type responseEncoding =
    | 'ascii' | 'ASCII'
    | 'ansi' | 'ANSI'
    | 'binary' | 'BINARY'
    | 'base64' | 'BASE64'
    | 'base64url' | 'BASE64URL'
    | 'hex' | 'HEX'
    | 'latin1' | 'LATIN1'
    | 'ucs-2' | 'UCS-2'
    | 'ucs2' | 'UCS2'
    | 'utf-8' | 'UTF-8'
    | 'utf8' | 'UTF8'
    | 'utf16le' | 'UTF16LE';

interface TransitionalOptions {
  silentJSONParsing?: boolean;
  forcedJSONParsing?: boolean;
  clarifyTimeoutError?: boolean;
}

interface GenericAbortSignal {
  readonly aborted: boolean;
  onabort?: ((...args: any) => any) | null;
  addEventListener?: (...args: any) => any;
  removeEventListener?: (...args: any) => any;
}

interface FormDataVisitorHelpers {
  defaultVisitor: SerializerVisitor;
  convertValue: (value: any) => any;
  isVisitable: (value: any) => boolean;
}

interface SerializerVisitor {
  (
      this: GenericFormData,
      value: any,
      key: string | number,
      path: null | Array<string | number>,
      helpers: FormDataVisitorHelpers
  ): boolean;
}

interface SerializerOptions {
  visitor?: SerializerVisitor;
  dots?: boolean;
  metaTokens?: boolean;
  indexes?: boolean | null;
}

// tslint:disable-next-line
interface FormSerializerOptions extends SerializerOptions {
}

interface ParamEncoder {
  (value: any, defaultEncoder: (value: any) => any): any;
}

interface CustomParamsSerializer {
  (params: Record<string, any>, options?: ParamsSerializerOptions): string;
}

interface ParamsSerializerOptions extends SerializerOptions {
  encode?: ParamEncoder;
  serialize?: CustomParamsSerializer;
}

type MaxUploadRate = number;

type MaxDownloadRate = number;

interface AxiosProgressEvent {
  loaded: number;
  total?: number;
  progress?: number;
  bytes: number;
  rate?: number;
  estimated?: number;
  upload?: boolean;
  download?: boolean;
}

type Milliseconds = number;

interface AxiosRequestConfig<D = any> {
  url?: string;
  method?: Method | string;
  baseURL?: string;
  transformRequest?: AxiosRequestTransformer | AxiosRequestTransformer[];
  transformResponse?: AxiosResponseTransformer | AxiosResponseTransformer[];
  headers?: RawAxiosRequestHeaders;
  params?: any;
  paramsSerializer?: ParamsSerializerOptions;
  data?: D;
  timeout?: Milliseconds;
  timeoutErrorMessage?: string;
  withCredentials?: boolean;
  adapter?: AxiosAdapter;
  auth?: AxiosBasicCredentials;
  responseType?: ResponseType;
  responseEncoding?: responseEncoding | string;
  xsrfCookieName?: string;
  xsrfHeaderName?: string;
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
  onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void;
  maxContentLength?: number;
  validateStatus?: ((status: number) => boolean) | null;
  maxBodyLength?: number;
  maxRedirects?: number;
  maxRate?: number | [MaxUploadRate, MaxDownloadRate];
  beforeRedirect?: (options: Record<string, any>, responseDetails: {headers: Record<string, string>}) => void;
  socketPath?: string | null;
  httpAgent?: any;
  httpsAgent?: any;
  proxy?: AxiosProxyConfig | false;
  cancelToken?: CancelToken;
  decompress?: boolean;
  transitional?: TransitionalOptions;
  signal?: GenericAbortSignal;
  insecureHTTPParser?: boolean;
  env?: {
    FormData?: new (...args: any[]) => object;
  };
  formSerializer?: FormSerializerOptions;
}

interface HeadersDefaults {
  common: RawAxiosRequestHeaders;
  delete: RawAxiosRequestHeaders;
  get: RawAxiosRequestHeaders;
  head: RawAxiosRequestHeaders;
  post: RawAxiosRequestHeaders;
  put: RawAxiosRequestHeaders;
  patch: RawAxiosRequestHeaders;
  options?: RawAxiosRequestHeaders;
  purge?: RawAxiosRequestHeaders;
  link?: RawAxiosRequestHeaders;
  unlink?: RawAxiosRequestHeaders;
}

interface AxiosDefaults<D = any> extends Omit<AxiosRequestConfig<D>, 'headers'> {
  headers: HeadersDefaults;
}

interface AxiosResponse<T = any, D = any>  {
  data: T;
  status: number;
  statusText: string;
  headers: RawAxiosResponseHeaders | AxiosResponseHeaders;
  config: AxiosRequestConfig<D>;
  request?: any;
}

type AxiosPromise<T = any> = Promise<AxiosResponse<T>>;

interface Cancel {
  message: string | undefined;
}

interface CancelToken {
  promise: Promise<Cancel>;
  reason?: Cancel;
  throwIfRequested(): void;
}

interface AxiosInterceptorOptions {
  synchronous?: boolean;
  runWhen?: (config: AxiosRequestConfig) => boolean;
}

interface AxiosInterceptorManager<V> {
  use(onFulfilled?: (value: V) => V | Promise<V>, onRejected?: (error: any) => any, options?: AxiosInterceptorOptions): number;
  eject(id: number): void;
  clear(): void;
}

declare class Axios {
  constructor(config?: AxiosRequestConfig);
  defaults: AxiosDefaults;
  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>;
    response: AxiosInterceptorManager<AxiosResponse>;
  };
  getUri(config?: AxiosRequestConfig): string;
  request<T = any, R = AxiosResponse<T>, D = any>(config: AxiosRequestConfig<D>): Promise<R>;
  get<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
  delete<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
  head<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
  options<T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
  post<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
  put<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
  patch<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
  postForm<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
  putForm<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
  patchForm<T = any, R = AxiosResponse<T>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
}

interface AxiosInstance extends Axios {
  <T = any, R = AxiosResponse<T>, D = any>(config: AxiosRequestConfig<D>): Promise<R>;
  <T = any, R = AxiosResponse<T>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;

  defaults: Omit<AxiosDefaults, 'headers'> & {
    headers: HeadersDefaults & {
      [key: string]: AxiosHeaderValue
    }
  };
}

interface GenericFormData {
  append(name: string, value: any, options?: any): any;
}

/**
 * Data processing class, can be configured according to the project
 */

declare abstract class AxiosTransform {
    /**
     * @description: Process configuration before request
     */
    beforeRequestHook?: (config: AHttpRequestConfig) => AHttpRequestConfig;
    /**
     * @description: Request successfully processed
     */
    afterRequestHook?: (res: AHttpResponse<any>) => any;
    /**
     * @description: 请求之前的拦截器
     */
    requestInterceptors?: (config: AHttpRequestConfig) => AHttpRequestConfig;
    /**
     * @description: 请求之后的拦截器
     */
    responseInterceptors?: (res: AHttpResponse<any>) => AHttpResponse<any>;
    /**
     * @description: 请求失败处理
     */
    requestCatchHook?: (error: Error) => Promise<any>;
    /**
     * @description: 请求之前的拦截器错误处理
     */
    requestInterceptorsCatch?: (error: Error) => void;
    /**
     * @description: 请求之后的拦截器错误处理
     */
    responseInterceptorsCatch?: (error: Error) => void;
}

declare type Cookie = Record<string, string>;
declare type AHttpHeaderValue = string | string[] | number | boolean | null;
declare type AHttpRequestHeader = Record<string, AHttpHeaderValue> & {
    'user-agent'?: string;
    'content-type'?: string;
    'referer'?: string;
    'origin'?: string;
    'connection'?: string;
    'accept-encoding'?: string;
    'accept-language'?: string;
    'accept'?: string;
    'cookie'?: string;
};
interface AHttpRequestConfig<D = any> extends AxiosRequestConfig {
    data?: D;
    redirect?: boolean;
    headers?: AHttpRequestHeader;
    proxy?: AxiosProxyConfig;
    transform?: AxiosTransform;
    ignoreCancelToken?: boolean;
}
interface AHttpResponse<T = any, D = any> extends AxiosResponse {
    data: T;
    status: number;
    statusText: string;
    headers: RawAxiosResponseHeaders | AxiosResponseHeaders & {
        location?: string;
    };
    config: AHttpRequestConfig<D>;
    request?: any;
    location?: string;
    cookie?: Cookie;
}

declare class AHttp {
    instance: AxiosInstance;
    options: AHttpRequestConfig;
    constructor(options?: AHttpRequestConfig);
    private getTransform;
    /**
     * @description: Set general header
     */
    setHeader(headers: AHttpRequestHeader): void;
    supportFormData(config: AHttpRequestConfig): AHttpRequestConfig<any>;
    /**
     * @description: Interceptor configuration
     */
    private setupInterceptors;
    request<T = any, D = any, R = AHttpResponse<T>>(config: AHttpRequestConfig<D>): Promise<R>;
    get<T = any, D = any, R = AHttpResponse<T>>(url: string, config?: AHttpRequestConfig<D>): Promise<R>;
    post<T = any, D = any, R = AHttpResponse<T>>(url: string, data: D, config?: AHttpRequestConfig<D>): Promise<R>;
    put<T = any, D = any, R = AHttpResponse<T>>(url: string, data: D, config?: AHttpRequestConfig<D>): Promise<R>;
    delete<T = any, D = any, R = AHttpResponse<T>>(url: string, config?: AHttpRequestConfig<D>): Promise<R>;
}

export { AHttp, AHttpRequestConfig, AHttpRequestHeader, AHttpResponse, ContentTypeEnum, Cookie, MethodEnum, cloneDeep, fakeIp, isFunction };
