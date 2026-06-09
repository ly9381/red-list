/**
 * 路由拦截，通常也是登录拦截
 * 可以设置路由白名单，或者黑名单，看业务需要选哪一个
 * 我这里应为大部分都可以随便进入，所以使用黑名单
 */
import { useUserStore } from '@/store'

// TODO Check
const loginRoute = import.meta.env.VITE_LOGIN_URL

function isLogined() {
  const userStore = useUserStore()
  return userStore.isLogined
}

// 不用登陆就可以访问的白名单页面
const whitePageList = [
  '/pages/login/login',
  '/pages/login/register',
  '/pages-sub/Help/Help',
  '/pages-sub/managerRegister/managerRegister',
]

// 黑名单登录拦截器 - （适用于大部分页面需要登录）
const navigateToInterceptor = {
  invoke({ url }: { url: string }) {
    console.log(url)
    const path = url.split('?')[0]
    const isNeedLogin = !whitePageList.includes(path)
    // 不需要登录的页面
    if (!isNeedLogin) {
      console.log('不需要登录,不拦截')
      return true
    }
    console.log('需要登录,拦截,检查是否登录')
    // 若本页面需要登录则验证登陆状态
    const hasLogin = isLogined()
    if (hasLogin) {
      console.log('已登录,不拦截')
      return true
    }
    else {
      console.log('未登录,拦截并跳转到登陆页面')
      const redirectRoute = `${loginRoute}?redirect=${encodeURIComponent(url)}`
      uni.reLaunch({ url: redirectRoute })
    }
    return false
  },
}

export const routeInterceptor = {
  install() {
    uni.addInterceptor('navigateTo', navigateToInterceptor)
    uni.addInterceptor('reLaunch', navigateToInterceptor)
    uni.addInterceptor('redirectTo', navigateToInterceptor)
    uni.addInterceptor('switchTab', navigateToInterceptor)
  },
}
