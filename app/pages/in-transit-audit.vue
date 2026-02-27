<script setup lang="ts">
/**
 * in-transit-audit.vue — 交控在途稽核大数据分析看板
 *
 * 页面展示：
 *   - 顶部：实时时钟 + 标题 + 全屏切换（BoardHeader 组件）
 *   - 左列：分公司成果占比（玫瑰饼图）+ 金额/数量排名 TOP10（横向柱状图×2）
 *   - 中列：统计卡片（2×3）+ 设备心跳监测表格 + 数量/金额占比（饼图×2）
 *   - 右列：车型占比（玫瑰饼图）+ 数量趋势（折线图）+ 金额变化（柱状图）
 */
import type { EChartsOption } from 'echarts'
import type { InTransitHBarChartData, InTransitPieChartData } from '~/composables/useInTransitData'
import * as echarts from 'echarts'
import { axisStyle, baseOption, darkTooltip, palette, smallLegend } from '~/utils/chartTheme'

definePageMeta({ layout: 'audit' })
useHead({ title: '交控在途稽核大数据分析看板' })

// ── 屏幕自适应缩放 ────────────────────────────────
const { screenRef, onScaled } = useScreenScale({ width: 1920, height: 1080 })

// ── 接口数据 ─────────────────────────────────────
const {
  stats,
  devices,
  leftPieChart,
  amountRankChart,
  quantityRankChart,
  centerPieChart,
  centerRingChart,
  vehiclePieChart,
  trendLineChart,
  amountBarChart,
  isLoading,
  pendings,
} = useInTransitData()

// ── 图表容器 ref ─────────────────────────────────
const leftPieRef = ref<HTMLElement>()
const amountRankRef = ref<HTMLElement>()
const quantityRankRef = ref<HTMLElement>()
const centerPieRef = ref<HTMLElement>()
const centerRingRef = ref<HTMLElement>()
const vehiclePieRef = ref<HTMLElement>()
const trendLineRef = ref<HTMLElement>()
const amountBarRef = ref<HTMLElement>()

// ── 图表 Option 构建函数 ───────────────────────────

/** 玫瑰饼图（分公司占比 / 数量占比 / 车型占比共用） */
function buildRosePie(c: InTransitPieChartData | null): EChartsOption {
  const colors = [palette.blue, palette.green, palette.orange, palette.cyan]
  return {
    ...baseOption,
    tooltip: { trigger: 'item', ...darkTooltip, formatter: '{b}: {c} ({d}%)' },
    legend: { show: false },
    series: [{
      type: 'pie',
      roseType: 'area',
      radius: ['20%', '70%'],
      center: ['50%', '50%'],
      avoidLabelOverlap: true,
      itemStyle: { borderRadius: 0, borderColor: '#0a1628', borderWidth: 0 },
      label: { show: true, position: 'outside', color: '#fff', fontSize: 14, formatter: '{b}\n\n{d}%' },
      labelLine: { lineStyle: { color: 'rgba(0,240,255,0.3)' } },
      data: (c?.data ?? []).map((d, i) => ({ ...d, itemStyle: { color: colors[i % colors.length] } })),
    }],
  }
}

/** 环形饼图（推送金额 vs 成果金额） */
function buildRingPie(c: InTransitPieChartData | null): EChartsOption {
  const colors = [palette.green, palette.orange]
  return {
    ...baseOption,
    tooltip: { trigger: 'item', ...darkTooltip, formatter: '{b}: {c} ({d}%)' },
    legend: { show: false },
    series: [{
      name: '金额占比',
      type: 'pie',
      radius: ['44%', '70%'],
      center: ['50%', '50%'],
      itemStyle: { borderRadius: 4, borderColor: '#0a1628', borderWidth: 0 },
      label: { show: true, position: 'outside', color: '#fff', fontSize: 14, formatter: '{b}\n\n{d}%' },
      labelLine: { lineStyle: { color: 'rgba(0,240,255,0.3)' } },
      data: (c?.data ?? []).map((d, i) => ({ ...d, itemStyle: { color: colors[i % colors.length] } })),
    }],
  }
}

/** 横向柱状图（金额/数量排名 TOP10，isAmount 控制颜色） */
function buildHBar(c: InTransitHBarChartData | null, isAmount: boolean): EChartsOption {
  const color = isAmount ? palette.cyan : palette.blue
  const colorEnd = isAmount ? 'rgba(0,240,255,0.25)' : 'rgba(41,121,255,0.25)'
  return {
    ...baseOption,
    tooltip: { trigger: 'axis', ...darkTooltip },
    legend: { data: [c?.series[0]?.name ?? ''], ...smallLegend },
    grid: { left: '2%', right: '12%', bottom: '3%', top: '16%', containLabel: true },
    xAxis: { type: 'value', axisLine: axisStyle.hiddenLine, axisLabel: axisStyle.smallLabel, splitLine: axisStyle.cyanSplit },
    yAxis: { type: 'category', data: c?.categories ?? [], axisLine: axisStyle.cyanLine, axisLabel: axisStyle.smallLabel, axisTick: axisStyle.noTick },
    series: [{
      name: c?.series[0]?.name ?? '',
      type: 'bar',
      data: c?.series[0]?.data ?? [],
      barWidth: '55%',
      itemStyle: { color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{ offset: 0, color }, { offset: 1, color: colorEnd }]), borderRadius: [0, 3, 3, 0] },
      label: { show: true, position: 'right', color: '#fff', fontSize: 9 },
    }],
  }
}

/** 数量趋势折线图 */
function buildTrendLine(c: InTransitHBarChartData | null): EChartsOption {
  return {
    ...baseOption,
    tooltip: { trigger: 'axis', ...darkTooltip },
    legend: { data: ['数量'], ...smallLegend },
    grid: { left: '3%', right: '4%', bottom: '5%', top: '20%', containLabel: true },
    xAxis: { type: 'category', boundaryGap: false, data: c?.categories ?? [], axisLine: axisStyle.cyanLine, axisLabel: axisStyle.smallLabel, axisTick: axisStyle.noTick },
    yAxis: { type: 'value', axisLine: axisStyle.hiddenLine, axisLabel: axisStyle.smallLabel, splitLine: axisStyle.cyanSplit },
    series: [{
      name: '数量',
      type: 'line',
      smooth: true,
      data: c?.series[0]?.data ?? [],
      lineStyle: { color: palette.cyan, width: 2 },
      areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(0,240,255,0.28)' }, { offset: 1, color: 'rgba(0,240,255,0.02)' }]) },
      itemStyle: { color: palette.cyan },
      symbol: 'circle',
      symbolSize: 5,
    }],
  }
}

/** 金额变化柱状图 */
function buildAmountBar(c: InTransitHBarChartData | null): EChartsOption {
  return {
    ...baseOption,
    tooltip: { trigger: 'axis', ...darkTooltip },
    legend: { data: ['金额'], ...smallLegend },
    grid: { left: '3%', right: '4%', bottom: '5%', top: '20%', containLabel: true },
    xAxis: { type: 'category', data: c?.categories ?? [], axisLine: axisStyle.cyanLine, axisLabel: axisStyle.smallLabel, axisTick: axisStyle.noTick },
    yAxis: { type: 'value', axisLine: axisStyle.hiddenLine, axisLabel: axisStyle.smallLabel, splitLine: axisStyle.cyanSplit },
    series: [{
      name: '金额',
      type: 'bar',
      data: c?.series[0]?.data ?? [],
      barWidth: '48%',
      itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: palette.orange }, { offset: 1, color: 'rgba(255,159,0,0.25)' }]), borderRadius: [3, 3, 0, 0] },
    }],
  }
}

// ── ECharts 生命周期管理 ─────────────────────────────
useEChartsManager([
  { domRef: leftPieRef, dataRef: leftPieChart, pendingRef: pendings.leftPieChart, buildOption: buildRosePie },
  { domRef: amountRankRef, dataRef: amountRankChart, pendingRef: pendings.amountRankChart, buildOption: c => buildHBar(c, true) },
  { domRef: quantityRankRef, dataRef: quantityRankChart, pendingRef: pendings.quantityRankChart, buildOption: c => buildHBar(c, false) },
  { domRef: centerPieRef, dataRef: centerPieChart, pendingRef: pendings.centerPieChart, buildOption: buildRosePie },
  { domRef: centerRingRef, dataRef: centerRingChart, pendingRef: pendings.centerRingChart, buildOption: buildRingPie },
  { domRef: vehiclePieRef, dataRef: vehiclePieChart, pendingRef: pendings.vehiclePieChart, buildOption: buildRosePie },
  { domRef: trendLineRef, dataRef: trendLineChart, pendingRef: pendings.trendLineChart, buildOption: buildTrendLine },
  { domRef: amountBarRef, dataRef: amountBarChart, pendingRef: pendings.amountBarChart, buildOption: buildAmountBar },
], onScaled)
</script>

<template>
  <div class="page-root page-enter-active">
    <div class="bg-layer" />
    <div ref="screenRef" class="screen-wrapper" style="transform-origin: left top;">
      <!-- ═══════════ HEADER ═══════════ -->
      <BoardHeader title="交控在途稽核大数据分析看板" show-week />

      <!-- ═══════════ 主内容 ═══════════ -->
      <div class="main-grid">
        <!-- 左列 -->
        <div class="left-col">
          <div class="panel border h-340px">
            <div class="panel-hd panel-title bg">
              <img class="p-icon" src="/assets/icons/arrow-icon.png" alt=""><span class="p-title">分公司本月成果占比</span>
            </div>
            <div ref="leftPieRef" class="chart-fill" />
          </div>
          <div class="left-bottom panel border">
            <div class="panel">
              <div class="panel-hd panel-title bg">
                <img class="p-icon" src="/assets/icons/arrow-icon.png" alt=""><span class="p-title">本月成果金额排名top10</span>
              </div>
              <div ref="amountRankRef" class="chart-fill" />
            </div>
            <div class="panel">
              <div class="panel-hd">
                <img class="p-icon" src="/assets/icons/arrow-icon.png" alt=""><span class="p-title">本月成果数量排名top10</span>
              </div>
              <div ref="quantityRankRef" class="chart-fill" />
            </div>
          </div>
        </div>

        <!-- 中列 -->
        <div class="center-col">
          <!-- 统计卡片 -->
          <div class="stat-grid relative">
            <div v-if="isLoading" class="panel-loading-overlay" style="border-radius: 8px;">
              <div class="loading-spinner" />
            </div>
            <div v-for="(card, i) in (stats as any[])" :key="i" class="stat-card">
              <div class="stat-inner">
                <div class="stat-text">
                  <div class="stat-value">
                    {{ card.value }}
                  </div>
                  <div class="stat-label">
                    {{ card.label }}
                  </div>
                </div>
                <img :src="card.icon" class="stat-icon" alt="">
              </div>
            </div>
          </div>

          <!-- 设备心跳监测 -->
          <div class="panel p-0" style="flex: 1;">
            <div class="panel-hd">
              <img class="p-icon" src="/assets/icons/arrow-icon.png" alt=""><span class="p-title">在途设备心跳监测</span>
            </div>
            <div class="table-wrap relative">
              <div v-if="isLoading" class="panel-loading-overlay">
                <div class="loading-spinner" />
              </div>
              <table class="data-table">
                <thead>
                  <tr>
                    <th>IP</th><th>系统CPU负载百分比</th><th>总物理内存大小</th>
                    <th>磁盘可用空间</th><th>物理内存使用率百分比</th><th>更新时间</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, i) in (devices as any[])" :key="i">
                    <td>{{ row.ip }}</td>
                    <td>{{ row.cpu }}</td>
                    <td>{{ row.memory }}</td>
                    <td>{{ row.disk }}</td>
                    <td>
                      <div class="prog-row">
                        <div class="prog-bar">
                          <div class="prog-fill" :style="{ '--width': `${row.usage}%` }" />
                        </div>
                        <span class="prog-text">{{ row.usage }}%</span>
                      </div>
                    </td>
                    <td>{{ row.time }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- 两个饼图 -->
          <div class="center-bottom border">
            <div class="panel">
              <div class="panel-hd">
                <img class="p-icon" src="/assets/icons/arrow-icon.png" alt=""><span class="p-title">分公司本月成果数量占比</span>
              </div>
              <div ref="centerPieRef" class="chart-fill" />
            </div>
            <div class="panel">
              <div class="panel-hd">
                <img class="p-icon" src="/assets/icons/arrow-icon.png" alt=""><span class="p-title">成果金额占比</span>
              </div>
              <div ref="centerRingRef" class="chart-fill" />
            </div>
          </div>
        </div>

        <!-- 右列 -->
        <div class="right-col">
          <div class="right-top panel p-0 border">
            <div class="panel p-0">
              <div class="panel-hd panel-title bg">
                <img class="p-icon" src="/assets/icons/arrow-icon.png" alt=""><span class="p-title">车型占比</span>
              </div>
              <div ref="vehiclePieRef" class="chart-fill" />
            </div>
            <div class="panel p-0">
              <div class="panel-hd">
                <img class="p-icon" src="/assets/icons/arrow-icon.png" alt=""><span class="p-title">在途成果数量本月趋势</span>
              </div>
              <div ref="trendLineRef" class="chart-fill" />
            </div>
          </div>
          <div class="panel border" style="flex: 0 0 36%;">
            <div class="panel-hd panel-title bg">
              <img class="p-icon" src="/assets/icons/arrow-icon.png" alt=""><span class="p-title">在途成果金额本月变化</span>
            </div>
            <div ref="amountBarRef" class="chart-fill" />
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
  position: relative;
  color: #fff;
  font-family: initial;
}
.bg-layer {
  position: absolute;
  inset: 0;
  background-image: url('/assets/images/bg02.jpg');
  background-size: cover;
  background-position: center;
  z-index: 0;
}
.screen-wrapper {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px 10px 30px;
  box-sizing: border-box;
  gap: 8px;
}

/* ══════════════ 主内容三列 ══════════════ */
.main-grid {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1.52fr 1fr;
  gap: 8px;
  min-height: 0;
}
.left-col,
.center-col,
.right-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 0;
  width: 100%;
  overflow: hidden;
}
.left-bottom {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 0;
}
.left-bottom .panel {
  flex: 1;
  min-height: 0;
}
.right-top {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 0;
}
.right-top .panel {
  flex: 1;
  min-height: 0;
}
.panel.p-0 {
  padding: 0;
}

/* ══════════════ 通用面板 ══════════════ */
.panel {
  position: relative;
  padding: 0 8px 10px 0;
  display: flex;
  flex-direction: column;
  min-height: 0;
}
.panel.border {
  border-radius: 10px;
  background: radial-gradient(0.5% 0.675% at 50% 50%, rgba(8, 53, 108, 0) 0%, rgba(0, 58, 140, 0.7) 100%);
  border: 1px solid rgba(56, 200, 255, 1);
}
.panel-hd {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  margin-bottom: 4px;
  padding: 10px 20px;
}
.panel-title {
  height: 44px;
  line-height: 44px;
  font-size: 14px;
  text-align: center;
  font-family: -regular;
}
.panel-title.bg {
  background-image: url('/assets/images/page2_block_title_bg.png');
  background-size: cover;
}
.p-icon {
  display: inline-block;
  width: 20px;
  height: 24px;
}
.p-title {
  font-size: 20px;
  color: #fff;
}
.chart-fill {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

/* ══════════════ 统计卡片 ══════════════ */
.stat-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 8px;
  flex-shrink: 0;
  height: 28%;
}
.stat-card {
  position: relative;
  overflow: hidden;
}
.stat-inner {
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  justify-content: flex-end;
  gap: 20px;
  height: 100%;
  padding: 8px 12px;
  box-sizing: border-box;
}
.stat-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.stat-value {
  font-size: 26px;
  font-weight: bold;
  color: #ff9f00;
  text-shadow: 0px 0px 5px rgba(240, 29, 4, 0.8);
  line-height: 1.1;
}
.stat-label {
  font-size: 14px;
  color: #fff;
  line-height: 1.3;
  margin-top: 5px;
}
.stat-icon {
  width: 94px;
  height: 94px;
  object-fit: contain;
  flex-shrink: 0;
}

/* ══════════════ 中列下方两饼图 ══════════════ */
.center-bottom {
  flex: 0 0 34%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  min-height: 0;
}
.center-bottom.border {
  border-radius: 10px;
  background: radial-gradient(0.5% 0.675% at 50% 50%, rgba(8, 53, 108, 0) 0%, rgba(0, 58, 140, 0.7) 100%);
  border: 1px solid rgba(56, 200, 255, 1);
}
.center-bottom .panel {
  min-height: 0;
}

/* ══════════════ 数据表格 ══════════════ */
.table-wrap {
  flex: 1;
  overflow: auto;
  min-height: 0;
}
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 11px;
}
.data-table th,
.data-table td {
  padding: 6px 10px;
  text-align: left;
  color: #fff;
  border-bottom: 1px solid rgba(0, 240, 255, 0.1);
  white-space: nowrap;
  height: 40px;
}
.data-table th {
  font-weight: normal;
  color: rgb(208, 222, 238);
  border-bottom: 1px solid rgba(0, 240, 255, 0.2);
  background: linear-gradient(180.03deg, rgba(0, 111, 255, 0) -71.13%, rgba(51, 99, 161, 0.4) 99.97%);
}
.data-table tr:hover td {
  background: rgba(0, 240, 255, 0.04);
}
.data-table tr:nth-child(even) td {
  background: rgba(99, 129, 234, 0.1);
}
.data-table tr:last-child td {
  border-bottom: none;
}

/* ══════════════ 进度条 ══════════════ */
.prog-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.prog-bar {
  width: 100px;
  height: 14px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.15);
  overflow: hidden;
  flex-shrink: 0;
  padding: 3px;
}
.prog-fill {
  height: 8px;
  border-radius: 1px;
  background: linear-gradient(268.46deg, rgba(47, 240, 200, 1) 5.81%, rgba(47, 240, 240, 0) 100.25%);
  position: relative;
  width: var(--width);
  transform-origin: left center;
  animation: prog-fill 1.2s cubic-bezier(0.23, 1, 0.32, 1) forwards;
}
@keyframes prog-fill {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}
.prog-fill::after {
  content: '';
  position: absolute;
  top: -50%;
  right: 0;
  height: 200%;
  width: 1px;
  background: #fff;
}
.prog-text {
  font-size: 12px;
  color: #a6d8e8;
  white-space: nowrap;
}

/* ══════════════ 滚动条 ══════════════ */
::-webkit-scrollbar {
  width: 3px;
  height: 3px;
}
::-webkit-scrollbar-track {
  background: rgba(0, 240, 255, 0.06);
}
::-webkit-scrollbar-thumb {
  background: rgba(0, 240, 255, 0.25);
  border-radius: 2px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 240, 255, 0.45);
}

/* ══════════════ 入场动画 ══════════════ */
.page-enter-active {
  animation: slideLeft 0.6s ease-out;
}
@keyframes slideLeft {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
