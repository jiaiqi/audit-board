/**
 * 工单看板本地兜底数据
 * 格式与真实接口返回完全一致（含 state/data 字段）
 * 若真实接口需要 adaptData，data 应使用真实原始字段名；
 * 若接口字段与前端格式一致，data 直接使用前端格式即可
 */

/** srvaud_board_stats_select — 统计卡片（data 为数组） */
export const mockStats = {
  state: 'SUCCESS',
  data: [
    { key: 'monthInitiated', label: '本月发起工单', value: 124, unit: '' },
    { key: 'monthRecovery', label: '本月追缴工单', value: 623, unit: '' },
    { key: 'monthAmount', label: '本月追缴金额', value: 40.17, unit: '万' },
    { key: 'lastMonthAmount', label: '上月追缴金额', value: 62.23, unit: '万' },
  ],
}

/** srvaud_board_company_recovery_rank_select — 分公司追缴金额排名TOP10 */
export const mockBarChart = {
  state: 'SUCCESS',
  data: {
    categories: ['公司简称一', '公司简称二', '公司简称三', '公司简称四', '公司简称五', '公司简称六', '公司简称七', '公司简称八', '公司简称九', '公司简称十'],
    series: [{ name: '追缴金额', data: [1860, 1620, 1480, 1350, 1200, 1080, 950, 820, 680, 520] }],
  },
}

/** srvaud_board_recovery_amount_trend_select — 追缴金额历史趋势 */
export const mockLineChart = {
  state: 'SUCCESS',
  data: {
    categories: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    series: [{ name: '追缴金额', data: [120, 200, 180, 160, 80, 60, 90, 100, 120, 130, 140, 150] }],
  },
}

/** srvaud_board_special_vehicle_stats_select — 特情车辆类型数量统计 */
export const mockPieChart = {
  state: 'SUCCESS',
  data: {
    data: [
      { value: 40, name: '逃费车辆' },
      { value: 32, name: '军警车辆' },
      { value: 18, name: '绕行车辆' },
      { value: 23, name: '其他特情' },
    ],
  },
}

/** srvaud_board_workorder_indicator_select — 工单处理指标 */
export const mockRingChart = {
  state: 'SUCCESS',
  data: {
    value: 20,
    total: 100,
    label: '处理率',
    center: { label: '本月处理工单', value: 6236 },
  },
}

/** srvaud_board_daily_recovery_trend_select — 上月追缴金额日变化趋势 */
export const mockTrendLineChart = {
  state: 'SUCCESS',
  data: {
    categories: ['12-01', '12-02', '12-03', '12-04', '12-05', '12-06', '12-07', '12-08', '12-09', '12-10', '12-11', '12-12'],
    series: [
      { name: '系列1', data: [180, 200, 150, 220, 160, 190, 210, 170, 200, 230, 180, 160] },
      { name: '系列2', data: [120, 150, 130, 170, 140, 160, 150, 130, 160, 180, 140, 120] },
      { name: '系列3', data: [80, 100, 90, 120, 100, 110, 130, 90, 110, 140, 100, 80] },
    ],
  },
}

/** srvaud_board_monthly_workorder_stats_select — 工单量按月统计 */
export const mockGroupBarChart = {
  state: 'SUCCESS',
  data: {
    categories: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    series: [
      { name: '发起工单', data: [120, 180, 150, 200, 160, 140, 170, 190, 210, 180, 160, 200] },
      { name: '处理工单', data: [100, 150, 130, 170, 140, 120, 150, 160, 180, 150, 140, 170] },
      { name: '追缴工单', data: [80, 120, 110, 140, 120, 100, 130, 140, 150, 130, 120, 150] },
    ],
  },
}
