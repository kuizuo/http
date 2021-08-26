import { AxiosInstance, AxiosProxyConfig, AxiosRequestConfig } from 'axios';
export interface Header {
    Origin?: string;
    Referer?: string;
    Cookie?: string | object;
    'User-Agent'?: string;
    Connection?: string;
    [propName: string]: any;
}
export interface Response<T = any> {
    data: T;
    status: number;
    statusText: string;
    headers: Header;
    location?: string;
    cookies?: object;
    config: AxiosRequestConfig;
    request?: any;
}
export declare class Http {
    instance: AxiosInstance;
    auto: boolean;
    cookies: object;
    headers: Header;
    redirect: boolean;
    protected proxy: AxiosProxyConfig;
    constructor(auto?: boolean, retryConfig?: any);
    request(config: AxiosRequestConfig): Promise<Response<any>>;
    get(url: string, config?: AxiosRequestConfig): Promise<Response<any>>;
    post(url: string, data: any, config?: AxiosRequestConfig): Promise<Response<any>>;
    put(url: string, data: any, config?: AxiosRequestConfig): Promise<Response<any>>;
    delete(url: string, config?: AxiosRequestConfig): Promise<Response<any>>;
    init(): void;
    setCookies(cookies?: string | object): void;
    setHeader(key: string, val?: string): void;
    setHeaders(headers: Header): void;
    setUserAgent(userAgent: string): void;
    setFakeIP(ip: string): void;
    setProxy(p: string | null): void;
}
export declare function cookies2Obj(cookies: string): {};
export declare function obj2Cookies(obj: any): string;
export declare function mergeCookie(c1: any, c2: any): any;
export declare function getFakeIP(): string;
