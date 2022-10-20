import { Cookie, AHttpRequestConfig, AHttpResponse } from '@/types';

declare module 'axios' {

  export class Axios {
    interceptors: {
      request: AxiosInterceptorManager<AHttpRequestConfig>;
      response: AxiosInterceptorManager<AHttpResponse>;
    }
  }
}

