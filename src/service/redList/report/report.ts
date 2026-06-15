import type { MerchantCardVo, MerchantSearchQuery, OptionVo, ReportSubmitReq, ReportSubmitVo } from '../types'
import { redListHttp as http } from '../client'

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
