import { createSuccessResponse } from '../../utils/response'

/**
 * 工单看板 - 追缴金额历史趋势
 * GET /api/audit-board/recovery-amount-trend
 */
export default defineEventHandler(() => {
  return createSuccessResponse({
    categories: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    series: [{ name: '追缴金额', data: [120, 200, 180, 160, 80, 60, 90, 100, 120, 130, 140, 150] }],
  })
})
