import { createSuccessResponse } from '../../utils/response'

/**
 * 工单看板 - 工单量按月统计
 * GET /api/audit-board/monthly-workorder-stats
 */
export default defineEventHandler(() => {
  return createSuccessResponse({
    categories: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    series: [
      { name: '发起工单', data: [120, 180, 150, 200, 160, 140, 170, 190, 210, 180, 160, 200] },
      { name: '处理工单', data: [100, 150, 130, 170, 140, 120, 150, 160, 180, 150, 140, 170] },
      { name: '追缴工单', data: [80, 120, 110, 140, 120, 100, 130, 140, 150, 130, 120, 150] },
    ],
  })
})
