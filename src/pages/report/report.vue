<route lang="jsonc">
{
  "layout": "tabbar",
  "style": {
    "navigationBarTitleText": "上报"
  }
}
</route>

<script setup lang="ts">
defineOptions({
  name: 'ReportPage',
})

type ReportType = 'red' | 'black'

const activeType = ref<ReportType>('red')
const rating = ref(0)
const anonymous = ref(false)

const reportTabs = [
  {
    type: 'red' as const,
    title: '红榜上报',
    desc: '推荐优质商家，分享美好体验',
    icon: 'i-carbon-thumbs-up-filled',
  },
  {
    type: 'black' as const,
    title: '黑榜上报',
    desc: '曝光问题商家，提醒大家避坑',
    icon: 'i-carbon-warning-alt-filled',
  },
]

const goodTags = ['味道很棒', '食材新鲜', '性价比高', '服务周到', '包装精美']
const badTags = ['食品变质', '分量不足', '价格不符', '服务态度差', '配送超时']
const uploads = Array.from({ length: 6 }, (_, index) => index + 1)

function chooseType(type: ReportType) {
  activeType.value = type
}

function chooseRating(value: number) {
  rating.value = value
}

function toggleAnonymous() {
  anonymous.value = !anonymous.value
}
</script>

<template>
  <view class="report-page">
    <view class="report-tabs">
      <view
        v-for="tab in reportTabs"
        :key="tab.type"
        class="report-tab"
        :class="{ 'report-tab--active': activeType === tab.type }"
        @tap="chooseType(tab.type)"
      >
        <view class="report-tab__main">
          <view class="report-tab__icon" :class="tab.icon" />
          <view>
            <view class="report-tab__title">
              {{ tab.title }}
            </view>
            <view class="report-tab__desc">
              {{ tab.desc }}
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="form-card">
      <view class="form-row">
        <view class="form-label">
          商家名称 <text>*</text>
        </view>
        <view class="input-pill">
          <view class="i-carbon-search input-icon" />
          <text>搜索或输入商家名称</text>
        </view>
        <view class="i-carbon-chevron-right row-arrow" />
      </view>

      <view class="form-row">
        <view class="form-label">
          分类 <text>*</text>
        </view>
        <view class="input-pill">
          <text>选择商家分类</text>
        </view>
        <view class="row-arrow i-carbon-chevron-right" />
      </view>

      <view class="form-row">
        <view class="form-label">
          就餐/下单时间 <text>*</text>
        </view>
        <view class="input-pill">
          <view class="input-icon i-carbon-calendar" />
          <text>选择时间</text>
        </view>
        <view class="row-arrow i-carbon-chevron-right" />
      </view>

      <view class="form-row form-row--score">
        <view class="form-label">
          评分 <text>*</text>
        </view>
        <view class="stars">
          <view
            v-for="item in 5"
            :key="item"
            class="i-carbon-star-filled star-icon"
            :class="{ 'star-icon--active': item <= rating }"
            @tap="chooseRating(item)"
          />
        </view>
        <view class="score-tip">
          点击评分
        </view>
      </view>

      <view class="tag-block">
        <view class="tag-head">
          <view class="form-label">
            标签 <text>*</text>
          </view>
          <view class="tag-tip">
            可多选
          </view>
        </view>

        <view class="tag-panel">
          <view class="tag-group">
            <view class="tag-title">
              优点标签 <text>（红榜必填）</text>
            </view>
            <view class="tag-list">
              <text v-for="tag in goodTags" :key="tag" class="report-tag report-tag--red">
                {{ tag }}
              </text>
              <view class="i-carbon-add add-tag" />
            </view>
          </view>

          <view class="tag-group tag-group--border">
            <view class="tag-title">
              问题标签 <text>（黑榜必填）</text>
            </view>
            <view class="tag-list">
              <text v-for="tag in badTags" :key="tag" class="report-tag report-tag--gray">
                {{ tag }}
              </text>
              <view class="add-tag i-carbon-add" />
            </view>
          </view>
        </view>
      </view>

      <view class="desc-row">
        <view class="form-label">
          详细说明 <text>*</text>
        </view>
        <view class="textarea-box">
          <text>请详细描述您的体验，帮助更多人参考（10-500字）</text>
          <view class="count">
            0/500
          </view>
        </view>
      </view>

      <view class="upload-block">
        <view class="upload-title">
          上传照片
          <text>请上传与体验相关的照片，最多6张</text>
        </view>
        <view class="upload-grid">
          <view v-for="item in uploads" :key="item" class="upload-cell">
            <view class="i-carbon-add upload-plus" />
            <text>上传照片</text>
          </view>
        </view>
      </view>

      <view class="anonymous-row">
        <view class="anonymous-text">
          <view class="anonymous-title">
            匿名发布
            <view class="info-icon i-carbon-information" />
          </view>
          <view class="anonymous-desc">
            开启后将隐藏您的昵称和头像
          </view>
        </view>
        <view class="switch" :class="{ 'switch--active': anonymous }" @tap="toggleAnonymous">
          <view class="switch-dot" />
        </view>
      </view>
    </view>

    <view class="report-tip">
      <view class="i-carbon-warning-alt-filled tip-icon" />
      <text>温馨提示：请如实填写，恶意上报将影响您的信用记录</text>
    </view>

    <button class="submit-button">
      提交上报
    </button>
  </view>
</template>

<style scoped lang="scss">
.report-page {
  min-height: 100%;
  box-sizing: border-box;
  padding: 24rpx 30rpx 40rpx;
  color: #111318;
  font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
  background: #fff;
}

.report-tabs {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  overflow: hidden;
  background: #f8f9fb;
  border: 1rpx solid #eceef2;
  border-radius: 18rpx;
}

.report-tab {
  box-sizing: border-box;
  min-height: 126rpx;
  padding: 24rpx 20rpx;
  color: #49505b;
}

.report-tab--active {
  color: #f32626;
  background: linear-gradient(110deg, #fff 0%, #fff1f1 100%);
  border: 1rpx solid #f32626;
  border-radius: 18rpx;
}

.report-tab__main {
  display: flex;
  align-items: center;
  justify-content: center;
}

.report-tab__icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 16rpx;
}

.report-tab__title {
  font-size: 28rpx;
  font-weight: 800;
  line-height: 38rpx;
}

.report-tab__desc {
  margin-top: 8rpx;
  font-size: 21rpx;
  line-height: 30rpx;
}

.form-card {
  padding: 20rpx 24rpx 24rpx;
  margin-top: 24rpx;
  background: #fff;
  border: 1rpx solid #edf0f4;
  border-radius: 18rpx;
  box-shadow: 0 8rpx 24rpx rgba(25, 31, 44, 0.05);
}

.form-row {
  display: grid;
  grid-template-columns: 176rpx minmax(0, 1fr) 34rpx;
  column-gap: 14rpx;
  align-items: center;
  min-height: 90rpx;
  border-bottom: 1rpx solid #edf0f4;
}

.form-row--score {
  grid-template-columns: 176rpx minmax(0, 1fr) 128rpx;
}

.form-label {
  font-size: 27rpx;
  font-weight: 800;
  line-height: 36rpx;
  color: #111318;

  text {
    color: #f32626;
  }
}

.input-pill {
  display: flex;
  align-items: center;
  min-width: 0;
  height: 64rpx;
  box-sizing: border-box;
  padding: 0 22rpx;
  font-size: 23rpx;
  line-height: 32rpx;
  color: #8b929e;
  background: #f6f7f9;
  border-radius: 22rpx;
}

.input-icon {
  width: 28rpx;
  height: 28rpx;
  margin-right: 14rpx;
  color: #727986;
}

.row-arrow {
  width: 30rpx;
  height: 30rpx;
  color: #59616c;
}

.stars {
  display: flex;
  gap: 24rpx;
  align-items: center;
}

.star-icon {
  width: 40rpx;
  height: 40rpx;
  color: #c9ccd3;
}

.star-icon--active {
  color: #f32626;
}

.score-tip,
.tag-tip {
  font-size: 22rpx;
  color: #727986;
  text-align: right;
}

.tag-block {
  padding: 24rpx 0;
  border-bottom: 1rpx solid #edf0f4;
}

.tag-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tag-panel {
  margin-top: 16rpx;
  overflow: hidden;
  border: 1rpx solid #e0e4ea;
  border-radius: 14rpx;
}

.tag-group {
  padding: 18rpx 16rpx;
}

.tag-group--border {
  border-top: 1rpx solid #edf0f4;
}

.tag-title {
  font-size: 21rpx;
  font-weight: 700;
  line-height: 30rpx;
  color: #111318;

  text {
    color: #f32626;
  }
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 14rpx 20rpx;
  align-items: center;
  margin-top: 14rpx;
}

.report-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 38rpx;
  padding: 0 16rpx;
  font-size: 20rpx;
  line-height: 1;
  border-radius: 7rpx;
}

.report-tag--red {
  color: #f32626;
  background: #fff0f0;
  border: 1rpx solid #ffcaca;
}

.report-tag--gray {
  color: #4e5561;
  background: #eef0f3;
  border: 1rpx solid #e2e5ea;
}

.add-tag {
  width: 40rpx;
  height: 40rpx;
  color: #7d8490;
  border: 1rpx solid #9aa0aa;
  border-radius: 50%;
}

.desc-row {
  display: grid;
  grid-template-columns: 176rpx minmax(0, 1fr);
  column-gap: 14rpx;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #edf0f4;
}

.textarea-box {
  min-height: 104rpx;
  box-sizing: border-box;
  padding: 20rpx 20rpx 16rpx;
  font-size: 22rpx;
  line-height: 32rpx;
  color: #8b929e;
  background: #f6f7f9;
  border-radius: 14rpx;
}

.count {
  margin-top: 20rpx;
  color: #6e7580;
  text-align: right;
}

.upload-block {
  padding: 24rpx 0 26rpx;
  border-bottom: 1rpx solid #edf0f4;
}

.upload-title {
  font-size: 27rpx;
  font-weight: 800;
  line-height: 36rpx;
  color: #111318;

  text {
    margin-left: 18rpx;
    font-size: 21rpx;
    font-weight: 400;
    color: #727986;
  }
}

.upload-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 18rpx;
  margin-top: 18rpx;
}

.upload-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 112rpx;
  font-size: 20rpx;
  color: #7a828d;
  border: 1rpx dashed #d6dae1;
  border-radius: 10rpx;
}

.upload-plus {
  width: 30rpx;
  height: 30rpx;
  margin-bottom: 10rpx;
  color: #5f6672;
}

.anonymous-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 22rpx;
}

.anonymous-title {
  display: flex;
  align-items: center;
  font-size: 27rpx;
  font-weight: 800;
  line-height: 36rpx;
  color: #111318;
}

.info-icon {
  width: 25rpx;
  height: 25rpx;
  margin-left: 14rpx;
  color: #6c7480;
}

.anonymous-desc {
  margin-top: 8rpx;
  font-size: 21rpx;
  color: #727986;
}

.switch {
  position: relative;
  width: 88rpx;
  height: 46rpx;
  background: #d7dae0;
  border-radius: 24rpx;
}

.switch-dot {
  position: absolute;
  top: 4rpx;
  left: 4rpx;
  width: 38rpx;
  height: 38rpx;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.12);
}

.switch--active {
  background: #f32626;

  .switch-dot {
    left: 46rpx;
  }
}

.report-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20rpx;
  font-size: 20rpx;
  line-height: 30rpx;
  color: #737b87;
}

.tip-icon {
  width: 24rpx;
  height: 24rpx;
  margin-right: 8rpx;
  color: #59616c;
}

.submit-button {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 74rpx;
  margin-top: 24rpx;
  font-size: 30rpx;
  font-weight: 800;
  color: #fff;
  background: #f32626;
  border-radius: 40rpx;

  &::after {
    border: 0;
  }
}
</style>
