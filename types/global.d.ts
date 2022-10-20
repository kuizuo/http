import { Cookie } from '@/types';

declare module 'axios' {
  export interface AHttpResponse {
    location?: string;
    cookie?: Cookie;
    headers: RawAxiosResponseHeaders | AxiosResponseHeaders & {
      location?: string;
    }
    config: AxiosRequestConfig<D>;
  }

  export interface AxiosResponse extends AHttpResponse {}
}

