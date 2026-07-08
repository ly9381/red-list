import type { ApiResult } from './types'
import type { CustomRequestOptions } from '@/http/interceptor'
import { http } from '@/http/http'

type Query = Record<string, any>
type Header = Record<string, any>

interface RedListHttp {
  get: <T>(url: string, query?: Query, header?: Header, options?: Partial<CustomRequestOptions>) => Promise<ApiResult<T>>
  post: <T>(url: string, data?: any, query?: Query, header?: Header, options?: Partial<CustomRequestOptions>) => Promise<ApiResult<T>>
  put: <T>(url: string, data?: any, query?: Query, header?: Header, options?: Partial<CustomRequestOptions>) => Promise<ApiResult<T>>
  delete: <T>(url: string, query?: Query, header?: Header, options?: Partial<CustomRequestOptions>) => Promise<ApiResult<T>>
}

export const redListHttp = http as typeof http & RedListHttp
