<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为 page -->
<route lang="jsonc" type="home">
{
  "layout": "tabbar",
  "style": {
    // 'custom' 表示开启自定义导航栏，默认 'default'
    "navigationStyle": "custom",
    "navigationBarTitleText": "首页"
  }
}
</route>

<script lang="ts" setup>
defineOptions({
  name: 'Home',
})

interface RecommendMerchant {
  id: number
  name: string
  category: string
  score: string
  tags: string[]
  logo: string
}

interface RecordItem {
  id: number
  name: string
  type: 'red' | 'black'
  time: string
}

const systemInfo = uni.getWindowInfo()
const safeAreaInsets = systemInfo.safeArea
  ? {
      top: systemInfo.safeArea.top,
      right: systemInfo.windowWidth - systemInfo.safeArea.right,
      bottom: systemInfo.windowHeight - systemInfo.safeArea.bottom,
      left: systemInfo.safeArea.left,
    }
  : null

const luckyMerchant: RecommendMerchant = {
  id: 1,
  name: '黄焖鸡米饭',
  category: '快餐便当',
  score: '4.8',
  tags: ['干净卫生', '分量足', '口味好'],
  logo: '/static/list/logo-huangmen.png',
}

const redRecommendations: RecommendMerchant[] = [
  {
    id: 1,
    name: '黄焖鸡米饭',
    category: '快餐便当',
    score: '4.8',
    tags: ['干净卫生', '分量足'],
    logo: '/static/list/logo-huangmen.png',
  },
  {
    id: 2,
    name: '轻食主义',
    category: '轻食沙拉',
    score: '4.7',
    tags: ['健康低脂', '食材新鲜'],
    logo: '/static/list/logo-light-food.png',
  },
  {
    id: 3,
    name: '川香阁',
    category: '川湘菜',
    score: '4.6',
    tags: ['口味正宗', '服务好'],
    logo: '/static/list/logo-chuanxiang.png',
  },
]

const records: RecordItem[] = [
  { id: 1, name: '张亮麻辣烫（燕北园店）', type: 'red', time: '05-18 12:45' },
  { id: 2, name: '饭小盒（畅春园店）', type: 'black', time: '05-18 11:32' },
  { id: 3, name: '沙县小吃（勺园店）', type: 'red', time: '05-18 10:15' },
]
</script>

<template>
  <view class="home-page" :style="{ paddingTop: `${safeAreaInsets?.top || 0}px` }">
    <view class="page-title">
      外卖红黑榜记录
    </view>

    <view class="search-row">
      <view class="search-box">
        <view class="search-icon i-carbon-search" />
        <text class="search-placeholder">
          搜索商家名称、菜品、关键词
        </text>
      </view>
      <view class="location-box">
        <view class="location-icon i-carbon-location" />
        <text class="location-text">
          北京大学校园
        </text>
        <view class="chevron-down i-carbon-chevron-down" />
      </view>
    </view>

    <view class="lucky-card">
      <view class="lucky-title-row">
        <view class="dice-icon i-carbon-cube" />
        <view>
          <view class="lucky-title">
            今天吃什么呢
          </view>
          <view class="lucky-subtitle">
            随机从红榜中抽取 1 家优质外卖
          </view>
        </view>
      </view>

      <view class="lucky-merchant">
        <image class="lucky-logo" :src="luckyMerchant.logo" mode="aspectFill" />
        <view class="lucky-info">
          <view class="merchant-name">
            {{ luckyMerchant.name }}
          </view>
          <view class="merchant-meta">
            <text>{{ luckyMerchant.category }}</text>
            <view class="score">
              <view class="score-icon i-carbon-star-filled" />
              <text>{{ luckyMerchant.score }}</text>
            </view>
          </view>
          <view class="tag-row">
            <text v-for="tag in luckyMerchant.tags" :key="tag" class="tag">
              {{ tag }}
            </text>
          </view>
          <view class="source-row">
            <view class="source-icon i-carbon-checkmark-filled" />
            <text>来自红榜推荐</text>
          </view>
        </view>
      </view>

      <button class="draw-button">
        随机抽取
      </button>
    </view>

    <view class="section-card">
      <view class="section-header">
        <view class="section-title">
          红榜推荐
        </view>
        <view class="section-more">
          <text>更多</text>
          <view class="more-icon i-carbon-chevron-right" />
        </view>
      </view>

      <view class="recommend-grid">
        <view v-for="merchant in redRecommendations" :key="merchant.id" class="recommend-card">
          <image class="recommend-logo" :src="merchant.logo" mode="aspectFill" />
          <view class="recommend-name">
            {{ merchant.name }}
          </view>
          <view class="recommend-category">
            {{ merchant.category }}
          </view>
          <view class="recommend-score">
            <view class="score-icon i-carbon-star-filled" />
            <text>{{ merchant.score }}</text>
          </view>
          <view class="mini-tags">
            <text v-for="tag in merchant.tags" :key="tag" class="mini-tag">
              {{ tag }}
            </text>
          </view>
        </view>
      </view>
    </view>

    <view class="section-card record-section">
      <view class="section-header">
        <view class="section-title">
          最新记录
        </view>
        <view class="section-more">
          <text>全部记录</text>
          <view class="more-icon i-carbon-chevron-right" />
        </view>
      </view>

      <view class="record-list">
        <view v-for="record in records" :key="record.id" class="record-row">
          <text class="record-name">
            {{ record.name }}
          </text>
          <text class="record-badge" :class="record.type === 'red' ? 'record-badge--red' : 'record-badge--black'">
            {{ record.type === 'red' ? '红榜' : '黑榜' }}
          </text>
          <text class="record-time">
            {{ record.time }}
          </text>
          <view class="i-carbon-chevron-right record-arrow" />
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.home-page {
  min-height: 100%;
  box-sizing: border-box;
  padding-right: 40rpx;
  padding-bottom: 40rpx;
  padding-left: 40rpx;
  overflow-x: hidden;
  color: #111318;
  font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
  background: #fff;
}

.page-title {
  margin-top: 34rpx;
  font-size: 38rpx;
  font-weight: 800;
  line-height: 52rpx;
  color: #15171c;
  text-align: center;
}

.search-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 284rpx;
  gap: 24rpx;
  margin-top: 30rpx;
}

.search-box,
.location-box {
  display: flex;
  align-items: center;
  height: 76rpx;
  box-sizing: border-box;
  background: #fff;
  border: 1rpx solid #dfe1e6;
  border-radius: 18rpx;
}

.search-box {
  min-width: 0;
  padding: 0 28rpx;
}

.search-icon {
  flex: 0 0 auto;
  width: 40rpx;
  height: 40rpx;
  color: #8c929d;
}

.search-placeholder {
  margin-left: 18rpx;
  overflow: hidden;
  font-size: 28rpx;
  line-height: 40rpx;
  color: #8a9099;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.location-box {
  justify-content: center;
  min-width: 0;
  padding: 0 18rpx;
}

.location-icon {
  width: 34rpx;
  height: 34rpx;
  color: #15171c;
}

.location-text {
  margin: 0 8rpx 0 10rpx;
  overflow: hidden;
  font-size: 26rpx;
  line-height: 36rpx;
  color: #17191f;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chevron-down {
  flex: 0 0 auto;
  width: 26rpx;
  height: 26rpx;
  color: #17191f;
}

.lucky-card {
  box-sizing: border-box;
  padding: 34rpx 28rpx 26rpx;
  margin-top: 22rpx;
  background: linear-gradient(120deg, #fff 0%, #fff4f4 100%);
  border: 1rpx solid #ffc4c4;
  border-radius: 18rpx;
  box-shadow: 0 8rpx 22rpx rgba(244, 35, 35, 0.08);
}

.lucky-title-row {
  display: flex;
  align-items: center;
}

.dice-icon {
  flex: 0 0 auto;
  width: 58rpx;
  height: 58rpx;
  margin-right: 24rpx;
  color: #f32626;
}

.lucky-title {
  font-size: 38rpx;
  font-weight: 800;
  line-height: 48rpx;
  color: #e71922;
}

.lucky-subtitle {
  margin-top: 12rpx;
  font-size: 25rpx;
  line-height: 34rpx;
  color: #1f232b;
}

.lucky-merchant {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 32rpx 40rpx;
  margin-top: 24rpx;
  background: #fff;
  border-radius: 18rpx;
  box-shadow: 0 8rpx 22rpx rgba(25, 31, 44, 0.08);
}

.lucky-logo {
  flex: 0 0 auto;
  width: 142rpx;
  height: 142rpx;
  overflow: hidden;
  border-radius: 50%;
}

.lucky-info {
  min-width: 0;
  margin-left: 44rpx;
}

.merchant-name {
  overflow: hidden;
  font-size: 36rpx;
  font-weight: 800;
  line-height: 48rpx;
  color: #16181e;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.merchant-meta {
  display: flex;
  align-items: center;
  margin-top: 12rpx;
  font-size: 26rpx;
  line-height: 36rpx;
  color: #5c6370;
}

.score {
  display: flex;
  align-items: center;
  margin-left: 32rpx;
}

.score-icon {
  width: 28rpx;
  height: 28rpx;
  margin-right: 9rpx;
  color: #f32626;
}

.tag-row,
.mini-tags {
  display: flex;
  gap: 12rpx;
  align-items: center;
}

.tag-row {
  margin-top: 16rpx;
}

.tag,
.mini-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  color: #f32626;
  white-space: nowrap;
  border: 1rpx solid #ff9999;
  border-radius: 6rpx;
}

.tag {
  height: 40rpx;
  padding: 0 16rpx;
  font-size: 24rpx;
  line-height: 1;
}

.source-row {
  display: flex;
  align-items: center;
  margin-top: 18rpx;
  font-size: 24rpx;
  line-height: 34rpx;
  color: #606875;
}

.source-icon {
  width: 25rpx;
  height: 25rpx;
  margin-right: 10rpx;
  color: #f32626;
}

.draw-button {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 76rpx;
  margin-top: 24rpx;
  font-size: 30rpx;
  font-weight: 800;
  line-height: 1;
  color: #fff;
  background: #f32626;
  border-radius: 40rpx;

  &::after {
    border: 0;
  }
}

.section-card {
  box-sizing: border-box;
  padding: 26rpx 28rpx 28rpx;
  margin-top: 22rpx;
  background: #fff;
  border: 1rpx solid #ebedf1;
  border-radius: 18rpx;
  box-shadow: 0 8rpx 24rpx rgba(25, 31, 44, 0.06);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-title {
  font-size: 32rpx;
  font-weight: 800;
  line-height: 42rpx;
  color: #17191f;
}

.section-more {
  display: flex;
  align-items: center;
  font-size: 24rpx;
  line-height: 34rpx;
  color: #747b86;
}

.more-icon {
  width: 24rpx;
  height: 24rpx;
  margin-left: 8rpx;
  color: #747b86;
}

.recommend-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18rpx;
  margin-top: 22rpx;
}

.recommend-card {
  min-width: 0;
  box-sizing: border-box;
  padding: 20rpx 16rpx 18rpx;
  text-align: center;
  background: #fff;
  border: 1rpx solid #edf0f3;
  border-radius: 14rpx;
  box-shadow: 0 6rpx 18rpx rgba(25, 31, 44, 0.04);
}

.recommend-logo {
  width: 96rpx;
  height: 96rpx;
  overflow: hidden;
  border-radius: 50%;
}

.recommend-name {
  margin-top: 14rpx;
  overflow: hidden;
  font-size: 25rpx;
  font-weight: 800;
  line-height: 34rpx;
  color: #17191f;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.recommend-category {
  margin-top: 4rpx;
  overflow: hidden;
  font-size: 22rpx;
  line-height: 30rpx;
  color: #69717d;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.recommend-score {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 8rpx;
  font-size: 25rpx;
  line-height: 34rpx;
  color: #404650;
}

.mini-tags {
  justify-content: center;
  margin-top: 12rpx;
}

.mini-tag {
  max-width: 92rpx;
  height: 32rpx;
  padding: 0 8rpx;
  overflow: hidden;
  font-size: 20rpx;
  line-height: 1;
  text-overflow: ellipsis;
}

.record-section {
  padding-bottom: 16rpx;
}

.record-list {
  padding: 4rpx 20rpx 0;
  margin-top: 14rpx;
  background: #fff;
  border: 1rpx solid #edf0f3;
  border-radius: 14rpx;
  box-shadow: 0 6rpx 18rpx rgba(25, 31, 44, 0.04);
}

.record-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 70rpx 168rpx 28rpx;
  column-gap: 18rpx;
  align-items: center;
  height: 66rpx;
  border-bottom: 1rpx solid #edf0f3;
}

.record-row:last-child {
  border-bottom: 0;
}

.record-name {
  overflow: hidden;
  font-size: 25rpx;
  line-height: 34rpx;
  color: #17191f;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.record-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 36rpx;
  font-size: 22rpx;
  font-weight: 700;
  color: #fff;
  border-radius: 9rpx;
}

.record-badge--red {
  background: #f32626;
}

.record-badge--black {
  background: #30343b;
}

.record-time {
  font-size: 23rpx;
  line-height: 32rpx;
  color: #666e7a;
  text-align: right;
}

.record-arrow {
  width: 26rpx;
  height: 26rpx;
  color: #8c929c;
}
</style>
