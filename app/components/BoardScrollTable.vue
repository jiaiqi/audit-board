<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

export interface TableColumn {
  title: string
  key: string
  width?: string
}

const props = withDefaults(defineProps<{
  /** 列表栏位配置 */
  columns: TableColumn[]
  /** 渲染的数据源 */
  data: any[]
  /** 是否在请求数据中，若开启则蒙一层遮罩 */
  isLoading?: boolean
  /** 是否开启自动滚动动画 */
  autoScroll?: boolean
  /** 当数据量超过多少条时才开启滚动 */
  scrollLimit?: number
  /** [continuous模式] 单条数据滚过的秒数，设定越小速度越快 */
  scrollSpeed?: number
  /** 滚动模式：'continuous' (连续平滑滚动) | 'step' (步进跳跃滚动) */
  scrollMode?: 'continuous' | 'step'
  /** [step模式] 每次滚动的行数 */
  stepRows?: number
  /** [step模式] 每次步进滚动的动画时长(秒) */
  stepDuration?: number
  /** [step模式] 每次步进后的停留时间(秒) */
  stepDelay?: number
}>(), {
  isLoading: false,
  autoScroll: true,
  scrollLimit: 5,
  scrollSpeed: 2,
  scrollMode: 'continuous',
  stepRows: 1,
  stepDuration: 0.5,
  stepDelay: 2,
})

const isPaused = ref(false)

// 计算是否超过需要滚动的阈值
const isScrolling = computed(() => props.autoScroll && (props.data?.length || 0) > props.scrollLimit)

// 数据源复用，用来无缝首尾相接滚动
const displayData = computed(() => {
  if (isScrolling.value) {
    return [...(props.data || []), ...(props.data || [])]
  }
  return props.data || []
})

// 总动画时间 = 数据总数 × 每行的速度参数，由于扩增了两倍数组但动画位移只移动 50%，所以时间基于原数组长
const animationDuration = computed(() => {
  return `${(props.data?.length || 0) * props.scrollSpeed}s`
})

// === 步进模式(Step) 控制 ===
const currentIndex = ref(0)
const isTransitioning = ref(false)
let stepTimer: ReturnType<typeof setInterval> | null = null

function startStepScroll() {
  stopStepScroll()
  if (props.scrollMode !== 'step' || !isScrolling.value)
    return

  const interval = (props.stepDelay + props.stepDuration) * 1000
  stepTimer = setInterval(() => {
    if (!isPaused.value) {
      isTransitioning.value = true
      currentIndex.value += props.stepRows
    }
  }, interval)
}

function stopStepScroll() {
  if (stepTimer) {
    clearInterval(stepTimer)
    stepTimer = null
  }
}

watch(() => props.data, () => {
  currentIndex.value = 0
  isTransitioning.value = false
  if (props.scrollMode === 'step') {
    startStepScroll()
  }
}, { deep: true })

watch(() => props.scrollMode, () => {
  currentIndex.value = 0
  isTransitioning.value = false
  if (props.scrollMode === 'step') {
    startStepScroll()
  }
  else {
    stopStepScroll()
  }
})

onMounted(() => {
  if (props.scrollMode === 'step') {
    startStepScroll()
  }
})

onBeforeUnmount(() => {
  stopStepScroll()
})

function handleTransitionEnd() {
  if (props.scrollMode !== 'step')
    return
  // 步进到末尾后瞬间跳回对应的起始排布以完成无缝播放
  if (currentIndex.value >= props.data.length) {
    isTransitioning.value = false
    currentIndex.value = currentIndex.value % props.data.length
  }
}

// 动态样式
const listStyle = computed(() => {
  if (props.scrollMode === 'continuous') {
    return { animationDuration: animationDuration.value }
  }
  else {
    // 步进模式
    const ratio = displayData.value.length ? (currentIndex.value / displayData.value.length) * 100 : 0
    return {
      transform: `translateY(-${ratio}%)`,
      transition: isTransitioning.value ? `transform ${props.stepDuration}s ease-in-out` : 'none',
    }
  }
})
</script>

<template>
  <div class="scroll-table-wrapper flex flex-1 flex-col min-h-0 relative">
    <!-- 加载层 -->
    <div v-if="isLoading" class="panel-loading-overlay">
      <div class="loading-spinner" />
    </div>

    <!-- 表头固定区域 -->
    <div class="scroll-table-header shrink-0">
      <table class="data-table" style="table-layout: fixed; width: 100%;">
        <colgroup>
          <col v-for="col in columns" :key="col.key" :style="{ width: col.width }">
        </colgroup>
        <thead>
          <tr>
            <th v-for="col in columns" :key="col.key">
              {{ col.title }}
            </th>
          </tr>
        </thead>
      </table>
    </div>

    <!-- 表体验自动滚动区域 -->
    <div
      class="scroll-table-body flex-1 overflow-hidden"
      @mouseenter="isPaused = true"
      @mouseleave="isPaused = false"
    >
      <div
        class="scroll-list"
        :class="{ 'is-scrolling': scrollMode === 'continuous' && isScrolling, 'is-paused': isPaused }"
        :style="listStyle"
        @transitionend="handleTransitionEnd"
      >
        <table class="data-table" style="table-layout: fixed; width: 100%;">
          <colgroup>
            <col v-for="col in columns" :key="col.key" :style="{ width: col.width }">
          </colgroup>
          <tbody>
            <tr v-for="(row, i) in displayData" :key="i">
              <td v-for="col in columns" :key="col.key">
                <slot :name="col.key" :row="row" :index="i">
                  {{ row[col.key] }}
                </slot>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scroll-table-wrapper {
  overflow: hidden;
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

/* ══════════════ 表格样式 ══════════════ */
.data-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 13px;
}
.data-table th,
.data-table td {
  padding: 6px 10px;
  text-align: left;
  color: #fff;
  border-bottom: 1px solid rgba(0, 240, 255, 0.1);
  white-space: nowrap;
  height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
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

/* ══════════════ 无缝滚动动画 ══════════════ */
.is-scrolling {
  animation: scroll-up linear infinite;
}
.is-paused {
  animation-play-state: paused;
}
@keyframes scroll-up {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-50%);
  }
}
</style>
