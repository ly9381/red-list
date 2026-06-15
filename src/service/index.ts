import { redListApi } from '@/service/redList'
/**
 * @file index.js
 * @author ikbye
 * @createDate 2025-5-20
 */
import * as userApi from '@/service/user/user'

// 接口引用统一导出
export const API = {
  user: { ...userApi },
  redList: redListApi,
}
