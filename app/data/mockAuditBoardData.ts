import type {
  AuditBoardStat,
  BarChartData,
  GroupBarChartData,
  LineChartData,
  PieChartData,
  RingChartData,
  TrendLineChartData,
} from '~/composables/useAuditBoardData'

/**
 * 工单看板本地兜底数据（纯业务格式，无 ApiResponse 包装）
 * 接口不通时直接作为降级数据使用
 */

export const mockStats: AuditBoardStat[] = [
  { key: 'monthInitiated', label: '本月发起工单', value: 124, unit: '' },
  { key: 'monthRecovery', label: '本月追缴工单', value: 623, unit: '' },
  { key: 'monthAmount', label: '本月追缴金额', value: 40.17, unit: '万' },
  { key: 'lastMonthAmount', label: '上月追缴金额', value: 62.23, unit: '万' },
]

export const mockBarChart: BarChartData = {
  categories: ['公司简称一', '公司简称二', '公司简称三', '公司简称四', '公司简称五', '公司简称六', '公司简称七', '公司简称八', '公司简称九', '公司简称十'],
  series: [{ name: '追缴金额', data: [1860, 1620, 1480, 1350, 1200, 1080, 950, 820, 680, 520] }],
}

export const mockLineChart: LineChartData = {
  categories: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  series: [{ name: '追缴金额', data: [120, 200, 180, 160, 80, 60, 90, 100, 120, 130, 140, 150] }],
}

export const mockPieChart: PieChartData = {
  data: [{ value: 40, name: '类型一' }, { value: 32, name: '类型二' }, { value: 18, name: '类型三' }, { value: 23, name: '类型四' }],
}

export const mockRingChart: RingChartData = {
  value: 20,
  total: 100,
  label: '处理率',
  center: { label: '本月处理工单', value: 6236 },
}

export const mockTrendLineChart: TrendLineChartData = {
  categories: ['12-01', '12-02', '12-03', '12-04', '12-05', '12-06', '12-07', '12-08', '12-09', '12-10', '12-11', '12-12'],
  series: [
    { name: '系列1', data: [180, 200, 150, 220, 160, 190, 210, 170, 200, 230, 180, 160] },
    { name: '系列2', data: [120, 150, 130, 170, 140, 160, 150, 130, 160, 180, 140, 120] },
    { name: '系列3', data: [80, 100, 90, 120, 100, 110, 130, 90, 110, 140, 100, 80] },
  ],
}

export const mockGroupBarChart: GroupBarChartData = {
  categories: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  series: [
    { name: '发起工单', data: [120, 180, 150, 200, 160, 140, 170, 190, 210, 180, 160, 200] },
    { name: '处理工单', data: [100, 150, 130, 170, 140, 120, 150, 160, 180, 150, 140, 170] },
    { name: '追缴工单', data: [80, 120, 110, 140, 120, 100, 130, 140, 150, 130, 120, 150] },
  ],
}
