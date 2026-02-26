import { createSuccessResponse } from '../../utils/response'

/**
 * 在途看板 - 分公司本月成果数量占比
 * GET /api/in-transit/company-quantity-ratio
 */
export default defineEventHandler(() => {
  return createSuccessResponse({
    data: [
      { value: 50, name: '西藏分公司' },
      { value: 30, name: '西安分公司' },
      { value: 20, name: '榆林分公司' },
    ],
  })
})
