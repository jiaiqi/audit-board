import { nextTick, onMounted, ref } from 'vue'

/**
 * 大屏看板缩放自适应
 * 基于设计稿尺寸（默认 1920×1080），根据当前视口自动缩放内容
 *
 * 缩放完成并 nextTick 后，会依次调用通过 onScaled 注册的回调。
 * 使用方式：
 *   const { screenRef, onScaled } = useScreenScale({ width: 1920, height: 1080 })
 *   onScaled(() => echartsInstance.resize())
 */
export function useScreenScale(options: {
  /** 设计稿宽度，默认 1920 */
  width?: number
  /** 设计稿高度，默认 1080 */
  height?: number
} = {}) {
  const { width: designWidth = 1920, height: designHeight = 1080 } = options

  const screenRef = ref<HTMLElement>()

  // 缩放完成后的回调列表
  const scaledCallbacks: (() => void)[] = []

  /** 注册缩放完成回调（在 nextTick 后执行，此时 DOM 已更新） */
  function onScaled(cb: () => void) {
    scaledCallbacks.push(cb)
  }

  async function calcScale() {
    const el = screenRef.value
    if (!el)
      return

    const w = window.innerWidth
    const h = window.innerHeight
    const scaleX = w / designWidth
    const scaleY = h / designHeight

    el.style.width = `${designWidth}px`
    el.style.height = `${designHeight}px`
    el.style.transform = `scale(${scaleX}, ${scaleY})`

    // 等待 DOM 渲染完成后再通知图表 resize
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 500))
    scaledCallbacks.forEach(cb => cb())
  }

  const debouncedCalc = useDebounceFn(calcScale, 100)

  onMounted(() => {
    calcScale()
    useEventListener(window, 'resize', debouncedCalc)
  })

  return {
    screenRef,
    onScaled,
  }
}
