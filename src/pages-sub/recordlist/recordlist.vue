<route lang="jsonc">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "全部上传记录"
  }
}
</route>

<script setup lang="ts">
import type { ReportRecordVo } from '@/service/redList'
import { API } from '@/service'
import { DEFAULT_USER_ID, RED_LIST_REFRESH_EVENT } from '@/service/redList'

defineOptions({
  name: 'RecordListPage',
})

interface RecordItem {
  id: number
  title: string
  category: string
  score: string
  date: string
  reason: string
  logo: string
  type: 'red' | 'black'
}

const DEFAULT_LOGOS = [
  '/static/list/logo-huangmen.png',
  '/static/list/logo-light-food.png',
  '/static/list/logo-chuanxiang.png',
  '/static/list/logo-xiaowei.png',
  '/static/list/logo-maixiang.png',
]

const systemInfo = uni.getWindowInfo()
const safeAreaTop = systemInfo.safeArea?.top || 0
const records = ref<RecordItem[]>([])
let recordPageLoaded = false

function formatScore(score?: number | string) {
  const value = Number(score || 0)
  return value ? value.toFixed(1) : '0.0'
}

function formatDate(value?: string) {
  if (!value)
    return ''
  const parsed = new Date(value.replace(/-/g, '/'))
  if (Number.isNaN(parsed.getTime()))
    return value.slice(5, 10)
  const month = `${parsed.getMonth() + 1}`.padStart(2, '0')
  const day = `${parsed.getDate()}`.padStart(2, '0')
  return `${month}-${day}`
}

function safeLogo(url: string | undefined, index: number) {
  if (!url || url.includes('example.com'))
    return DEFAULT_LOGOS[index % DEFAULT_LOGOS.length]
  return url
}

function toRecord(item: ReportRecordVo, index: number): RecordItem {
  const type = item.reportType === 'black' ? 'black' : 'red'
  return {
    id: Number(item.reportId || index),
    title: item.fullName || item.merchantName || '',
    category: item.categoryName || '',
    score: formatScore(item.rating || item.avgScore),
    date: formatDate(item.createdAt),
    reason: item.description || item.tags?.join('，') || '',
    logo: safeLogo(item.logoUrl, index),
    type,
  }
}

function goBack() {
  uni.navigateBack({ delta: 1 })
}

async function loadRecords() {
  const res = await API.redList.my.recordList({
    userId: DEFAULT_USER_ID,
    page: 1,
    limit: 50,
  })
  records.value = (res.data || []).map(toRecord)
}

async function refreshRecords() {
  await loadRecords()
  recordPageLoaded = true
}

function confirmDeleteRecord(record: RecordItem) {
  uni.showModal({
    title: '删除记录',
    content: '删除后将同步更新商家统计和榜单数据，确定删除这条记录吗？',
    confirmText: '删除',
    confirmColor: '#f32626',
    success: async ({ confirm }) => {
      if (!confirm)
        return
      try {
        await API.redList.my.deleteReport(DEFAULT_USER_ID, record.id)
        uni.showToast({ title: '已删除', icon: 'success' })
        uni.$emit(RED_LIST_REFRESH_EVENT)
        await refreshRecords()
      }
      catch {
        uni.showToast({ title: '删除失败', icon: 'none' })
      }
    },
  })
}

onLoad(() => {
  uni.$on(RED_LIST_REFRESH_EVENT, refreshRecords)
  refreshRecords()
})

onShow(() => {
  if (recordPageLoaded)
    refreshRecords()
})

onUnload(() => {
  uni.$off(RED_LIST_REFRESH_EVENT, refreshRecords)
})
</script>

<template>
  <view class="record-page" :style="{ paddingTop: `${safeAreaTop}px` }">
    <view class="page-header">
      <view class="header-icon i-carbon-chevron-left" @tap="goBack" />
      <text class="page-title">
        全部上传记录
      </text>
      <view class="header-placeholder" />
    </view>

    <view class="record-list">
      <view v-for="record in records" :key="record.id" class="record-card">
        <image class="record-logo" :src="record.logo" mode="aspectFill" />

        <view class="record-main">
          <view class="title-row">
            <text class="record-title">
              {{ record.title }}
            </text>
            <view class="record-date-wrap">
              <text class="record-date">
                {{ record.date }}
              </text>
              <view class="date-arrow i-carbon-chevron-right" />
            </view>
          </view>

          <view class="record-meta">
            <text class="record-category">
              {{ record.category }}
            </text>
            <view class="score" :class="{ 'score--black': record.type === 'black' }">
              <view class="score-icon i-carbon-star-filled" />
              <text>{{ record.score }}</text>
            </view>
            <view class="i-carbon-chevron-right row-arrow" />
          </view>

          <view class="reason">
            <text class="reason-label">
              {{ record.type === 'red' ? '推荐理由：' : '避雷理由：' }}
            </text>
            <text class="reason-text">
              {{ record.reason }}
            </text>
          </view>

          <view class="record-actions">
            <view class="delete-button" @tap.stop="confirmDeleteRecord(record)">
              <view class="delete-icon i-carbon-trash-can" />
              <text>删除</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.record-page {
  min-height: 100%;
  box-sizing: border-box;
  padding: 0 24rpx 36rpx;
  color: #111318;
  font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
  background: #fff;
}

.page-header {
  display: grid;
  grid-template-columns: 64rpx minmax(0, 1fr) 64rpx;
  align-items: center;
  height: 148rpx;
}

.header-icon {
  width: 52rpx;
  height: 52rpx;
  color: #05070a;
}

.header-placeholder {
  width: 64rpx;
  height: 64rpx;
}

.page-title {
  overflow: hidden;
  font-size: 39rpx;
  font-weight: 800;
  line-height: 52rpx;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.record-card {
  display: grid;
  grid-template-columns: 148rpx minmax(0, 1fr);
  column-gap: 26rpx;
  min-height: 178rpx;
  box-sizing: border-box;
  padding: 30rpx 22rpx 28rpx 28rpx;
  margin-bottom: 22rpx;
  background: #fff;
  border: 1rpx solid #edf0f3;
  border-radius: 14rpx;
  box-shadow: 0 6rpx 18rpx rgba(24, 30, 42, 0.02);
}

.record-logo {
  align-self: center;
  width: 112rpx;
  height: 112rpx;
  overflow: hidden;
  border-radius: 50%;
}

.record-main {
  min-width: 0;
}

.title-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 112rpx;
  column-gap: 12rpx;
  align-items: center;
}

.record-title {
  overflow: hidden;
  font-size: 31rpx;
  font-weight: 800;
  line-height: 42rpx;
  color: #0d0d0f;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.record-date-wrap {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.record-date {
  font-size: 24rpx;
  color: #68707c;
}

.date-arrow {
  width: 26rpx;
  height: 26rpx;
  margin-left: 6rpx;
  color: #68707c;
}

.record-meta {
  position: relative;
  display: flex;
  align-items: center;
  margin-top: 16rpx;
}

.record-category {
  margin-right: 28rpx;
  overflow: hidden;
  font-size: 25rpx;
  line-height: 32rpx;
  color: #666e7a;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.score {
  display: flex;
  gap: 8rpx;
  align-items: center;
  font-size: 26rpx;
  font-weight: 800;
  color: #f32626;
}

.score--black {
  color: #252a34;
}

.score-icon {
  width: 29rpx;
  height: 29rpx;
  color: currentColor;
}

.row-arrow {
  position: absolute;
  right: 0;
  width: 28rpx;
  height: 28rpx;
  color: #68707c;
}

.reason {
  display: flex;
  margin-top: 22rpx;
  overflow: hidden;
  font-size: 25rpx;
  line-height: 34rpx;
  white-space: nowrap;
}

.reason-label {
  flex: 0 0 auto;
  font-weight: 800;
  color: #f32626;
}

.reason-text {
  overflow: hidden;
  color: #5f6672;
  text-overflow: ellipsis;
}

.record-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20rpx;
}

.delete-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 42rpx;
  padding: 0 16rpx;
  font-size: 22rpx;
  font-weight: 700;
  line-height: 1;
  color: #f32626;
  background: #fff4f4;
  border: 1rpx solid #ffd2d2;
  border-radius: 22rpx;
}

.delete-icon {
  width: 24rpx;
  height: 24rpx;
  margin-right: 7rpx;
}
</style>
