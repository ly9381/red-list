<route lang="jsonc">
{
  "layout": "tabbar",
  "style": {
    "navigationStyle": "custom",
    "navigationBarTitleText": "上报"
  }
}
</route>

<script setup lang="ts">
import type { MerchantCardVo, OptionVo, RankType, ReportSubmitReq } from '@/service/redList'
import { API } from '@/service'
import { DEFAULT_USER_ID, RED_LIST_REFRESH_EVENT } from '@/service/redList'
// import { useUserStore } from '@/store'

defineOptions({
  name: 'ReportPage',
})

const MOCK_CAMPUS_ID = 1
const systemInfo = uni.getWindowInfo()
const safeAreaInsets = systemInfo.safeArea
const menuButtonInfo = uni.getMenuButtonBoundingClientRect?.()
const customBarTop = menuButtonInfo?.top || safeAreaInsets?.top || 0
const customBarHeight = menuButtonInfo?.height || systemInfo.statusBarHeight || 0
// const userStore = useUserStore()

const activeType = ref<RankType>('red')
const rating = ref(0)
const anonymous = ref(false)
const categories = ref<OptionVo[]>([])
const merchantKeyword = ref('')
const merchantResults = ref<MerchantCardVo[]>([])
const selectedMerchant = ref<MerchantCardVo>()
const selectedCategoryId = ref<number>()
const orderDate = ref(formatDateInput(new Date()))
const description = ref('')

interface UploadImageItem {
  id: number
  localPath: string
  url: string
  uploading: boolean
}

const MAX_UPLOAD_COUNT = 6
let uploadImageId = 0
const uploadImages = ref<UploadImageItem[]>([])
const uploadSlots = computed(() => Array.from({ length: Math.max(MAX_UPLOAD_COUNT - uploadImages.value.length, 0) }, (_, index) => index + 1))
const isUploadingImage = computed(() => uploadImages.value.some(item => item.uploading))

// 单用户模式：暂时不走登录态，后续恢复登录时可切回 userStore.userInfo.id。
// const currentUserId = computed(() => Number(userStore.userInfo?.id || DEFAULT_USER_ID))
const currentUserId = DEFAULT_USER_ID
const selectedCategoryName = computed(() => categories.value.find(item => item.id === selectedCategoryId.value)?.name || '')
const selectedMerchantName = computed(() => selectedMerchant.value?.fullName || selectedMerchant.value?.name || merchantKeyword.value)

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

function formatDateInput(date: Date) {
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

function chooseType(type: RankType) {
  activeType.value = type
}

function chooseRating(value: number) {
  rating.value = value
}

function toggleAnonymous() {
  anonymous.value = !anonymous.value
}

function chooseCategory(event: any) {
  const index = Number(event.detail.value)
  selectedCategoryId.value = categories.value[index]?.id
}

function chooseOrderDate(event: any) {
  orderDate.value = event.detail.value
}

async function searchReportMerchants() {
  if (!merchantKeyword.value.trim())
    return
  const res = await API.redList.report.searchMerchants({
    campusId: MOCK_CAMPUS_ID,
    keyword: merchantKeyword.value.trim(),
    limit: 10,
  })
  merchantResults.value = res.data || []
}

async function chooseMerchant() {
  await searchReportMerchants()
  if (!merchantResults.value.length) {
    selectedMerchant.value = undefined
    uni.showToast({ title: '未找到商家，将按新商家上报', icon: 'none' })
    return
  }

  uni.showActionSheet({
    itemList: merchantResults.value.map(item => item.fullName || item.name || '未命名商家'),
    success: ({ tapIndex }) => {
      selectedMerchant.value = merchantResults.value[tapIndex]
      merchantKeyword.value = selectedMerchantName.value
      if (selectedMerchant.value?.categoryId)
        selectedCategoryId.value = selectedMerchant.value.categoryId
    },
  })
}

async function chooseReportImages() {
  const remainingCount = MAX_UPLOAD_COUNT - uploadImages.value.length
  if (remainingCount <= 0) {
    uni.showToast({ title: '最多上传6张图片', icon: 'none' })
    return
  }

  try {
    const filePaths = await chooseImages(remainingCount)
    filePaths.forEach((filePath) => {
      const imageId = ++uploadImageId
      uploadImages.value.push({
        id: imageId,
        localPath: filePath,
        url: '',
        uploading: true,
      })
      uploadReportImage(imageId, filePath)
    })
  }
  catch (error: any) {
    if (!String(error?.errMsg || error?.message || '').includes('cancel'))
      uni.showToast({ title: '选择图片失败', icon: 'none' })
  }
}

function chooseImages(count: number) {
  return new Promise<string[]>((resolve, reject) => {
    // #ifdef MP-WEIXIN
    uni.chooseMedia({
      count,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res: any) => {
        const tempFilePaths = (res.tempFiles || [])
          .map((item: any) => item.tempFilePath)
          .filter(Boolean)
        resolve(tempFilePaths)
      },
      fail: err => reject(err),
    })
    // #endif

    // #ifndef MP-WEIXIN
    uni.chooseImage({
      count,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePaths = Array.isArray(res.tempFilePaths) ? res.tempFilePaths : [res.tempFilePaths].filter(Boolean)
        resolve(tempFilePaths as string[])
      },
      fail: err => reject(err),
    })
    // #endif
  })
}

async function uploadReportImage(imageId: number, filePath: string) {
  try {
    const url = await API.redList.report.uploadImage(filePath)
    const image = uploadImages.value.find(item => item.id === imageId)
    if (image) {
      image.url = url
      image.uploading = false
    }
  }
  catch (error: any) {
    uploadImages.value = uploadImages.value.filter(item => item.id !== imageId)
    uni.showToast({ title: error?.message || '图片上传失败', icon: 'none' })
  }
}

function removeUploadImage(index: number) {
  uploadImages.value.splice(index, 1)
}

function validateForm() {
  if (!selectedMerchantName.value.trim())
    return '请填写或选择商家名称'
  if (!selectedCategoryId.value)
    return '请选择商家分类'
  if (!rating.value)
    return '请点击评分'
  if (description.value.trim().length < 1)
    return '详细说明至少 1 个字'
  return ''
}

async function submitReport() {
  const error = validateForm()
  if (error) {
    uni.showToast({ title: error, icon: 'none' })
    return
  }

  if (isUploadingImage.value) {
    uni.showToast({ title: '图片还在上传中，请稍后提交', icon: 'none' })
    return
  }
  if (uploadImages.value.some(item => !item.url)) {
    uni.showToast({ title: '有图片上传失败，请重新选择', icon: 'none' })
    return
  }

  const now = new Date()
  const time = `${`${now.getHours()}`.padStart(2, '0')}:${`${now.getMinutes()}`.padStart(2, '0')}:${`${now.getSeconds()}`.padStart(2, '0')}`
  const payload: ReportSubmitReq = {
    userId: currentUserId,
    campusId: MOCK_CAMPUS_ID,
    merchantId: selectedMerchant.value?.merchantId,
    merchantName: selectedMerchant.value ? selectedMerchant.value.name : merchantKeyword.value.trim(),
    branchName: selectedMerchant.value?.branchName,
    categoryId: selectedCategoryId.value!,
    reportType: activeType.value,
    orderTime: `${orderDate.value} ${time}`,
    rating: rating.value,
    tagIds: [],
    description: description.value.trim(),
    photoUrls: uploadImages.value.map(item => item.url).filter(Boolean),
    isAnonymous: anonymous.value ? 1 : 0,
  }

  const res = await API.redList.report.submit(payload)
  if (res.code === 200) {
    uni.showToast({ title: '提交成功', icon: 'success' })
    uni.$emit(RED_LIST_REFRESH_EVENT)
    description.value = ''
    rating.value = 0
    uploadImages.value = []
  }
  else {
    uni.showToast({ title: (res as any).message || res.msg || '提交失败', icon: 'none' })
  }
}

onLoad(async () => {
  const categoryRes = await API.redList.report.categories()
  categories.value = categoryRes.data || []
})
</script>

<template>
  <view class="report-page" :style="{ paddingTop: `${customBarTop}px` }">
    <view class="custom-bar" :style="{ height: `${customBarHeight}px` }">
      <text>上报</text>
    </view>

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
          <input v-model="merchantKeyword" class="plain-input" placeholder="搜索或输入商家名称" confirm-type="search" @confirm="chooseMerchant">
        </view>
        <view class="i-carbon-chevron-right row-arrow" @tap="chooseMerchant" />
      </view>

      <view class="form-row">
        <view class="form-label">
          分类 <text>*</text>
        </view>
        <picker class="input-pill" :range="categories" range-key="name" @change="chooseCategory">
          <text>{{ selectedCategoryName || '选择商家分类' }}</text>
        </picker>
        <view class="row-arrow i-carbon-chevron-right" />
      </view>

      <view class="form-row">
        <view class="form-label">
          就餐/下单时间 <text>*</text>
        </view>
        <picker class="input-pill" mode="date" :value="orderDate" @change="chooseOrderDate">
          <view class="input-icon i-carbon-calendar" />
          <text>{{ orderDate || '选择时间' }}</text>
        </picker>
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

      <view class="desc-row">
        <view class="form-label">
          详细说明 <text>*</text>
        </view>
        <view class="textarea-box">
          <textarea v-model="description" class="desc-input" :maxlength="500" placeholder="请详细描述您的体验，帮助更多人参考（10-500字）" />
          <view class="count">
            {{ description.length }}/500
          </view>
        </view>
      </view>

      <view class="upload-block">
        <view class="upload-title">
          上传照片
          <text>请上传与体验相关的照片，最多6张</text>
        </view>
        <view class="upload-grid">
          <view v-for="(image, index) in uploadImages" :key="image.id" class="upload-cell upload-cell--image">
            <image class="upload-preview" :src="image.localPath || image.url" mode="aspectFill" />
            <view v-if="image.uploading" class="upload-mask">
              上传中
            </view>
            <view class="upload-remove i-carbon-close" @tap.stop="removeUploadImage(index)" />
          </view>
          <view v-for="item in uploadSlots" :key="`upload-${item}`" class="upload-cell" @tap="chooseReportImages">
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
      <view class="tip-icon i-carbon-warning-alt-filled" />
      <text>温馨提示：请如实填写，恶意上报将影响您的信用记录</text>
    </view>

    <button class="submit-button" @tap="submitReport">
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

.custom-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24rpx;
  font-size: 34rpx;
  font-weight: 800;
  line-height: 1;
  color: #0f1115;
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

.plain-input {
  flex: 1;
  min-width: 0;
  height: 64rpx;
  font-size: 23rpx;
  color: #111318;
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
  color: #4e5561;
  background: #eef0f3;
  border: 1rpx solid #e2e5ea;
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

.desc-input {
  width: 100%;
  min-height: 76rpx;
  font-size: 22rpx;
  line-height: 32rpx;
  color: #111318;
}

.report-tag--active {
  color: #fff;
  background: #f32626;
  border-color: #f32626;
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
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 112rpx;
  font-size: 20rpx;
  color: #7a828d;
  border: 1rpx dashed #d6dae1;
  border-radius: 10rpx;
  overflow: hidden;
  background: #fff;
}

.upload-cell--image {
  border-style: solid;
}

.upload-plus {
  width: 30rpx;
  height: 30rpx;
  margin-bottom: 10rpx;
  color: #5f6672;
}

.upload-preview {
  width: 100%;
  height: 100%;
}

.upload-mask {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20rpx;
  font-weight: 700;
  color: #fff;
  background: rgba(17, 19, 24, 0.48);
}

.upload-remove {
  position: absolute;
  top: 6rpx;
  right: 6rpx;
  width: 30rpx;
  height: 30rpx;
  padding: 4rpx;
  color: #fff;
  background: rgba(17, 19, 24, 0.55);
  border-radius: 50%;
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
