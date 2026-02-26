import { createSuccessResponse } from '../../utils/response'

/**
 * 在途看板 - 在途成果金额本月变化
 * GET /api/in-transit/amount-monthly-change
 */
export default defineEventHandler(() => {
  return createSuccessResponse({
    categories: ['12-01', '12-02', '12-03', '12-04', '12-05', '12-06', '12-07', '12-08', '12-09', '12-10'],
    series: [{ name: '金额', data: [120, 150, 130, 110, 140, 180, 160, 140, 190, 130] }],
  })
})
