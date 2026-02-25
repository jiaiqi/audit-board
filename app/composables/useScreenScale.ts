import { nextTick, onMounted, ref } from 'vue'
/**
 * 大屏看板缩放自适应
 * 基于设计稿尺寸（默认 1920×1080），根据当前视口自动缩放内容
 */
export function useScreenScale(options: {
  /** 设计稿宽度，默认 1920 */
  width?: number
  /** 设计稿高度，默认 1080 */
  height?: number
} = {}) {
  const { width: designWidth = 1920, height: designHeight = 1080 } = options

  const screenRef = ref<HTMLElement>()

  function calcScale() {
    const el = screenRef.value
    if (!el)
      return

    const w = window.innerWidth
    const h = window.innerHeight
    // 宽高独立缩放，铺满整个屏幕
    const scaleX = w / designWidth
    const scaleY = h / designHeight

    el.style.width = `${designWidth}px`
    el.style.height = `${designHeight}px`
    el.style.transform = `scale(${scaleX}, ${scaleY})`
  }

  const debouncedCalc = useDebounceFn(calcScale, 100)

  onMounted(() => {
    calcScale()
    useEventListener(window, 'resize', debouncedCalc)
  })

  return {
    screenRef,
  }
}
