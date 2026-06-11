<route lang="json5">
{
  "layout": "tabbar",
  style: {
    navigationBarTitleText: '海星优家',
    navigationStyle: 'custom',
  },
}
</route>

<script setup type="ts">
import { useUserStore } from '@/store'

// 0为正常跳转，1为跳转回原来的页面
let type = 0
const userStore = useUserStore()
function login(code) {
  uni.login({
    provider: 'weixin',
    success: async (loginRes) => {
      if (await userStore.login()) {
        setTimeout(() => {
          if (type === 1) {
            uni.navigateBack()
          }
          else {
            uni.switchTab({
              url: '/pages/index/index',
            })
          }
        }, 1000)
      }
    },
  })
}

onLoad((option) => {
  type = option.type

  // 自动登录逻辑
  if (userStore.isLogined) {
    login()
  }
})
</script>

<template>
  <view @click="login">
    <text>微信一键登录</text>
  </view>
</template>
