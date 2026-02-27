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
      _r_n: 1
    }
  ]
}

/** srvaud_workorder_amount_organ_select — 分公司追缴金额排名TOP10 */
export const mockBarChart = {
  state: 'SUCCESS',
  data: [
    { org_name: '枝城分公司', cnt_fee: 45459.7 },
    { org_name: '宜都分公司', cnt_fee: 33144.16 },
    { org_name: '秭归分公司', cnt_fee: 25545.42 },
    { org_name: '兴山分公司', cnt_fee: 18600.5 },
    { org_name: '五峰分公司', cnt_fee: 15420.3 }
  ],
}

/** srvaud_workorder_amount_ym_select — 追缴金额历史趋势 */
export const mockLineChart = {
  state: 'SUCCESS',
  data: [
    { year_month: '202302', total_payback: 288183.73 },
    { year_month: '202303', total_payback: 331714.19 },
    { year_month: '202304', total_payback: 264449.22 },
    { year_month: '202305', total_payback: 435113.65 },
    { year_month: '202306', total_payback: 463850.57 },
    { year_month: '202307', total_payback: 473020.5 }
  ],
}

/** srvaud_workorder_cnt_tq_select — 特情车辆类型数量(近30日) */
export const mockPieChart = {
  state: 'SUCCESS',
  data: [
    { type_cnt: 31074, total_cnt: 32335, s_type: '无介质', type_ratio: 0.96 },
    { type_cnt: 1461, total_cnt: 32335, s_type: '异性卡', type_ratio: 0.04 }
  ],
}

/** srvaud_workorder_cnt_cm_cl_select — 本月特情工单及处理率 */
export const mockRingChart = {
  state: 'SUCCESS',
  data: [
    {
      issue_total: 3089,
      issue_pro_str: '20.19%'
    }
  ],
}

/** srvaud_workorder_amount_lm_zjd_select — 上月追缴金额日变化趋势 */
export const mockTrendLineChart = {
  state: 'SUCCESS',
  data: [
    { total_payback: 17793.88, day_of_month: '01' },
    { total_payback: 9454.12, day_of_month: '02' },
    { total_payback: 10486.11, day_of_month: '03' },
    { total_payback: 18226.23, day_of_month: '04' },
    { total_payback: 10506.55, day_of_month: '05' },
    { total_payback: 13123.62, day_of_month: '06' }
  ],
}

/** srvaud_workorder_cnt_ym_select — 工单量按月统计 */
export const mockGroupBarChart = {
  state: 'SUCCESS',
  data: [
    { year_month: '202302', cnt_zj: 7122, cnt_fq: 15473, cnt_cl: 14842 },
    { year_month: '202303', cnt_zj: 8883, cnt_fq: 17239, cnt_cl: 15877 },
    { year_month: '202304', cnt_zj: 8071, cnt_fq: 21533, cnt_cl: 20607 },
    { year_month: '202305', cnt_zj: 8957, cnt_fq: 21355, cnt_cl: 20249 },
    { year_month: '202306', cnt_zj: 8057, cnt_fq: 20981, cnt_cl: 19787 }
  ],
}
