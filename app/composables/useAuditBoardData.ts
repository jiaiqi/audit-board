import type { ApiResponse } from '~~/server/utils/response'

/** 统计卡片类型 */
export interface AuditBoardStat {
  key: string
  label: string
  value: number
  unit: string
}

/** 图表序列（工单看板专用） */
export interface AuditSeriesItem {
  name: string
  data: number[]
}

/** 各图表数据类型 */
export interface BarChartData { categories: string[], series: AuditSeriesItem[] }
export interface LineChartData { categories: string[], series: AuditSeriesItem[] }
export interface PieChartData { data: { value: number, name: string }[] }
export interface RingChartData {
  value: number
  total: number
  label: string
  center: { label: string, value: number }
}
export interface TrendLineChartData { categories: string[], series: AuditSeriesItem[] }
export interface GroupBarChartData { categories: string[], series: AuditSeriesItem[] }

/**
 * 工单看板数据 Composable
 * 每个图表使用独立接口（按业务命名），利用 useFetch 并行请求
 * 兼容 SSR/CSR（Nuxt 水合时不重复请求）
 */
export function useAuditBoardData() {
  const { getUrl } = useApiConfig()

  // 统计卡片数据
  const { data: statsRes } = useFetch<ApiResponse<AuditBoardStat[]>>(
    getUrl('/api/audit-board/stats', '/audit/board/stats'),
  )

  // 分公司追缴金额排名TOP10
  const { data: barChartRes } = useFetch<ApiResponse<BarChartData>>(
    getUrl('/api/audit-board/company-recovery-rank', '/audit/board/company-recovery-rank'),
  )

  // 追缴金额历史趋势
  const { data: lineChartRes } = useFetch<ApiResponse<LineChartData>>(
    getUrl('/api/audit-board/recovery-amount-trend', '/audit/board/recovery-amount-trend'),
  )

  // 特情车辆类型数量统计
  const { data: pieChartRes } = useFetch<ApiResponse<PieChartData>>(
    getUrl('/api/audit-board/special-vehicle-stats', '/audit/board/special-vehicle-stats'),
  )

  // 工单处理指标（环形进度）
  const { data: ringChartRes } = useFetch<ApiResponse<RingChartData>>(
    getUrl('/api/audit-board/workorder-indicator', '/audit/board/workorder-indicator'),
  )

  // 上月追缴金额日变化趋势
  const { data: trendLineChartRes } = useFetch<ApiResponse<TrendLineChartData>>(
    getUrl('/api/audit-board/daily-recovery-trend', '/audit/board/daily-recovery-trend'),
  )

  // 工单量按月统计
  const { data: groupBarChartRes } = useFetch<ApiResponse<GroupBarChartData>>(
    getUrl('/api/audit-board/monthly-workorder-stats', '/audit/board/monthly-workorder-stats'),
  )

  // 提取 state=SUCCESS 时的 data
  const stats = computed(() =>
    statsRes.value?.state === 'SUCCESS' ? statsRes.value.data : [],
  )
  const barChart = computed(() =>
    barChartRes.value?.state === 'SUCCESS' ? barChartRes.value.data : null,
  )
  const lineChart = computed(() =>
    lineChartRes.value?.state === 'SUCCESS' ? lineChartRes.value.data : null,
  )
  const pieChart = computed(() =>
    pieChartRes.value?.state === 'SUCCESS' ? pieChartRes.value.data : null,
  )
  const ringChart = computed(() =>
    ringChartRes.value?.state === 'SUCCESS' ? ringChartRes.value.data : null,
  )
  const trendLineChart = computed(() =>
    trendLineChartRes.value?.state === 'SUCCESS' ? trendLineChartRes.value.data : null,
  )
  const groupBarChart = computed(() =>
    groupBarChartRes.value?.state === 'SUCCESS' ? groupBarChartRes.value.data : null,
  )

  return {
    stats,
    barChart,
    lineChart,
    pieChart,
    ringChart,
    trendLineChart,
    groupBarChart,
  }
}
