<script setup lang="ts">
import type { EChartsOption } from 'echarts'
import type { InTransitHBarChartData, InTransitPieChartData } from '~/composables/useInTransitData'

import * as echarts from 'echarts'

definePageMeta({
  layout: 'audit',
})

// 实时时间
const currentTime = ref('')
const currentDate = ref('')

function updateTime() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  const weekDay = weekDays[now.getDay()]
  currentTime.value = `${hours}:${minutes}:${seconds}`
  currentDate.value = `${year}年${month}月${day}日 ${weekDay}`
}

useIntervalFn(updateTime, 1000)
onMounted(updateTime)

// 全屏
const { isFullscreen, toggle: toggleFullscreen } = useFullscreen()

// 1920×1080 自适应缩放
const { screenRef } = useScreenScale({ width: 1920, height: 1080 })

// ── 接口数据（每个图表独立字段）──────────────────────
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
} = useInTransitData()

// ── ECharts 实例（_inst 后缀，避免与接口数据同名冲突）──
const commonOption: EChartsOption = {
  backgroundColor: 'transparent',
  textStyle: { fontFamily: 'Microsoft YaHei, sans-serif' },
}

const leftPieChartRef = ref<HTMLElement>()
let leftPieChart_inst: echarts.ECharts | null = null

const amountRankChartRef = ref<HTMLElement>()
let amountRankChart_inst: echarts.ECharts | null = null

const quantityRankChartRef = ref<HTMLElement>()
let quantityRankChart_inst: echarts.ECharts | null = null

const centerPieChartRef = ref<HTMLElement>()
let centerPieChart_inst: echarts.ECharts | null = null

const centerRingChartRef = ref<HTMLElement>()
let centerRingChart_inst: echarts.ECharts | null = null

const vehiclePieChartRef = ref<HTMLElement>()
let vehiclePieChart_inst: echarts.ECharts | null = null

const trendLineChartRef = ref<HTMLElement>()
let trendLineChart_inst: echarts.ECharts | null = null

const amountBarChartRef = ref<HTMLElement>()
let amountBarChart_inst: echarts.ECharts | null = null

// ── 图表构建函数 ──────────────────────────────────
/** 玫瑰饼图 */
function buildRosePie(c: InTransitPieChartData | null): EChartsOption {
  const pieColors = ['#2979ff', '#00e676', '#ff9f00', '#00f0ff']
  return {
    ...commonOption,
    tooltip: { trigger: 'item', backgroundColor: 'rgba(11,17,26,0.9)', borderColor: '#00f0ff', textStyle: { color: '#fff' }, formatter: '{b}: {c} ({d}%)' },
    legend: { show: false },
    series: [{
      type: 'pie',
      roseType: 'area',
      radius: ['20%', '70%'],
      center: ['50%', '50%'],
      avoidLabelOverlap: true,
      itemStyle: { borderRadius: 0, borderColor: '#0a1628', borderWidth: 0 },
      label: { show: true, position: 'outside', color: '#fff', fontSize: 10, formatter: '{b}\n{d}%' },
      labelLine: { lineStyle: { color: 'rgba(0,240,255,0.3)' } },
      data: (c?.data ?? []).map((d, i) => ({ ...d, itemStyle: { color: pieColors[i % pieColors.length] } })),
    }],
  }
}

/** 环形图（成果金额占比） */
function buildRingPie(c: InTransitPieChartData | null): EChartsOption {
  const ringColors = ['#00e676', '#ff9f00']
  return {
    ...commonOption,
    tooltip: { trigger: 'item', backgroundColor: 'rgba(11,17,26,0.9)', borderColor: '#00f0ff', textStyle: { color: '#fff' }, formatter: '{b}: {c} ({d}%)' },
    legend: { show: false },
    series: [{
      name: '金额占比',
      type: 'pie',
      radius: ['44%', '70%'],
      center: ['50%', '50%'],
      itemStyle: { borderRadius: 4, borderColor: '#0a1628', borderWidth: 0 },
      label: { show: true, position: 'outside', color: '#fff', fontSize: 9, formatter: '{b}\n{d}%' },
      labelLine: { lineStyle: { color: 'rgba(0,240,255,0.3)' } },
      data: (c?.data ?? []).map((d, i) => ({ ...d, itemStyle: { color: ringColors[i % ringColors.length] } })),
    }],
  }
}

/** 横向柱状图（成果金额/数量排名） */
function buildHBarChart(c: InTransitHBarChartData | null, isAmount: boolean): EChartsOption {
  const barColor = isAmount ? '#00f0ff' : '#2979ff'
  const barColorEnd = isAmount ? 'rgba(0,240,255,0.25)' : 'rgba(41,121,255,0.25)'
  return {
    ...commonOption,
    tooltip: { trigger: 'axis', backgroundColor: 'rgba(11,17,26,0.9)', borderColor: '#00f0ff', textStyle: { color: '#fff' } },
    legend: { data: [c?.series[0]?.name ?? ''], textStyle: { color: '#fff', fontSize: 10 }, top: 0, right: 'center', itemWidth: 12, itemHeight: 8 },
    grid: { left: '2%', right: '12%', bottom: '3%', top: '16%', containLabel: true },
    xAxis: { type: 'value', axisLine: { show: false }, axisLabel: { color: '#fff', fontSize: 9 }, splitLine: { lineStyle: { color: 'rgba(0,240,255,0.1)' } } },
    yAxis: {
      type: 'category',
      data: c?.categories ?? [],
      axisLine: { lineStyle: { color: 'rgba(0,240,255,0.3)' } },
      axisLabel: { color: '#fff', fontSize: 9 },
      axisTick: { show: false },
    },
    series: [{
      name: c?.series[0]?.name ?? '',
      type: 'bar',
      data: c?.series[0]?.data ?? [],
      barWidth: '55%',
      itemStyle: { color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{ offset: 0, color: barColor }, { offset: 1, color: barColorEnd }]), borderRadius: [0, 3, 3, 0] },
      label: { show: true, position: 'right', color: '#fff', fontSize: 9 },
    }],
  }
}

/** 折线趋势图 */
function buildTrendLine(c: InTransitHBarChartData | null): EChartsOption {
  return {
    ...commonOption,
    tooltip: { trigger: 'axis', backgroundColor: 'rgba(11,17,26,0.9)', borderColor: '#00f0ff', textStyle: { color: '#fff' } },
    legend: { data: ['数量'], textStyle: { color: '#fff', fontSize: 10 }, top: 0, right: 'center', itemWidth: 12, itemHeight: 8 },
    grid: { left: '3%', right: '4%', bottom: '5%', top: '20%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: c?.categories ?? [],
      axisLine: { lineStyle: { color: 'rgba(0,240,255,0.3)' } },
      axisLabel: { color: '#fff', fontSize: 9 },
      axisTick: { show: false },
    },
    yAxis: { type: 'value', axisLine: { show: false }, axisLabel: { color: '#fff', fontSize: 9 }, splitLine: { lineStyle: { color: 'rgba(0,240,255,0.1)' } } },
    series: [{
      name: '数量',
      type: 'line',
      smooth: true,
      data: c?.series[0]?.data ?? [],
      lineStyle: { color: '#00f0ff', width: 2 },
      areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(0,240,255,0.28)' }, { offset: 1, color: 'rgba(0,240,255,0.02)' }]) },
      itemStyle: { color: '#00f0ff' },
      symbol: 'circle',
      symbolSize: 5,
    }],
  }
}

/** 纵向柱状图（金额变化） */
function buildAmountBar(c: InTransitHBarChartData | null): EChartsOption {
  return {
    ...commonOption,
    tooltip: { trigger: 'axis', backgroundColor: 'rgba(11,17,26,0.9)', borderColor: '#00f0ff', textStyle: { color: '#fff' } },
    legend: { data: ['金额'], textStyle: { color: '#fff', fontSize: 10 }, top: 0, right: 'center', itemWidth: 12, itemHeight: 8 },
    grid: { left: '3%', right: '4%', bottom: '5%', top: '20%', containLabel: true },
    xAxis: {
      type: 'category',
      data: c?.categories ?? [],
      axisLine: { lineStyle: { color: 'rgba(0,240,255,0.3)' } },
      axisLabel: { color: '#fff', fontSize: 9 },
      axisTick: { show: false },
    },
    yAxis: { type: 'value', axisLine: { show: false }, axisLabel: { color: '#fff', fontSize: 9 }, splitLine: { lineStyle: { color: 'rgba(0,240,255,0.1)' } } },
    series: [{
      name: '金额',
      type: 'bar',
      data: c?.series[0]?.data ?? [],
      barWidth: '48%',
      itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#ff9f00' }, { offset: 1, color: 'rgba(255,159,0,0.25)' }]), borderRadius: [3, 3, 0, 0] },
    }],
  }
}

function initCharts() {
  if (leftPieChartRef.value) { leftPieChart_inst = echarts.init(leftPieChartRef.value); leftPieChart_inst.setOption(buildRosePie(leftPieChart.value)) }
  if (amountRankChartRef.value) { amountRankChart_inst = echarts.init(amountRankChartRef.value); amountRankChart_inst.setOption(buildHBarChart(amountRankChart.value, true)) }
  if (quantityRankChartRef.value) { quantityRankChart_inst = echarts.init(quantityRankChartRef.value); quantityRankChart_inst.setOption(buildHBarChart(quantityRankChart.value, false)) }
  if (centerPieChartRef.value) { centerPieChart_inst = echarts.init(centerPieChartRef.value); centerPieChart_inst.setOption(buildRosePie(centerPieChart.value)) }
  if (centerRingChartRef.value) { centerRingChart_inst = echarts.init(centerRingChartRef.value); centerRingChart_inst.setOption(buildRingPie(centerRingChart.value)) }
  if (vehiclePieChartRef.value) { vehiclePieChart_inst = echarts.init(vehiclePieChartRef.value); vehiclePieChart_inst.setOption(buildRosePie(vehiclePieChart.value)) }
  if (trendLineChartRef.value) { trendLineChart_inst = echarts.init(trendLineChartRef.value); trendLineChart_inst.setOption(buildTrendLine(trendLineChart.value)) }
  if (amountBarChartRef.value) { amountBarChart_inst = echarts.init(amountBarChartRef.value); amountBarChart_inst.setOption(buildAmountBar(amountBarChart.value)) }
}

// 每个图表独立 watch，数据就绪后各自更新（兼容 SSR 水合）
watch(leftPieChart, c => leftPieChart_inst?.setOption(buildRosePie(c)))
watch(amountRankChart, c => amountRankChart_inst?.setOption(buildHBarChart(c, true)))
watch(quantityRankChart, c => quantityRankChart_inst?.setOption(buildHBarChart(c, false)))
watch(centerPieChart, c => centerPieChart_inst?.setOption(buildRosePie(c)))
watch(centerRingChart, c => centerRingChart_inst?.setOption(buildRingPie(c)))
watch(vehiclePieChart, c => vehiclePieChart_inst?.setOption(buildRosePie(c)))
watch(trendLineChart, c => trendLineChart_inst?.setOption(buildTrendLine(c)))
watch(amountBarChart, c => amountBarChart_inst?.setOption(buildAmountBar(c)))

function handleResize() {
  leftPieChart_inst?.resize(); amountRankChart_inst?.resize(); quantityRankChart_inst?.resize()
  centerPieChart_inst?.resize(); centerRingChart_inst?.resize()
  vehiclePieChart_inst?.resize(); trendLineChart_inst?.resize(); amountBarChart_inst?.resize()
}

onMounted(() => { nextTick(() => { initCharts(); useEventListener(window, 'resize', handleResize) }) })

onBeforeUnmount(() => {
  leftPieChart_inst?.dispose(); amountRankChart_inst?.dispose(); quantityRankChart_inst?.dispose()
  centerPieChart_inst?.dispose(); centerRingChart_inst?.dispose()
  vehiclePieChart_inst?.dispose(); trendLineChart_inst?.dispose(); amountBarChart_inst?.dispose()
})

useHead({ title: '交控稽核大数据分析看板' })
</script>

<template>
  <div class="page-root page-enter-active">
    <div class="bg-layer" />
    <div ref="screenRef" class="screen-wrapper" style="transform-origin: left top;">
      <!-- ═══════════ HEADER ═══════════ -->
      <header class="header">
        <div class="header-time">
          <div class="time-big">
            {{ currentTime }}
          </div>
          <div class="time-date">
            {{ currentDate }}
          </div>
        </div>
        <div class="header-title">
          <!-- <div class="title-line-l" /> -->
          <h1 class="title-text">
            交控稽核大数据分析看板
          </h1>
          <!-- <div class="title-line-r" /> -->
        </div>
        <div class="header-actions">
          <button class="icon-btn" @click="toggleFullscreen">
            <svg v-if="!isFullscreen" viewBox="0 0 24 24" class="hw-5" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
            </svg>
            <svg v-else viewBox="0 0 24 24" class="hw-5" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
            </svg>
          </button>
        </div>
        <div class="header-line" />
      </header>

      <!-- ═══════════ 主内容：左 | 中 | 右 三列 ═══════════ -->
      <div class="main-grid">
        <!-- 左列：上（饼图）/ 下（两个横向柱状图） -->
        <div class="left-col">
          <!-- 左上：分公司本月成果占比 -->
          <div class="panel border h-340px">
            <div class="panel-hd panel-title bg">
              <img class="p-icon" src="/assets/icons/arrow-icon.png" alt=""><span class="p-title">分公司本月成果占比</span>
            </div>
            <div ref="leftPieChartRef" class="chart-fill" />
          </div>
          <!-- 左下：两个横向柱状图 -->
          <div class="left-bottom panel border">
            <!-- 金额排名 -->
            <div class="panel">
              <div class="panel-hd panel-title bg">
                <img class="p-icon" src="/assets/icons/arrow-icon.png" alt=""><span class="p-title">本月成果金额排名top10</span>
              </div>
              <div ref="amountRankChartRef" class="chart-fill" />
            </div>
            <!-- 数量排名 -->
            <div class="panel">
              <div class="panel-hd">
                <img class="p-icon" src="/assets/icons/arrow-icon.png" alt=""><span class="p-title">本月成果数量排名top10</span>
              </div>
              <div ref="quantityRankChartRef" class="chart-fill" />
            </div>
          </div>
        </div>

        <!-- 中列：上：统计卡片 2行3列 | 中：在途设备心跳监测（表格） | 下：分公司数量占比 | 成果金额占比 -->
        <div class="center-col">
          <!-- 中上：统计卡片 2×3 -->
          <div class="stat-grid">
            <div v-for="(card, i) in stats" :key="i" class="stat-card">
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

          <!-- 中中：在途设备心跳监测 -->
          <div class="panel" style="flex: 1;">
            <div class="panel-hd">
              <img class="p-icon" src="/assets/icons/arrow-icon.png" alt=""><span class="p-title">在途设备心跳监测</span>
            </div>
            <div class="table-wrap">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>IP</th>
                    <th>系统CPU负载百分比</th>
                    <th>总物理内存大小</th>
                    <th>磁盘可用空间</th>
                    <th>物理内存使用率百分比</th>
                    <th>更新时间</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, i) in devices" :key="i">
                    <td>{{ row.ip }}</td>
                    <td>{{ row.cpu }}</td>
                    <td>{{ row.memory }}</td>
                    <td>{{ row.disk }}</td>
                    <td>
                      <div class="prog-row">
                        <div class="prog-bar">
                          <div
                            class="prog-fill"
                            :style="{ '--width': `${row.usage}%` }"
                          />
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

          <!-- 中下：两个饼图左右并排 -->
          <div class="center-bottom border">
            <div class="panel">
              <div class="panel-hd">
                <img class="p-icon" src="/assets/icons/arrow-icon.png" alt=""><span class="p-title">分公司本月成果数量占比</span>
              </div>
              <div ref="centerPieChartRef" class="chart-fill" />
            </div>
            <div class="panel">
              <div class="panel-hd">
                <img class="p-icon" src="/assets/icons/arrow-icon.png" alt=""><span class="p-title">成果金额占比</span>
              </div>
              <div ref="centerRingChartRef" class="chart-fill" />
            </div>
          </div>
        </div>

        <!-- 右列：上（占 ~62%）：车型占比 + 数量趋势（上下） | 下（占 ~38%）：金额变化柱状图 -->
        <div class="right-col">
          <!-- 右上：两个图表上下排列 -->
          <div class="right-top panel border">
            <!-- 车型占比 -->
            <div class="panel">
              <div class="panel-hd panel-title bg">
                <img class="p-icon" src="/assets/icons/arrow-icon.png" alt=""><span class="p-title">车型占比</span>
              </div>
              <div ref="vehiclePieChartRef" class="chart-fill" />
            </div>
            <!-- 在途成果数量本月趋势 -->
            <div class="panel">
              <div class="panel-hd">
                <img class="p-icon" src="/assets/icons/arrow-icon.png" alt=""><span class="p-title">在途成果数量本月趋势</span>
              </div>
              <div ref="trendLineChartRef" class="chart-fill" />
            </div>
          </div>
          <!-- 右下：在途成果金额本月变化 -->
          <div class="panel border" style="flex: 0 0 36%;">
            <div class="panel-hd panel-title bg">
              <img class="p-icon" src="/assets/icons/arrow-icon.png" alt=""><span class="p-title">在途成果金额本月变化</span>
            </div>
            <div ref="amountBarChartRef" class="chart-fill" />
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

/* ══════════════ Header ══════════════ */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px 0;
  margin-bottom: 10px;
  position: relative;
  flex-shrink: 0;
}

.header-time {
  min-width: 200px;
}

.time-big {
  font-size: 28px;
  font-weight: bold;
  font-family: monospace;
  color: #00f0ff;
  text-shadow: 0 0 20px rgba(0, 240, 255, 0.5);
  line-height: 1.1;
}

.time-date {
  font-size: 12px;
  color: #fff;
  margin-top: 3px;
}

.header-title {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background-image: url('/assets/images/page2_title_bg.png');
  background-position: center bottom;
  background-repeat: no-repeat;
  height: 70px;
}

.title-line-l {
  width: 120px;
  height: 1px;
  background: linear-gradient(90deg, transparent, #00f0ff);
}
.title-line-r {
  width: 120px;
  height: 1px;
  background: linear-gradient(90deg, #00f0ff, transparent);
}

.title-text {
  font-size: 34px;
  color: #ebf9ff;
  letter-spacing: 6px;
  font-weight: bold;
  white-space: nowrap;
  text-shadow: 0px 2px 6px rgba(0, 190, 231, 1);
  line-height: 45px;
}

.header-actions {
  min-width: 200px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.icon-btn {
  background: transparent;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 4px;
  transition: color 0.3s;
}
.icon-btn:hover {
  color: #00f0ff;
}

.hw-5 {
  width: 20px;
  height: 20px;
}

.header-line {
  position: absolute;
  bottom: 0;
  left: 5%;
  right: 5%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 240, 255, 0.5), transparent);
}

/* ══════════════ 主内容三列网格 ══════════════ */
.main-grid {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1.52fr 1fr;
  gap: 8px;
  min-height: 0;
}

/* ══════════════ 左列 ══════════════ */
.left-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 0;
}

/* 左列下半：两个横向柱状图上下排 */
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

/* ══════════════ 中列 ══════════════ */
.center-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 0;
}

/* 中上：统计卡片 2行×3列 */
.stat-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 8px;
  flex-shrink: 0;
  height: 28%;
}

/* 中下：两个饼图 */
.center-bottom {
  flex: 0 0 34%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  min-height: 0;
  flex-direction: row;
}
.center-bottom.border {
  border-radius: 10px;
  background: radial-gradient(0.5% 0.675% at 50% 50%, rgba(8, 53, 108, 0) 0%, rgba(0, 58, 140, 0.7) 100%);
  border: 1px solid rgba(56, 200, 255, 1);
}

.center-bottom .panel {
  min-height: 0;
}

/* ══════════════ 右列 ══════════════ */
.right-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 0;
}

/* 右上：两个图（车型+趋势）上下排 */
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

/* ══════════════ 通用面板 ══════════════ */
.panel {
  position: relative;
  /* background: linear-gradient(135deg, rgba(0, 28, 68, 0.72), rgba(4, 12, 36, 0.82)); */
  /* border: 1px solid rgba(0, 240, 255, 0.28); */
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

/* 面板标题行 */
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

/* 图表填充区 */
.chart-fill {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

/* ══════════════ 统计卡片 ══════════════ */
.stat-card {
  position: relative;
  overflow: hidden;
}

.stat-inner {
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
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
  font-size: 16px;
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
  padding: 6px 20px;
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

/* 进度条 */
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
  animation: prog-fill 1s ease-out forwards;
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
