import { createSuccessResponse } from '../../utils/response'

/**
 * 工单看板 - 分公司追缴金额排名TOP10
 * GET /api/audit-board/company-recovery-rank
 */
export default defineEventHandler(() => {
  return createSuccessResponse({
    categories: ['公司简称一', '公司简称二', '公司简称三', '公司简称四', '公司简称五', '公司简称六', '公司简称七', '公司简称八', '公司简称九', '公司简称十'],
    series: [{ name: '追缴金额', data: [1860, 1620, 1480, 1350, 1200, 1080, 950, 820, 680, 520] }],
  })
})
