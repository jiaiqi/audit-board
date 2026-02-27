/**
 * 在途看板本地兜底数据
 * 格式与真实接口返回完全一致（含 state/data 字段，data 使用真实原始字段名）
 * 会经过 useInTransitData 中的 adaptData 函数转换后再使用
 */

/** srvaud_laneexitdata_cnt_lm_cm_select — 统计卡片（data 为单条对象） */
export const mockStats = {
  state: 'SUCCESS',
  data: {
    diff_fee_lm_ts: 75675.13, // 上月推送成果金额
    diff_fee_cm: 60934.94, // 本月在途成果金额
    ztjh_cnt_lm_ts: 1035, // 上月推送成果数量
    ztjh_cnt_lm: 28108, // 上月在途成果数量
    diff_fee_lm: 100035.47, // 上月在途成果金额
    ztjh_cnt_cm: 17709, // 本月在途成果数量
  },
}

/** srvaud_laneexitdata_dev_status_select — 在途设备心跳 */
export const mockDevices = {
  state: 'SUCCESS',
  data: [
    {
      update_time: '2026-02-26 18:20:21',
      physical_total_memory: '15.6G',
      system_cpu_load: '2.57%',
      physical_memory_used_rate: '17.62%',
      ip_address: '10.61.72.234',
      iowait_cpu_load: '0.07%',
      disk1_usable_space: '899.6G',
    },
    {
      update_time: '2026-02-26 18:20:21',
      physical_total_memory: '3.8G',
      system_cpu_load: '13.95%',
      physical_memory_used_rate: '63.51%',
      ip_address: '10.97.60.207',
      iowait_cpu_load: '1.8%',
      disk1_usable_space: '0.4G',
    },
    {
      update_time: '2026-02-26 18:20:20',
      physical_total_memory: '31.3G',
      system_cpu_load: '0.75%',
      physical_memory_used_rate: '17.49%',
      ip_address: '10.61.4.210',
      iowait_cpu_load: '1.74%',
      disk1_usable_space: '75.7G',
    },
    {
      update_time: '2026-02-26 18:20:20',
      physical_total_memory: '7.6G',
      system_cpu_load: '7.12%',
      physical_memory_used_rate: '49.3%',
      ip_address: '10.96.244.207',
      iowait_cpu_load: '0%',
      disk1_usable_space: '87.9G',
    },
    {
      update_time: '2026-02-26 18:20:20',
      physical_total_memory: '7.6G',
      system_cpu_load: '4.31%',
      physical_memory_used_rate: '68.32%',
      ip_address: '10.96.245.225',
      iowait_cpu_load: '0.06%',
      disk1_usable_space: '83.8G',
    },
    {
      update_time: '2026-02-26 18:20:20',
      physical_total_memory: '7.7G',
      system_cpu_load: '3.8%',
      physical_memory_used_rate: '23.43%',
      ip_address: '11.96.247.177',
      iowait_cpu_load: '8.44%',
      disk1_usable_space: '25G',
    },
    {
      update_time: '2026-02-26 18:20:20',
      physical_total_memory: '7.6G',
      system_cpu_load: '12.6%',
      physical_memory_used_rate: '23.06%',
      ip_address: '11.96.248.176',
      iowait_cpu_load: '2.37%',
      disk1_usable_space: '379.9G',
    },
    {
      update_time: '2026-02-26 18:20:20',
      physical_total_memory: '7.6G',
      system_cpu_load: '9.72%',
      physical_memory_used_rate: '22.78%',
      ip_address: '11.96.248.240',
      iowait_cpu_load: '1.5%',
      disk1_usable_space: '385.5G',
    },
    {
      update_time: '2026-02-26 18:20:19',
      physical_total_memory: '15.6G',
      system_cpu_load: '0.09%',
      physical_memory_used_rate: '14.61%',
      ip_address: '10.61.45.106',
      iowait_cpu_load: '0.27%',
      disk1_usable_space: '897.7G',
    },
    {
      update_time: '2026-02-26 18:20:19',
      physical_total_memory: '7.6G',
      system_cpu_load: '5.28%',
      physical_memory_used_rate: '43.54%',
      ip_address: '10.96.248.33',
      iowait_cpu_load: '0.04%',
      disk1_usable_space: '89.7G',
    },
  ],
}

/** srvaud_laneexitdata_amount_m_ratio_select — 分公司本月成果金额占比 */
export const mockLeftPieChart = {
  data: [
    { dept_name: '西安绕城分公司', diff_fee_disp: 58371.92, dept_ratio_str: 64.78 },
    { dept_name: '西渭分公司', diff_fee_disp: 22067.82, dept_ratio_str: 24.49 },
    { dept_name: '西宝分公司', diff_fee_disp: 9662.94, dept_ratio_str: 10.72 },
  ],
  page: { total: 3, pageNo: 1, rownumber: 3 },
  state: 'SUCCESS',
}

/** srvaud_laneexitdata_amount_station_top10_select — 本月成果金额排名TOP10 */
export const mockAmountRankChart = {
  data: [
    { diff_fee_disp: 9644.42, dept_name: '陕西汉城收费站', id: '陕西汉城收费站' },
    { diff_fee_disp: 7866.07, dept_name: '陕西未央北收费站', id: '陕西未央北收费站' },
    { diff_fee_disp: 6986.91, dept_name: '陕西灞桥收费站', id: '陕西灞桥收费站' },
    { diff_fee_disp: 6655.5, dept_name: '陕西曲江收费站', id: '陕西曲江收费站' },
    { diff_fee_disp: 5897.1, dept_name: '陕西渭南西收费站', id: '陕西渭南西收费站' },
    { diff_fee_disp: 5657.31, dept_name: '陕西长安路收费站', id: '陕西长安路收费站' },
    { diff_fee_disp: 5211.79, dept_name: '陕西新筑收费站', id: '陕西新筑收费站' },
    { diff_fee_disp: 4542.71, dept_name: '陕西杏园收费站', id: '陕西杏园收费站' },
    { diff_fee_disp: 3463.1, dept_name: '陕西阿房宫收费站', id: '陕西阿房宫收费站' },
    { diff_fee_disp: 3104.45, dept_name: '陕西田王收费站', id: '陕西田王收费站' },
  ],
  page: { total: 10, pageNo: 1, rownumber: 10 },
  state: 'SUCCESS',
}

/** srvaud_laneexitdata_cnt_station_top10_select — 本月成果数量排名TOP10 */
export const mockQuantityRankChart = {
  data: [
    { ztjh_cnt: 2609, dept_name: '陕西渭南西收费站', id: '陕西渭南西收费站' },
    { ztjh_cnt: 2245, dept_name: '陕西灞桥收费站', id: '陕西灞桥收费站' },
    { ztjh_cnt: 1307, dept_name: '陕西长安路收费站', id: '陕西长安路收费站' },
    { ztjh_cnt: 1288, dept_name: '陕西曲江收费站', id: '陕西曲江收费站' },
    { ztjh_cnt: 874, dept_name: '陕西新筑收费站', id: '陕西新筑收费站' },
    { ztjh_cnt: 809, dept_name: '陕西杏园收费站', id: '陕西杏园收费站' },
    { ztjh_cnt: 660, dept_name: '陕西秦东收费站', id: '陕西秦东收费站' },
    { ztjh_cnt: 580, dept_name: '陕西汉城收费站', id: '陕西汉城收费站' },
    { ztjh_cnt: 512, dept_name: '陕西临潼收费站', id: '陕西临潼收费站' },
    { ztjh_cnt: 490, dept_name: '陕西罗敷收费站', id: '陕西罗敷收费站' },
  ],
  page: { total: 10, pageNo: 1, rownumber: 10 },
  state: 'SUCCESS',
}

/** srvaud_laneexitdata_cnt_m_ratio_select — 分公司本月成果数量占比 */
export const mockCenterPieChart = {
  data: [
    {
      dept_name: '西安绕城分公司',
      id: '西安绕城分公司',
      ztjh_cnt: 8718,
      dept_ratio_str: 47.66,
    },
    {
      dept_name: '西渭分公司',
      id: '西渭分公司',
      ztjh_cnt: 8163,
      dept_ratio_str: 44.62,
    },
    {
      dept_name: '西宝分公司',
      id: '西宝分公司',
      ztjh_cnt: 1412,
      dept_ratio_str: 7.72,
    },
  ],
  page: {
    total: 3,
    pageNo: 1,
    rownumber: 3,
  },
  state: 'SUCCESS',
}

/** srvaud_laneexitdata_type_ratio_select — 成果金额占比（车道 vs 推送） */
export const mockCenterRingChart = {
  data: [
    { dept_ratio_str: 67.7, amount_type: '车道成果', amount: 61147.07, id: '车道成果' },
    { dept_ratio_str: 32.3, amount_type: '推送成果', amount: 29167.74, id: '推送成果' },
  ],
  page: { total: 2, pageNo: 1, rownumber: 10 },
  state: 'SUCCESS',
}

/** srvaud_laneexitdata_vehicle_ratio_select — 车型占比 */
export const mockVehiclePieChart = {
  data: [
    { dept_ratio_str: 91.87, exvehicletype_str: '一型客车', cnt: 16806, id: '1', exvehicletype: '1' },
    { dept_ratio_str: 5.42, exvehicletype_str: '一型货车', cnt: 992, id: '11', exvehicletype: '11' },
    { dept_ratio_str: 1.09, exvehicletype_str: '六型货车', cnt: 200, id: '16', exvehicletype: '16' },
    { dept_ratio_str: 0.78, exvehicletype_str: '二型货车', cnt: 142, id: '12', exvehicletype: '12' },
    { dept_ratio_str: 0.25, exvehicletype_str: '四型货车', cnt: 45, id: '14', exvehicletype: '14' },
    { dept_ratio_str: 0.14, exvehicletype_str: '三型货车', cnt: 26, id: '13', exvehicletype: '13' },
    { dept_ratio_str: 0.14, exvehicletype_str: '三型客车', cnt: 25, id: '3', exvehicletype: '3' },
    { dept_ratio_str: 0.13, exvehicletype_str: '五型货车', cnt: 23, id: '15', exvehicletype: '15' },
    { dept_ratio_str: 0.08, exvehicletype_str: '二型客车', cnt: 14, id: '2', exvehicletype: '2' },
    { dept_ratio_str: 0.08, exvehicletype_str: '四型客车', cnt: 14, id: '4', exvehicletype: '4' },
  ],
  page: { total: 11, pageNo: 1, rownumber: 10 },
  state: 'SUCCESS',
}

/** srvaud_laneexitdata_cnt_date_select — 在途成果数量本月趋势 */
export const mockTrendLineChart = {
  data: [
    { ztjh_cnt: 1387, cnt_date: 1 },
    { ztjh_cnt: 1184, cnt_date: 2 },
    { ztjh_cnt: 1151, cnt_date: 3 },
    { ztjh_cnt: 1104, cnt_date: 4 },
    { ztjh_cnt: 1301, cnt_date: 5 },
    { ztjh_cnt: 1512, cnt_date: 6 },
    { ztjh_cnt: 1176, cnt_date: 7 },
    { ztjh_cnt: 974, cnt_date: 8 },
    { ztjh_cnt: 906, cnt_date: 9 },
    { ztjh_cnt: 856, cnt_date: 10 },
  ],
  page: { total: 26, pageNo: 1, rownumber: 10 },
  state: 'SUCCESS',
}
/** srvaud_laneexitdata_amount_date_select — 在途成果金额本月变化 */
export const mockAmountBarChart = {
  data: [
    { diff_fee: 8972.51, cnt_date: 1 },
    { diff_fee: 6579.42, cnt_date: 2 },
    { diff_fee: 6877.3, cnt_date: 3 },
    { diff_fee: 8153.52, cnt_date: 4 },
    { diff_fee: 9041.06, cnt_date: 5 },
    { diff_fee: 8948.49, cnt_date: 6 },
    { diff_fee: 4587.08, cnt_date: 7 },
    { diff_fee: 3030.83, cnt_date: 8 },
    { diff_fee: 5472.9, cnt_date: 9 },
    { diff_fee: 3879.29, cnt_date: 10 },
  ],
  page: { total: 26, pageNo: 1, rownumber: 10 },
  state: 'SUCCESS',
}
