/**
 * @file 文件上传处理工具
 * @author ikbye
 * @createDate 2025-6-13
 */

/**
 * 使用方法
 *       <wd-upload
 *         v-model:file-list="pageData.fileList"
 *         :upload-method="fileUpload"
 *         与图片二进制文件一起加入到formData里的参数
 *         :formData="HOUSE_PHOTOS"
 *       ></wd-upload>
 */

import { getEnvBaseUploadUrl, getEnvBaseUrl } from '@/utils'

const VITE_UPLOAD_BASEURL = `${getEnvBaseUploadUrl()}`

/**
 * @var {{fileType: number}}
 * @desc 用于加入upload接口中formData的参数
 */
export const LOGO = { fileType: 1 } // 商家入驻-营业执照
export const BUSINESS_LICENSE = { fileType: 2 } // 商家入驻-营业执照
export const ID_CARD_FRONT = { fileType: 3 } // 商家入驻-身份证正面
export const ID_CARD_BACK = { fileType: 4 } // 商家入驻-身份证反面
export const DECORATION_QUALIFICATION = { fileType: 5 } // 商家入驻-装修资质证书
export const DESIGN_QUALIFICATION = { fileType: 6 } // 商家入驻-设计资质证书
export const DECORATION_CASE_IMAGES = { fileType: 7 } // 商家入驻-装修案例图片
export const SUPPLEMENTARY_MATERIALS = { fileType: 8 } // 商家入驻-补充材料
export const BUSINESS_AVATAR = { fileType: 9 } // 商家信息-头像
export const HOUSE_PHOTOS = { fileType: 10 } // 房屋信息-房屋照片
export const FILE = { fileType: 11 } // 文件
export const SWIPER_FILE = { fileType: 12 } // 轮播图图片
export const COMMENT_FILE = { fileType: 13 } // 提交文件
export const USER_AVATAR = { fileType: 14 } // 用户头像
export const PROBLEM_FILE = { fileType: 15 } // 用户问题照片

/**
 * 组件直接调用的上传函数
 * @param file 文件列表
 * @param formData 包括二进制的
 * @param options 配置
 */
export function fileUpload(file, formData, options) {
  const uploadTask = uni.uploadFile({
    url: VITE_UPLOAD_BASEURL,
    header: options.header,
    // 二进制文件列表的参数名
    name: 'files',
    fileName: options.name,
    fileType: options.fileType,
    formData,
    filePath: file.url,
    success(res) {
      if (res.statusCode === options.statusCode) {
        // 设置上传成功
        options.onSuccess(res, file, formData)
      }
      else {
        // 设置上传失败
        options.onError({ ...res, errMsg: res.errMsg || '' }, file, formData)
      }
    },
    fail(err) {
      // 设置上传失败
      options.onError(err, file, formData)
    },
  })
  // 设置当前文件加载的百分比
  uploadTask.onProgressUpdate((res) => {
    options.onProgress(res, file)
  })
}

// 拼接网络地址
export function getUrl(url) {
  return `${getEnvBaseUrl()}${url}`
}

// 去除网络基址
export function delUrl(url) {
  return url.split(getEnvBaseUrl()).join('')
}

/**
 * 页面里的组件绑定的fileList格式是 [{url:baseUrl+相对地址},{...}]
 * 添加更新时提交到后端的Photos格式是[ '相对地址','相对地址',... ]
 */

// 将fileList转为Photos格式
export function CvtFileListToHalfUrl(fileList) {
  const HalfUrl = []
  for (let i = 0; i < fileList.length; i++) {
    // 如果是完整地址，需要删除基址
    if (fileList[i].url.includes('home-decoration')) {
      HalfUrl.push(delUrl(fileList[i].url))
    }
    // 如果是相对地址，直接加入即可
    else {
      HalfUrl.push(JSON.parse(fileList[i].response).data[0])
    }
  }
  return HalfUrl
}

// 将Photos转为fileList格式
export function CvtHalfUrlToFileList(HalfUrl) {
  const fileList = []
  for (let i = 0; i < HalfUrl.length; i++) {
    const obj = {
      url: HalfUrl[i],
    }
    obj.url = getUrl(obj.url)
    fileList.push(obj)
  }
  return JSON.parse(JSON.stringify(fileList))
}
