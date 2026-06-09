import { http } from '@/http/http'

/**
 * @file user.ts
 * @author ikbye
 * @createDate 2025-5-20
 */

/**
 * @desc 获取手机号
 * @param {string} code 动态令牌
 * @returns {Promise<any>}
 */
export function getPhoneNumber(code: string) {
  return http.get('/user/get-phone-number', { code })
}

/**
 * @desc 获取用户信息
 * @returns {Promise<any>}
 */
export function getUserInfo() {
  return http.get('/user/info')
}

/**
 * @desc 请求登录
 * @param {string} jsCode js_code
 * @returns {Promise<any>}
 */
export function login(jsCode: string) {
  return http.post('/login/user', { jsCode })
}

/**
 * @desc 暴力登录
 * @returns {Promise<any>}
 */
export function loginBAOLI() {
  return http.get('/user/login')
}

/**
 * 退出登录
 */
export function logout() {
  return http.get<void>('/user/logout')
}

/**
 * @desc 修改用户信息å
 * @param {any} data 用户信息
 * @returns {Promise<any>}
 */
export function updateInfo(data: IUserInfo) {
  return http.post('/user/update', { ...data })
}
