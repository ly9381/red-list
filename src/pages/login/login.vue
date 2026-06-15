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
// import { useUserStore } from '@/store'

let type = 0
// const userStore = useUserStore()

function login() {
  uni.showToast({ title: '当前为单用户模式，暂不需要登录', icon: 'none' })

  // 登录逻辑先保留，后续需要多用户时再恢复。
  // uni.login({
  //   provider: 'weixin',
  //   success: async () => {
  //     if (await userStore.login()) {
  //       setTimeout(() => {
  //         if (type === 1) {
  //           uni.navigateBack()
  //         }
  //         else {
  //           uni.switchTab({
  //             url: '/pages/index/index',
  //           })
  //         }
  //       }, 1000)
  //     }
  //   },
  // })
}

onLoad((option) => {
  type = Number(option.type || 0)

  // 自动登录逻辑先关闭。
  // if (userStore.isLogined) {
  //   login()
  // }
})
</script>

<template>
  <view @click="login">
    <text>微信一键登录</text>
  </view>
</template>
