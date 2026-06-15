import * as indexApi from './index/index'
import * as listApi from './list/list'
import * as myApi from './my/my'
import * as reportApi from './report/report'

export * from './constants'
export * from './types'

export const redListApi = {
  index: indexApi,
  list: listApi,
  report: reportApi,
  my: myApi,
}
