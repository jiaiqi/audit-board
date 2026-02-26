import { createSuccessResponse } from '../../utils/response'

/**
 * 在途看板 - 车型占比
 * GET /api/in-transit/vehicle-type-ratio
 */
export default defineEventHandler(() => {
  return createSuccessResponse({
    data: [
      { value: 40, name: '一类' },
      { value: 32, name: '二类' },
      { value: 18, name: '三类' },
      { value: 10, name: '四类' },
    ],
  })
})
