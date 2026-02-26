import { createSuccessResponse } from '../../utils/response'

/**
 * 工单看板 - 工单处理指标（环形进度）
 * GET /api/audit-board/workorder-indicator
 */
export default defineEventHandler(() => {
  return createSuccessResponse({
    value: 20,
    total: 100,
    label: '处理率',
    center: { label: '本月处理工单', value: 6236 },
  })
})
