import type { HomeQuery, MerchantCardVo, MerchantSearchQuery, OptionVo, ReportRecordVo } from '../types'
import { redListHttp as http } from '../client'

export function campuses() {
  return http.get<OptionVo[]>('/app/index/campuses')
}

export function currentCampus(campusId?: number) {
  return http.get<OptionVo>('/app/index/current-campus', campusId ? { campusId } : undefined)
}

export function searchMerchants(query: MerchantSearchQuery) {
  return http.get<MerchantCardVo[]>('/app/index/merchant/search', query)
}

export function todayEat(query: HomeQuery) {
  return http.get<MerchantCardVo>('/app/index/today-eat', query)
}

export function redRecommend(query: HomeQuery & { limit?: number }) {
  return http.get<MerchantCardVo[]>('/app/index/red-recommend', query)
}

export function latestRecords(query: { campusId?: number, limit?: number }) {
  return http.get<ReportRecordVo[]>('/app/index/latest-records', query)
}
