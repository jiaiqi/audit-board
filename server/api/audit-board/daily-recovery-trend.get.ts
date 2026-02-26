import { createSuccessResponse } from '../../utils/response'

/**
 * 工单看板 - 上月追缴金额日变化趋势
 * GET /api/audit-board/daily-recovery-trend
 */
export default defineEventHandler(() => {
  return createSuccessResponse({
    categories: ['12-01', '12-02', '12-03', '12-04', '12-05', '12-06', '12-07', '12-08', '12-09', '12-10', '12-11', '12-12'],
    series: [
      { name: '系列1', data: [180, 200, 150, 220, 160, 190, 210, 170, 200, 230, 180, 160] },
      { name: '系列2', data: [120, 150, 130, 170, 140, 160, 150, 130, 160, 180, 140, 120] },
      { name: '系列3', data: [80, 100, 90, 120, 100, 110, 130, 90, 110, 140, 100, 80] },
    ],
  })
})
