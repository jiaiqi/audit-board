import { createSuccessResponse } from '../../utils/response'

/**
 * 工单看板统计卡片数据
 * GET /api/audit-board/stats
 */
export default defineEventHandler(() => {
  const data = [
    { key: 'monthInitiated', label: '本月发起工单', value: 124, unit: '' },
    { key: 'monthRecovery', label: '本月追缴工单', value: 623, unit: '' },
    { key: 'monthAmount', label: '本月追缴金额', value: 40.17, unit: '万' },
    { key: 'lastMonthAmount', label: '上月追缴金额', value: 62.23, unit: '万' },
  ]
  return createSuccessResponse(data, { total: data.length, pageNo: 1, rownumber: data.length })
})
