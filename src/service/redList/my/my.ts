import type {
  FavoriteToggleVo,
  MerchantCardVo,
  MyStatisticsVo,
  NotificationVo,
  RankType,
  ReportRecordVo,
  UserProfileVo,
} from '../types'
import { redListHttp as http } from '../client'

export function profile(userId: number) {
  return http.get<UserProfileVo>('/app/my/profile', { userId })
}

export function statistics(userId: number) {
  return http.get<MyStatisticsVo>('/app/my/statistics', { userId })
}

export function recentReports(query: { userId: number, limit?: number }) {
  return http.get<ReportRecordVo[]>('/app/my/recent-reports', query)
}

export function reports(query: { userId: number, reportType?: RankType, status?: string }) {
  return http.get<ReportRecordVo[]>('/app/my/reports', query)
}

export function recordList(query: { userId: number, reportType?: RankType, status?: string, page?: number, limit?: number }) {
  return http.get<ReportRecordVo[]>('/app/my/record-list', query)
}

export function deleteReport(userId: number, reportId: number) {
  return http.delete<void>(`/app/my/reports/${reportId}`, { userId })
}

export function getReportDetail(userId: number, reportId: number) {
  return http.get<ReportRecordVo>(`/app/my/reports/${reportId}`, { userId })
}

export function favorites(userId: number) {
  return http.get<MerchantCardVo[]>('/app/my/favorites', { userId })
}

export function addFavorite(userId: number, merchantId: number) {
  return http.post<FavoriteToggleVo>(`/app/my/favorite/${merchantId}`, undefined, { userId })
}

export function removeFavorite(userId: number, merchantId: number) {
  return http.delete<FavoriteToggleVo>(`/app/my/favorite/${merchantId}`, { userId })
}

export function notifications(userId: number) {
  return http.get<NotificationVo[]>('/app/my/notifications', { userId })
}

export function markNotificationRead(userId: number, notificationId: number) {
  return http.post<void>(`/app/my/notifications/${notificationId}/read`, undefined, { userId })
}

export function feedback(data: { userId: number, content: string, contact?: string, imageUrls?: string[] }) {
  return http.post<void>('/app/my/feedback', data)
}
