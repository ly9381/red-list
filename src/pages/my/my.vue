<route lang="jsonc">
{
  "layout": "tabbar",
  "style": {
    "navigationBarTitleText": "我的"
  }
}
</route>

<script setup lang="ts">
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

const records: RecordItem[] = [
  {
    id: 1,
    type: 'red',
    name: '张亮麻辣烫（燕北园店）',
    tag: '红榜',
    desc: '食材新鲜，汤底干净，服务态度好',
    time: '05-18 12:45',
  },
  {
    id: 2,
    type: 'black',
    name: '饭小盒（畅春园店）',
    tag: '黑榜',
    desc: '饭菜有异味，包装破损，影响食用',
    time: '05-18 11:32',
  },
  {
    id: 3,
    type: 'red',
    name: '沙县小吃（勺园店）',
    tag: '红榜',
    desc: '出餐快，分量足，价格实惠',
    time: '05-18 10:15',
  },
]

const menuItems: MenuItem[] = [
  { id: 1, title: '我的收藏', desc: '收藏的优质商家', icon: 'i-carbon-star-filled', tone: 'yellow' },
  { id: 2, title: '审核进度', desc: '查看上报审核状态', icon: 'i-carbon-document-tasks', tone: 'blue' },
  { id: 3, title: '消息通知', desc: '系统消息与通知', icon: 'i-carbon-notification', tone: 'orange' },
  { id: 4, title: '帮助反馈', desc: '问题反馈与建议', icon: 'i-carbon-chat', tone: 'green' },
  { id: 5, title: '设置', desc: '账号与隐私设置', icon: 'i-carbon-settings', tone: 'gray' },
]
</script>

<template>
  <view class="my-page">
    <view class="profile-card">
      <view class="profile-main">
        <view class="avatar">
          <view class="avatar-icon i-carbon-user-avatar" />
        </view>
        <view class="profile-info">
          <view class="name-row">
            <text class="nickname">
              干饭小能手
            </text>
            <text class="level-tag">
              活跃贡献者
            </text>
          </view>
          <view class="slogan">
            一起维护外卖环境，分享真实体验
          </view>
        </view>
        <view class="i-carbon-chevron-right profile-arrow" />
      </view>

      <view class="stats-row">
        <view class="stat-item">
          <view class="stat-number">
            28
          </view>
          <view class="stat-label">
            我的上报
          </view>
        </view>
        <view class="stat-divider" />
        <view class="stat-item">
          <view class="stat-number">
            16
          </view>
          <view class="stat-label">
            收藏商家
          </view>
        </view>
        <view class="stat-divider" />
        <view class="stat-item stat-item--dot">
          <view class="stat-number">
            3
          </view>
          <view class="stat-label">
            待处理
          </view>
        </view>
      </view>

      <view class="points-card">
        <view class="points-icon i-carbon-security" />
        <view class="points-block">
          <text>积分</text>
          <text class="points-number">
            362
          </text>
        </view>
        <view class="points-line" />
        <view class="credit-block">
          <view class="credit-title">
            信誉良好
          </view>
          <view class="credit-desc">
            继续保持哦
          </view>
        </view>
        <view class="points-line" />
        <view class="credit-block">
          <view class="credit-title">
            连续贡献 12 天
          </view>
          <view class="credit-desc">
            再接再厉，获得更多积分
          </view>
        </view>
        <view class="i-carbon-chevron-right points-arrow" />
      </view>
    </view>

    <view class="section-card records-card">
      <view class="section-header">
        <view class="section-title">
          我的记录
        </view>
        <view class="section-more">
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
      <view class="report-button">
        <text>去上报</text>
        <view class="report-plus i-carbon-add" />
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
  padding: 32rpx 36rpx 22rpx;
  background: linear-gradient(120deg, #fff 0%, #fff2f2 100%);
  border-color: #ffd4d4;
}

.profile-main {
  display: flex;
  align-items: center;
}

.avatar {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 112rpx;
  height: 112rpx;
  overflow: hidden;
  background: #ffe6e6;
  border-radius: 50%;
}

.avatar-icon {
  width: 80rpx;
  height: 80rpx;
  color: #242832;
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
  color: #111318;
}

.stats-row {
  display: grid;
  grid-template-columns: 1fr 1rpx 1fr 1rpx 1fr;
  align-items: center;
  margin-top: 34rpx;
}

.stat-item {
  position: relative;
  text-align: center;
}

.stat-number {
  font-size: 34rpx;
  font-weight: 800;
  line-height: 42rpx;
  color: #111318;
}

.stat-label {
  margin-top: 8rpx;
  font-size: 22rpx;
  line-height: 32rpx;
  color: #59616d;
}

.stat-divider {
  height: 64rpx;
  background: #e5e8ed;
}

.stat-item--dot::after {
  position: absolute;
  top: -4rpx;
  right: 44rpx;
  width: 12rpx;
  height: 12rpx;
  content: '';
  background: #f32626;
  border-radius: 50%;
}

.points-card {
  display: grid;
  grid-template-columns: 82rpx 160rpx 1rpx minmax(0, 1fr) 1rpx minmax(0, 1.18fr) 30rpx;
  column-gap: 18rpx;
  align-items: center;
  min-height: 100rpx;
  padding: 12rpx 20rpx;
  margin-top: 32rpx;
  color: #f4d98d;
  background: #202734;
  border-radius: 14rpx;
}

.points-icon {
  width: 62rpx;
  height: 62rpx;
  color: #98a3b5;
}

.points-block {
  display: flex;
  align-items: baseline;
  font-size: 23rpx;
  font-weight: 700;
}

.points-number {
  margin-left: 12rpx;
  font-size: 34rpx;
  font-weight: 800;
}

.points-line {
  width: 1rpx;
  height: 64rpx;
  background: rgba(255, 255, 255, 0.18);
}

.credit-title {
  overflow: hidden;
  font-size: 25rpx;
  font-weight: 800;
  line-height: 34rpx;
  color: #f4d98d;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.credit-desc {
  margin-top: 6rpx;
  overflow: hidden;
  font-size: 20rpx;
  line-height: 28rpx;
  color: rgba(255, 255, 255, 0.78);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.points-arrow {
  width: 30rpx;
  height: 30rpx;
  color: #d5dbe5;
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
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
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
  padding-right: 22rpx;
  border-right: 1rpx solid #edf0f4;
}

.menu-item:nth-child(even) {
  padding-left: 24rpx;
}

.menu-item:nth-last-child(1),
.menu-item:nth-last-child(2) {
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
