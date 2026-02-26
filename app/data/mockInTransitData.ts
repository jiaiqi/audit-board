import type {
  DeviceInfo,
  InTransitHBarChartData,
  InTransitPieChartData,
  InTransitStat,
} from '~/composables/useInTransitData'

/**
 * 在途看板本地兜底数据（纯业务格式，无 ApiResponse 包装）
 * 接口不通时直接作为降级数据使用
 */

export const mockStats: InTransitStat[] = [
  { key: 'lastMonthCount', label: '上月在途成果数量', value: '5000', icon: '/assets/icons/a.png' },
  { key: 'lastMonthAmount', label: '上月在途成果金额', value: '65894.55', icon: '/assets/icons/b.png' },
  { key: 'lastMonthPushCount', label: '上月推送成果数量', value: '800', icon: '/assets/icons/c.png' },
  { key: 'lastMonthPushAmount', label: '上月推送成果金额', value: '56546.36', icon: '/assets/icons/d.png' },
  { key: 'thisMonthCount', label: '本月在途成果数量', value: '9', icon: '/assets/icons/e.png' },
  { key: 'thisMonthAmount', label: '本月在途成果金额', value: '15', icon: '/assets/icons/f.png' },
]

export const mockDevices: DeviceInfo[] = [
  { ip: '10.61.13.170', cpu: '0.83%', memory: '15.6G', disk: '862.5G', usage: 70, time: '23-03-31 10:17' },
  { ip: '10.61.13.171', cpu: '1.20%', memory: '15.6G', disk: '720.0G', usage: 90, time: '23-03-31 10:17' },
  { ip: '10.61.13.172', cpu: '0.54%', memory: '15.6G', disk: '500.3G', usage: 70, time: '23-03-31 10:17' },
  { ip: '10.61.13.173', cpu: '0.31%', memory: '15.6G', disk: '930.1G', usage: 40, time: '23-03-31 10:17' },
  { ip: '10.61.13.174', cpu: '2.10%', memory: '15.6G', disk: '610.8G', usage: 70, time: '23-03-31 10:17' },
  { ip: '10.61.13.175', cpu: '0.76%', memory: '15.6G', disk: '755.2G', usage: 70, time: '23-03-31 10:17' },
]

export const mockLeftPieChart: InTransitPieChartData = {
  data: [{ value: 50, name: '西藏分公司' }, { value: 30, name: '西安分公司' }, { value: 20, name: '榆林分公司' }],
}

export const mockAmountRankChart: InTransitHBarChartData = {
  categories: ['陕西曲江收费站', '陕西新筑收费站', '陕西阿房宫收费站', '陕西西铜收费站', '陕西咸阳东收费站', '陕西灞桥收费站', '陕西临潼收费站', '陕西泾阳收费站', '陕西三原收费站', '陕西高陵收费站'],
  series: [{ name: '成果金额', data: [255, 350, 247, 442, 361, 110, 150, 163, 200, 180] }],
}

export const mockQuantityRankChart: InTransitHBarChartData = {
  categories: ['陕西曲江收费站', '陕西新筑收费站', '陕西阿房宫收费站', '陕西西铜收费站', '陕西咸阳东收费站', '陕西灞桥收费站', '陕西临潼收费站', '陕西泾阳收费站', '陕西三原收费站', '陕西高陵收费站'],
  series: [{ name: '成果数量', data: [442, 361, 255, 350, 247, 110, 150, 163, 200, 180] }],
}

export const mockCenterPieChart: InTransitPieChartData = {
  data: [{ value: 50, name: '西藏分公司' }, { value: 30, name: '西安分公司' }, { value: 20, name: '榆林分公司' }],
}

export const mockCenterRingChart: InTransitPieChartData = {
  data: [{ value: 60, name: '推送金额' }, { value: 40, name: '成果金额' }],
}

export const mockVehiclePieChart: InTransitPieChartData = {
  data: [{ value: 40, name: '一类' }, { value: 32, name: '二类' }, { value: 18, name: '三类' }, { value: 10, name: '四类' }],
}

export const mockTrendLineChart: InTransitHBarChartData = {
  categories: ['12-01', '12-02', '12-03', '12-04', '12-05', '12-06', '12-07', '12-08', '12-09', '12-10'],
  series: [{ name: '数量', data: [220, 200, 180, 160, 140, 120, 160, 180, 170, 200] }],
}

export const mockAmountBarChart: InTransitHBarChartData = {
  categories: ['12-01', '12-02', '12-03', '12-04', '12-05', '12-06', '12-07', '12-08', '12-09', '12-10'],
  series: [{ name: '金额', data: [120, 150, 130, 110, 140, 180, 160, 140, 190, 130] }],
}
