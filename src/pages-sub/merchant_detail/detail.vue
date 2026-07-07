<route lang="jsonc">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "点评详情"
  }
}
</route>

<script setup lang="ts">
import type { ReportRecordVo } from '@/service/redList'
import { API } from '@/service'
import { DEFAULT_USER_ID, RED_LIST_REFRESH_EVENT } from '@/service/redList'

defineOptions({
  name: 'MerchantDetailPage',
})

const systemInfo = uni.getWindowInfo()
const safeAreaTop = systemInfo.safeArea?.top || 0

const detail = ref<ReportRecordVo>({
  reportId: 0,
  merchantName: '',
  fullName: '',
  categoryName: '',
  reportType: 'red',
  reportTypeName: '',
  status: '',
  rating: 0,
  description: '',
  tags: [],
  photoUrls: [],
  createdAt: '',
  isAnonymous: 0,
})

const loading = ref(true)

function formatDateTime(value?: string | number | Date) {
  if (!value)
    return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime()))
    return String(value)
  const y = d.getFullYear()
  const M = `${d.getMonth() + 1}`.padStart(2, '0')
  const da = `${d.getDate()}`.padStart(2, '0')
  const h = `${d.getHours()}`.padStart(2, '0')
  const m = `${d.getMinutes()}`.padStart(2, '0')
  return `${y}-${M}-${da} ${h}:${m}`
}

function formatScore(score?: number | string) {
  const value = Number(score || 0)
  return value ? value.toFixed(1) : '0.0'
}

function statusText(status?: string) {
  if (status === 'approved')
    return '已发布'
  if (status === 'pending')
    return '待审核'
  if (status === 'rejected')
    return '已驳回'
  return status || ''
}

function privacyText(isAnonymous?: number) {
  return isAnonymous === 1 ? '仅自己可见' : '所有人可见'
}

function getImageFullUrl(url: string) {
  if (!url)
    return ''
  if (/^(?:https?:)?\/\//i.test(url))
    return url
  const baseUrl = import.meta.env.VITE_SERVER_BASEURL || ''
  if (!baseUrl)
    return url
  return `${baseUrl.replace(/\/$/, '')}/${url.replace(/^\//, '')}`
}

const displayRating = computed(() => Number(detail.value.rating || 0))
const maxStars = 5
const fullStars = computed(() => Math.floor(displayRating.value))
const hasHalfStar = computed(() => displayRating.value - fullStars.value >= 0.5)
const emptyStars = computed(() => maxStars - fullStars.value - (hasHalfStar.value ? 1 : 0))

function goBack() {
  uni.navigateBack({ delta: 1 })
}

async function loadDetail(reportId: number) {
  console.log('[detail] 开始加载详情, reportId:', reportId)
  try {
    loading.value = true
    const res = await API.redList.my.getReportDetail(DEFAULT_USER_ID, reportId)
    console.log('[detail] 接口返回:', JSON.stringify(res))
    if (res.data) {
      detail.value = res.data
      console.log('[detail] 数据已赋值, merchantName:', res.data.fullName || res.data.merchantName)
    }
    else {
      console.log('[detail] res.data 为空')
    }
  }
  catch (e) {
    console.error('[detail] 加载失败:', e)
    uni.showToast({ title: '加载失败，请查看控制台', icon: 'none' })
  }
  finally {
    loading.value = false
  }
}

function handleDelete() {
  uni.showModal({
    title: '删除点评',
    content: '删除后将无法恢复，确定要删除这条点评吗？',
    confirmText: '删除',
    confirmColor: '#f32626',
    success: async ({ confirm }) => {
      if (!confirm)
        return
      try {
        await API.redList.my.deleteReport(DEFAULT_USER_ID, detail.value.reportId!)
        uni.$emit(RED_LIST_REFRESH_EVENT)
        uni.showToast({ title: '已删除', icon: 'success' })
        setTimeout(() => uni.navigateBack({ delta: 1 }), 800)
      }
      catch {
        uni.showToast({ title: '删除失败', icon: 'none' })
      }
    },
  })
}

function handleEdit() {
  uni.showToast({ title: '编辑功能开发中', icon: 'none' })
}

function previewImage(index: number) {
  const urls = (detail.value.photoUrls || []).map(getImageFullUrl)
  if (!urls.length)
    return
  uni.previewImage({ current: urls[index], urls })
}

onLoad((query: any) => {
  console.log('[detail] onLoad 触发, query:', JSON.stringify(query))
  const reportId = Number(query?.reportId || 0)
  console.log('[detail] 解析后的 reportId:', reportId)
  if (reportId) {
    loadDetail(reportId)
  }
  else {
    console.error('[detail] reportId 无效，无法加载')
    uni.showToast({ title: '缺少记录ID', icon: 'none' })
  }
})
</script>

<template>
  <view class="detail-page" :style="{ paddingTop: `${safeAreaTop}px` }">
    <view class="page-header">
      <view class="header-icon i-carbon-chevron-left" @tap="goBack" />
      <text class="page-title">
        点评详情
      </text>
      <view class="header-placeholder" />
    </view>
    <view v-if="loading" class="loading-box">
      <text>加载中...</text>
    </view>
    <template v-else>
      <view class="merchant-card">
        <view class="merchant-name">
          {{ detail.fullName || detail.merchantName || '未知商家' }}
        </view>
        <view class="merchant-category">
          <view class="category-icon i-carbon-restaurant" />
          <text>{{ detail.categoryName || '暂无分类' }}</text>
        </view>
      </view>
      <view class="review-card">
        <view class="review-header">
          <view class="review-accent" />
          <text class="review-title">
            我的点评
          </text>
        </view>
        <view class="rating-row">
          <text class="rating-score">
            {{ formatScore(detail.rating) }}分
          </text>
          <view class="rating-stars">
            <view v-for="n in fullStars" :key="`f-${n}`" class="star-icon star--active i-carbon-star-filled" />
            <view v-if="hasHalfStar" class="star-icon star--active i-carbon-star-half" />
            <view v-for="n in emptyStars" :key="`e-${n}`" class="star-icon i-carbon-star-filled star--empty" />
          </view>
        </view>
        <view class="review-text">
          {{ detail.description || '暂无详细说明' }}
        </view>
        <view v-if="detail.photoUrls && detail.photoUrls.length" class="review-photos">
          <image v-for="(url, i) in detail.photoUrls" :key="i" class="review-photo" :src="getImageFullUrl(url)" mode="aspectFill" @tap="previewImage(i)" />
        </view>
        <view v-else class="review-photos--empty">
          <view class="i-carbon-image empty-icon" />
          <text>暂无图片</text>
        </view>
      </view>
      <view class="info-card">
        <view class="info-row">
          <text class="info-label">
            点评时间
          </text>
          <text class="info-value">
            {{ formatDateTime(detail.createdAt) }}
          </text>
        </view>
        <view class="info-row">
          <text class="info-label">
            状态
          </text>
          <text class="info-value info-value--status">
            {{ statusText(detail.status) }}
          </text>
        </view>
        <view class="info-row info-row--last">
          <text class="info-label">
            隐私设置
          </text>
          <text class="info-value">
            {{ privacyText(detail.isAnonymous) }}
          </text>
        </view>
      </view>
      <view class="bottom-actions">
        <button class="action-btn action-btn--delete" @tap="handleDelete">
          删除点评
        </button>
        <button class="action-btn action-btn--edit" @tap="handleEdit">
          再次编辑
        </button>
      </view>
    </template>
  </view>
</template>

<style scoped lang="scss">
.detail-page {
  min-height: 100vh;
  box-sizing: border-box;
  padding: 0 30rpx 48rpx;
  color: #111318;
  font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
  background: #f5f6f8;
}

.page-header {
  display: grid;
  grid-template-columns: 64rpx minmax(0, 1fr) 64rpx;
  align-items: center;
  height: 116rpx;
  margin-bottom: 16rpx;
}

.header-icon {
  width: 48rpx;
  height: 48rpx;
  color: #05070a;
}

.header-placeholder {
  width: 64rpx;
  height: 64rpx;
}

.page-title {
  overflow: hidden;
  font-size: 34rpx;
  font-weight: 800;
  line-height: 46rpx;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.loading-box {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400rpx;
  font-size: 28rpx;
  color: #9ba2ae;
}

.merchant-card {
  padding: 36rpx 30rpx;
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 16rpx rgba(25, 31, 44, 0.04);
}

.merchant-name {
  font-size: 34rpx;
  font-weight: 800;
  line-height: 46rpx;
  color: #0d0d0f;
}

.merchant-category {
  display: flex;
  align-items: center;
  margin-top: 14rpx;
  font-size: 24rpx;
  color: #69717d;
}

.category-icon {
  width: 28rpx;
  height: 28rpx;
  margin-right: 10rpx;
}

.review-card {
  margin-top: 20rpx;
  padding: 32rpx 30rpx;
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 16rpx rgba(25, 31, 44, 0.04);
}

.review-header {
  display: flex;
  align-items: center;
}

.review-accent {
  width: 6rpx;
  height: 32rpx;
  margin-right: 14rpx;
  background: #f32626;
  border-radius: 3rpx;
}

.review-title {
  font-size: 30rpx;
  font-weight: 800;
  line-height: 40rpx;
  color: #111318;
}

.rating-row {
  display: flex;
  align-items: baseline;
  margin-top: 28rpx;
}

.rating-score {
  font-size: 48rpx;
  font-weight: 800;
  line-height: 1;
  color: #f32626;
}

.rating-stars {
  display: flex;
  gap: 10rpx;
  align-items: center;
  margin-left: 18rpx;
}

.star-icon {
  width: 36rpx;
  height: 36rpx;
}

.star--active {
  color: #f32626;
}

.star--empty {
  color: #d7dae0;
}

.review-text {
  margin-top: 24rpx;
  font-size: 27rpx;
  line-height: 42rpx;
  color: #3a404a;
  text-align: justify;
}

.review-photos {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16rpx;
  margin-top: 24rpx;
}

.review-photo {
  width: 100%;
  height: 200rpx;
  overflow: hidden;
  border-radius: 12rpx;
  background: #f0f1f4;
}

.review-photos--empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 160rpx;
  margin-top: 24rpx;
  font-size: 23rpx;
  color: #9ba2ae;
  background: #f8f9fb;
  border: 1rpx dashed #d7dae0;
  border-radius: 12rpx;
}

.empty-icon {
  width: 44rpx;
  height: 44rpx;
  margin-bottom: 10rpx;
  color: #b4bac6;
}

.info-card {
  margin-top: 20rpx;
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 16rpx rgba(25, 31, 44, 0.04);
  overflow: hidden;
}

.info-row {
  display: grid;
  grid-template-columns: 156rpx minmax(0, 1fr);
  column-gap: 24rpx;
  align-items: center;
  min-height: 88rpx;
  padding: 0 30rpx;
  border-bottom: 1rpx solid #f2f3f6;
}

.info-row--last {
  border-bottom: 0;
}

.info-label {
  font-size: 26rpx;
  font-weight: 500;
  line-height: 36rpx;
  color: #737b87;
}

.info-value {
  font-size: 26rpx;
  line-height: 36rpx;
  color: #111318;
  text-align: right;
}

.info-value--status {
  color: #16a34a;
  font-weight: 600;
}

.bottom-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20rpx;
  margin-top: 24rpx;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 78rpx;
  font-size: 27rpx;
  font-weight: 700;
  border-radius: 40rpx;

  &::after {
    border: 0;
  }
}

.action-btn--delete {
  color: #f32626;
  background: #fff;
  border: 1rpx solid #ffd1d1;
}

.action-btn--edit {
  color: #fff;
  background: #f32626;
}
</style>
