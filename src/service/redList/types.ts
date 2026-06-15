export type RankType = 'red' | 'black'

export interface ApiResult<T> {
  code: number
  message?: string
  msg?: string
  data: T
  timestamp?: string
}

export interface OptionVo {
  id: number
  name: string
  iconUrl?: string
  type?: string
}

export interface MerchantCardVo {
  merchantId: number
  categoryId?: number
  categoryName?: string
  name?: string
  branchName?: string
  fullName?: string
  logoUrl?: string
  address?: string
  avgScore?: number | string
  redCount?: number
  blackCount?: number
  favoriteCount?: number
  favorite?: boolean
  tags?: string[]
}

export interface ReportRecordVo {
  reportId: number
  merchantId?: number
  merchantName?: string
  branchName?: string
  fullName?: string
  categoryName?: string
  logoUrl?: string
  avgScore?: number | string
  reportType: RankType
  reportTypeName?: string
  status?: string
  rating?: number
  description?: string
  tags?: string[]
  createdAt?: string
}

export interface RankMerchantVo {
  rankNo?: number
  rankType: RankType
  merchantId: number
  name?: string
  branchName?: string
  fullName?: string
  categoryName?: string
  logoUrl?: string
  avgScore?: number | string
  tags?: string[]
  reason?: string
  issueLabel?: string
  lastReportAt?: string
}

export interface UserProfileVo {
  userId: number
  nickname?: string
  avatarUrl?: string
  slogan?: string
  userLevel?: string
  points?: number
  creditScore?: number
  continuousDays?: number
}

export interface MyStatisticsVo {
  reportCount?: number
  favoriteCount?: number
  pendingCount?: number
  unreadNotificationCount?: number
  points?: number
  creditScore?: number
  continuousDays?: number
}

export interface FavoriteToggleVo {
  merchantId: number
  favorite: boolean
  favoriteCount: number
}

export interface NotificationVo {
  id: number
  title?: string
  content?: string
  noticeType?: string
  relatedType?: string
  relatedId?: number
  read?: boolean
  createdAt?: string
}

export interface ReportSubmitReq {
  userId: number
  campusId?: number
  merchantId?: number
  merchantName?: string
  branchName?: string
  categoryId: number
  reportType: RankType
  orderTime: string
  rating: number
  tagIds: number[]
  description: string
  photoUrls?: string[]
  isAnonymous?: number
}

export interface ReportSubmitVo {
  reportId: number
  status: string
}

export interface HomeQuery {
  campusId?: number
  keyword?: string
  userId?: number
}

export interface MerchantSearchQuery extends HomeQuery {
  categoryId?: number
  limit?: number
}

export interface RankQuery {
  campusId?: number
  rankType?: RankType
  categoryId?: number
  keyword?: string
  sortType?: 'rank' | 'distance' | 'score' | 'week'
  periodType?: 'all' | 'week' | 'month'
  page?: number
  limit?: number
}
