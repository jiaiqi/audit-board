import type { ApiResponse } from '~~/server/utils/response'

/** 统计卡片类型 */
export interface InTransitStat {
  key: string
  label: string
  value: string
  icon: string
}

/** 设备心跳类型 */
export interface DeviceInfo {
  ip: string
  cpu: string
  memory: string
  disk: string
  usage: number
  time: string
}

/** 图表数据类型（在途看板专用） */
export interface InTransitSeriesItem {
  name: string
  data: number[]
}
export interface InTransitPieChartData { data: { value: number, name: string }[] }
export interface InTransitHBarChartData { categories: string[], series: InTransitSeriesItem[] }

/**
 * 在途看板数据 Composable
 * 每个图表使用独立接口（按业务命名），利用 useFetch 并行请求
 * 兼容 SSR/CSR（Nuxt 水合时不重复请求）
 */
export function useInTransitData() {
  const { getUrl } = useApiConfig()

  // 统计卡片数据
  const { data: statsRes } = useFetch<ApiResponse<InTransitStat[]>>(
    getUrl('/api/in-transit/stats', '/in-transit/stats'),
  )

  // 设备心跳数据
  const { data: devicesRes } = useFetch<ApiResponse<DeviceInfo[]>>(
    getUrl('/api/in-transit/devices', '/in-transit/devices'),
  )

  // 分公司本月成果占比
  const { data: leftPieChartRes } = useFetch<ApiResponse<InTransitPieChartData>>(
    getUrl('/api/in-transit/company-achievement-ratio', '/in-transit/company-achievement-ratio'),
  )

  // 本月成果金额排名TOP10
  const { data: amountRankChartRes } = useFetch<ApiResponse<InTransitHBarChartData>>(
    getUrl('/api/in-transit/company-amount-rank', '/in-transit/company-amount-rank'),
  )

  // 本月成果数量排名TOP10
  const { data: quantityRankChartRes } = useFetch<ApiResponse<InTransitHBarChartData>>(
    getUrl('/api/in-transit/company-quantity-rank', '/in-transit/company-quantity-rank'),
  )

  // 分公司本月成果数量占比
  const { data: centerPieChartRes } = useFetch<ApiResponse<InTransitPieChartData>>(
    getUrl('/api/in-transit/company-quantity-ratio', '/in-transit/company-quantity-ratio'),
  )

  // 成果金额占比（推送金额 vs 成果金额）
  const { data: centerRingChartRes } = useFetch<ApiResponse<InTransitPieChartData>>(
    getUrl('/api/in-transit/achievement-amount-ratio', '/in-transit/achievement-amount-ratio'),
  )

  // 车型占比
  const { data: vehiclePieChartRes } = useFetch<ApiResponse<InTransitPieChartData>>(
    getUrl('/api/in-transit/vehicle-type-ratio', '/in-transit/vehicle-type-ratio'),
  )

  // 在途成果数量本月趋势
  const { data: trendLineChartRes } = useFetch<ApiResponse<InTransitHBarChartData>>(
    getUrl('/api/in-transit/quantity-monthly-trend', '/in-transit/quantity-monthly-trend'),
  )

  // 在途成果金额本月变化
  const { data: amountBarChartRes } = useFetch<ApiResponse<InTransitHBarChartData>>(
    getUrl('/api/in-transit/amount-monthly-change', '/in-transit/amount-monthly-change'),
  )

  // 提取 state=SUCCESS 时的 data
  const stats = computed(() =>
    statsRes.value?.state === 'SUCCESS' ? statsRes.value.data : [],
  )
  const devices = computed(() =>
    devicesRes.value?.state === 'SUCCESS' ? devicesRes.value.data : [],
  )
  const leftPieChart = computed(() =>
    leftPieChartRes.value?.state === 'SUCCESS' ? leftPieChartRes.value.data : null,
  )
  const amountRankChart = computed(() =>
    amountRankChartRes.value?.state === 'SUCCESS' ? amountRankChartRes.value.data : null,
  )
  const quantityRankChart = computed(() =>
    quantityRankChartRes.value?.state === 'SUCCESS' ? quantityRankChartRes.value.data : null,
  )
  const centerPieChart = computed(() =>
    centerPieChartRes.value?.state === 'SUCCESS' ? centerPieChartRes.value.data : null,
  )
  const centerRingChart = computed(() =>
    centerRingChartRes.value?.state === 'SUCCESS' ? centerRingChartRes.value.data : null,
  )
  const vehiclePieChart = computed(() =>
    vehiclePieChartRes.value?.state === 'SUCCESS' ? vehiclePieChartRes.value.data : null,
  )
  const trendLineChart = computed(() =>
    trendLineChartRes.value?.state === 'SUCCESS' ? trendLineChartRes.value.data : null,
  )
  const amountBarChart = computed(() =>
    amountBarChartRes.value?.state === 'SUCCESS' ? amountBarChartRes.value.data : null,
  )

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
  }
}
