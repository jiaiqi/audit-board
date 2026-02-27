/**
 * 工单看板本地兜底数据
 * 格式与真实接口返回完全一致（含 state/data 字段）
 * 若真实接口需要 adaptData，data 应使用真实原始字段名；
 * 若接口字段与前端格式一致，data 直接使用前端格式即可
 */

/** srvaud_workorder_cnt_cmlm_select — 统计卡片 */
export const mockStats = {
  state: 'SUCCESS',
  data: [
    {
      cnt_cm_zj: 261,
      amount_lm_zj: 428257.82,
      cnt_cm_fq: 15202,
      amount_cm_zj: 216377.05,
      _r_n: 1,
    },
  ],
}

/** srvaud_workorder_amount_organ_select — 分公司追缴金额排名TOP10 */
export const mockBarChart = { data: [
  { org_name: '绕城分公司', cnt_fee: 45459.7 },
  { org_name: '西宝分公司', cnt_fee: 26744.16 },
  { org_name: '靖富分公司', cnt_fee: 25545.45 },
  { org_name: '西渭分公司', cnt_fee: 20862.36 },
  { org_name: '西富分公司', cnt_fee: 17663.94 },
  { org_name: '宝天分公司', cnt_fee: 15621.1 },
  { org_name: '绥定分公司', cnt_fee: 13339.74 },
  { org_name: '宝川分公司', cnt_fee: 9834.57 },
  { org_name: '西禹分公司', cnt_fee: 7526.44 },
  { org_name: '外环分公司', cnt_fee: 7326.4 },
], page: { total: 10, pageNo: 1, rownumber: 10 }, state: 'SUCCESS' }

/** srvaud_workorder_amount_ym_select — 追缴金额历史趋势 */
export const mockLineChart = {
  data: [
    { year_month: '202502', cnt_zj: 7122, cnt_fq: 15479, cnt_cl: 14842 },
    { year_month: '202503', cnt_zj: 6888, cnt_fq: 17230, cnt_cl: 15877 },
    { year_month: '202504', cnt_zj: 8971, cnt_fq: 21533, cnt_cl: 20607 },
    { year_month: '202505', cnt_zj: 8897, cnt_fq: 21385, cnt_cl: 20249 },
    { year_month: '202506', cnt_zj: 8057, cnt_fq: 20981, cnt_cl: 19767 },
    { year_month: '202507', cnt_zj: 6993, cnt_fq: 21219, cnt_cl: 19762 },
    { year_month: '202508', cnt_zj: 5771, cnt_fq: 20447, cnt_cl: 18202 },
    { year_month: '202509', cnt_zj: 3509, cnt_fq: 23934, cnt_cl: 16294 },
    { year_month: '202510', cnt_zj: 325, cnt_fq: 24269, cnt_cl: 5038 },
    { year_month: '202511', cnt_zj: 427, cnt_fq: 22930, cnt_cl: 6461 },
  ],
  page: { total: 12, pageNo: 1, rownumber: 10 },
  state: 'SUCCESS',
}

/** srvaud_workorder_cnt_tq_select — 特情车辆类型数量(近30日) */
export const mockPieChart = {
  data: [
    {
      type_cnt: 31074,
      total_cnt: 32535,
      s_type: '无介质',
      type_ratio: 0.96,
      type_ratio_disp: 95.51,
    },
    {
      type_cnt: 1461,
      total_cnt: 32535,
      s_type: '升降档',
      type_ratio: 0.044,
      type_ratio_disp: 4.49,
    },
  ],
  page: {
    total: 2,
    pageNo: 1,
    rownumber: 10,
  },
  state: 'SUCCESS',
}

/** srvaud_workorder_cnt_cm_cl_select — 本月特情工单及处理率 */
export const mockRingChart = {
  data: [
    {
      issue_total: 3089,
      issue_pro_str: '20.19%',
    },
  ],
  page: {
    total: 1,
    pageNo: 1,
    rownumber: 10,
  },
  state: 'SUCCESS',
}

/** srvaud_workorder_amount_lm_zjd_select — 上月追缴金额日变化趋势 */
export const mockTrendLineChart = {
  data: [
    { total_payback: 17793.88, day_of_month: '01' },
    { total_payback: 9454.12, day_of_month: '02' },
    { total_payback: 8162.08, day_of_month: '03' },
    { total_payback: 9094.42, day_of_month: '04' },
    { total_payback: 10486.11, day_of_month: '05' },
    { total_payback: 14777.42, day_of_month: '06' },
    { total_payback: 18226.23, day_of_month: '07' },
    { total_payback: 10506.55, day_of_month: '08' },
    { total_payback: 17858.43, day_of_month: '09' },
    { total_payback: 13123.32, day_of_month: '10' },
  ],
  page: { total: 31, pageNo: 1, rownumber: 10 },
  state: 'SUCCESS',
}

/** srvaud_workorder_cnt_ym_select — 工单量按月统计 */
export const mockGroupBarChart = {
  data: [
    { year_month: '202502', cnt_zj: 7122, cnt_fq: 15479 },
    { year_month: '202503', cnt_zj: 6888, cnt_fq: 17230 },
    { year_month: '202504', cnt_zj: 8971, cnt_fq: 21533 },
    { year_month: '202505', cnt_zj: 8897, cnt_fq: 21385 },
    { year_month: '202506', cnt_zj: 8057, cnt_fq: 20981 },
    { year_month: '202507', cnt_zj: 6993, cnt_fq: 21219 },
    { year_month: '202508', cnt_zj: 5771, cnt_fq: 20447 },
    { year_month: '202509', cnt_zj: 3509, cnt_fq: 23934 },
    { year_month: '202510', cnt_zj: 325, cnt_fq: 24269 },
    { year_month: '202511', cnt_zj: 427, cnt_fq: 22930 },
  ],
  page: { total: 12, pageNo: 1, rownumber: 10 },
  state: 'SUCCESS',
}
