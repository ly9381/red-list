<route lang="jsonc">
{
  "layout": "tabbar",
  "style": {
    "navigationBarTitleText": "榜单",
    "enablePullDownRefresh": false
  }
}
</route>

<script setup lang="ts">
defineOptions({
  name: 'ListPage',
})

type RankType = 'red' | 'black'

interface RedMerchant {
  id: number
  rank: string
  title: string
  category: string
  score: string
  date: string
  tags: string[]
  reason: string
  logo: string
  trophy: string
  tone: 'gold' | 'silver' | 'bronze'
}

interface BlackMerchant {
  id: number
  title: string
  category: string
  score: string
  date: string
  issue: string
  reason: string
  logo: string
}

const activeRank = ref<RankType>('red')
const activeFilter = ref('全部分类')

const rankTabs = [
  { type: 'red' as const, label: '红榜', icon: 'i-carbon-fire' },
  { type: 'black' as const, label: '黑榜', icon: 'i-carbon-warning-alt-filled' },
]

const filters = [
  { label: '全部分类', icon: '', suffix: 'i-carbon-chevron-down' },
  { label: '距离最近', icon: 'i-carbon-location', suffix: '' },
  { label: '评分最高', icon: 'i-carbon-star', suffix: '' },
  { label: '本周新增', icon: 'i-carbon-calendar-add', suffix: '' },
]

const redMerchants: RedMerchant[] = [
  {
    id: 1,
    rank: 'NO.1',
    title: '黄焖鸡米饭（北京大学店）',
    category: '快餐便当',
    score: '4.8',
    date: '05-18',
    tags: ['干净卫生', '分量足', '包装好', '味道正宗'],
    reason: '餐品新鲜，卫生整洁，口味稳定，性价比高',
    logo: '/static/list/logo-huangmen.png',
    trophy: '/static/list/trophy-1.png',
    tone: 'gold',
  },
  {
    id: 2,
    rank: 'NO.2',
    title: '轻食主义（中关村店）',
    category: '轻食沙拉',
    score: '4.7',
    date: '05-17',
    tags: ['健康低脂', '食材新鲜', '搭配合理', '轻盈无负担'],
    reason: '食材新鲜低脂，搭配丰富，健康营养，吃得安心',
    logo: '/static/list/logo-light-food.png',
    trophy: '/static/list/trophy-2.png',
    tone: 'silver',
  },
  {
    id: 3,
    rank: 'NO.3',
    title: '川香阁川湘菜（清华园店）',
    category: '川湘菜',
    score: '4.6',
    date: '05-16',
    tags: ['口味正宗', '价格实惠', '服务好', '分量大'],
    reason: '口味地道，性价比高，出餐快，服务热情',
    logo: '/static/list/logo-chuanxiang.png',
    trophy: '/static/list/trophy-3.png',
    tone: 'bronze',
  },
]

const blackMerchants: BlackMerchant[] = [
  {
    id: 1,
    title: '小味炸鸡（五道口店）',
    category: '炸鸡小吃',
    score: '2.1',
    date: '05-18',
    issue: '卫生问题',
    reason: '多次反映存在异物，后厨卫生差',
    logo: '/static/list/logo-xiaowei.png',
  },
  {
    id: 2,
    title: '麦香汉堡（清华东路店）',
    category: '西式快餐',
    score: '2.3',
    date: '05-17',
    issue: '食材问题',
    reason: '食材新鲜度不足，存在变质风险',
    logo: '/static/list/logo-maixiang.png',
  },
]

function chooseRank(type: RankType) {
  activeRank.value = type
}

function chooseFilter(label: string) {
  activeFilter.value = label
}
</script>

<template>
  <view class="list-page">
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
        :key="item.label"
        class="filter-chip"
        :class="{ 'filter-chip--active': activeFilter === item.label }"
        @tap="chooseFilter(item.label)"
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
        :class="[`rank-card--${merchant.tone}`, { 'rank-card--featured': merchant.id === 1, 'rank-card--with-action': merchant.id === 3 }]"
      >
        <view class="rank-card__main">
          <view class="rank-badge" :class="`rank-badge--${merchant.tone}`">
            <text>{{ merchant.rank }}</text>
          </view>

          <image class="merchant-logo" :src="merchant.logo" mode="aspectFill" />

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
          <image class="trophy" :class="`trophy--${merchant.tone}`" :src="merchant.trophy" mode="aspectFit" />

          <view class="recommend">
            <text class="recommend__label">
              推荐理由：
            </text>
            <text class="recommend__text">
              {{ merchant.reason }}
            </text>
          </view>
        </view>

        <view v-if="merchant.id === 3" class="rank-card__action">
          <text>查看全部红榜商家</text>
          <view class="i-carbon-chevron-right action-icon" />
        </view>
      </view>
    </view>

    <view class="black-preview">
      <view class="black-preview__header">
        <view class="black-preview__title">
          <view class="black-title-icon i-carbon-warning-alt-filled" />
          <text>黑榜商家预览</text>
        </view>
        <view class="black-preview__more">
          <text>全部黑榜</text>
          <view class="i-carbon-chevron-right more-icon" />
        </view>
      </view>

      <view class="black-list">
        <view v-for="merchant in blackMerchants" :key="merchant.id" class="black-row">
          <image class="black-logo" :src="merchant.logo" mode="aspectFill" />

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
  min-height: 100%;
  padding: 24rpx 0 32rpx;
  overflow-x: hidden;
  color: #111318;
  font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
  background: #fff;
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
  padding: 32rpx 24rpx 24rpx 214rpx;
}

.rank-card--with-action {
  .rank-card__main {
    min-height: 218rpx;
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

.merchant-logo {
  position: absolute;
  top: 36rpx;
  left: 40rpx;
  width: 106rpx;
  height: 106rpx;
  overflow: hidden;
  border-radius: 50%;
}

.merchant-info {
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  width: 100%;
  padding-right: 166rpx;
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

.trophy {
  position: absolute;
  top: 56rpx;
  right: 38rpx;
  width: 160rpx;
  height: 124rpx;
}

.trophy--silver,
.trophy--bronze {
  right: 46rpx;
  width: 132rpx;
  height: 96rpx;
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
  display: flex;
  align-items: center;
  min-height: 86rpx;
  padding: 12rpx 16rpx 12rpx 8rpx;
  box-sizing: border-box;
  background: #fff;
  border: 1rpx solid #edf0f4;
  border-radius: 13rpx;
}

.black-row + .black-row {
  margin-top: 8rpx;
}

.black-logo {
  flex: 0 0 auto;
  width: 60rpx;
  height: 60rpx;
  margin-right: 17rpx;
  overflow: hidden;
  border-radius: 50%;
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
