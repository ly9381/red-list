<route lang="jsonc">
{
  "layout": "default",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "全部榜单商家"
  }
}
</route>

<script setup lang="ts">
import type { OptionVo, RankMerchantVo, RankType } from '@/service/redList'
import { API } from '@/service'
import { RED_LIST_REFRESH_EVENT } from '@/service/redList'

defineOptions({
  name: 'RedMerchantPage',
})

interface MerchantItem {
  id: number
  rankNo: number
  title: string
  category: string
  score: string
  date: string
  tags: string[]
  reason: string
  issue: string
}

const MOCK_CAMPUS_ID = 1

const systemInfo = uni.getWindowInfo()
const safeAreaTop = systemInfo.safeArea?.top || 0
const rankType = ref<RankType>('red')
const keyword = ref('')
const categoryLabel = ref('全部分类')
const selectedCategoryId = ref<number>()
const sortType = ref<'rank' | 'distance' | 'score' | 'week'>('rank')
const categories = ref<OptionVo[]>([])
const merchants = ref<MerchantItem[]>([])
let merchantPageLoaded = false

const pageTitle = computed(() => rankType.value === 'red' ? '全部红榜商家' : '全部黑榜商家')
const reasonLabel = computed(() => rankType.value === 'red' ? '推荐理由：' : '曝光理由：')
const filters = computed(() => [
  { label: categoryLabel.value, icon: '', suffix: 'i-carbon-chevron-down', type: 'category' as const, sort: 'rank' as const },
  { label: '距离最近', icon: 'i-carbon-location', suffix: '', type: 'sort' as const, sort: 'distance' as const },
  { label: '评分最高', icon: 'i-carbon-star', suffix: '', type: 'sort' as const, sort: 'score' as const },
  { label: '本周新增', icon: 'i-carbon-calendar-add', suffix: '', type: 'sort' as const, sort: 'week' as const },
])

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

function toMerchant(item: RankMerchantVo, index: number): MerchantItem {
  return {
    id: Number(item.merchantId || index),
    rankNo: index + 1,
    title: item.fullName || item.name || '',
    category: item.categoryName || '',
    score: formatScore(item.avgScore),
    date: formatDate(item.lastReportAt),
    tags: item.tags || [],
    reason: item.reason || '',
    issue: item.issueLabel || item.tags?.[0] || '问题记录',
  }
}

async function loadCategories() {
  const res = await API.redList.list.categories()
  categories.value = res.data || []
}

async function loadMerchants() {
  const res = await API.redList.list.allMerchants({
    campusId: MOCK_CAMPUS_ID,
    rankType: rankType.value,
    categoryId: selectedCategoryId.value,
    keyword: keyword.value.trim() || undefined,
    sortType: sortType.value,
    periodType: sortType.value === 'week' ? 'week' : 'all',
    page: 1,
    limit: 50,
  })
  merchants.value = (res.data || []).map(toMerchant)
}

async function refreshMerchantPage() {
  if (!categories.value.length)
    await loadCategories()
  await loadMerchants()
  merchantPageLoaded = true
}

function goBack() {
  uni.navigateBack({ delta: 1 })
}

async function chooseFilter(item: (typeof filters.value)[number]) {
  if (item.type === 'category') {
    const itemList = ['全部分类', ...categories.value.map(item => item.name)]
    uni.showActionSheet({
      itemList,
      success: async ({ tapIndex }) => {
        const selected = tapIndex === 0 ? undefined : categories.value[tapIndex - 1]
        selectedCategoryId.value = selected?.id
        categoryLabel.value = selected?.name || '全部分类'
        await loadMerchants()
      },
    })
    return
  }

  sortType.value = item.sort
  await loadMerchants()
}

onLoad(async (query) => {
  rankType.value = query?.rankType === 'black' ? 'black' : 'red'
  uni.$on(RED_LIST_REFRESH_EVENT, refreshMerchantPage)
  await refreshMerchantPage()
})

onShow(() => {
  if (merchantPageLoaded)
    refreshMerchantPage()
})

onUnload(() => {
  uni.$off(RED_LIST_REFRESH_EVENT, refreshMerchantPage)
})
</script>

<template>
  <view class="merchant-page" :class="{ 'merchant-page--black': rankType === 'black' }" :style="{ paddingTop: `${safeAreaTop}px` }">
    <view class="page-header">
      <view class="header-icon i-carbon-chevron-left" @tap="goBack" />
      <text class="page-title">
        {{ pageTitle }}
      </text>
      <view class="header-icon i-carbon-search" @tap="loadMerchants" />
    </view>

    <view class="search-box">
      <view class="search-icon i-carbon-search" />
      <input v-model="keyword" class="search-input" placeholder="搜索商家/品类/门店" confirm-type="search" @confirm="loadMerchants">
    </view>

    <view class="filter-row">
      <view
        v-for="item in filters"
        :key="item.label"
        class="filter-chip"
        :class="{ 'filter-chip--active': item.type === 'category' || sortType === item.sort }"
        @tap="chooseFilter(item)"
      >
        <view v-if="item.icon" class="filter-chip__icon" :class="item.icon" />
        <text>{{ item.label }}</text>
        <view v-if="item.suffix" class="filter-chip__suffix" :class="item.suffix" />
      </view>
    </view>

    <view class="merchant-list">
      <view v-for="merchant in merchants" :key="merchant.id" class="merchant-card" :class="{ 'merchant-card--first': merchant.rankNo === 1 }">
        <view class="rank-badge" :class="{ 'rank-badge--muted': merchant.rankNo > 3 }">
          <text>NO.{{ merchant.rankNo }}</text>
        </view>

        <view class="merchant-main">
          <view class="title-row">
            <text class="merchant-title">
              {{ merchant.title }}
            </text>
            <text class="merchant-date">
              {{ merchant.date }}
            </text>
          </view>

          <view class="merchant-meta">
            <text class="merchant-category">
              {{ merchant.category }}
            </text>
            <view class="score">
              <view class="score-icon i-carbon-star-filled" />
              <text>{{ merchant.score }}</text>
            </view>
          </view>

          <view class="tag-row">
            <text v-for="tag in merchant.tags" :key="tag" class="tag">
              {{ tag }}
            </text>
          </view>

          <view class="reason">
            <text class="reason-label">
              {{ reasonLabel }}
            </text>
            <text class="reason-text">
              {{ merchant.reason || merchant.issue }}
            </text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.merchant-page {
  min-height: 100%;
  box-sizing: border-box;
  padding: 0 28rpx 36rpx;
  color: #111318;
  font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
  background: #fff;
}

.page-header {
  position: relative;
  display: grid;
  grid-template-columns: 64rpx minmax(0, 1fr) 64rpx;
  align-items: center;
  height: 116rpx;
}

.header-icon {
  width: 48rpx;
  height: 48rpx;
  color: #05070a;
}

.page-title {
  overflow: hidden;
  font-size: 38rpx;
  font-weight: 800;
  line-height: 50rpx;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.search-box {
  display: flex;
  align-items: center;
  height: 72rpx;
  box-sizing: border-box;
  padding: 0 24rpx;
  background: #f5f6f8;
  border-radius: 36rpx;
}

.search-icon {
  width: 36rpx;
  height: 36rpx;
  color: #747b86;
}

.search-input {
  flex: 1;
  min-width: 0;
  height: 72rpx;
  margin-left: 16rpx;
  font-size: 26rpx;
  color: #111318;
}

.filter-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24rpx;
  margin-top: 28rpx;
}

.filter-chip {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  height: 58rpx;
  box-sizing: border-box;
  padding: 0 12rpx;
  font-size: 24rpx;
  color: #242832;
  white-space: nowrap;
  background: #fff;
  border: 1rpx solid #e9eaee;
  border-radius: 31rpx;
}

.filter-chip--active {
  color: #f32626;
  background: #fff4f4;
  border-color: #ffd4d4;
}

.filter-chip__icon,
.filter-chip__suffix {
  width: 30rpx;
  height: 30rpx;
}

.filter-chip__icon {
  margin-right: 7rpx;
  color: #15171c;
}

.filter-chip__suffix {
  margin-left: 7rpx;
  color: #f32626;
}

.merchant-list {
  margin-top: 24rpx;
}

.merchant-card {
  position: relative;
  min-height: 208rpx;
  box-sizing: border-box;
  padding: 34rpx 24rpx 26rpx 150rpx;
  margin-bottom: 22rpx;
  overflow: hidden;
  background: #fff;
  border: 1rpx solid #edf0f3;
  border-radius: 14rpx;
}

.merchant-card--first {
  border-color: #ffc6c6;
}

.rank-badge {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  width: 74rpx;
  height: 66rpx;
  box-sizing: border-box;
  padding-top: 12rpx;
  font-size: 25rpx;
  font-weight: 800;
  line-height: 1;
  color: #fff;
  text-align: center;
  background: linear-gradient(135deg, #ff4e62 0%, #ff766e 100%);

  &::after {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 0;
    content: '';
    border-right: 37rpx solid transparent;
    border-bottom: 13rpx solid #fff;
    border-left: 37rpx solid transparent;
  }

  text {
    position: relative;
    z-index: 1;
  }
}

.rank-badge--muted {
  background: linear-gradient(135deg, #9ea3ad 0%, #c7ccd4 100%);
}

.merchant-main {
  min-width: 0;
}

.title-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 80rpx;
  column-gap: 16rpx;
  align-items: center;
}

.merchant-title {
  overflow: hidden;
  font-size: 31rpx;
  font-weight: 800;
  line-height: 40rpx;
  color: #0d0d0f;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.merchant-date {
  font-size: 22rpx;
  color: #737b87;
  text-align: right;
}

.merchant-meta {
  display: flex;
  align-items: center;
  margin-top: 14rpx;
}

.merchant-category {
  margin-right: 24rpx;
  font-size: 24rpx;
  color: #656b76;
}

.score {
  display: flex;
  gap: 8rpx;
  align-items: center;
  font-size: 25rpx;
  font-weight: 800;
  color: #f32626;
}

.score-icon {
  width: 28rpx;
  height: 28rpx;
  color: #f32626;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 11rpx;
  margin-top: 18rpx;
}

.tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 34rpx;
  box-sizing: border-box;
  padding: 0 10rpx;
  font-size: 21rpx;
  font-weight: 600;
  line-height: 1;
  color: #f32626;
  background: #fff0f0;
  border: 1rpx solid #ffcfcf;
  border-radius: 5rpx;
}

.reason {
  display: flex;
  margin-top: 22rpx;
  overflow: hidden;
  font-size: 24rpx;
  line-height: 32rpx;
  white-space: nowrap;
}

.reason-label {
  flex: 0 0 auto;
  font-weight: 800;
  color: #f32626;
}

.reason-text {
  overflow: hidden;
  color: #5d6470;
  text-overflow: ellipsis;
}
</style>
