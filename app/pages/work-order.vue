<script setup lang="ts">
/**
 * work-order.vue — 交控稽核工单大数据看板
 *
 * 页面展示内容：
 *   - 顶部：实时时钟 + 看板标题 + 全屏切换
 *   - 统计卡片（4张）：从接口动态渲染，数字随接口数据变化
 *   - 图表区（6个 ECharts 图表）：
 *       barChart       分公司追缴金额排名 TOP10（柱状图）
 *       lineChart      追缴金额历史趋势（折线图）
 *       pieChart       特情车辆类型数量（玫瑰饼图）
 *       ringChart      指标环形进度（饼图模拟）
 *       trendLineChart 上月追缴金额日变化趋势（多系列折线图）
 *       groupBarChart  工单量按月统计（分组柱状图）
 */
import type { EChartsOption } from 'echarts'
// 从 useAuditBoardData composable 导入各图表专用数据类型，确保 TS 类型安全
import type { BarChartData, GroupBarChartData, LineChartData, PieChartData, RingChartData, TrendLineChartData } from '~/composables/useAuditBoardData'

import * as echarts from 'echarts'

// 指定此页面使用 audit 布局（全屏深色背景）
definePageMeta({
  layout: 'audit',
})

// ── 实时时钟 ──────────────────────────────────────
// 无日期/星期需求，传入 showDate: false
const { currentTime, currentDate } = useBoardClock({ showDate: true, showWeek: false })

// ── 全屏切换 ──────────────────────────────────────
// isFullscreen: 当前是否全屏，toggleFullscreen: 切换函数
const { isFullscreen, toggle: toggleFullscreen } = useFullscreen()

// ── 屏幕自适应缩放 ────────────────────────────────
// 以 1920×1080 为基准分辨率进行等比缩放
const { screenRef } = useScreenScale({ width: 1920, height: 1080 })

// ── 接口数据（每个图表独立接口）─────────────────────
// useAuditBoardData 封装了所有图表的 useFetch 请求，
// 各字段均为 ComputedRef，数据就绪后自动驱动对应 watch 更新图表
const { stats, barChart, lineChart, pieChart, ringChart, trendLineChart, groupBarChart } = useAuditBoardData()

// ── ECharts 公共配置 ──────────────────────────────
// 所有图表共享：透明背景 + 微软雅黑字体，通过展开运算符合并到各图表 option
const commonOption: EChartsOption = {
  backgroundColor: 'transparent',
  textStyle: { fontFamily: 'Microsoft YaHei, sans-serif' },
}

// ── ECharts 实例声明 ──────────────────────────────
// ── ECharts 容器 DOM 引用 ─────────────────────────
const barChartRef = ref<HTMLElement>()
const lineChartRef = ref<HTMLElement>()
const pieChartRef = ref<HTMLElement>()
const ringChartRef = ref<HTMLElement>()
const trendLineChartRef = ref<HTMLElement>()
const groupBarChartRef = ref<HTMLElement>()

// ── 图表 Option 构建函数 ───────────────────────────
// 每个 build 函数只负责「样式 + 结构」，数据通过参数 c 传入，
// 参数为 null 时用空数组/0 兜底，避免图表初始化阶段报错。

/**
 * 构建分公司追缴金额排名柱状图 option
 * @param c 接口数据（categories: 公司名列表，series[0].data: 金额列表）
 * 颜色策略：蓝色/橙色渐变交替，增加视觉区分度
 */
function buildBarOption(c: BarChartData | null): EChartsOption {
  return {
    ...commonOption,
    tooltip: { trigger: 'axis', backgroundColor: 'rgba(11,17,26,0.9)', borderColor: '#00f0ff', textStyle: { color: '#fff' } },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: c?.categories ?? [],
      axisLine: { lineStyle: { color: 'rgba(0,240,255,0.3)' } },
      axisLabel: { color: '#fff', fontSize: 10, interval: 0, rotate: 30 }, // 旋转 30° 防止标签重叠
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisLabel: { color: '#fff', formatter: (v: number) => `${v}万元` }, // 数值带单位
      splitLine: { lineStyle: { color: 'rgba(0,240,255,0.1)' } },
    },
    series: [{
      name: '追缴金额',
      type: 'bar',
      data: c?.series[0]?.data ?? [],
      barWidth: '50%',
      itemStyle: {
        borderRadius: [4, 4, 0, 0], // 顶部圆角
        color: (params: { dataIndex: number }) => {
          // 蓝/橙交替线性渐变，使相邻柱子更易区分
          const colors = [
            new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#00f0ff' }, { offset: 1, color: 'rgba(0,240,255,0.3)' }]),
            new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#ff9f00' }, { offset: 1, color: 'rgba(255,159,0,0.3)' }]),
          ]
          return colors[params.dataIndex % 2] as echarts.graphic.LinearGradient
        },
      },
      emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,240,255,0.5)' } }, // hover 时发光效果
    }],
  }
}
/**
 * 构建追缴金额历史趋势折线图 option
 * @param c 接口数据（categories: 月份列表，series[0].data: 金额列表）
 * 使用渐变面积填充增强趋势感
 */
function buildLineOption(c: LineChartData | null): EChartsOption {
  return {
    ...commonOption,
    legend: { data: ['追缴金额'], textStyle: { color: '#fff' }, top: '5%', right: 'center', icon: 'circle', itemWidth: 8, itemHeight: 8 },
    tooltip: { trigger: 'axis', backgroundColor: 'rgba(11,17,26,0.9)', borderColor: '#ff9f00', textStyle: { color: '#fff' } },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '20%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false, // 折线从坐标轴起点开始，不留空白
      data: c?.categories ?? [],
      axisLine: { lineStyle: { color: 'rgba(255,159,0,0.3)' } },
      axisLabel: { color: '#fff' },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      name: '金额(万元)',
      nameTextStyle: { color: '#fff' },
      axisLine: { show: false },
      axisLabel: { color: '#fff' },
      splitLine: { lineStyle: { color: 'rgba(255,159,0,0.1)' } },
    },
    series: [{
      name: '追缴金额',
      type: 'line',
      smooth: true, // 平滑曲线，视觉更柔和
      data: c?.series[0]?.data ?? [],
      lineStyle: { color: '#ff9f00', width: 3 },
      // 从线条颜色向透明的垂直渐变面积填充
      areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(255,159,0,0.5)' }, { offset: 1, color: 'rgba(255,159,0,0.05)' }]) },
      itemStyle: { color: '#ff9f00' },
      symbol: 'circle',
      symbolSize: 8,
    }],
  }
}
/**
 * 构建特情车辆类型数量玫瑰饼图 option
 * @param c 接口数据（data: [{value, name}] 格式的数组）
 * roseType:'area' 使面积而非半径代表大小，视觉更均衡
 */
function buildPieOption(c: PieChartData | null): EChartsOption {
  const pieColors = ['#ff9f00', '#00e676', '#2979ff', '#00f0ff'] // 预设调色盘，循环取用
  return {
    ...commonOption,
    tooltip: { trigger: 'item', backgroundColor: 'rgba(11,17,26,0.9)', borderColor: '#00f0ff', textStyle: { color: '#fff' }, formatter: '{b}: {c} ({d}%)' },
    legend: { show: false }, // 依靠外部标签显示名称，图例隐藏节省空间
    series: [{
      name: '特殊车型',
      roseType: 'area', // 南丁格尔玫瑰图，面积正比于数值
      type: 'pie',
      radius: ['20%', '70%'], // 内半径留空形成空心效果
      center: ['50%', '50%'],
      avoidLabelOverlap: true, // 自动规避标签重叠
      itemStyle: { borderRadius: 2, borderWidth: 2 },
      label: { show: true, position: 'outside', color: '#fff', formatter: '{b}: {c}' },
      labelLine: { lineStyle: { color: 'rgba(0,240,255,0.3)' } },
      emphasis: { label: { fontSize: 14, fontWeight: 'bold' } },
      // map 为每个数据项动态分配调色盘颜色
      data: (c?.data ?? []).map((d, i) => ({ ...d, itemStyle: { color: pieColors[i % pieColors.length] } })),
    }],
  }
}
/**
 * 构建工单处理指标环形进度图 option
 * @param c 接口数据（value: 已处理数，total: 总数）
 * 使用双扇形 pie 模拟环形进度：已处理（青色渐变）+ 未处理（低透明度填充）
 */
function buildRingOption(c: RingChartData | null): EChartsOption {
  const val = c?.value ?? 0 // 已处理工单数（进度值）
  const total = c?.total ?? 100 // 工单总数（兜底 100，避免除零）
  return {
    series: [{
      type: 'pie',
      radius: ['70%', '85%'], // 较小内外半径差形成细环效果
      center: ['50%', '50%'],
      silent: true, // 禁用交互，纯展示用途
      label: { show: false }, // 标签由外层 DOM 覆盖显示，此处隐藏
      data: [
        // 已完成部分：青色水平渐变
        { value: val, itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: '#00f0ff' }, { offset: 1, color: '#48F7F7' }]) } },
        // 未完成部分：低透明度填充
        { value: total - val, itemStyle: { color: 'rgba(0,240,255,0.1)' } },
      ],
    }],
  }
}
/**
 * 构建上月追缴金额日变化趋势多系列折线图 option
 * @param c 接口数据（categories: 日期列表，series: 多条折线）
 * 支持多系列，颜色从预设数组循环取用
 */
function buildTrendLineOption(c: TrendLineChartData | null): EChartsOption {
  const colors = ['#00f0ff', '#ff9f00', '#00e676'] // 多系列颜色，依次分配
  return {
    ...commonOption,
    grid: { left: '10%', right: '5%', bottom: '15%', top: '15%' },
    xAxis: {
      type: 'category',
      data: c?.categories ?? [],
      axisLine: { lineStyle: { color: 'rgba(0,240,255,0.3)' } },
      axisLabel: { color: '#fff', fontSize: 9 },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisLabel: { color: '#fff', fontSize: 9 },
      splitLine: { lineStyle: { color: 'rgba(0,240,255,0.1)' } },
    },
    // 利用 map 动态生成多条折线系列，颜色循环取用
    series: (c?.series ?? []).map((s, i) => ({
      type: 'line' as const,
      smooth: true,
      data: s.data,
      lineStyle: { color: colors[i % colors.length], width: 2 },
      itemStyle: { color: colors[i % colors.length] },
      symbol: 'circle',
      symbolSize: 4,
    })),
  }
}
/**
 * 构建工单量按月统计分组柱状图 option
 * @param c 接口数据（categories: 月份列表，series: 多分组系列）
 * axisPointer:'shadow' 使 tooltip 显示阴影背景，便于对比各分组数值
 */
function buildGroupBarOption(c: GroupBarChartData | null): EChartsOption {
  const colors = ['#2979ff', '#ff9f00', '#00e676'] // 各分组颜色，依次分配
  return {
    ...commonOption,
    tooltip: { trigger: 'axis', backgroundColor: 'rgba(11,17,26,0.9)', borderColor: '#00f0ff', textStyle: { color: '#fff' }, axisPointer: { type: 'shadow' } },
    legend: {
      data: (c?.series ?? []).map(s => s.name), // 从接口数据动态生成图例条目
      textStyle: { color: '#fff' },
      top: '5%',
      right: 'center',
      itemWidth: 12,
      itemHeight: 12,
    },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '20%', containLabel: true },
    xAxis: {
      type: 'category',
      data: c?.categories ?? [],
      axisLine: { lineStyle: { color: 'rgba(0,240,255,0.3)' } },
      axisLabel: { color: '#fff' },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      name: '工单数',
      nameTextStyle: { color: '#fff' },
      axisLine: { show: false },
      axisLabel: { color: '#fff' },
      splitLine: { lineStyle: { color: 'rgba(0,240,255,0.1)' } },
    },
    // 循环生成各分组柱状图系列
    series: (c?.series ?? []).map((s, i) => ({
      name: s.name,
      type: 'bar' as const,
      data: s.data,
      itemStyle: { color: colors[i % colors.length], borderRadius: [4, 4, 0, 0] },
    })),
  }
}

// ── 环形图配套文字（响应式 computed）─────────────────
// 这些值显示在 ringChart 图表 DOM 的正中心覆盖层，
// 使用 computed 确保接口数据更新时自动同步刷新

/** 处理率百分比文字，例如："20%" */
const ringPercent = computed(() => {
  const v = ringChart.value?.value ?? 0
  const t = ringChart.value?.total ?? 100
  return `${Math.round(v / t * 100)}%`
})

/** 环形图中心小标题，例如："处理率" */
const ringCenterLabel = computed(() => ringChart.value?.label ?? '处理率')
/** 环形图上方大数字，例如：6236（本月已处理工单数） */
const ringCenterValue = computed(() => ringChart.value?.center?.value ?? 0)
/** 环形图上方描述文字，例如："本月处理工单" */
const ringCenterTitle = computed(() => ringChart.value?.center?.label ?? '本月处理工单')

// ── ECharts 图表统一管理 ─────────────────────────────
// useEChartsManager 自动处理 init/watch/resize/dispose 生命周期
useEChartsManager([
  { domRef: barChartRef, dataRef: barChart, buildOption: buildBarOption },
  { domRef: lineChartRef, dataRef: lineChart, buildOption: buildLineOption },
  { domRef: pieChartRef, dataRef: pieChart, buildOption: buildPieOption },
  { domRef: ringChartRef, dataRef: ringChart, buildOption: buildRingOption },
  { domRef: trendLineChartRef, dataRef: trendLineChart, buildOption: buildTrendLineOption },
  { domRef: groupBarChartRef, dataRef: groupBarChart, buildOption: buildGroupBarOption },
])

// ── 页面标题 ───────────────────────────────────────
const title = ref('交控稽核工单大数据看板')
useHead({ title: title.value })
</script>

<template>
  <div
    class="page-enter-active bg-[#0b111a] bg-[url('/assets/images/bg01.jpg')] h-screen w-screen overflow-hidden bg-size-[100%_100%] bg-center"
  >
    <div
      ref="screenRef"
      class="text-white px-5 flex flex-col h-full w-full relative overflow-hidden"
      style="transform-origin: left top;"
    >
      <header class="mb-5 px-8 py-3 flex items-center justify-between relative">
        <!-- 左侧时间 -->
        <div class="text-lg font-mono min-w-[180px]">
          {{ currentDate }} {{ currentTime }}
        </div>
        <!-- 中间标题 -->
        <div class="text-center flex-1 relative">
          <h1
            class="text-2xl text-[#EBF9FF] tracking-[8px] font-bold inline-block relative"
            style="text-shadow:0px 2px 6px rgba(0,190,231,1);"
          >
            {{ title }}
          </h1>
        </div>
        <!-- 右侧按钮 -->
        <div class="flex gap-4 min-w-[180px] items-center justify-end">
          <button
            class="text-[#fff] cursor-pointer transition-colors hover:text-[#00f0ff]"
            @click="toggleFullscreen"
          >
            <!-- 进入全屏图标 -->
            <svg
              v-if="!isFullscreen"
              viewBox="0 0 24 24"
              class="h-5 w-5"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
            </svg>
            <!-- 退出全屏图标 -->
            <svg
              v-else
              viewBox="0 0 24 24"
              class="h-5 w-5"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
            </svg>
          </button>
        </div>
        <!-- 底部装饰边线 -->
        <div
          class="h-[1px] bottom-0 left-[5%] right-[5%] absolute"
          style="background: linear-gradient(90deg, transparent, rgba(0, 240, 255, 0.5), transparent);"
        />
      </header>

      <div class="pb-30px pt-10px flex flex-1 flex-col">
        <!-- 统计卡片：从接口数据动态渲染 -->
        <div class="mb-4 gap-5 grid grid-cols-4">
          <div
            v-for="(item, i) in stats"
            :key="item.key"
            class="top-block h-180px transition-all duration-300 relative overflow-hidden hover:shadow-[0_0_30px_rgba(0,240,255,0.2)] hover:translate-y-[-2px]"
          >
            <div class="px-10 py-5 flex h-full items-center justify-between">
              <div class="flex flex-col">
                <div class="top-block-title text-sm flex gap-2 items-center">
                  {{ item.label }}
                </div>
                <div class="text-[48px] text-#FFCD84 font-bold">
                  {{ item.value }}
                  <span v-if="item.unit" class="ml-1">{{ item.unit }}</span>
                </div>
              </div>
              <img
                :src="`/assets/icons/0${i + 1}.png`"
                alt=""
                class="top-block-icon"
              >
            </div>
          </div>
        </div>

        <div class="mb-4 flex-1 gap-5 grid grid-cols-2 min-h-318px">
          <div
            class="center-block border border-[rgba(0,240,255,0.3)] flex flex-col h-full relative"
          >
            <div class="center-block-title bg1">
              <div class="text-white font-bold mt--28px">
                分公司追缴金额(近30日TOP10)
              </div>
            </div>
            <div
              ref="barChartRef"
              class="flex-1 h-full w-full"
            />
          </div>

          <div
            class="center-block border border-[rgba(0,240,255,0.3)] flex flex-col relative"
          >
            <div class="center-block-title bg1">
              <div class="text-white font-bold mt--28px">
                追缴金额历史趋势
              </div>
            </div>
            <div
              ref="lineChartRef"
              class="flex-1 h-full w-full"
            />
          </div>
        </div>

        <div class="flex-1 gap-5 grid grid-cols-[1fr_1fr_1.2fr]">
          <div
            class="center-block border border-[rgba(0,240,255,0.3)] flex flex-col h-438px relative"
          >
            <div class="center-block-title bg2">
              <div class="text-white font-bold mt--28px">
                特情车辆类型数量(近30日)
              </div>
            </div>
            <div
              ref="pieChartRef"
              class="flex-1 h-full w-full"
            />
          </div>

          <div class="flex flex-col gap-16px">
            <div
              class="center-block border border-[rgba(0,240,255,0.3)] flex flex-col relative"
            >
              <div class="center-block-title bg3">
                <div class="text-white font-bold mt--28px">
                  指标
                </div>
              </div>
              <!-- 上半部分：大数字 + 环形进度条 -->
              <div class="flex flex-1 items-center justify-between">
                <div class="pt-18px flex gap-30px">
                  <img src="/assets/icons/05.png" alt="">
                  <div>
                    <div class="text-lg text-white font-bold mb-20px">
                      {{ ringCenterTitle }}
                    </div>
                    <div
                      class="text-[48px] text-[#FFCD84] leading-none font-bold"
                    >
                      {{ ringCenterValue }}
                    </div>
                  </div>
                </div>
                <div class="h-[130px] w-[130px] relative">
                  <div
                    ref="ringChartRef"
                    class="h-full w-full"
                  />
                  <div class="flex flex-col items-center inset-0 justify-center absolute">
                    <span class="text-xl text-white font-bold">{{ ringPercent }}</span>
                    <span class="text-[10px]">{{ ringCenterLabel }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="center-block pt-10px border border-[rgba(0,240,255,0.3)] flex flex-1 flex-col relative"
            >
              <div class="center-block-title">
                <span class="i-ri:radio-button-line text-base text-#6ADEFE ml--20px mr-14px inline-block" />
                <div class="text-white font-bold">
                  上月追缴金额日变化趋势图
                </div>
              </div>
              <!-- 下半部分：趋势折线图 -->
              <div
                ref="trendLineChartRef"
                class="flex-1 w-full"
              />
            </div>
          </div>

          <div
            class="center-block border border-[rgba(0,240,255,0.3)] flex flex-col relative"
          >
            <div class="center-block-title bg4">
              <div class="text-white font-bold mt--28px">
                工单量按月统计
              </div>
            </div>
            <div
              ref="groupBarChartRef"
              class="flex-1 w-full"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(1, 31, 31, 0.5);
}

::-webkit-scrollbar-thumb {
  background: rgba(1, 31, 31, 0.5);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(1, 31, 31, 0.5);
}

.top-block {
  width: 450px;
  height: 181px;
  background-image: url('/assets/images/top-block-bg.png');
  background-size: 100% 100%;
  font-family: initial;
}

.top-block-title {
  line-height: 39px;
  font-size: 22px;
  font-weight: bold;
  display: inline-block;
  transform: skew(-5deg);
  margin-bottom: 10px;
}

.top-block-icon {
  width: 136px;
  height: 127px;
}

.center-block {
  padding: 20px;
  display: flex;
  flex-direction: column;
  background-color: rgba(0, 178, 255, 0.15);
}
.center-block.pt-10px {
  padding-top: 10px;
}
.center-block-title {
  background-size: 100% 100%;
  height: 39px;
  display: flex;
  align-items: center;
  padding-left: 34px;
  font-size: 20px;
}

.center-block-title.bg1 {
  padding-left: 40px;
  background-image: url('/assets/images/title_bg_1.png');
}

.center-block-title.bg2 {
  background-image: url('/assets/images/title_bg_2.png');
}

.center-block-title.bg3 {
  background-image: url('/assets/images/title_bg_3.png');
}

.center-block-title.bg4 {
  background-image: url('/assets/images/title_bg_4.png');
}

.page-enter-active {
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
