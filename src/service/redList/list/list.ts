import type { OptionVo, RankMerchantVo, RankQuery } from '../types'
import { redListHttp as http } from '../client'

export function categories() {
  return http.get<OptionVo[]>('/app/list/categories')
}

export function rankItems(query: RankQuery) {
  return http.get<RankMerchantVo[]>('/app/list/rank-items', query)
}

export function allMerchants(query: RankQuery) {
  return http.get<RankMerchantVo[]>('/app/list/all-merchants', query)
}

export function total(query: RankQuery) {
  return http.get<number>('/app/list/total', query)
}

export function blackPreview(query: { campusId?: number, limit?: number }) {
  return http.get<RankMerchantVo[]>('/app/list/black-preview', query)
}
