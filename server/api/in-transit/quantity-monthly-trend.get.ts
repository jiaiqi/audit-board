import { createSuccessResponse } from '../../utils/response'

/**
 * 在途看板 - 在途成果数量本月趋势
 * GET /api/in-transit/quantity-monthly-trend
 */
export default defineEventHandler(() => {
  return createSuccessResponse({
    categories: ['12-01', '12-02', '12-03', '12-04', '12-05', '12-06', '12-07', '12-08', '12-09', '12-10'],
    series: [{ name: '数量', data: [220, 200, 180, 160, 140, 120, 160, 180, 170, 200] }],
  })
})
