import { createSuccessResponse } from '../../utils/response'

/**
 * 在途看板 - 成果金额占比（推送金额 vs 成果金额）
 * GET /api/in-transit/achievement-amount-ratio
 */
export default defineEventHandler(() => {
  return createSuccessResponse({
    data: [
      { value: 60, name: '推送金额' },
      { value: 40, name: '成果金额' },
    ],
  })
})
