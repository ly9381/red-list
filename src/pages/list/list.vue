<route lang="jsonc">
{
  "layout": "tabbar",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "榜单",
    "enablePullDownRefresh": false
  }
}
</route>

<!-- TODO：修改排行逻辑，优化排行榜界面 -->
<script setup lang="ts">
import type { OptionVo, RankMerchantVo, RankType } from '@/service/redList'
import { API } from '@/service'
import { RED_LIST_REFRESH_EVENT } from '@/service/redList'

defineOptions({
  name: 'ListPage',
})

interface RedMerchant {
  id: number
  rank: string
  rankNo: number
  title: string
  category: string
  score: string
  date: string
  tags: string[]
  reason: string
  tone: 'gold' | 'silver' | 'bronze'
  showAction: boolean
}

interface BlackMerchant {
  id: number
  title: string
  category: string
  score: string
  date: string
  issue: string
  reason: string
}

const MOCK_CAMPUS_ID = 1
const systemInfo = uni.getWindowInfo()
const safeAreaInsets = systemInfo.safeArea
const menuButtonInfo = uni.getMenuButtonBoundingClientRect?.()
const customBarTop = menuButtonInfo?.top || safeAreaInsets?.top || 0
const customBarHeight = menuButtonInfo?.height || systemInfo.statusBarHeight || 0

const activeRank = ref<RankType>('red')
const categoryLabel = ref('全部分类')
const selectedCategoryId = ref<number>()
const sortType = ref<'rank' | 'score' | 'week'>('rank')
const categories = ref<OptionVo[]>([])
const redMerchants = ref<RedMerchant[]>([])
const blackMerchants = ref<BlackMerchant[]>([])
let listLoaded = false

const rankTabs = [
  { type: 'red' as const, label: '红榜', icon: 'i-carbon-fire' },
  { type: 'black' as const, label: '黑榜', icon: 'i-carbon-warning-alt-filled' },
]

const filters = computed(() => [
  { label: categoryLabel.value, icon: '', suffix: 'i-carbon-chevron-down', type: 'category' as const },
  { label: '综合排序', icon: 'i-carbon-list', suffix: '', type: 'sort' as const, sort: 'rank' as const },
  { label: '评分最高', icon: 'i-carbon-star', suffix: '', type: 'sort' as const, sort: 'score' as const },
  { label: '本周新增', icon: 'i-carbon-calendar-add', suffix: '', type: 'sort' as const, sort: 'week' as const },
])

// Mock data is kept commented after API integration.
// const mockRedMerchants: RedMerchant[] = []
// const mockBlackMerchants: BlackMerchant[] = []

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

function toneByRank(rankNo: number): RedMerchant['tone'] {
  if (rankNo === 1)
    return 'gold'
  if (rankNo === 2)
    return 'silver'
  return 'bronze'
}

function toRankCard(item: RankMerchantVo, index: number): RedMerchant {
  const rankNo = index + 1
  const tone = toneByRank(rankNo)
  return {
    id: Number(item.merchantId || index),
    rankNo,
    rank: `NO.${rankNo}`,
    title: item.fullName || item.name || '',
    category: item.categoryName || '',
    score: formatScore(item.avgScore),
    date: formatDate(item.lastReportAt),
    tags: item.tags || [],
    reason: item.reason || '',
    tone,
    showAction: index === 2,
  }
}

function toBlackMerchant(item: RankMerchantVo, index: number): BlackMerchant {
  return {
    id: Number(item.merchantId || index),
    title: item.fullName || item.name || '',
    category: item.categoryName || '',
    score: formatScore(item.avgScore),
    date: formatDate(item.lastReportAt),
    issue: item.issueLabel || item.tags?.[0] || '问题记录',
    reason: item.reason || '',
  }
}

async function loadCategories() {
  const res = await API.redList.list.categories()
  categories.value = res.data || []
}

async function loadRankItems() {
  const res = await API.redList.list.rankItems({
    campusId: MOCK_CAMPUS_ID,
    rankType: activeRank.value,
    categoryId: selectedCategoryId.value,
    sortType: sortType.value,
    periodType: sortType.value === 'week' ? 'week' : 'all',
    page: 1,
    limit: 3,
  })
  redMerchants.value = (res.data || []).map(toRankCard)
}

async function loadBlackPreview() {
  const res = await API.redList.list.blackPreview({ campusId: MOCK_CAMPUS_ID, limit: 2 })
  blackMerchants.value = (res.data || []).map(toBlackMerchant)
}

async function refreshListData() {
  if (!categories.value.length)
    await loadCategories()
  await Promise.all([loadRankItems(), loadBlackPreview()])
  listLoaded = true
}

async function chooseRank(type: RankType) {
  activeRank.value = type
  await loadRankItems()
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
        await loadRankItems()
      },
    })
    return
  }

  sortType.value = item.sort
  await loadRankItems()
}

function goAllMerchants(type: RankType) {
  uni.navigateTo({ url: `/pages-sub/redmerchant/redmerchant?rankType=${type}` as any })
}

onLoad(() => {
  uni.$on(RED_LIST_REFRESH_EVENT, refreshListData)
  refreshListData()
})

onShow(() => {
  if (listLoaded)
    refreshListData()
})

onUnload(() => {
  uni.$off(RED_LIST_REFRESH_EVENT, refreshListData)
})
</script>

<template>
  <view class="list-page" :style="{ paddingTop: `${customBarTop}px` }">
    <view class="custom-bar" :style="{ height: `${customBarHeight}px` }">
      <text>榜单</text>
    </view>

    <view class="rank-switch">
      <view
        v-for="item in rankTabs"
        :key="item.type"
        class="rank-tab"
        :class="{ 'rank-tab--active': activeRank === item.type, 'rank-tab--red': item.type === 'red' }"
        @tap="chooseRank(item.type)"
      >
        <view class="rank-tab__inner">
          <view class="rank-tab__icon" :class="item.icon" />
          <text>{{ item.label }}</text>
        </view>
      </view>
    </view>

    <view class="filter-row">
      <view
        v-for="item in filters"
        :key="`${item.type}-${item.label}`"
        class="filter-chip"
        :class="{ 'filter-chip--active': item.type === 'category' || sortType === item.sort }"
        @tap="chooseFilter(item)"
      >
        <view v-if="item.icon" class="filter-chip__icon" :class="item.icon" />
        <text>{{ item.label }}</text>
        <view v-if="item.suffix" class="filter-chip__suffix" :class="item.suffix" />
      </view>
    </view>

    <view class="red-list">
      <view
        v-for="merchant in redMerchants"
        :key="merchant.id"
        class="rank-card"
        :class="[`rank-card--${merchant.tone}`, { 'rank-card--featured': merchant.rankNo === 1, 'rank-card--with-action': merchant.showAction }]"
      >
        <view class="rank-card__main">
          <view class="rank-badge" :class="`rank-badge--${merchant.tone}`">
            <text>{{ merchant.rank }}</text>
          </view>

          <view class="merchant-info">
            <text class="merchant-title">
              {{ merchant.title }}
            </text>

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
              <text v-for="tag in merchant.tags" :key="tag" class="red-tag">
                {{ tag }}
              </text>
            </view>
          </view>

          <text class="rank-date">
            {{ merchant.date }}
          </text>

          <view class="recommend">
            <text class="recommend__label">
              {{ activeRank === 'red' ? '推荐理由：' : '曝光理由：' }}
            </text>
            <text class="recommend__text">
              {{ merchant.reason }}
            </text>
          </view>
        </view>

        <view v-if="merchant.showAction" class="rank-card__action" @tap="goAllMerchants(activeRank)">
          <text>{{ activeRank === 'red' ? '查看全部红榜商家' : '查看全部黑榜商家' }}</text>
          <view class="action-icon i-carbon-chevron-right" />
        </view>
      </view>
    </view>

    <view class="black-preview">
      <view class="black-preview__header">
        <view class="black-preview__title">
          <view class="black-title-icon i-carbon-warning-alt-filled" />
          <text>黑榜商家预览</text>
        </view>
        <view class="black-preview__more" @tap="goAllMerchants('black')">
          <text>全部黑榜</text>
          <view class="i-carbon-chevron-right more-icon" />
        </view>
      </view>

      <view class="black-list">
        <view v-for="merchant in blackMerchants" :key="merchant.id" class="black-row">
          <view class="black-main">
            <view class="black-line">
              <text class="black-name">
                {{ merchant.title }}
              </text>
              <text class="black-category">
                {{ merchant.category }}
              </text>
              <view class="black-score">
                <view class="i-carbon-star-filled black-score-icon" />
                <text>{{ merchant.score }}</text>
              </view>
              <text class="black-date">
                {{ merchant.date }}
              </text>
              <text class="issue-tag">
                {{ merchant.issue }}
              </text>
            </view>
            <text class="black-reason">
              {{ merchant.reason }}
            </text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.list-page {
  min-height: 100vh;
  padding: 24rpx 0 32rpx;
  overflow-x: hidden;
  color: #111318;
  font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
  background:
    linear-gradient(
      180deg,
      rgba(255, 249, 244, 0.98) 0%,
      rgba(255, 247, 250, 0.94) 28%,
      rgba(246, 251, 255, 0.98) 56%,
      #edf7fc 100%
    ),
    linear-gradient(112deg, rgba(255, 244, 220, 0.72) 0%, rgba(255, 247, 235, 0.24) 34%, rgba(255, 247, 235, 0) 58%),
    linear-gradient(252deg, rgba(255, 229, 238, 0.8) 0%, rgba(255, 242, 247, 0.35) 38%, rgba(255, 242, 247, 0) 64%),
    #edf7fc;
}

.custom-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 28rpx 24rpx;
  font-size: 34rpx;
  font-weight: 800;
  line-height: 1;
  color: #0f1115;
}

.rank-switch {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  height: 80rpx;
  margin: 0 28rpx;
  overflow: hidden;
  background: #f6f7f9;
  border: 1rpx solid #e9eaed;
  border-radius: 42rpx;
  box-shadow: inset 0 3rpx 10rpx rgba(31, 37, 51, 0.03);
}

.rank-tab {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #252b35;
}

.rank-tab__inner {
  display: flex;
  gap: 16rpx;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 28rpx;
  font-weight: 700;
}

.rank-tab__icon {
  width: 34rpx;
  height: 34rpx;
  color: #252b35;
}

.rank-tab--active {
  color: #f32626;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.94), rgba(255, 238, 238, 0.88));
  border: 1rpx solid #ff8d93;
  border-radius: 42rpx;

  .rank-tab__icon {
    color: #f32626;
  }
}

.rank-tab--red {
  margin: -1rpx 0 -1rpx -1rpx;
}

.filter-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24rpx;
  margin: 26rpx 30rpx 0;
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
  background: rgba(255, 255, 255, 0.92);
  border: 1rpx solid #e9eaee;
  border-radius: 31rpx;
  box-shadow: 0 4rpx 12rpx rgba(23, 30, 42, 0.03);
}

.filter-chip--active {
  color: #f32626;
  background: #fff4f4;
  border-color: #ffd4d4;
}

.filter-chip__icon {
  width: 30rpx;
  height: 30rpx;
  margin-right: 7rpx;
  color: #15171c;
}

.filter-chip__suffix {
  width: 28rpx;
  height: 28rpx;
  margin-left: 7rpx;
  color: #f32626;
}

.red-list {
  margin-top: 24rpx;
}

.rank-card {
  position: relative;
  margin: 0 30rpx 22rpx;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.96);
  border: 1rpx solid #ebedf1;
  border-radius: 14rpx;
  box-shadow: 0 8rpx 24rpx rgba(29, 34, 44, 0.02);
}

.rank-card--featured {
  border-color: #ffaaa9;
  box-shadow: 0 8rpx 28rpx rgba(246, 48, 48, 0.05);
}

.rank-card__main {
  position: relative;
  min-height: 214rpx;
  box-sizing: border-box;
  padding: 34rpx 24rpx 76rpx 150rpx;
}

.rank-card--with-action {
  .rank-card__main {
    min-height: 216rpx;
  }
}

.rank-badge {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 72rpx;
  height: 66rpx;
  box-sizing: border-box;
  padding-top: 13rpx;
  overflow: hidden;
  font-size: 26rpx;
  font-weight: 800;
  line-height: 1;
  color: #fff;
  border-top-left-radius: 13rpx;

  &::after {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 0;
    content: '';
    border-right: 36rpx solid transparent;
    border-bottom: 13rpx solid #fff;
    border-left: 36rpx solid transparent;
  }

  text {
    position: relative;
    z-index: 1;
  }
}

.rank-badge--gold {
  background: linear-gradient(135deg, #ff4e62 0%, #ff766e 100%);
}

.rank-badge--silver,
.rank-badge--bronze {
  background: linear-gradient(135deg, #ff8847 0%, #ffad78 100%);
}

.merchant-info {
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  width: 100%;
  padding-right: 92rpx;
  transform: translateX(-20px);
}

.merchant-title {
  display: block;
  overflow: hidden;
  font-size: 29rpx;
  font-weight: 800;
  line-height: 36rpx;
  color: #0d0d0f;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.merchant-meta {
  display: flex;
  align-items: center;
  margin-top: 10rpx;
}

.merchant-category {
  margin-right: 24rpx;
  font-size: 23rpx;
  line-height: 28rpx;
  color: #656b76;
}

.score {
  display: flex;
  gap: 8rpx;
  align-items: center;
  font-size: 25rpx;
  font-weight: 800;
  line-height: 28rpx;
  color: #f32626;
}

.score-icon {
  width: 28rpx;
  height: 28rpx;
  color: #f32626;
}

.tag-row {
  display: flex;
  gap: 11rpx;
  align-items: center;
  margin-top: 18rpx;
  overflow: hidden;
}

.red-tag {
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
  white-space: nowrap;
  background: #fff0f0;
  border: 1rpx solid #ffcfcf;
  border-radius: 5rpx;
}

.rank-date {
  position: absolute;
  top: 27rpx;
  right: 24rpx;
  font-size: 22rpx;
  line-height: 1;
  color: #737b87;
}

.recommend {
  position: absolute;
  right: 24rpx;
  bottom: 24rpx;
  left: 50rpx;
  display: flex;
  align-items: center;
  overflow: hidden;
  font-size: 23rpx;
  line-height: 30rpx;
  white-space: nowrap;
}

.recommend__label {
  flex: 0 0 auto;
  font-weight: 800;
  color: #f32626;
}

.recommend__text {
  overflow: hidden;
  color: #5d6470;
  text-overflow: ellipsis;
}

.rank-card__action {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 58rpx;
  font-size: 24rpx;
  font-weight: 700;
  line-height: 1;
  color: #15171d;
  border-top: 1rpx solid #eef0f3;
}

.action-icon {
  position: absolute;
  right: 28rpx;
  width: 32rpx;
  height: 32rpx;
  color: #5b626d;
}

.black-preview {
  margin: 0 30rpx;
  padding: 22rpx 14rpx 16rpx;
  background: rgba(255, 255, 255, 0.98);
  border: 1rpx solid #edf0f3;
  border-radius: 14rpx;
  box-shadow: 0 8rpx 24rpx rgba(25, 31, 44, 0.02);
}

.black-preview__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10rpx 14rpx;
}

.black-preview__title,
.black-preview__more {
  display: flex;
  align-items: center;
}

.black-preview__title {
  gap: 12rpx;
  font-size: 27rpx;
  font-weight: 800;
  color: #101217;
}

.black-title-icon {
  width: 32rpx;
  height: 32rpx;
  color: #1d222c;
}

.black-preview__more {
  gap: 4rpx;
  font-size: 21rpx;
  color: #606874;
}

.more-icon {
  width: 24rpx;
  height: 24rpx;
  color: #606874;
}

.black-list {
  display: flex;
  flex-direction: column;
}

.black-row {
  display: block;
  min-height: 86rpx;
  padding: 18rpx 16rpx 18rpx;
  box-sizing: border-box;
  background: #fff;
  border: 1rpx solid #edf0f4;
  border-radius: 13rpx;
}

.black-row + .black-row {
  margin-top: 8rpx;
}

.black-main {
  flex: 1;
  min-width: 0;
}

.black-line {
  display: grid;
  grid-template-columns: minmax(190rpx, 1fr) 94rpx 72rpx 72rpx 86rpx;
  column-gap: 10rpx;
  align-items: center;
  min-width: 0;
}

.black-name {
  overflow: hidden;
  font-size: 22rpx;
  font-weight: 800;
  line-height: 28rpx;
  color: #15171c;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.black-category {
  overflow: hidden;
  font-size: 19rpx;
  line-height: 26rpx;
  color: #68707c;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.black-score {
  display: flex;
  gap: 5rpx;
  align-items: center;
  font-size: 20rpx;
  font-weight: 700;
  color: #252a34;
}

.black-score-icon {
  width: 20rpx;
  height: 20rpx;
  color: #505967;
}

.black-date {
  font-size: 19rpx;
  color: #69717d;
  text-align: center;
}

.issue-tag {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32rpx;
  font-size: 18rpx;
  font-weight: 600;
  color: #f32626;
  background: #fff0f0;
  border: 1rpx solid #ffd0d0;
  border-radius: 6rpx;
}

.black-reason {
  display: block;
  margin-top: 6rpx;
  overflow: hidden;
  font-size: 20rpx;
  line-height: 26rpx;
  color: #6a717c;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
