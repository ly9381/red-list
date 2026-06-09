// 全局要用的类型放到这里

declare global {
  interface IResData<T> {
    code: number
    msg: string
    data: T
  }

  // uni.uploadFile文件上传参数
  interface IUniUploadFileOptions {
    file?: File
    files?: UniApp.UploadFileOptionFiles[]
    filePath?: string
    name?: string
    formData?: any
  }

  interface IUserInfo {
    openid?: string
    token?: string
    address?: string
    avatar?: string
    email?: string
    id?: number
    idCardNumber?: string
    nickname?: string
    phone?: string
    realName?: string
    sex?: string
  }
}

export {} // 防止模块污染
