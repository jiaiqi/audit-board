import {
  mockBarChart,
  mockGroupBarChart,
  mockLineChart,
  mockPieChart,
  mockRingChart,
  mockStats,
  mockTrendLineChart,
} from '~/data/mockAuditBoardData'

// ─────────────────────────────────────
// 前端数据类型
// ─────────────────────────────────────

export interface AuditBoardStat { key: string, label: string, value: number, unit: string }
export interface AuditSeriesItem { name: string, data: number[] }
export interface BarChartData { categories: string[], series: AuditSeriesItem[] }
export interface LineChartData { categories: string[], series: AuditSeriesItem[] }
export interface PieChartData { data: { value: number, name: string }[] }
export interface RingChartData { value: number, total: number, label: string, center: { label: string, value: number } }
export interface TrendLineChartData { categories: string[], series: AuditSeriesItem[] }
export interface GroupBarChartData { categories: string[], series: AuditSeriesItem[] }

// ─────────────────────────────────────
// Composable
// ─────────────────────────────────────

/**
 * 工单看板数据
 * apiFetch 已在内部完成 state 检查 + data 提取 + 降级兜底，
 * 返回的 .data 直接是业务类型 Ref<T | null>
 */
export function useAuditBoardData() {
  const { apiFetch } = useApiConfig()

  const { data: stats, pending: statsPending } = apiFetch('srvaud_board_stats_select', mockStats)
  const { data: barChart, pending: barChartPending } = apiFetch('srvaud_board_company_recovery_rank_select', mockBarChart)
  const { data: lineChart, pending: lineChartPending } = apiFetch('srvaud_board_recovery_amount_trend_select', mockLineChart)
  const { data: pieChart, pending: pieChartPending } = apiFetch('srvaud_board_special_vehicle_stats_select', mockPieChart)
  const { data: ringChart, pending: ringChartPending } = apiFetch('srvaud_board_workorder_indicator_select', mockRingChart)
  const { data: trendLineChart, pending: trendLineChartPending } = apiFetch('srvaud_board_daily_recovery_trend_select', mockTrendLineChart)
  const { data: groupBarChart, pending: groupBarChartPending } = apiFetch('srvaud_board_monthly_workorder_stats_select', mockGroupBarChart)

  const isLoading = computed(() =>
    statsPending.value ||
    barChartPending.value ||
    lineChartPending.value ||
    pieChartPending.value ||
    ringChartPending.value ||
    trendLineChartPending.value ||
    groupBarChartPending.value,
  )

  return {
    stats,
    barChart,
    lineChart,
    pieChart,
    ringChart,
    trendLineChart,
    groupBarChart,
    isLoading,
    /* 导出具体图表的 pending 以供图表单点 loading 使用 */
    pendings: {
      barChart: barChartPending,
      lineChart: lineChartPending,
      pieChart: pieChartPending,
      ringChart: ringChartPending,
      trendLineChart: trendLineChartPending,
      groupBarChart: groupBarChartPending,
    },
  }
}
