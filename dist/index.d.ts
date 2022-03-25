import { AxiosInstance, AxiosProxyConfig, AxiosRequestConfig } from 'axios';
interface Cookie {
    [prop: string]: string;
}
export interface Header {
    Origin?: string;
    Referer?: string;
    Cookie?: string;
    'User-Agent'?: string;
    Connection?: string;
    [propName: string]: any;
}
export interface Response<T = any> {
    data: T;
    status: number;
    statusText: string;
    headers: Header;
    config: AxiosRequestConfig;
    location?: string;
    cookies?: Cookie;
    request?: any;
}
export default class Http {
    instance: AxiosInstance;
    auto: boolean;
    cookies: Cookie;
    headers: Header;
    redirect: boolean;
    protected proxy: AxiosProxyConfig;
    constructor(auto?: boolean, retryConfig?: {
        retries: number;
        delay: number;
    });
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
export {};
