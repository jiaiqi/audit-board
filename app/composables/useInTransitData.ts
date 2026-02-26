import {
  mockAmountBarChart,
  mockAmountRankChart,
  mockCenterPieChart,
  mockCenterRingChart,
  mockDevices,
  mockLeftPieChart,
  mockQuantityRankChart,
  mockStats,
  mockTrendLineChart,
  mockVehiclePieChart,
} from '~/data/mockInTransitData'

// ─────────────────────────────────────
// 前端数据类型
// ─────────────────────────────────────

export interface InTransitStat { key: string, label: string, value: string, icon: string }
export interface DeviceInfo { ip: string, cpu: string, memory: string, disk: string, usage: number, time: string }
export interface InTransitSeriesItem { name: string, data: number[] }
export interface InTransitPieChartData { data: { value: number, name: string }[] }
export interface InTransitHBarChartData { categories: string[], series: InTransitSeriesItem[] }

// ─────────────────────────────────────
// 字段适配函数：真实接口原始字段 → 前端格式
// ─────────────────────────────────────

/** 统计卡片：单条对象 → 卡片数组 */
function adaptStats(raw: any): InTransitStat[] {
  return [
    { key: 'lastMonthCount', label: '上月在途成果数量', value: String(raw.diff_cnt_lm ?? '-'), icon: '/assets/icons/a.png' },
    { key: 'lastMonthAmount', label: '上月在途成果金额', value: String(raw.diff_fee_lm_to ?? '-'), icon: '/assets/icons/b.png' },
    { key: 'lastMonthPushCount', label: '上月推送成果数量', value: String(raw.stlh_cnt_lm ?? '-'), icon: '/assets/icons/c.png' },
    { key: 'lastMonthPushAmount', label: '上月推送成果金额', value: String(raw.stlh_fee_lm ?? '-'), icon: '/assets/icons/d.png' },
    { key: 'thisMonthCount', label: '本月在途成果数量', value: String(raw.diff_cnt_cm ?? '-'), icon: '/assets/icons/e.png' },
    { key: 'thisMonthAmount', label: '本月在途成果金额', value: String(raw.diff_fee_cm ?? '-'), icon: '/assets/icons/f.png' },
  ]
}

/** 设备心跳 */
function adaptDevices(raw: any[]): DeviceInfo[] {
  return raw.map(d => ({
    ip: d.ip_address,
    cpu: d.sys_cpu_load,
    memory: d.physical_total_memory,
    disk: d.disk_usable_space,
    usage: Number.parseFloat(d.sys_cpu_load) || 0,
    time: d.update_time,
  }))
}

/** 饼图通用适配：nameKey → name, valueKey → value */
function adaptPie(nameKey: string, valueKey: string) {
  return (raw: any[]): InTransitPieChartData => ({
    data: raw.map(d => ({ name: d[nameKey], value: Number(d[valueKey]) || 0 })),
  })
}

/** 排名柱状图通用适配：nameKey → categories, valueKey → series.data */
function adaptRank(seriesName: string, nameKey: string, valueKey: string) {
  return (raw: any[]): InTransitHBarChartData => ({
    categories: raw.map(d => d[nameKey]),
    series: [{ name: seriesName, data: raw.map(d => Number(d[valueKey]) || 0) }],
  })
}

/** 日期趋势通用适配：dateKey → categories, valueKey → series.data */
function adaptDateSeries(seriesName: string, dateKey: string, valueKey: string) {
  return (raw: any[]): InTransitHBarChartData => ({
    categories: raw.map(d => d[dateKey]),
    series: [{ name: seriesName, data: raw.map(d => Number(d[valueKey]) || 0) }],
  })
}

// ─────────────────────────────────────
// Composable
// ─────────────────────────────────────

/**
 * 在途看板数据
 * apiFetch 已在内部完成 state 检查 + data 提取 + 字段适配 + 降级兜底，
 * 返回的 .data 直接是业务类型 Ref<T | null>，外部无需再做 computed 提取
 */
export function useInTransitData() {
  const { apiFetch } = useApiConfig()

  const { data: stats } = apiFetch('srvaud_laneexitdata_cnt_lm_cm_select', mockStats, adaptStats)
  const { data: devices } = apiFetch('srvaud_laneexitdata_dev_status_select', mockDevices, adaptDevices)
  const { data: leftPieChart } = apiFetch('srvaud_laneexitdata_amount_m_ratio_select', mockLeftPieChart, adaptPie('dept_name', 'diff_ratio_sts'))
  const { data: amountRankChart } = apiFetch('srvaud_laneexitdata_amount_station_top10_select', mockAmountRankChart, adaptRank('成果金额', 'dept_name', 'diff_fee_disp'))
  const { data: quantityRankChart } = apiFetch('srvaud_laneexitdata_cnt_station_top10_select', mockQuantityRankChart, adaptRank('成果数量', 'dept_name', 'stlh_cnt'))
  const { data: centerPieChart } = apiFetch('srvaud_laneexitdata_cnt_m_ratio_select', mockCenterPieChart, adaptPie('dept_name', 'cnt_ratio_sts'))
  const { data: centerRingChart } = apiFetch('srvaud_laneexitdata_type_ratio_select', mockCenterRingChart, adaptPie('type_name', 'diff_ratio_sts'))
  const { data: vehiclePieChart } = apiFetch('srvaud_laneexitdata_vehicle_ratio_select', mockVehiclePieChart, adaptPie('exvehicletype', 'cnt_ratio_sts'))
  const { data: trendLineChart } = apiFetch('srvaud_laneexitdata_cnt_date_select', mockTrendLineChart, adaptDateSeries('成果数量', 'statistic_date', 'diff_cnt'))
  const { data: amountBarChart } = apiFetch('srvaud_laneexitdata_amount_date_select', mockAmountBarChart, adaptDateSeries('成果金额', 'statistic_date', 'diff_fee_disp'))

  return { stats, devices, leftPieChart, amountRankChart, quantityRankChart, centerPieChart, centerRingChart, vehiclePieChart, trendLineChart, amountBarChart }
}
