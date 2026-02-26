import type { EChartsOption } from 'echarts'
import type { ComputedRef, Ref } from 'vue'
import * as echarts from 'echarts'

/** 单个图表描述符 */
export interface ChartDescriptor<T = unknown> {
  /** 图表容器 DOM 的 ref（由 template 中 ref="xxx" 绑定） */
  domRef: Ref<HTMLElement | undefined>
  /** 接口数据来源（Ref 或 ComputedRef，数据就绪时自动触发 watch 更新） */
  dataRef: Ref<T | null> | ComputedRef<T | null>
  /** 根据接口数据构建 ECharts option 的函数 */
  buildOption: (data: T | null) => EChartsOption
}

/**
 * useEChartsManager — ECharts 图表统一生命周期管理
 *
 * @param descriptors 图表描述符数组
 * @param onScaled    可选，来自 useScreenScale 的回调注册函数。
 *                    若传入，则在每次缩放完成（DOM 更新后）自动 resize 所有图表；
 *                    若不传入，则监听 window resize 事件作为兜底。
 *
 * 生命周期：
 *   1. onMounted → nextTick → 批量 init + setOption
 *   2. watch 各 dataRef → 数据就绪后 setOption
 *   3. useScreenScale.onScaled → resize（与缩放同步）
 *   4. onBeforeUnmount → 批量 dispose
 */
export function useEChartsManager(
  descriptors: ChartDescriptor<any>[],
  onScaled?: (cb: () => void) => void,
) {
  const instances: (echarts.ECharts | null)[] = descriptors.map(() => null)

  /** 初始化所有图表实例 */
  async function initAll() {
    for (let index = 0; index < descriptors.length; index++) {
      const element = descriptors[index]
      if (!element?.domRef.value) {
        return
      }
      await new Promise(resolve => setTimeout(resolve, 500))
      instances[index] = echarts.init(element.domRef.value)
      instances[index]!.setOption(element.buildOption(element.dataRef.value))
    }
  }

  /** 批量 resize */
  async function resizeAll() {
    for (let index = 0; index < instances.length; index++) {
      const element = instances[index]
      if (element) {
        await new Promise(resolve => setTimeout(resolve, 100))
        element.resize()
      }
    }
  }

  /** 批量 dispose */
  function disposeAll() {
    instances.forEach(inst => inst?.dispose())
  }

  // 各图表独立 watch 数据源，数据就绪后立即更新
  descriptors.forEach((desc, i) => {
    watch(desc.dataRef, (data) => {
      instances[i]?.setOption(desc.buildOption(data))
    })
  })

  onMounted(async () => {
    await nextTick()
    await new Promise(resolve => setTimeout(resolve, 1000))
    initAll()
    if (onScaled) {
      // 优先：缩放完成（DOM 更新后）再 resize，与屏幕缩放精确同步
      onScaled(resizeAll)
    }
    else {
      // 兜底：直接监听 window resize（未使用 useScreenScale 的场景）
      useEventListener(window, 'resize', resizeAll)
    }
  })

  onBeforeUnmount(disposeAll)
}
