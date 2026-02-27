<script setup lang="ts">
/**
 * work-order.vue — 交控稽核工单大数据看板
 *
 * 页面展示：
 *   - 顶部：BoardHeader 组件（时钟 + 标题 + 全屏）
 *   - 统计卡片（4张）
 *   - 图表区（6个 ECharts 图表）
 */
import type { EChartsOption } from 'echarts'
import type { BarChartData, GroupBarChartData, LineChartData, PieChartData, RingChartData, TrendLineChartData } from '~/composables/useAuditBoardData'
import * as echarts from 'echarts'
import { axisStyle, baseOption, darkTooltip, orangeTooltip, palette } from '~/utils/chartTheme'

definePageMeta({ layout: 'audit' })
useHead({ title: '交控稽核工单大数据看板' })

const { screenRef, onScaled } = useScreenScale({ width: 1920, height: 1080 })
const {
  stats,
  barChart,
  lineChart,
  pieChart,
  ringChart,
  trendLineChart,
  groupBarChart,
  isLoading,
  pendings,
} = useAuditBoardData()

// ── 图表容器 ref ─────────────────────────────────
const barRef = ref<HTMLElement>()
const lineRef = ref<HTMLElement>()
const pieRef = ref<HTMLElement>()
const ringRef = ref<HTMLElement>()
const trendLineRef = ref<HTMLElement>()
const groupBarRef = ref<HTMLElement>()

// ── 图表 Option 构建函数 ───────────────────────────

/** 追缴金额排名柱状图 */
function buildBar(c: BarChartData | null): EChartsOption {
  return {
    ...baseOption,
    tooltip: { trigger: 'axis', ...darkTooltip },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
    xAxis: { type: 'category', data: c?.categories ?? [], axisLine: axisStyle.cyanLine, axisLabel: { ...axisStyle.whiteLabel, fontSize: 10, interval: 0, rotate: 30 }, axisTick: axisStyle.noTick },
    yAxis: { type: 'value', axisLine: axisStyle.hiddenLine, axisLabel: { ...axisStyle.whiteLabel, formatter: (v: number) => `${v}万元` }, splitLine: axisStyle.cyanSplit },
    series: [{
      name: '追缴金额',
      type: 'bar',
      data: c?.series[0]?.data ?? [],
      barWidth: '50%',
      itemStyle: {
        borderRadius: [4, 4, 0, 0],
        color: (params: { dataIndex: number }) => {
          const colors = [
            new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: palette.cyan }, { offset: 1, color: 'rgba(0,240,255,0.3)' }]),
            new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: palette.orange }, { offset: 1, color: 'rgba(255,159,0,0.3)' }]),
          ]
          return colors[params.dataIndex % 2] as echarts.graphic.LinearGradient
        },
      },
      emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,240,255,0.5)' } },
    }],
  }
}

/** 追缴金额历史趋势折线图 */
function buildLine(c: LineChartData | null): EChartsOption {
  return {
    ...baseOption,
    legend: { data: ['追缴金额'], textStyle: { color: '#fff' }, top: '5%', right: 'center', icon: 'circle', itemWidth: 8, itemHeight: 8 },
    tooltip: { trigger: 'axis', ...orangeTooltip },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '20%', containLabel: true },
    xAxis: { type: 'category', boundaryGap: false, data: c?.categories ?? [], axisLine: axisStyle.orangeLine, axisLabel: axisStyle.whiteLabel, axisTick: axisStyle.noTick },
    yAxis: { type: 'value', name: '金额(万元)', nameTextStyle: { color: '#fff' }, axisLine: axisStyle.hiddenLine, axisLabel: axisStyle.whiteLabel, splitLine: axisStyle.orangeSplit },
    series: [{
      name: '追缴金额',
      type: 'line',
      smooth: true,
      data: c?.series[0]?.data ?? [],
      lineStyle: { color: palette.orange, width: 3 },
      areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(255,159,0,0.5)' }, { offset: 1, color: 'rgba(255,159,0,0.05)' }]) },
      itemStyle: { color: palette.orange },
      symbol: 'circle',
      symbolSize: 8,
    }],
  }
}

/** 特情车辆类型饼图 */
function buildPie(c: PieChartData | null): EChartsOption {
  const colors = [palette.orange, palette.green, palette.blue, palette.cyan]
  return {
    ...baseOption,
    tooltip: { trigger: 'item', ...darkTooltip, formatter: '{b}: {c} ({d}%)' },
    legend: { show: false },
    series: [{
      name: '特殊车型',
      roseType: 'radius',
      type: 'pie',
      radius: ['20%', '70%'],
      center: ['50%', '50%'],
      avoidLabelOverlap: true,
      itemStyle: { borderRadius: 2, borderWidth: 2 },
      label: { show: true, position: 'outside', color: '#fff', formatter: '{b}: {c}' },
      labelLine: { lineStyle: { color: 'rgba(0,240,255,0.3)' } },
      emphasis: { label: { fontSize: 14, fontWeight: 'bold' } },
      data: (c?.data ?? []).map((d, i) => ({ ...d, itemStyle: { color: colors[i % colors.length] } })),
    }],
  }
}

/** 工单处理指标环形进度图 */
function buildRing(c: RingChartData | null): EChartsOption {
  const val = c?.value ?? 0
  const total = c?.total ?? 100
  return {
    series: [{
      type: 'pie',
      radius: ['70%', '85%'],
      center: ['50%', '50%'],
      silent: true,
      label: { show: false },
      data: [
        { value: val, itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{ offset: 0, color: palette.cyan }, { offset: 1, color: '#48F7F7' }]) } },
        { value: total - val, itemStyle: { color: 'rgba(0,240,255,0.1)' } },
      ],
    }],
  }
}

/** 上月追缴金额日变化趋势（多系列折线） */
function buildTrendLine(c: TrendLineChartData | null): EChartsOption {
  const colors = [palette.cyan, palette.orange, palette.green]
  return {
    ...baseOption,
    grid: { left: '10%', right: '5%', bottom: '15%', top: '15%' },
    xAxis: { type: 'category', data: c?.categories ?? [], axisLine: axisStyle.cyanLine, axisLabel: axisStyle.smallLabel, axisTick: axisStyle.noTick },
    yAxis: { type: 'value', axisLine: axisStyle.hiddenLine, axisLabel: axisStyle.smallLabel, splitLine: axisStyle.cyanSplit },
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

/** 工单量按月统计（分组柱状图） */
function buildGroupBar(c: GroupBarChartData | null): EChartsOption {
  const colors = [palette.blue, palette.orange, palette.green]
  return {
    ...baseOption,
    tooltip: { trigger: 'axis', ...darkTooltip, axisPointer: { type: 'shadow' } },
    legend: { data: (c?.series ?? []).map(s => s.name), textStyle: { color: '#fff' }, top: '5%', right: 'center', itemWidth: 12, itemHeight: 12 },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '20%', containLabel: true },
    xAxis: { type: 'category', data: c?.categories ?? [], axisLine: axisStyle.cyanLine, axisLabel: axisStyle.whiteLabel, axisTick: axisStyle.noTick },
    yAxis: { type: 'value', name: '工单数', nameTextStyle: { color: '#fff' }, axisLine: axisStyle.hiddenLine, axisLabel: axisStyle.whiteLabel, splitLine: axisStyle.cyanSplit },
    series: (c?.series ?? []).map((s, i) => ({
      name: s.name,
      type: 'bar' as const,
      data: s.data,
      itemStyle: { color: colors[i % colors.length], borderRadius: [4, 4, 0, 0] },
    })),
  }
}

// ── 环形图中心文字 ─────────────────────────────────
const ringPercent = computed(() => {
  const v = (ringChart.value as any)?.value ?? 0
  const t = (ringChart.value as any)?.total ?? 100
  return `${Math.round(v / t * 100)}%`
})
const ringCenterLabel = computed(() => (ringChart.value as any)?.label ?? '处理率')
const ringCenterValue = computed(() => (ringChart.value as any)?.center?.value ?? 0)
const ringCenterTitle = computed(() => (ringChart.value as any)?.center?.label ?? '本月处理工单')

// ── ECharts 生命周期管理 ─────────────────────────────
useEChartsManager([
  { domRef: barRef, dataRef: barChart, pendingRef: pendings.barChart, buildOption: buildBar },
  { domRef: lineRef, dataRef: lineChart, pendingRef: pendings.lineChart, buildOption: buildLine },
  { domRef: pieRef, dataRef: pieChart, pendingRef: pendings.pieChart, buildOption: buildPie },
  { domRef: ringRef, dataRef: ringChart, pendingRef: pendings.ringChart, buildOption: buildRing },
  { domRef: trendLineRef, dataRef: trendLineChart, pendingRef: pendings.trendLineChart, buildOption: buildTrendLine },
  { domRef: groupBarRef, dataRef: groupBarChart, pendingRef: pendings.groupBarChart, buildOption: buildGroupBar },
], onScaled)
</script>

<template>
  <div class="page-root page-enter-active">
    <div ref="screenRef" class="screen-wrapper" style="transform-origin: left top;">
      <!-- ═══════════ HEADER ═══════════ -->
      <BoardHeader title="交控稽核工单大数据看板" />

      <div class="main-content">
        <!-- 统计卡片 -->
        <div class="stat-row h-181px relative">
          <div v-if="isLoading" class="panel-loading-overlay">
            <div class="loading-spinner" />
          </div>
          <div v-for="(item, i) in (stats as any[])" :key="item.key" class="top-block">
            <div class="top-block__inner">
              <div class="top-block__text">
                <div class="top-block__label">
                  {{ item.label }}
                </div>
                <div class="top-block__value">
                  <BoardCountUp
                    :value="item.value"
                    :use-grouping="true"
                    :suffix="item.unit"
                  />
                </div>
              </div>
              <img :src="`/assets/icons/0${i + 1}.png`" alt="" class="top-block__icon">
            </div>
          </div>
        </div>

        <!-- 上排两图 -->
        <div class="chart-row-2 h-318px">
          <div class="chart-block">
            <div class="chart-block__title bg1">
              <div class="chart-block__title-text">
                分公司追缴金额(近30日TOP10)
              </div>
            </div>
            <div ref="barRef" class="chart-block__body" />
          </div>
          <div class="chart-block">
            <div class="chart-block__title bg1">
              <div class="chart-block__title-text">
                追缴金额历史趋势
              </div>
            </div>
            <div ref="lineRef" class="chart-block__body" />
          </div>
        </div>

        <!-- 下排三图 -->
        <div class="chart-row-3">
          <div class="chart-block">
            <div class="chart-block__title bg2">
              <div class="chart-block__title-text">
                特情车辆类型数量(近30日)
              </div>
            </div>
            <div ref="pieRef" class="chart-block__body" />
          </div>

          <div class="chart-col-mid">
            <!-- 指标环形 -->
            <div class="chart-block">
              <div class="chart-block__title bg3">
                <div class="chart-block__title-text">
                  指标
                </div>
              </div>
              <div class="ring-row">
                <div class="ring-row__left">
                  <img src="/assets/icons/05.png" alt="">
                  <div>
                    <div class="ring-row__label">
                      {{ ringCenterTitle }}
                    </div>
                    <div class="ring-row__value" style="font-family: PangMenZhengDao, sans-serif;">
                      <BoardCountUp
                        :value="ringCenterValue"
                        :use-grouping="true"
                      />
                    </div>
                  </div>
                </div>
                <div class="ring-row__chart">
                  <div ref="ringRef" class="ring-row__canvas" />
                  <div class="ring-row__overlay">
                    <span class="ring-row__percent">{{ ringPercent }}</span>
                    <span class="ring-row__hint">{{ ringCenterLabel }}</span>
                  </div>
                </div>
              </div>
            </div>
            <!-- 追缴金额日变化 -->
            <div class="chart-block chart-block--compact">
              <div class="chart-block__title">
                <span class="chart-block__dot" />
                <div class="chart-block__title-text">
                  上月追缴金额日变化趋势图
                </div>
              </div>
              <div ref="trendLineRef" class="chart-block__body" />
            </div>
          </div>

          <div class="chart-block">
            <div class="chart-block__title bg4">
              <div class="chart-block__title-text">
                工单量按月统计
              </div>
            </div>
            <div ref="groupBarRef" class="chart-block__body" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ══════════════ 根容器 ══════════════ */
.page-root {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #0b111a url('/assets/images/bg01.jpg') center / 100% 100%;
  color: #fff;
}
.screen-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 20px;
  position: relative;
  overflow: hidden;
}

/* ══════════════ 主内容 ══════════════ */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-bottom: 30px;
  padding-top: 10px;
  overflow: hidden;
  gap: 16px;
}

/* ══════════════ 统计卡片 ══════════════ */
.stat-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}
.top-block {
  width: 100%;
  height: 181px;
  background: url('/assets/images/top-block-bg.png') 100% 100%;
  background-size: 100% 100%;
  font-family: initial;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
}
.top-block:hover {
  box-shadow: 0 0 30px rgba(0, 240, 255, 0.2);
  transform: translateY(-2px);
}
.top-block__inner {
  padding: 20px 40px;
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: space-between;
}
.top-block__label {
  font-size: 22px;
  font-weight: bold;
  transform: skew(-5deg);
  margin-bottom: 10px;
  line-height: 39px;
}
.top-block__value {
  font-size: 48px;
  color: #ffcd84;
  font-weight: bold;
}
.top-block__unit {
  margin-left: 4px;
}
.top-block__icon {
  width: 136px;
  height: 127px;
}

/* ══════════════ 图表区块 ══════════════ */
.chart-block {
  padding: 13px;
  display: flex;
  flex-direction: column;
  background-color: rgba(0, 178, 255, 0.15);
  border: 1px solid rgba(0, 240, 255, 0.3);
  position: relative;
  height: 100%;
}
.chart-block--compact {
  padding-top: 10px;
}
.chart-block__title {
  background-size: 100% 100%;
  height: 39px;
  display: flex;
  align-items: center;
  padding-left: 34px;
  font-size: 20px;
}
.chart-block__title.bg1 {
  padding-left: 40px;
  background-image: url('/assets/images/title_bg_1.png');
}
.chart-block__title.bg2 {
  background-image: url('/assets/images/title_bg_2.png');
}
.chart-block__title.bg3 {
  background-image: url('/assets/images/title_bg_3.png');
}
.chart-block__title.bg4 {
  background-image: url('/assets/images/title_bg_4.png');
}
.chart-block__title-text {
  color: #fff;
  font-weight: bold;
  margin-top: -28px;
}
.chart-block__title:not(.bg1):not(.bg2):not(.bg3):not(.bg4) .chart-block__title-text {
  margin-top: 0;
}
.chart-block__dot {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid #6adefe;
  margin-right: 14px;
  margin-left: -20px;
}
.chart-block__body {
  flex: 1;
  width: 100%;
  min-height: 0;
}
.chart-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  flex: 1;
  min-height: 318px;
}
.chart-row-3 {
  display: grid;
  grid-template-columns: 1fr 1fr 1.2fr;
  gap: 20px;
  flex: 1;
}
.chart-col-mid {
  display: flex;
  flex-direction: column;
  gap: 16px;
  display: grid;
  grid-template-rows: 0.8fr 1fr;
}

/* ══════════════ 环形指标 ══════════════ */
.ring-row {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
}
.ring-row__left {
  padding-top: 18px;
  display: flex;
  gap: 30px;
}
.ring-row__label {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
}
.ring-row__value {
  font-size: 48px;
  color: #ffcd84;
  font-weight: bold;
  line-height: 1;
}
.ring-row__chart {
  width: 130px;
  height: 130px;
  position: relative;
}
.ring-row__canvas {
  width: 100%;
  height: 100%;
}
.ring-row__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.ring-row__percent {
  font-size: 20px;
  font-weight: bold;
}
.ring-row__hint {
  font-size: 10px;
}

/* ══════════════ 入场动画 ══════════════ */
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

/* ══════════════ 滚动条 ══════════════ */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: rgba(1, 31, 31, 0.5);
}
::-webkit-scrollbar-thumb {
  background: rgba(1, 31, 31, 0.5);
}

/* ══════════════ Loading 遮罩层 ══════════════ */
.panel-loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(11, 17, 26, 0.6);
  backdrop-filter: blur(2px);
  z-index: 10;
  border-radius: inherit;
}
.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(0, 240, 255, 0.2);
  border-top-color: #00f0ff;
  border-radius: 50%;
  animation: spinner-rotate 1s linear infinite;
}
@keyframes spinner-rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
