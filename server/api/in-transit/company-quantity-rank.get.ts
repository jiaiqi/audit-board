import { createSuccessResponse } from '../../utils/response'

/**
 * 在途看板 - 本月成果数量排名TOP10
 * GET /api/in-transit/company-quantity-rank
 */
export default defineEventHandler(() => {
  return createSuccessResponse({
    categories: ['陕西曲江收费站', '陕西新筑收费站', '陕西阿房宫收费站', '陕西西铜收费站', '陕西咸阳东收费站', '陕西灞桥收费站', '陕西临潼收费站', '陕西泾阳收费站', '陕西三原收费站', '陕西高陵收费站'],
    series: [{ name: '成果数量', data: [442, 361, 255, 350, 247, 110, 150, 163, 200, 180] }],
  })
})
