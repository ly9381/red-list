import type { MerchantCardVo, MerchantSearchQuery, OptionVo, ReportSubmitReq, ReportSubmitVo } from '../types'
import { redListHttp as http } from '../client'

interface UploadResponseData {
  code?: number
  message?: string
  msg?: string
  url?: string
  fileUrl?: string
  imageUrl?: string
  path?: string
  src?: string
  fullUrl?: string
  data?: string | UploadResponseData
}

const DEFAULT_UPLOAD_URL = '/app/upload/image'
const UPLOAD_FIELD_NAME = 'file'

export function campuses() {
  return http.get<OptionVo[]>('/app/report/campuses')
}

export function categories() {
  return http.get<OptionVo[]>('/app/report/categories')
}

export function goodTags() {
  return http.get<OptionVo[]>('/app/report/good-tags')
}

export function badTags() {
  return http.get<OptionVo[]>('/app/report/bad-tags')
}

export function searchMerchants(query: MerchantSearchQuery) {
  return http.get<MerchantCardVo[]>('/app/report/merchant/search', query)
}

export function submit(data: ReportSubmitReq) {
  return http.post<ReportSubmitVo>('/app/report/submit', data)
}

export function uploadImage(filePath: string) {
  const uploadUrl = import.meta.env.VITE_UPLOAD_BASEURL || DEFAULT_UPLOAD_URL

  return new Promise<string>((resolve, reject) => {
    uni.uploadFile({
      url: uploadUrl,
      filePath,
      name: UPLOAD_FIELD_NAME,
      success: (res) => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          reject(new Error(`图片上传失败：${res.statusCode}`))
          return
        }

        const response = parseUploadData(res.data)
        if (response.code && response.code !== 200) {
          reject(new Error(response.message || response.msg || '图片上传失败'))
          return
        }

        const imageUrl = parseUploadUrl(response)
        if (!imageUrl) {
          reject(new Error('上传成功，但没有获取到图片地址'))
          return
        }

        resolve(imageUrl)
      },
      fail: err => reject(err),
    })
  })
}

function parseUploadUrl(rawData: string | UploadResponseData) {
  const response = parseUploadData(rawData)
  const data = response?.data
  const uploadUrl = typeof data === 'string'
    ? data
    : data?.url || data?.fileUrl || data?.imageUrl || data?.path || data?.src || data?.fullUrl

  return uploadUrl || response?.url || response?.fileUrl || response?.imageUrl || response?.path || response?.src || response?.fullUrl || ''
}

function parseUploadData(rawData: string | UploadResponseData): UploadResponseData {
  if (typeof rawData !== 'string')
    return rawData

  try {
    return JSON.parse(rawData)
  }
  catch {
    return { url: rawData }
  }
}
