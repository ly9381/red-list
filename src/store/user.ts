import { defineStore } from 'pinia'
import { ref } from 'vue'
import { API } from '@/service'
import { toast } from '@/utils/toast'

export interface LoginInfo {
  token: string
  id: number
}

// 初始化状态(预设默认信息)
const userInfoState: IUserInfo = {
  nickname: '',
  avatar: '',
  openid: '',
  token: '',
  address: '',
  email: '',
  id: 1,
  idCardNumber: '',
  phone: '',
  realName: '',
}

export const useUserStore = defineStore(
  'user',
  () => {
    // 定义用户信息
    const userInfo = ref<IUserInfo>({ ...userInfoState })
    const token = ref<string>('')
    const isLogined = computed(() => !!token.value)
    // 设置用户信息
    const setUserInfo = (val: IUserInfo) => {
      userInfo.value = { ...val }
    }
    // 设置token
    const setToken = (val: string) => {
      token.value = val
    }
    /**
     * 用户登录
     * @returns R<IUserLogin>
     */
    const login = async () => {
      const loginRes = await API.user.loginBAOLI() as IResData<LoginInfo>
      const loginInfo: LoginInfo = loginRes.data
      toast.success('登录成功')
      setToken(loginInfo.token)
      const userRes = await API.user.getUserInfo() as IResData<IUserInfo>
      const userInfo: IUserInfo = userRes.data
      setUserInfo(userInfo)
      // TODO 这里可以增加获取用户路由的方法 根据用户的角色动态生成路由
      return true
    }
    /**
     * 删除用户信息
     */
    const logout = async () => {
      userInfo.value = { ...userInfoState }
    }

    return {
      userInfo,
      token,
      isLogined,
      login,
      logout,
    }
  },
  {
    persist: true,
  },
)
