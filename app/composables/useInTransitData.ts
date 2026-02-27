import dayjs from 'dayjs'
import {
  mockAmountBarChart,
  mockAmountRankChart, // 本月成果金额排名TOP10
  mockCenterPieChart,
  mockCenterRingChart,
  mockDevices, // 设备心跳
  mockLeftPieChart, // 分公司本月成果占比
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
    { key: 'lastMonthCount', label: '上月在途成果数量', value: String(raw.ztjh_cnt_lm ?? '-'), icon: `${useRuntimeConfig().app.baseURL}assets/icons/a.png` },
    { key: 'lastMonthAmount', label: '上月在途成果金额', value: String(raw.diff_fee_lm ?? '-'), icon: `${useRuntimeConfig().app.baseURL}assets/icons/b.png` },
    { key: 'lastMonthPushCount', label: '上月推送成果数量', value: String(raw.ztjh_cnt_lm_ts ?? '-'), icon: `${useRuntimeConfig().app.baseURL}assets/icons/c.png` },
    { key: 'lastMonthPushAmount', label: '上月推送成果金额', value: String(raw.diff_fee_lm_ts ?? '-'), icon: `${useRuntimeConfig().app.baseURL}assets/icons/d.png` },
    { key: 'thisMonthCount', label: '本月在途成果数量', value: String(raw.ztjh_cnt_cm ?? '-'), icon: `${useRuntimeConfig().app.baseURL}assets/icons/e.png` },
    { key: 'thisMonthAmount', label: '本月在途成果金额', value: String(raw.diff_fee_cm ?? '-'), icon: `${useRuntimeConfig().app.baseURL}assets/icons/f.png` },
  ]
}

/** 在途设备心跳监测 */
function adaptDevices(raw: any[]): DeviceInfo[] {
  return raw.map(d => ({
    ip: d.ip_address,
    cpu: d.system_cpu_load, // 系统CPU负载百分比
    memory: d.physical_total_memory, // 总物理内存大小
    disk: d.disk1_usable_space, // 磁盘可用空间
    usage: Number.parseFloat(d.physical_memory_used_rate.replace('%', '')) || 0, // 物理内存使用率百分比
    time: dayjs(d.update_time).format('YYYY-MM-DD HH:mm'),
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

  const { data: stats, pending: statsPending } = apiFetch('srvaud_laneexitdata_cnt_lm_cm_select', mockStats, adaptStats) // 统计卡片
  const { data: devices, pending: devicesPending } = apiFetch('srvaud_laneexitdata_dev_status_select', mockDevices, adaptDevices)
  const { data: leftPieChart, pending: leftPieChartPending } = apiFetch('srvaud_laneexitdata_amount_m_ratio_select', mockLeftPieChart, adaptPie('dept_name', 'dept_ratio_str')) // 分公司本月成果占比
  const { data: amountRankChart, pending: amountRankChartPending } = apiFetch('srvaud_laneexitdata_amount_station_top10_select', mockAmountRankChart, adaptRank('成果金额', 'dept_name', 'diff_fee_disp')) // 本月成果金额排名TOP10
  const { data: quantityRankChart, pending: quantityRankChartPending } = apiFetch('srvaud_laneexitdata_cnt_station_top10_select', mockQuantityRankChart, adaptRank('成果数量', 'dept_name', 'ztjh_cnt')) // 本月成果数量排名TOP10
  const { data: centerPieChart, pending: centerPieChartPending } = apiFetch('srvaud_laneexitdata_cnt_m_ratio_select', mockCenterPieChart, adaptPie('dept_name', 'dept_ratio_str')) // 分公司本月成果数量占比
  const { data: centerRingChart, pending: centerRingChartPending } = apiFetch('srvaud_laneexitdata_type_ratio_select', mockCenterRingChart, adaptPie('amount_type', 'dept_ratio_str')) // 成果类型金额占比
  const { data: vehiclePieChart, pending: vehiclePieChartPending } = apiFetch('srvaud_laneexitdata_vehicle_ratio_select', mockVehiclePieChart, adaptPie('exvehicletype_str', 'dept_ratio_str')) // 车型占比
  const { data: trendLineChart, pending: trendLineChartPending } = apiFetch('srvaud_laneexitdata_cnt_date_select', mockTrendLineChart, adaptDateSeries('成果数量', 'cnt_date', 'ztjh_cnt')) // 成果数量本月趋势
  const { data: amountBarChart, pending: amountBarChartPending } = apiFetch('srvaud_laneexitdata_amount_date_select', mockAmountBarChart, adaptDateSeries('成果金额', 'cnt_date', 'diff_fee')) // 成果金额本月变化
  // === 全局 isLoading 汇总 ===
  const isLoadingRaw = computed(() =>
    statsPending.value
    || devicesPending.value
    || leftPieChartPending.value
    || amountRankChartPending.value
    || quantityRankChartPending.value
    || centerPieChartPending.value
    || centerRingChartPending.value
    || vehiclePieChartPending.value
    || trendLineChartPending.value
    || amountBarChartPending.value,
  )

  const isClientReady = ref(false)
  if (import.meta.client) {
    setTimeout(() => {
      isClientReady.value = true
    }, 600)
  }

  // 计算属性，合成 API pending 与首次渲染最少 600ms 的保护层，保证各模块首屏加载动效不割裂
  const delayedIsLoading = computed(() => {
    if (import.meta.client && !isClientReady.value) {
      return true
    }
    return isLoadingRaw.value
  })

  return {
    stats,
    devices,
    leftPieChart,
    amountRankChart,
    quantityRankChart,
    centerPieChart,
    centerRingChart,
    vehiclePieChart,
    trendLineChart,
    amountBarChart,
    isLoading: delayedIsLoading,
    /* 导出单点 pending 以供 ECharts 使用 */
    pendings: {
      leftPieChart: leftPieChartPending,
      amountRankChart: amountRankChartPending,
      quantityRankChart: quantityRankChartPending,
      centerPieChart: centerPieChartPending,
      centerRingChart: centerRingChartPending,
      vehiclePieChart: vehiclePieChartPending,
      trendLineChart: trendLineChartPending,
      amountBarChart: amountBarChartPending,
    },
  }
}
