<route lang="jsonc">
{
  "layout": "tabbar",
  "style": {
    "navigationBarTitleText": "我的"
  }
}
</route>

<script setup lang="ts">
import type { ReportRecordVo, UserProfileVo } from '@/service/redList'
import { API } from '@/service'
import { DEFAULT_USER_ID, RED_LIST_REFRESH_EVENT } from '@/service/redList'
// import { useUserStore } from '@/store'

defineOptions({
  name: 'MyPage',
})

interface RecordItem {
  id: number
  type: 'red' | 'black'
  name: string
  tag: string
  desc: string
  time: string
}

interface MenuItem {
  id: number
  title: string
  desc: string
  icon: string
  tone: 'yellow' | 'blue' | 'orange' | 'green' | 'gray'
}

// const userStore = useUserStore()
// 单用户模式：暂时不走登录态，后续恢复登录时可切回 userStore.userInfo.id。
// const currentUserId = computed(() => Number(userStore.userInfo?.id || DEFAULT_USER_ID))
const currentUserId = DEFAULT_USER_ID
const profile = ref<UserProfileVo>({ userId: currentUserId })
const records = ref<RecordItem[]>([])
let myPageLoaded = false

// Mock data is kept commented after API integration.
// const mockRecords: RecordItem[] = []

const menuItems: MenuItem[] = [
  { id: 1, title: '消息通知', desc: '系统消息与通知', icon: 'i-carbon-notification', tone: 'orange' },
  { id: 2, title: '帮助反馈', desc: '问题反馈与建议', icon: 'i-carbon-chat', tone: 'green' },
  { id: 3, title: '设置', desc: '账号与隐私设置', icon: 'i-carbon-settings', tone: 'gray' },
]

function formatDate(value?: string) {
  if (!value)
    return ''
  const parsed = new Date(value.replace(/-/g, '/'))
  if (Number.isNaN(parsed.getTime()))
    return value.slice(5, 16)
  const month = `${parsed.getMonth() + 1}`.padStart(2, '0')
  const day = `${parsed.getDate()}`.padStart(2, '0')
  const hour = `${parsed.getHours()}`.padStart(2, '0')
  const minute = `${parsed.getMinutes()}`.padStart(2, '0')
  return `${month}-${day} ${hour}:${minute}`
}

function toRecord(item: ReportRecordVo, index = 0): RecordItem {
  const type = item.reportType === 'black' ? 'black' : 'red'
  return {
    id: Number(item.reportId || index),
    type,
    name: item.fullName || item.merchantName || '',
    tag: item.reportTypeName || (type === 'red' ? '红榜' : '黑榜'),
    desc: item.description || item.tags?.join('，') || '',
    time: formatDate(item.createdAt),
  }
}

async function loadMyPage() {
  const [profileRes, recordsRes] = await Promise.all([
    API.redList.my.profile(currentUserId),
    API.redList.my.recentReports({ userId: currentUserId, limit: 3 }),
  ])
  profile.value = profileRes.data || { userId: currentUserId }
  records.value = (recordsRes.data || []).map(toRecord)
}

async function refreshMyPage() {
  await loadMyPage()
  myPageLoaded = true
}

function goReport() {
  uni.switchTab({ url: '/pages/report/report' })
}

function goRecordList() {
  uni.navigateTo({ url: '/pages-sub/recordlist/recordlist' as any })
}

onLoad(() => {
  uni.$on(RED_LIST_REFRESH_EVENT, refreshMyPage)
  refreshMyPage()
})

onShow(() => {
  if (myPageLoaded)
    refreshMyPage()
})

onUnload(() => {
  uni.$off(RED_LIST_REFRESH_EVENT, refreshMyPage)
})
</script>

<template>
  <view class="my-page">
    <view class="profile-card">
      <view class="profile-main">
        <view class="avatar">
          <image v-if="profile.avatarUrl" class="avatar-image" :src="profile.avatarUrl" mode="aspectFill" />
          <view v-else class="avatar-icon i-carbon-user-avatar" />
        </view>
        <view class="profile-info">
          <view class="name-row">
            <text class="nickname">
              {{ profile.nickname || '服务器已歇逼' }}
            </text>
            <text class="level-tag">
              {{ profile.userLevel || '活跃贡献者' }}
            </text>
          </view>
          <view class="slogan">
            {{ profile.slogan || '一起维护外卖环境，分享真实体验' }}
          </view>
        </view>
        <view class="i-carbon-chevron-right profile-arrow" />
      </view>
    </view>

    <view class="section-card records-card">
      <view class="section-header">
        <view class="section-title">
          我的记录
        </view>
        <view class="section-more" @tap="goRecordList">
          <text>全部记录</text>
          <view class="i-carbon-chevron-right more-icon" />
        </view>
      </view>

      <view class="record-list">
        <view v-for="record in records" :key="record.id" class="record-row">
          <view class="record-type" :class="record.type === 'red' ? 'record-type--red' : 'record-type--black'">
            {{ record.type === 'red' ? '红' : '黑' }}
          </view>
          <view class="record-main">
            <view class="record-title-row">
              <text class="record-name">
                {{ record.name }}
              </text>
              <text class="record-tag" :class="record.type === 'red' ? 'record-tag--red' : 'record-tag--black'">
                {{ record.tag }}
              </text>
            </view>
            <view class="record-desc">
              {{ record.desc }}
            </view>
          </view>
          <view class="record-time">
            {{ record.time }}
          </view>
          <view class="i-carbon-chevron-right record-arrow" />
        </view>
      </view>
    </view>

    <view class="section-card menu-card">
      <view class="menu-grid">
        <view v-for="item in menuItems" :key="item.id" class="menu-item">
          <view class="menu-icon-wrap" :class="`menu-icon-wrap--${item.tone}`">
            <view class="menu-icon" :class="item.icon" />
          </view>
          <view class="menu-text">
            <view class="menu-title">
              {{ item.title }}
            </view>
            <view class="menu-desc">
              {{ item.desc }}
            </view>
          </view>
          <view class="i-carbon-chevron-right menu-arrow" />
        </view>
      </view>
    </view>

    <view class="thanks-card">
      <view class="thanks-icon i-carbon-badge" />
      <view class="thanks-text">
        <view class="thanks-title">
          感谢你的每一次真实分享
        </view>
        <view class="thanks-desc">
          你的一份评价，让外卖环境更美好
        </view>
      </view>
      <view class="report-button" @tap="goReport">
        <text>去上报</text>
        <view class="i-carbon-add report-plus" />
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.my-page {
  min-height: 100%;
  box-sizing: border-box;
  padding: 24rpx 30rpx 40rpx;
  color: #111318;
  font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
  background: #fff;
}

.profile-card,
.section-card,
.thanks-card {
  background: #fff;
  border: 1rpx solid #edf0f4;
  border-radius: 18rpx;
  box-shadow: 0 8rpx 24rpx rgba(25, 31, 44, 0.05);
}

.profile-card {
  padding: 36rpx;
  background: linear-gradient(135deg, #fff 0%, #fff7f2 48%, #fff1f1 100%);
  border-color: #ffd4d4;
}

.profile-main {
  display: flex;
  align-items: center;
  min-height: 124rpx;
}

.avatar {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 118rpx;
  height: 118rpx;
  overflow: hidden;
  background: linear-gradient(145deg, #ffe8e2 0%, #ffdede 100%);
  border-radius: 50%;
  box-shadow: 0 8rpx 18rpx rgba(243, 38, 38, 0.1);
}

.avatar-icon {
  width: 80rpx;
  height: 80rpx;
  color: #242832;
}

.avatar-image {
  width: 118rpx;
  height: 118rpx;
}

.profile-info {
  flex: 1;
  min-width: 0;
  margin-left: 34rpx;
}

.name-row {
  display: flex;
  align-items: center;
  min-width: 0;
}

.nickname {
  overflow: hidden;
  font-size: 38rpx;
  font-weight: 800;
  line-height: 48rpx;
  color: #111318;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.level-tag {
  flex: 0 0 auto;
  height: 34rpx;
  padding: 0 14rpx;
  margin-left: 18rpx;
  font-size: 20rpx;
  line-height: 34rpx;
  color: #f32626;
  border: 1rpx solid #ff9b9b;
  border-radius: 7rpx;
}

.slogan {
  margin-top: 14rpx;
  overflow: hidden;
  font-size: 24rpx;
  line-height: 34rpx;
  color: #48505c;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.profile-arrow {
  width: 34rpx;
  height: 34rpx;
  color: #8b929d;
}

.section-card {
  padding: 24rpx 24rpx 10rpx;
  margin-top: 22rpx;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8rpx;
}

.section-title {
  font-size: 31rpx;
  font-weight: 800;
  line-height: 42rpx;
  color: #111318;
}

.section-more {
  display: flex;
  align-items: center;
  font-size: 23rpx;
  line-height: 32rpx;
  color: #68707c;
}

.more-icon {
  width: 24rpx;
  height: 24rpx;
  margin-left: 6rpx;
}

.record-row {
  display: grid;
  grid-template-columns: 58rpx minmax(0, 1fr) 162rpx 28rpx;
  column-gap: 18rpx;
  align-items: center;
  min-height: 106rpx;
  border-bottom: 1rpx solid #edf0f4;
}

.record-row:last-child {
  border-bottom: 0;
}

.record-type {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 54rpx;
  height: 54rpx;
  font-size: 25rpx;
  font-weight: 800;
  color: #fff;
  border-radius: 50%;
}

.record-type--red {
  background: #f32626;
}

.record-type--black {
  background: #222833;
}

.record-main {
  min-width: 0;
}

.record-title-row {
  display: flex;
  align-items: center;
  min-width: 0;
}

.record-name {
  overflow: hidden;
  font-size: 24rpx;
  font-weight: 800;
  line-height: 34rpx;
  color: #111318;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.record-tag {
  flex: 0 0 auto;
  height: 30rpx;
  padding: 0 10rpx;
  margin-left: 12rpx;
  font-size: 18rpx;
  line-height: 30rpx;
  border-radius: 6rpx;
}

.record-tag--red {
  color: #f32626;
  background: #fff3f3;
  border: 1rpx solid #ffb6b6;
}

.record-tag--black {
  color: #222833;
  background: #f2f3f5;
  border: 1rpx solid #d9dde4;
}

.record-desc {
  margin-top: 8rpx;
  overflow: hidden;
  font-size: 21rpx;
  line-height: 30rpx;
  color: #59616d;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.record-time {
  font-size: 22rpx;
  line-height: 32rpx;
  color: #65707d;
  text-align: right;
}

.record-arrow {
  width: 26rpx;
  height: 26rpx;
  color: #7b838f;
}

.menu-card {
  padding: 12rpx 24rpx;
}

.menu-grid {
  display: block;
}

.menu-item {
  display: grid;
  grid-template-columns: 66rpx minmax(0, 1fr) 28rpx;
  column-gap: 16rpx;
  align-items: center;
  min-height: 112rpx;
  border-bottom: 1rpx solid #edf0f4;
}

.menu-item:nth-child(odd) {
  padding-right: 0;
  border-right: 0;
}

.menu-item:nth-child(even) {
  padding-left: 0;
}

.menu-item:last-child {
  border-bottom: 0;
}

.menu-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 54rpx;
  height: 54rpx;
  border-radius: 50%;
}

.menu-icon {
  width: 32rpx;
  height: 32rpx;
}

.menu-icon-wrap--yellow {
  color: #ffb300;
  background: #fff5df;
}

.menu-icon-wrap--blue {
  color: #2c8cff;
  background: #eaf4ff;
}

.menu-icon-wrap--orange {
  color: #ff7b1a;
  background: #fff0e5;
}

.menu-icon-wrap--green {
  color: #21b66f;
  background: #eafaf2;
}

.menu-icon-wrap--gray {
  color: #66707d;
  background: #f1f3f6;
}

.menu-text {
  min-width: 0;
}

.menu-title {
  overflow: hidden;
  font-size: 24rpx;
  font-weight: 800;
  line-height: 34rpx;
  color: #111318;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.menu-desc {
  margin-top: 6rpx;
  overflow: hidden;
  font-size: 20rpx;
  line-height: 28rpx;
  color: #67707c;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.menu-arrow {
  width: 26rpx;
  height: 26rpx;
  color: #636b76;
}

.thanks-card {
  display: flex;
  align-items: center;
  padding: 24rpx 34rpx;
  margin-top: 22rpx;
  background: linear-gradient(120deg, #fff 0%, #fff4f4 100%);
  border-color: #ffd0d0;
}

.thanks-icon {
  flex: 0 0 auto;
  width: 58rpx;
  height: 58rpx;
  color: #f6a13a;
}

.thanks-text {
  flex: 1;
  min-width: 0;
  margin-left: 24rpx;
}

.thanks-title {
  overflow: hidden;
  font-size: 25rpx;
  font-weight: 800;
  line-height: 35rpx;
  color: #111318;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.thanks-desc {
  margin-top: 8rpx;
  overflow: hidden;
  font-size: 21rpx;
  line-height: 30rpx;
  color: #616a76;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.report-button {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  height: 54rpx;
  padding: 0 22rpx;
  font-size: 24rpx;
  font-weight: 800;
  color: #f32626;
  border: 1rpx solid #f32626;
  border-radius: 28rpx;
}

.report-plus {
  width: 24rpx;
  height: 24rpx;
  margin-left: 10rpx;
}
</style>
