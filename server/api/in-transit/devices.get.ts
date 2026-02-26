import { createSuccessResponse } from '../../utils/response'

/**
 * 在途设备心跳监测列表数据
 * GET /api/in-transit/devices
 */
export default defineEventHandler(() => {
  const data = [
    { ip: '10.61.13.170', cpu: '0.83%', memory: '15.6G', disk: '862.5G', usage: 70, time: '23-03-31 10:17' },
    { ip: '10.61.13.171', cpu: '1.20%', memory: '15.6G', disk: '720.0G', usage: 90, time: '23-03-31 10:17' },
    { ip: '10.61.13.172', cpu: '0.54%', memory: '15.6G', disk: '500.3G', usage: 70, time: '23-03-31 10:17' },
    { ip: '10.61.13.173', cpu: '0.31%', memory: '15.6G', disk: '930.1G', usage: 40, time: '23-03-31 10:17' },
    { ip: '10.61.13.174', cpu: '2.10%', memory: '15.6G', disk: '610.8G', usage: 70, time: '23-03-31 10:17' },
    { ip: '10.61.13.175', cpu: '0.76%', memory: '15.6G', disk: '755.2G', usage: 70, time: '23-03-31 10:17' },
  ]
  return createSuccessResponse(data, { total: data.length, pageNo: 1, rownumber: data.length })
})
