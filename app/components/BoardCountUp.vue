<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  /** 目标数值 */
  value: number | string
  /** 动画持续时间（毫秒） */
  duration?: number
  /** 小数位数 */
  decimals?: number
  /** 是否开启千分位格式化 */
  useGrouping?: boolean
  /** 动画缓动效果：是否带有阻尼感（由快到慢） */
  useEasing?: boolean
  /** 数值前缀（如 ¥、$） */
  prefix?: string
  /** 数值后缀（如 %、元） */
  suffix?: string
  /** 是否开启大数自动转换（万、亿），默认开启 */
  autoUnit?: boolean
  /** 是否移除小数末尾的零（例如 10.00 -> 10，10.50 -> 10.5），默认开启 */
  trimTrailingZeros?: boolean
}>(), {
  duration: 1500,
  decimals: 2,
  useGrouping: false,
  useEasing: true,
  prefix: '',
  suffix: '',
  autoUnit: true,
  trimTrailingZeros: true,
})

const displayValue = ref('')
const currentAutoUnit = ref('')
let animationFrameId: number

// easeOutExpo 缓动函数：具有强烈的阻尼感，开始很快，最后很慢
function easeOutExpo(t: number, b: number, c: number, d: number): number {
  return (t === d) ? b + c : c * (-(2 ** (-10 * t / d)) + 1) + b
}

// 格式化数字
function formatNumber(num: number): string {
  let fixedNum = num.toFixed(props.decimals ?? 2)

  if (props.trimTrailingZeros) {
    fixedNum = String(Number.parseFloat(fixedNum))
  }

  let result = fixedNum

  if (props.useGrouping) {
    const parts = fixedNum.split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    result = parts.join('.')
  }

  return `${props.prefix ?? ''}${result}`
}

function startAnimation(originalTarget: number) {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }

  let targetNumber = originalTarget
  currentAutoUnit.value = ''

  if (props.autoUnit) {
    const absNum = Math.abs(originalTarget)
    if (absNum >= 100000000) {
      targetNumber = originalTarget / 100000000
      currentAutoUnit.value = '亿'
    }
    else if (absNum >= 10000) {
      targetNumber = originalTarget / 10000
      currentAutoUnit.value = '万'
    }
  }

  const startTime = Date.now()
  const startValue = 0
  const changeInValue = targetNumber - startValue

  function update() {
    const currentTime = Date.now()
    const duration = props.duration ?? 1500
    const elapsedTime = Math.min(currentTime - startTime, duration)

    let currentNumber: number
    if (props.useEasing) {
      currentNumber = easeOutExpo(elapsedTime, startValue, changeInValue, duration)
    }
    else {
      // 线性匀速
      currentNumber = startValue + changeInValue * (elapsedTime / duration)
    }

    displayValue.value = formatNumber(currentNumber)

    if (elapsedTime < duration) {
      animationFrameId = requestAnimationFrame(update)
    }
    else {
      // 确保最终值精确
      displayValue.value = formatNumber(targetNumber)
    }
  }

  animationFrameId = requestAnimationFrame(update)
}

watch(() => props.value, (newVal) => {
  const num = Number.parseFloat(String(newVal).replace(/,/g, ''))
  if (!Number.isNaN(num)) {
    startAnimation(num)
  }
  else {
    // 无法解析为数字，直接展示原始字符串
    displayValue.value = `${props.prefix}${newVal}${props.suffix}`
  }
}, { immediate: true })

onBeforeUnmount(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})
</script>

<template>
  <span class="board-count-up">
    {{ displayValue }}<span v-if="currentAutoUnit || suffix" class="board-count-up__unit">{{ currentAutoUnit }}{{ suffix }}</span>
  </span>
</template>

<style scoped>
.board-count-up {
  display: inline-flex;
  align-items: baseline;
}
.board-count-up__unit {
  font-size: 0.5em; /* 单位比数字小一半 */
  margin-left: 2px;
}
</style>
