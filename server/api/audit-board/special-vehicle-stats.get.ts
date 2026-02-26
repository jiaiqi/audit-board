import { createSuccessResponse } from '../../utils/response'

/**
 * 工单看板 - 特情车辆类型数量统计
 * GET /api/audit-board/special-vehicle-stats
 */
export default defineEventHandler(() => {
  return createSuccessResponse({
    data: [
      { value: 40, name: '类型一' },
      { value: 32, name: '类型二' },
      { value: 18, name: '类型三' },
      { value: 23, name: '类型四' },
    ],
  })
})
