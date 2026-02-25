<script setup lang="ts">
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

definePageMeta({
  layout: 'audit',
})

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

const commonOption: EChartsOption = {
  backgroundColor: 'transparent',
  textStyle: {
    fontFamily: 'Microsoft YaHei, sans-serif',
  },
}

const leftPieChartRef = ref<HTMLElement>()
let leftPieChart: echarts.ECharts | null = null
const leftPieOption: EChartsOption = {
  ...commonOption,
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(11, 17, 26, 0.9)',
    borderColor: '#00f0ff',
    textStyle: { color: '#fff' },
    formatter: '{b}: {c} ({d}%)',
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    top: 'center',
    textStyle: { color: '#a6b9c8', fontSize: 11 },
    itemWidth: 10,
    itemHeight: 10,
  },
  series: [
    {
      name: '分公司占比',
      type: 'pie',
      radius: ['45%', '70%'],
      center: ['65%', '50%'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 4,
        borderColor: '#0b111a',
        borderWidth: 2,
      },
      label: {
        show: true,
        position: 'outside',
        color: '#a6b9c8',
        fontSize: 10,
        formatter: '{b}\n{d}%',
      },
      labelLine: {
        lineStyle: { color: 'rgba(0, 240, 255, 0.3)' },
      },
      data: [
        { value: 50, name: '西藏分公司', itemStyle: { color: '#2979ff' } },
        { value: 30, name: '西安分公司', itemStyle: { color: '#00e676' } },
        { value: 20, name: '榆林分公司', itemStyle: { color: '#ff9f00' } },
      ],
    },
  ],
}

const amountRankChartRef = ref<HTMLElement>()
let amountRankChart: echarts.ECharts | null = null
const amountRankOption: EChartsOption = {
  ...commonOption,
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(11, 17, 26, 0.9)',
    borderColor: '#00f0ff',
    textStyle: { color: '#fff' },
    formatter: '{b}: {c}元',
  },
  legend: {
    data: ['成果金额'],
    textStyle: { color: '#a6b9c8', fontSize: 10 },
    top: 0,
    right: 10,
    itemWidth: 12,
    itemHeight: 8,
  },
  grid: {
    left: '3%',
    right: '8%',
    bottom: '3%',
    top: '15%',
    containLabel: true,
  },
  xAxis: {
    type: 'value',
    axisLine: { show: false },
    axisLabel: { color: '#a6b9c8', fontSize: 10 },
    splitLine: { lineStyle: { color: 'rgba(0, 240, 255, 0.1)' } },
  },
  yAxis: {
    type: 'category',
    data: ['陕西曲江收费站', '陕西新筑收费站', '陕西阿房宫收费站', '陕西西铜收费站', '陕西咸阳东收费站', '陕西灞桥收费站', '陕西临潼收费站', '陕西泾阳收费站', '陕西三原收费站', '陕西高陵收费站'],
    axisLine: { lineStyle: { color: 'rgba(0, 240, 255, 0.3)' } },
    axisLabel: { color: '#a6b9c8', fontSize: 9 },
    axisTick: { show: false },
  },
  series: [
    {
      name: '成果金额',
      type: 'bar',
      data: [255, 350, 247, 442, 361, 110, 150, 163, 200, 180],
      barWidth: '60%',
      itemStyle: {
        color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
          { offset: 0, color: '#00f0ff' },
          { offset: 1, color: 'rgba(0, 240, 255, 0.3)' },
        ]),
        borderRadius: [0, 4, 4, 0],
      },
      label: {
        show: true,
        position: 'right',
        color: '#fff',
        fontSize: 9,
        formatter: '{c}元',
      },
    },
  ],
}

const quantityRankChartRef = ref<HTMLElement>()
let quantityRankChart: echarts.ECharts | null = null
const quantityRankOption: EChartsOption = {
  ...commonOption,
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(11, 17, 26, 0.9)',
    borderColor: '#00f0ff',
    textStyle: { color: '#fff' },
  },
  legend: {
    data: ['成果数量'],
    textStyle: { color: '#a6b9c8', fontSize: 10 },
    top: 0,
    right: 10,
    itemWidth: 12,
    itemHeight: 8,
  },
  grid: {
    left: '3%',
    right: '8%',
    bottom: '3%',
    top: '15%',
    containLabel: true,
  },
  xAxis: {
    type: 'value',
    axisLine: { show: false },
    axisLabel: { color: '#a6b9c8', fontSize: 10 },
    splitLine: { lineStyle: { color: 'rgba(0, 240, 255, 0.1)' } },
  },
  yAxis: {
    type: 'category',
    data: ['陕西曲江收费站', '陕西新筑收费站', '陕西阿房宫收费站', '陕西西铜收费站', '陕西咸阳东收费站', '陕西灞桥收费站', '陕西临潼收费站', '陕西泾阳收费站', '陕西三原收费站', '陕西高陵收费站'],
    axisLine: { lineStyle: { color: 'rgba(0, 240, 255, 0.3)' } },
    axisLabel: { color: '#a6b9c8', fontSize: 9 },
    axisTick: { show: false },
  },
  series: [
    {
      name: '成果数量',
      type: 'bar',
      data: [442, 361, 255, 350, 247, 110, 150, 163, 200, 180],
      barWidth: '60%',
      itemStyle: {
        color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
          { offset: 0, color: '#2979ff' },
          { offset: 1, color: 'rgba(41, 121, 255, 0.3)' },
        ]),
        borderRadius: [0, 4, 4, 0],
      },
      label: {
        show: true,
        position: 'right',
        color: '#fff',
        fontSize: 9,
        formatter: '{c}',
      },
    },
  ],
}

const centerPieChartRef = ref<HTMLElement>()
let centerPieChart: echarts.ECharts | null = null
const centerPieOption: EChartsOption = {
  ...commonOption,
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(11, 17, 26, 0.9)',
    borderColor: '#00f0ff',
    textStyle: { color: '#fff' },
    formatter: '{b}: {c} ({d}%)',
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    top: 'center',
    textStyle: { color: '#a6b9c8', fontSize: 10 },
    itemWidth: 10,
    itemHeight: 10,
  },
  series: [
    {
      name: '数量占比',
      type: 'pie',
      radius: ['40%', '65%'],
      center: ['60%', '50%'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 4,
        borderColor: '#0b111a',
        borderWidth: 2,
      },
      label: {
        show: true,
        position: 'outside',
        color: '#a6b9c8',
        fontSize: 10,
        formatter: '{b}\n{d}%',
      },
      labelLine: {
        lineStyle: { color: 'rgba(0, 240, 255, 0.3)' },
      },
      data: [
        { value: 50, name: '西藏分公司', itemStyle: { color: '#2979ff' } },
        { value: 30, name: '西安分公司', itemStyle: { color: '#00e676' } },
        { value: 20, name: '榆林分公司', itemStyle: { color: '#ff9f00' } },
      ],
    },
  ],
}

const centerRingChartRef = ref<HTMLElement>()
let centerRingChart: echarts.ECharts | null = null
const centerRingOption: EChartsOption = {
  ...commonOption,
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(11, 17, 26, 0.9)',
    borderColor: '#00f0ff',
    textStyle: { color: '#fff' },
    formatter: '{b}: {c} ({d}%)',
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    top: 'center',
    textStyle: { color: '#a6b9c8', fontSize: 10 },
    itemWidth: 10,
    itemHeight: 10,
  },
  series: [
    {
      name: '金额占比',
      type: 'pie',
      radius: ['50%', '75%'],
      center: ['60%', '50%'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 4,
        borderColor: '#0b111a',
        borderWidth: 2,
      },
      label: {
        show: true,
        position: 'outside',
        color: '#a6b9c8',
        fontSize: 10,
        formatter: '{b}\n{d}%',
      },
      labelLine: {
        lineStyle: { color: 'rgba(0, 240, 255, 0.3)' },
      },
      data: [
        { value: 60, name: '推送金额', itemStyle: { color: '#00e676' } },
        { value: 40, name: '成果金额', itemStyle: { color: '#ff9f00' } },
      ],
    },
  ],
}

const vehiclePieChartRef = ref<HTMLElement>()
let vehiclePieChart: echarts.ECharts | null = null
const vehiclePieOption: EChartsOption = {
  ...commonOption,
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(11, 17, 26, 0.9)',
    borderColor: '#00f0ff',
    textStyle: { color: '#fff' },
    formatter: '{b}: {c} ({d}%)',
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    top: 'center',
    textStyle: { color: '#a6b9c8', fontSize: 10 },
    itemWidth: 10,
    itemHeight: 10,
  },
  series: [
    {
      name: '车型占比',
      type: 'pie',
      radius: ['40%', '65%'],
      center: ['60%', '50%'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 4,
        borderColor: '#0b111a',
        borderWidth: 2,
      },
      label: {
        show: true,
        position: 'outside',
        color: '#a6b9c8',
        fontSize: 10,
        formatter: '{b}\n{d}%',
      },
      labelLine: {
        lineStyle: { color: 'rgba(0, 240, 255, 0.3)' },
      },
      data: [
        { value: 40, name: '一类', itemStyle: { color: '#2979ff' } },
        { value: 32, name: '二类', itemStyle: { color: '#00e676' } },
        { value: 18, name: '三类', itemStyle: { color: '#ff9f00' } },
        { value: 10, name: '四类', itemStyle: { color: '#00f0ff' } },
      ],
    },
  ],
}

const trendLineChartRef = ref<HTMLElement>()
let trendLineChart: echarts.ECharts | null = null
const trendLineOption: EChartsOption = {
  ...commonOption,
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(11, 17, 26, 0.9)',
    borderColor: '#00f0ff',
    textStyle: { color: '#fff' },
  },
  legend: {
    data: ['数量'],
    textStyle: { color: '#a6b9c8', fontSize: 10 },
    top: 0,
    right: 10,
    itemWidth: 12,
    itemHeight: 8,
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: '20%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['12-01', '12-02', '12-03', '12-04', '12-05', '12-06', '12-07', '12-08', '12-09', '12-10'],
    axisLine: { lineStyle: { color: 'rgba(0, 240, 255, 0.3)' } },
    axisLabel: { color: '#a6b9c8', fontSize: 9 },
    axisTick: { show: false },
  },
  yAxis: {
    type: 'value',
    axisLine: { show: false },
    axisLabel: { color: '#a6b9c8', fontSize: 10 },
    splitLine: { lineStyle: { color: 'rgba(0, 240, 255, 0.1)' } },
  },
  series: [
    {
      name: '数量',
      type: 'line',
      smooth: true,
      data: [220, 200, 180, 160, 140, 120, 160, 180, 170, 200],
      lineStyle: {
        color: '#00f0ff',
        width: 2,
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(0, 240, 255, 0.3)' },
          { offset: 1, color: 'rgba(0, 240, 255, 0.05)' },
        ]),
      },
      itemStyle: {
        color: '#00f0ff',
      },
      symbol: 'circle',
      symbolSize: 6,
    },
  ],
}

const amountBarChartRef = ref<HTMLElement>()
let amountBarChart: echarts.ECharts | null = null
const amountBarOption: EChartsOption = {
  ...commonOption,
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(11, 17, 26, 0.9)',
    borderColor: '#00f0ff',
    textStyle: { color: '#fff' },
  },
  legend: {
    data: ['金额'],
    textStyle: { color: '#a6b9c8', fontSize: 10 },
    top: 0,
    right: 10,
    itemWidth: 12,
    itemHeight: 8,
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: '20%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    data: ['12-01', '12-02', '12-03', '12-04', '12-05', '12-06', '12-07', '12-08', '12-09', '12-10'],
    axisLine: { lineStyle: { color: 'rgba(0, 240, 255, 0.3)' } },
    axisLabel: { color: '#a6b9c8', fontSize: 9 },
    axisTick: { show: false },
  },
  yAxis: {
    type: 'value',
    axisLine: { show: false },
    axisLabel: { color: '#a6b9c8', fontSize: 10 },
    splitLine: { lineStyle: { color: 'rgba(0, 240, 255, 0.1)' } },
  },
  series: [
    {
      name: '金额',
      type: 'bar',
      data: [120, 150, 130, 110, 140, 180, 160, 140, 190, 130],
      barWidth: '50%',
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#ff9f00' },
          { offset: 1, color: 'rgba(255, 159, 0, 0.3)' },
        ]),
        borderRadius: [4, 4, 0, 0],
      },
    },
  ],
}

const deviceData = ref([
  { ip: '10.61.13.170', cpu: '0.83%', memory: '15.6G', disk: '862.5G', usage: 70, time: '23-03-31 10:17' },
  { ip: '10.61.13.170', cpu: '0.83%', memory: '15.6G', disk: '862.5G', usage: 90, time: '23-03-31 10:17' },
  { ip: '10.61.13.170', cpu: '0.83%', memory: '15.6G', disk: '862.5G', usage: 70, time: '23-03-31 10:17' },
  { ip: '10.61.13.170', cpu: '0.83%', memory: '15.6G', disk: '862.5G', usage: 40, time: '23-03-31 10:17' },
  { ip: '10.61.13.170', cpu: '0.83%', memory: '15.6G', disk: '862.5G', usage: 70, time: '23-03-31 10:17' },
  { ip: '10.61.13.170', cpu: '0.83%', memory: '15.6G', disk: '862.5G', usage: 70, time: '23-03-31 10:17' },
])

function initCharts() {
  if (leftPieChartRef.value) {
    leftPieChart = echarts.init(leftPieChartRef.value)
    leftPieChart.setOption(leftPieOption)
  }
  if (amountRankChartRef.value) {
    amountRankChart = echarts.init(amountRankChartRef.value)
    amountRankChart.setOption(amountRankOption)
  }
  if (quantityRankChartRef.value) {
    quantityRankChart = echarts.init(quantityRankChartRef.value)
    quantityRankChart.setOption(quantityRankOption)
  }
  if (centerPieChartRef.value) {
    centerPieChart = echarts.init(centerPieChartRef.value)
    centerPieChart.setOption(centerPieOption)
  }
  if (centerRingChartRef.value) {
    centerRingChart = echarts.init(centerRingChartRef.value)
    centerRingChart.setOption(centerRingOption)
  }
  if (vehiclePieChartRef.value) {
    vehiclePieChart = echarts.init(vehiclePieChartRef.value)
    vehiclePieChart.setOption(vehiclePieOption)
  }
  if (trendLineChartRef.value) {
    trendLineChart = echarts.init(trendLineChartRef.value)
    trendLineChart.setOption(trendLineOption)
  }
  if (amountBarChartRef.value) {
    amountBarChart = echarts.init(amountBarChartRef.value)
    amountBarChart.setOption(amountBarOption)
  }
}

function handleResize() {
  leftPieChart?.resize()
  amountRankChart?.resize()
  quantityRankChart?.resize()
  centerPieChart?.resize()
  centerRingChart?.resize()
  vehiclePieChart?.resize()
  trendLineChart?.resize()
  amountBarChart?.resize()
}

onMounted(() => {
  nextTick(() => {
    initCharts()
    useEventListener(window, 'resize', handleResize)
  })
})

onBeforeUnmount(() => {
  leftPieChart?.dispose()
  amountRankChart?.dispose()
  quantityRankChart?.dispose()
  centerPieChart?.dispose()
  centerRingChart?.dispose()
  vehiclePieChart?.dispose()
  trendLineChart?.dispose()
  amountBarChart?.dispose()
})

useHead({
  title: '交控稽核大数据分析看板',
})
</script>

<template>
  <div class="min-h-screen bg-[#0a1628] text-white overflow-hidden relative">
    <div class="fixed inset-0 pointer-events-none z-0">
      <div
        class="absolute inset-0"
        style="
          background-image:
            linear-gradient(rgba(0, 240, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 240, 255, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
        "
      />
    </div>

    <div class="relative z-1 h-screen flex flex-col p-4">
      <header class="relative mb-4 px-8 py-4">
        <div class="absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-[#00f0ff]" />
        <div class="absolute top-0 right-0 w-20 h-20 border-r-2 border-t-2 border-[#00f0ff]" />
        <div class="absolute bottom-0 left-0 w-20 h-20 border-l-2 border-b-2 border-[#00f0ff]" />
        <div class="absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-[#00f0ff]" />

        <div class="flex justify-between items-center">
          <div class="text-[#a6b9c8] text-sm">
            <div class="text-2xl font-bold text-[#00f0ff]" style="text-shadow: 0 0 20px rgba(0, 240, 255, 0.5)">
              {{ currentTime }}
            </div>
            <div class="text-xs mt-1">{{ currentDate }}</div>
          </div>
          <div class="text-center relative">
            <div
              class="h-[1px] left-0 right-[calc(50%+200px)] top-1/2 absolute"
              style="background: linear-gradient(90deg, transparent, #00f0ff);"
            />
            <h1
              class="text-3xl font-bold text-[#00f0ff] tracking-widest inline-block"
              style="text-shadow: 0 0 20px rgba(0, 240, 255, 0.5)"
            >
              交控稽核大数据分析看板
            </h1>
            <div
              class="h-[1px] left-[calc(50%+200px)] right-0 top-1/2 absolute"
              style="background: linear-gradient(90deg, #00f0ff, transparent);"
            />
          </div>
          <div class="flex gap-4">
            <button class="text-[#a6b9c8] hover:text-[#00f0ff] transition-colors">
              <div class="i-carbon-maximize text-xl" />
            </button>
            <button class="text-[#a6b9c8] hover:text-[#00f0ff] transition-colors">
              <div class="i-carbon-close text-xl" />
            </button>
          </div>
        </div>
      </header>

      <div class="grid grid-cols-3 gap-4 mb-4">
        <div
          class="relative p-4"
          style="background: linear-gradient(135deg, rgba(0, 40, 80, 0.6), rgba(10, 22, 40, 0.6)); border: 1px solid rgba(0, 240, 255, 0.3);"
        >
          <div class="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-[#00f0ff]" />
          <div class="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-[#00f0ff]" />
          <div class="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-[#00f0ff]" />
          <div class="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-[#00f0ff]" />
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded flex items-center justify-center" style="background: linear-gradient(135deg, rgba(0, 100, 150, 0.5), rgba(0, 50, 100, 0.5)); box-shadow: 0 0 20px rgba(0, 240, 255, 0.3), inset 0 0 20px rgba(0, 240, 255, 0.1);">
              <div class="i-carbon-document text-[#00f0ff] text-3xl" />
            </div>
            <div>
              <div class="text-[#ff9f00] text-2xl font-bold" style="text-shadow: 0 0 10px rgba(255, 159, 0, 0.5);">5000</div>
              <div class="text-[#a6b9c8] text-sm">上月在途成果数量</div>
            </div>
          </div>
        </div>
        <div
          class="relative p-4"
          style="background: linear-gradient(135deg, rgba(0, 40, 80, 0.6), rgba(10, 22, 40, 0.6)); border: 1px solid rgba(0, 240, 255, 0.3);"
        >
          <div class="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-[#00f0ff]" />
          <div class="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-[#00f0ff]" />
          <div class="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-[#00f0ff]" />
          <div class="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-[#00f0ff]" />
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded flex items-center justify-center" style="background: linear-gradient(135deg, rgba(0, 100, 150, 0.5), rgba(0, 50, 100, 0.5)); box-shadow: 0 0 20px rgba(0, 240, 255, 0.3), inset 0 0 20px rgba(0, 240, 255, 0.1);">
              <div class="i-carbon-money text-[#00f0ff] text-3xl" />
            </div>
            <div>
              <div class="text-[#ff9f00] text-2xl font-bold" style="text-shadow: 0 0 10px rgba(255, 159, 0, 0.5);">65894.55</div>
              <div class="text-[#a6b9c8] text-sm">上月在途成果金额</div>
            </div>
          </div>
        </div>
        <div
          class="relative p-4"
          style="background: linear-gradient(135deg, rgba(0, 40, 80, 0.6), rgba(10, 22, 40, 0.6)); border: 1px solid rgba(0, 240, 255, 0.3);"
        >
          <div class="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-[#00f0ff]" />
          <div class="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-[#00f0ff]" />
          <div class="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-[#00f0ff]" />
          <div class="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-[#00f0ff]" />
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded flex items-center justify-center" style="background: linear-gradient(135deg, rgba(0, 100, 150, 0.5), rgba(0, 50, 100, 0.5)); box-shadow: 0 0 20px rgba(0, 240, 255, 0.3), inset 0 0 20px rgba(0, 240, 255, 0.1);">
              <div class="i-carbon-send text-[#00f0ff] text-3xl" />
            </div>
            <div>
              <div class="text-[#ff9f00] text-2xl font-bold" style="text-shadow: 0 0 10px rgba(255, 159, 0, 0.5);">800</div>
              <div class="text-[#a6b9c8] text-sm">上月推送成果数量</div>
            </div>
          </div>
        </div>
        <div
          class="relative p-4"
          style="background: linear-gradient(135deg, rgba(0, 40, 80, 0.6), rgba(10, 22, 40, 0.6)); border: 1px solid rgba(0, 240, 255, 0.3);"
        >
          <div class="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-[#00f0ff]" />
          <div class="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-[#00f0ff]" />
          <div class="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-[#00f0ff]" />
          <div class="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-[#00f0ff]" />
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded flex items-center justify-center" style="background: linear-gradient(135deg, rgba(0, 100, 150, 0.5), rgba(0, 50, 100, 0.5)); box-shadow: 0 0 20px rgba(0, 240, 255, 0.3), inset 0 0 20px rgba(0, 240, 255, 0.1);">
              <div class="i-carbon-money text-[#00f0ff] text-3xl" />
            </div>
            <div>
              <div class="text-[#ff9f00] text-2xl font-bold" style="text-shadow: 0 0 10px rgba(255, 159, 0, 0.5);">56546.36</div>
              <div class="text-[#a6b9c8] text-sm">上月推送成果金额</div>
            </div>
          </div>
        </div>
        <div
          class="relative p-4"
          style="background: linear-gradient(135deg, rgba(0, 40, 80, 0.6), rgba(10, 22, 40, 0.6)); border: 1px solid rgba(0, 240, 255, 0.3);"
        >
          <div class="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-[#00f0ff]" />
          <div class="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-[#00f0ff]" />
          <div class="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-[#00f0ff]" />
          <div class="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-[#00f0ff]" />
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded flex items-center justify-center" style="background: linear-gradient(135deg, rgba(0, 100, 150, 0.5), rgba(0, 50, 100, 0.5)); box-shadow: 0 0 20px rgba(0, 240, 255, 0.3), inset 0 0 20px rgba(0, 240, 255, 0.1);">
              <div class="i-carbon-document text-[#00f0ff] text-3xl" />
            </div>
            <div>
              <div class="text-[#ff9f00] text-2xl font-bold" style="text-shadow: 0 0 10px rgba(255, 159, 0, 0.5);">9</div>
              <div class="text-[#a6b9c8] text-sm">本月在途成果数量</div>
            </div>
          </div>
        </div>
        <div
          class="relative p-4"
          style="background: linear-gradient(135deg, rgba(0, 40, 80, 0.6), rgba(10, 22, 40, 0.6)); border: 1px solid rgba(0, 240, 255, 0.3);"
        >
          <div class="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-[#00f0ff]" />
          <div class="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-[#00f0ff]" />
          <div class="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-[#00f0ff]" />
          <div class="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-[#00f0ff]" />
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded flex items-center justify-center" style="background: linear-gradient(135deg, rgba(0, 100, 150, 0.5), rgba(0, 50, 100, 0.5)); box-shadow: 0 0 20px rgba(0, 240, 255, 0.3), inset 0 0 20px rgba(0, 240, 255, 0.1);">
              <div class="i-carbon-money text-[#00f0ff] text-3xl" />
            </div>
            <div>
              <div class="text-[#ff9f00] text-2xl font-bold" style="text-shadow: 0 0 10px rgba(255, 159, 0, 0.5);">15</div>
              <div class="text-[#a6b9c8] text-sm">本月在途成果金额</div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex-1 grid grid-cols-[1fr_1.5fr_1fr] gap-4 min-h-0">
        <div class="flex flex-col gap-4">
          <div
            class="flex-1 relative p-3"
            style="background: linear-gradient(135deg, rgba(15, 42, 53, 0.8), rgba(11, 17, 26, 0.8)); border: 1px solid rgba(0, 240, 255, 0.3);"
          >
            <div class="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-[#00f0ff]" />
            <div class="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-[#00f0ff]" />
            <div class="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-[#00f0ff]" />
            <div class="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-[#00f0ff]" />
            <div class="flex items-center gap-2 mb-2">
              <div
                class="w-4 h-4"
                style="
                  background: linear-gradient(135deg, #00f0ff, #00e676);
                  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
                "
              />
              <div class="text-sm font-bold text-white">分公司本月成果占比</div>
            </div>
            <div ref="leftPieChartRef" class="w-full h-[calc(100%-30px)]" />
          </div>

          <div
            class="flex-1 relative p-3"
            style="background: linear-gradient(135deg, rgba(15, 42, 53, 0.8), rgba(11, 17, 26, 0.8)); border: 1px solid rgba(0, 240, 255, 0.3);"
          >
            <div class="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-[#00f0ff]" />
            <div class="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-[#00f0ff]" />
            <div class="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-[#00f0ff]" />
            <div class="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-[#00f0ff]" />
            <div class="flex items-center gap-2 mb-2">
              <div
                class="w-4 h-4"
                style="
                  background: linear-gradient(135deg, #00f0ff, #00e676);
                  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
                "
              />
              <div class="text-sm font-bold text-white">本月成果金额排名top10</div>
            </div>
            <div ref="amountRankChartRef" class="w-full h-[calc(100%-30px)]" />
          </div>

          <div
            class="flex-1 relative p-3"
            style="background: linear-gradient(135deg, rgba(15, 42, 53, 0.8), rgba(11, 17, 26, 0.8)); border: 1px solid rgba(0, 240, 255, 0.3);"
          >
            <div class="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-[#00f0ff]" />
            <div class="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-[#00f0ff]" />
            <div class="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-[#00f0ff]" />
            <div class="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-[#00f0ff]" />
            <div class="flex items-center gap-2 mb-2">
              <div
                class="w-4 h-4"
                style="
                  background: linear-gradient(135deg, #00f0ff, #00e676);
                  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
                "
              />
              <div class="text-sm font-bold text-white">本月成果数量排名top10</div>
            </div>
            <div ref="quantityRankChartRef" class="w-full h-[calc(100%-30px)]" />
          </div>
        </div>

        <div class="flex flex-col gap-4">
          <div
            class="relative p-3"
            style="background: linear-gradient(135deg, rgba(15, 42, 53, 0.8), rgba(11, 17, 26, 0.8)); border: 1px solid rgba(0, 240, 255, 0.3);"
          >
            <div class="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-[#00f0ff]" />
            <div class="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-[#00f0ff]" />
            <div class="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-[#00f0ff]" />
            <div class="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-[#00f0ff]" />
            <div class="flex items-center gap-2 mb-3">
              <div
                class="w-4 h-4"
                style="
                  background: linear-gradient(135deg, #00f0ff, #00e676);
                  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
                "
              />
              <div class="text-sm font-bold text-white">在途设备心跳监测</div>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-xs">
                <thead>
                  <tr class="text-[#a6b9c8] border-b border-[rgba(0,240,255,0.2)]">
                    <th class="py-2 text-left">IP</th>
                    <th class="py-2 text-left">系统CPU负载百分比</th>
                    <th class="py-2 text-left">总物理内存大小</th>
                    <th class="py-2 text-left">磁盘可用空间</th>
                    <th class="py-2 text-left">物理内存使用率百分比</th>
                    <th class="py-2 text-left">更新时间</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, index) in deviceData"
                    :key="index"
                    class="text-[#a6b9c8] border-b border-[rgba(0,240,255,0.1)]"
                  >
                    <td class="py-2">{{ item.ip }}</td>
                    <td class="py-2">{{ item.cpu }}</td>
                    <td class="py-2">{{ item.memory }}</td>
                    <td class="py-2">{{ item.disk }}</td>
                    <td class="py-2">
                      <div class="flex items-center gap-2">
                        <div class="w-16 h-2 bg-[rgba(0,240,255,0.2)] rounded overflow-hidden">
                          <div
                            class="h-full rounded"
                            :style="{ width: item.usage + '%', background: item.usage > 80 ? '#ff5722' : item.usage > 60 ? '#ff9f00' : '#00e676' }"
                          />
                        </div>
                        <span>{{ item.usage }}%</span>
                      </div>
                    </td>
                    <td class="py-2">{{ item.time }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="flex-1 grid grid-cols-2 gap-4">
            <div
              class="relative p-3"
              style="background: linear-gradient(135deg, rgba(15, 42, 53, 0.8), rgba(11, 17, 26, 0.8)); border: 1px solid rgba(0, 240, 255, 0.3);"
            >
              <div class="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-[#00f0ff]" />
              <div class="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-[#00f0ff]" />
              <div class="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-[#00f0ff]" />
              <div class="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-[#00f0ff]" />
              <div class="flex items-center gap-2 mb-2">
                <div
                  class="w-4 h-4"
                  style="
                    background: linear-gradient(135deg, #00f0ff, #00e676);
                    clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
                  "
                />
                <div class="text-sm font-bold text-white">分公司本月成果数量占比</div>
              </div>
              <div ref="centerPieChartRef" class="w-full h-[calc(100%-30px)]" />
            </div>

            <div
              class="relative p-3"
              style="background: linear-gradient(135deg, rgba(15, 42, 53, 0.8), rgba(11, 17, 26, 0.8)); border: 1px solid rgba(0, 240, 255, 0.3);"
            >
              <div class="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-[#00f0ff]" />
              <div class="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-[#00f0ff]" />
              <div class="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-[#00f0ff]" />
              <div class="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-[#00f0ff]" />
              <div class="flex items-center gap-2 mb-2">
                <div
                  class="w-4 h-4"
                  style="
                    background: linear-gradient(135deg, #00f0ff, #00e676);
                    clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
                  "
                />
                <div class="text-sm font-bold text-white">成果金额占比</div>
              </div>
              <div ref="centerRingChartRef" class="w-full h-[calc(100%-30px)]" />
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-4">
          <div
            class="flex-1 relative p-3"
            style="background: linear-gradient(135deg, rgba(15, 42, 53, 0.8), rgba(11, 17, 26, 0.8)); border: 1px solid rgba(0, 240, 255, 0.3);"
          >
            <div class="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-[#00f0ff]" />
            <div class="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-[#00f0ff]" />
            <div class="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-[#00f0ff]" />
            <div class="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-[#00f0ff]" />
            <div class="flex items-center gap-2 mb-2">
              <div
                class="w-4 h-4"
                style="
                  background: linear-gradient(135deg, #00f0ff, #00e676);
                  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
                "
              />
              <div class="text-sm font-bold text-white">车型占比</div>
            </div>
            <div ref="vehiclePieChartRef" class="w-full h-[calc(100%-30px)]" />
          </div>

          <div
            class="flex-1 relative p-3"
            style="background: linear-gradient(135deg, rgba(15, 42, 53, 0.8), rgba(11, 17, 26, 0.8)); border: 1px solid rgba(0, 240, 255, 0.3);"
          >
            <div class="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-[#00f0ff]" />
            <div class="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-[#00f0ff]" />
            <div class="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-[#00f0ff]" />
            <div class="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-[#00f0ff]" />
            <div class="flex items-center gap-2 mb-2">
              <div
                class="w-4 h-4"
                style="
                  background: linear-gradient(135deg, #00f0ff, #00e676);
                  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
                "
              />
              <div class="text-sm font-bold text-white">在途成果数量本月趋势</div>
            </div>
            <div ref="trendLineChartRef" class="w-full h-[calc(100%-30px)]" />
          </div>

          <div
            class="flex-1 relative p-3"
            style="background: linear-gradient(135deg, rgba(15, 42, 53, 0.8), rgba(11, 17, 26, 0.8)); border: 1px solid rgba(0, 240, 255, 0.3);"
          >
            <div class="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-[#00f0ff]" />
            <div class="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-[#00f0ff]" />
            <div class="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-[#00f0ff]" />
            <div class="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-[#00f0ff]" />
            <div class="flex items-center gap-2 mb-2">
              <div
                class="w-4 h-4"
                style="
                  background: linear-gradient(135deg, #00f0ff, #00e676);
                  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
                "
              />
              <div class="text-sm font-bold text-white">在途成果金额本月变化</div>
            </div>
            <div ref="amountBarChartRef" class="w-full h-[calc(100%-30px)]" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 240, 255, 0.1);
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 240, 255, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 240, 255, 0.5);
}
</style>
