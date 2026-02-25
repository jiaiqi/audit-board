<script
  setup
  lang="ts"
>
import type { EChartsOption } from 'echarts'
import * as echarts from 'echarts'

definePageMeta({
  layout: 'audit',
})

const currentTime = ref('')

function updateTime() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  currentTime.value = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

useIntervalFn(updateTime, 1000)
onMounted(updateTime)

// 全屏功能
const { isFullscreen, toggle: toggleFullscreen } = useFullscreen()

// 屏幕自适应缩放
const { screenRef } = useScreenScale({ width: 1920, height: 1080 })

const commonOption: EChartsOption = {
  backgroundColor: 'transparent',
  textStyle: {
    fontFamily: 'Microsoft YaHei, sans-serif',
  },
}

const barChartRef = ref<HTMLElement>()
let barChart: echarts.ECharts | null = null
const barOption: EChartsOption = {
  ...commonOption,
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(11, 17, 26, 0.9)',
    borderColor: '#00f0ff',
    textStyle: { color: '#fff' },
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: '10%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    data: [
      '公司简称一',
      '公司简称二',
      '公司简称三',
      '公司简称四',
      '公司简称五',
      '公司简称六',
      '公司简称七',
      '公司简称八',
      '公司简称九',
      '公司简称十',
    ],
    axisLine: { lineStyle: { color: 'rgba(0, 240, 255, 0.3)' } },
    axisLabel: { color: '#a6b9c8', fontSize: 10, interval: 0, rotate: 30 },
    axisTick: { show: false },
  },
  yAxis: {
    type: 'value',
    name: '',
    nameTextStyle: { color: '#a6b9c8' },
    axisLine: { show: false },
    axisLabel: {
      color: '#a6b9c8',
      formatter: (value: number) => `${value}万元`,
    },
    splitLine: { lineStyle: { color: 'rgba(0, 240, 255, 0.1)' } },
  },
  series: [
    {
      name: '追缴金额',
      type: 'bar',
      data: [1860, 1620, 1480, 1350, 1200, 1080, 950, 820, 680, 520],
      barWidth: '50%',
      itemStyle: {
        borderRadius: [4, 4, 0, 0],
        color: (params: { dataIndex: number }) => {
          // 蓝/橙交替颜色
          const colors = [
            new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#00f0ff' },
              { offset: 1, color: 'rgba(0, 240, 255, 0.3)' },
            ]),
            new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#ff9f00' },
              { offset: 1, color: 'rgba(255, 159, 0, 0.3)' },
            ]),
          ]
          return colors[params.dataIndex % 2] as echarts.graphic.LinearGradient
        },
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 240, 255, 0.5)',
        },
      },
    },
  ],
}

const lineChartRef = ref<HTMLElement>()
let lineChart: echarts.ECharts | null = null
const lineOption: EChartsOption = {
  ...commonOption,
  legend: {
    data: ['追缴金额'],
    textStyle: { color: '#a6b9c8' },
    top: 5,
    right: 'center',
    icon: 'circle',
    itemWidth: 8,
    itemHeight: 8,
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(11, 17, 26, 0.9)',
    borderColor: '#ff9f00',
    textStyle: { color: '#fff' },
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: '15%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    axisLine: { lineStyle: { color: 'rgba(255, 159, 0, 0.3)' } },
    axisLabel: { color: '#a6b9c8' },
    axisTick: { show: false },
  },
  yAxis: {
    type: 'value',
    name: '金额(万元)',
    nameTextStyle: { color: '#a6b9c8' },
    axisLine: { show: false },
    axisLabel: { color: '#a6b9c8' },
    splitLine: { lineStyle: { color: 'rgba(255, 159, 0, 0.1)' } },
  },
  series: [
    {
      name: '追缴金额',
      type: 'line',
      smooth: true,
      data: [120, 200, 180, 160, 80, 60, 90, 100, 120, 130, 140, 150],
      lineStyle: {
        color: '#ff9f00',
        width: 3,
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(255, 159, 0, 0.5)' },
          { offset: 1, color: 'rgba(255, 159, 0, 0.05)' },
        ]),
      },
      itemStyle: {
        color: '#ff9f00',
      },
      symbol: 'circle',
      symbolSize: 8,
    },
  ],
}

const pieChartRef = ref<HTMLElement>()
let pieChart: echarts.ECharts | null = null
const pieOption: EChartsOption = {
  ...commonOption,
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(11, 17, 26, 0.9)',
    borderColor: '#00f0ff',
    textStyle: { color: '#fff' },
    formatter: '{b}: {c} ({d}%)',
  },
  legend: {
    show: false,
  },
  series: [
    {
      name: '特殊车型',
      roseType: 'area',
      type: 'pie',
      radius: ['20%', '70%'],
      center: ['50%', '50%'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 2,
        borderWidth: 2,
      },
      label: {
        show: true,
        position: 'outside',
        color: '#a6b9c8',
        formatter: '{b}: {c}',
      },
      labelLine: {
        lineStyle: { color: 'rgba(0, 240, 255, 0.3)' },
      },
      emphasis: {
        label: {
          fontSize: 14,
          fontWeight: 'bold',
        },
      },
      data: [
        { value: 40, name: '类型一', itemStyle: { color: '#ff9f00' } },
        { value: 32, name: '类型二', itemStyle: { color: '#00e676' } },
        { value: 18, name: '类型三', itemStyle: { color: '#2979ff' } },
        { value: 23, name: '类型四', itemStyle: { color: '#00f0ff' } },
      ],
    },
  ],
}

// 环形进度条
const ringChartRef = ref<HTMLElement>()
let ringChart: echarts.ECharts | null = null
const ringOption: EChartsOption = {
  series: [
    {
      type: 'pie',
      radius: ['70%', '85%'],
      center: ['50%', '50%'],
      silent: true,
      label: { show: false },
      data: [
        {
          value: 20,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: '#00f0ff' },
              { offset: 1, color: '#48F7F7' },
            ]),
          },
        },
        {
          value: 80,
          itemStyle: { color: 'rgba(0, 240, 255, 0.1)' },
        },
      ],
    },
  ],
}

// 趋势折线图
const trendLineChartRef = ref<HTMLElement>()
let trendLineChart: echarts.ECharts | null = null
const trendLineOption: EChartsOption = {
  ...commonOption,
  grid: {
    left: '10%',
    right: '5%',
    bottom: '15%',
    top: '15%',
  },
  xAxis: {
    type: 'category',
    data: ['12-01', '12-02', '12-03', '12-04', '12-05', '12-06', '12-07', '12-08', '12-09', '12-10', '12-11', '12-12'],
    axisLine: { lineStyle: { color: 'rgba(0, 240, 255, 0.3)' } },
    axisLabel: { color: '#a6b9c8', fontSize: 9 },
    axisTick: { show: false },
  },
  yAxis: {
    type: 'value',
    axisLine: { show: false },
    axisLabel: { color: '#a6b9c8', fontSize: 9 },
    splitLine: { lineStyle: { color: 'rgba(0, 240, 255, 0.1)' } },
  },
  series: [
    {
      type: 'line',
      smooth: true,
      data: [180, 200, 150, 220, 160, 190, 210, 170, 200, 230, 180, 160],
      lineStyle: { color: '#00f0ff', width: 2 },
      itemStyle: { color: '#00f0ff' },
      symbol: 'circle',
      symbolSize: 4,
    },
    {
      type: 'line',
      smooth: true,
      data: [120, 150, 130, 170, 140, 160, 150, 130, 160, 180, 140, 120],
      lineStyle: { color: '#ff9f00', width: 2 },
      itemStyle: { color: '#ff9f00' },
      symbol: 'circle',
      symbolSize: 4,
    },
    {
      type: 'line',
      smooth: true,
      data: [80, 100, 90, 120, 100, 110, 130, 90, 110, 140, 100, 80],
      lineStyle: { color: '#00e676', width: 2 },
      itemStyle: { color: '#00e676' },
      symbol: 'circle',
      symbolSize: 4,
    },
  ],
}

const groupBarChartRef = ref<HTMLElement>()
let groupBarChart: echarts.ECharts | null = null
const groupBarOption: EChartsOption = {
  ...commonOption,
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(11, 17, 26, 0.9)',
    borderColor: '#00f0ff',
    textStyle: { color: '#fff' },
    axisPointer: {
      type: 'shadow',
    },
  },
  legend: {
    data: ['发起工单', '处理工单', '追缴工单'],
    textStyle: { color: '#a6b9c8' },
    top: 0,
    right: 'center',
    itemWidth: 12,
    itemHeight: 12,
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: '15%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    axisLine: { lineStyle: { color: 'rgba(0, 240, 255, 0.3)' } },
    axisLabel: { color: '#a6b9c8' },
    axisTick: { show: false },
  },
  yAxis: {
    type: 'value',
    name: '工单数',
    nameTextStyle: { color: '#a6b9c8' },
    axisLine: { show: false },
    axisLabel: { color: '#a6b9c8' },
    splitLine: { lineStyle: { color: 'rgba(0, 240, 255, 0.1)' } },
  },
  series: [
    {
      name: '发起工单',
      type: 'bar',
      data: [120, 180, 150, 200, 160, 140, 170, 190, 210, 180, 160, 200],
      itemStyle: { color: '#2979ff', borderRadius: [4, 4, 0, 0] },
    },
    {
      name: '处理工单',
      type: 'bar',
      data: [100, 150, 130, 170, 140, 120, 150, 160, 180, 150, 140, 170],
      itemStyle: { color: '#ff9f00', borderRadius: [4, 4, 0, 0] },
    },
    {
      name: '追缴工单',
      type: 'bar',
      data: [80, 120, 110, 140, 120, 100, 130, 140, 150, 130, 120, 150],
      itemStyle: { color: '#00e676', borderRadius: [4, 4, 0, 0] },
    },
  ],
}

function initCharts() {
  if (barChartRef.value) {
    barChart = echarts.init(barChartRef.value)
    barChart.setOption(barOption)
  }
  if (lineChartRef.value) {
    lineChart = echarts.init(lineChartRef.value)
    lineChart.setOption(lineOption)
  }
  if (pieChartRef.value) {
    pieChart = echarts.init(pieChartRef.value)
    pieChart.setOption(pieOption)
  }
  if (ringChartRef.value) {
    ringChart = echarts.init(ringChartRef.value)
    ringChart.setOption(ringOption)
  }
  if (trendLineChartRef.value) {
    trendLineChart = echarts.init(trendLineChartRef.value)
    trendLineChart.setOption(trendLineOption)
  }
  if (groupBarChartRef.value) {
    groupBarChart = echarts.init(groupBarChartRef.value)
    groupBarChart.setOption(groupBarOption)
  }
}

function handleResize() {
  barChart?.resize()
  lineChart?.resize()
  pieChart?.resize()
  ringChart?.resize()
  trendLineChart?.resize()
  groupBarChart?.resize()
}

onMounted(() => {
  nextTick(() => {
    initCharts()
    useEventListener(window, 'resize', handleResize)
  })
})

onBeforeUnmount(() => {
  barChart?.dispose()
  lineChart?.dispose()
  pieChart?.dispose()
  ringChart?.dispose()
  trendLineChart?.dispose()
  groupBarChart?.dispose()
})

useHead({
  title: '交控稽核大数据分析看板',
})
</script>

<template>
  <div
    class="bg-[#0b111a] bg-[url('/assets/images/bg01.jpg')] h-screen w-screen overflow-hidden bg-size-[100%_100%] bg-center"
  >
    <div
      ref="screenRef"
      class="text-white px-5 flex flex-col h-full w-full relative overflow-hidden"
      style="transform-origin: left top;"
    >
      <header class="mb-5 px-8 py-3 flex items-center justify-between relative">
        <!-- 左侧时间 -->
        <div class="text-lg font-mono min-w-[180px]">
          {{ currentTime }}
        </div>
        <!-- 中间标题 -->
        <div class="text-center flex-1 relative">
          <h1
            class="text-2xl text-[#EBF9FF] tracking-[8px] font-bold inline-block relative"
            style="text-shadow:0px 2px 6px rgba(0,190,231,1);"
          >
            交控稽核大数据分析看板
          </h1>
        </div>
        <!-- 右侧按钮 -->
        <div class="flex gap-4 min-w-[180px] items-center justify-end">
          <button
            class="text-[#a6b9c8] cursor-pointer transition-colors hover:text-[#00f0ff]"
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
        <div class="mb-4 gap-5 grid grid-cols-4">
          <div
            class="top-block h-180px transition-all duration-300 relative overflow-hidden hover:shadow-[0_0_30px_rgba(0,240,255,0.2)] hover:translate-y-[-2px]"
          >
            <div class="px-10 py-5 flex h-full items-center justify-between">
              <div class="flex flex-col">
                <div class="top-block-title text-sm flex gap-2 items-center">
                  本月发起工单
                </div>
                <div class="text-[48px] text-#FFCD84 font-bold">
                  124
                </div>
              </div>
              <img
                src="/assets/icons/01.png"
                alt=""
                class="top-block-icon"
              >
            </div>
          </div>

          <div
            class="top-block h-180px transition-all duration-300 relative overflow-hidden hover:shadow-[0_0_30px_rgba(0,240,255,0.2)] hover:translate-y-[-2px]"
          >
            <div class="px-10 py-5 flex h-full items-center justify-between">
              <div class="flex flex-col">
                <div class="top-block-title text-sm flex gap-2 items-center">
                  本月追缴工单
                </div>
                <div class="text-[48px] text-#FFCD84 font-bold">
                  623
                </div>
              </div>
              <img
                src="/assets/icons/02.png"
                alt=""
                class="top-block-icon"
              >
            </div>
          </div>

          <div
            class="top-block h-180px transition-all duration-300 relative overflow-hidden hover:shadow-[0_0_30px_rgba(0,240,255,0.2)] hover:translate-y-[-2px]"
          >
            <div class="px-10 py-5 flex h-full items-center justify-between">
              <div class="flex flex-col">
                <div class="top-block-title text-sm flex gap-2 items-center">
                  本月追缴金额
                </div>
                <div class="text-[48px] text-#FFCD84 font-bold">
                  40.17
                  <span class="text-base ml-1">万</span>
                </div>
              </div>
              <img
                src="/assets/icons/03.png"
                alt=""
                class="top-block-icon"
              >
            </div>
          </div>

          <div
            class="top-block h-180px transition-all duration-300 relative overflow-hidden hover:shadow-[0_0_30px_rgba(0,240,255,0.2)] hover:translate-y-[-2px]"
          >
            <div class="px-10 py-5 flex h-full items-center justify-between">
              <div class="flex flex-col">
                <div class="top-block-title text-sm flex gap-2 items-center">
                  上月追缴金额
                </div>
                <div class="text-[48px] text-#FFCD84 font-bold">
                  62.23
                  <span class="text-base text-[#a6b9c8] ml-1">万</span>
                </div>
              </div>
              <img
                src="/assets/icons/04.png"
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
              <div class="text-base text-white font-bold mt--28px">
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
              <div class="text-base text-white font-bold mt--28px">
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
              <div class="text-base text-white font-bold mt--28px">
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
                <div class="text-base text-white font-bold mt--28px">
                  指标
                </div>
              </div>
              <!-- 上半部分：大数字 + 环形进度条 -->
              <div class="flex flex-1 items-center justify-between">
                <div class="pt-18px flex gap-30px">
                  <img src="/assets/icons/05.png" alt="">
                  <div>
                    <div class="text-lg text-white font-bold mb-20px">
                      本月处理工单
                    </div>
                    <div
                      class="text-[48px] text-[#FFCD84] leading-none font-bold"
                    >
                      6236
                    </div>
                  </div>
                </div>
                <div class="h-[130px] w-[130px] relative">
                  <div
                    ref="ringChartRef"
                    class="h-full w-full"
                  />
                  <div class="flex flex-col items-center inset-0 justify-center absolute">
                    <span
                      class="text-xl text-white font-bold"
                    >20%</span>
                    <span class="text-[10px]">处理率</span>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="center-block border border-[rgba(0,240,255,0.3)] flex flex-1 flex-col relative"
            >
              <div class="center-block-title">
                <span class="i-ri:radio-button-line text-#6ADEFE ml--20px mr-14px inline-block" />
                <div class="text-base text-white font-bold">
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
              <div class="text-base text-white font-bold mt--28px">
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

.center-block-title {
  background-size: 100% 100%;
  height: 39px;
  display: flex;
  align-items: center;
  padding-left: 34px;
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
</style>
