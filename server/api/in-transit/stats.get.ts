import { createSuccessResponse } from '../../utils/response'

/**
 * 在途看板统计卡片数据
 * GET /api/in-transit/stats
 */
export default defineEventHandler(() => {
  const data = [
    { key: 'lastMonthCount', label: '上月在途成果数量', value: '5000', icon: '/assets/icons/a.png' },
    { key: 'lastMonthAmount', label: '上月在途成果金额', value: '65894.55', icon: '/assets/icons/b.png' },
    { key: 'lastMonthPushCount', label: '上月推送成果数量', value: '800', icon: '/assets/icons/c.png' },
    { key: 'lastMonthPushAmount', label: '上月推送成果金额', value: '56546.36', icon: '/assets/icons/d.png' },
    { key: 'thisMonthCount', label: '本月在途成果数量', value: '9', icon: '/assets/icons/e.png' },
    { key: 'thisMonthAmount', label: '本月在途成果金额', value: '15', icon: '/assets/icons/f.png' },
  ]
  return createSuccessResponse(data, { total: data.length, pageNo: 1, rownumber: data.length })
})
