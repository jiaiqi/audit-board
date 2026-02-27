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
// 适配器函数 (后端数据 -> 前端格式)
// ─────────────────────────────────────

function adaptStats(raw: any): AuditBoardStat[] {
  // raw 可能是一个对象数组，取第一条
  const data = Array.isArray(raw) ? raw[0] : raw
  return [
    { key: 'monthInitiated', label: '本月发起工单', value: data?.cnt_cm_fq ?? 0, unit: '个' },
    { key: 'monthRecovery', label: '本月追缴工单', value: data?.cnt_cm_zj ?? 0, unit: '个' },
    { key: 'monthAmount', label: '本月追缴金额', value: data?.amount_cm_zj ?? 0, unit: '元' },
    { key: 'lastMonthAmount', label: '上月追缴金额', value: data?.amount_lm_zj ?? 0, unit: '元' },
  ]
}

function adaptBarChart(raw: any[]): BarChartData {
  return {
    categories: raw.map(d => d.org_name),
    series: [{ name: '追缴金额', data: raw.map(d => Number(d.cnt_fee)) }],
  }
}

function adaptLineChart(raw: any[]): LineChartData {
  return {
    categories: raw.map(d => d.year_month),
    series: [{ name: '追缴金额', data: raw.map(d => Number(d.total_payback)) }],
  }
}

function adaptPieChart(raw: any[]): PieChartData {
  return {
    data: raw.map(d => ({ name: d.s_type, value: Number(d.type_cnt) })),
  }
}

function adaptRingChart(raw: any[]): RingChartData {
  const data = Array.isArray(raw) ? raw[0] : raw
  const total = Number(data?.issue_total || 0)
  const proStr = data?.issue_pro_str || '0%'
  const percent = Number.parseFloat(proStr.replace('%', ''))
  // 此处特意返回饼图实际两块比例的数据（以便环形图分为已处理和未处理两截）
  // 虽然返回值与旧版稍微不同，但业务上更符合环形图需求
  return {
    value: percent,
    total: 100, // ECharts可以直接用这两个比例作为数据
    label: '处理率',
    center: { label: '本月特情工单', value: total },
  }
}

function adaptTrendLineChart(raw: any[]): TrendLineChartData {
  return {
    categories: raw.map(d => d.day_of_month),
    series: [{ name: '追缴金额', data: raw.map(d => Number(d.total_payback)) }],
  }
}

function adaptGroupBarChart(raw: any[]): GroupBarChartData {
  return {
    categories: raw.map(d => d.year_month),
    series: [
      { name: '发起工单', data: raw.map(d => Number(d.cnt_fq)) },
      { name: '追缴工单', data: raw.map(d => Number(d.cnt_zj)) },
      { name: '处理工单', data: raw.map(d => Number(d.cnt_cl)) },
    ],
  }
}

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

  const { data: stats, pending: statsPending } = apiFetch('srvaud_workorder_cnt_cmlm_select', mockStats, adaptStats)
  const { data: barChart, pending: barChartPending } = apiFetch('srvaud_workorder_amount_organ_select', mockBarChart, adaptBarChart)
  const { data: lineChart, pending: lineChartPending } = apiFetch('srvaud_workorder_amount_ym_select', mockLineChart, adaptLineChart)
  const { data: pieChart, pending: pieChartPending } = apiFetch('srvaud_workorder_cnt_tq_select', mockPieChart, adaptPieChart)
  const { data: ringChart, pending: ringChartPending } = apiFetch('srvaud_workorder_cnt_cm_cl_select', mockRingChart, adaptRingChart)
  const { data: trendLineChart, pending: trendLineChartPending } = apiFetch('srvaud_workorder_amount_lm_zjd_select', mockTrendLineChart, adaptTrendLineChart)
  const { data: groupBarChart, pending: groupBarChartPending } = apiFetch('srvaud_workorder_cnt_ym_select', mockGroupBarChart, adaptGroupBarChart)

  const isLoadingRaw = computed(() =>
    statsPending.value
    || barChartPending.value
    || lineChartPending.value
    || pieChartPending.value
    || ringChartPending.value
    || trendLineChartPending.value
    || groupBarChartPending.value,
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
    barChart,
    lineChart,
    pieChart,
    ringChart,
    trendLineChart,
    groupBarChart,
    isLoading: delayedIsLoading,
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
