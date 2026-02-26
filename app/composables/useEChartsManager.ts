import type { EChartsOption } from 'echarts'
import type { ComputedRef, Ref } from 'vue'
import * as echarts from 'echarts'

/**
 * 单个图表描述符
 *
 * @template T - 接口数据类型
 */
export interface ChartDescriptor<T = unknown> {
  /** 图表容器 DOM 的 ref（由 template 中 ref="xxx" 绑定） */
  domRef: Ref<HTMLElement | undefined>
  /** 接口数据来源（ComputedRef，数据就绪时自动触发 watch 更新） */
  dataRef: ComputedRef<T | null>
  /** 根据接口数据构建 ECharts option 的函数 */
  buildOption: (data: T | null) => EChartsOption
}

/**
 * useEChartsManager — ECharts 图表统一生命周期管理 Composable
 *
 * 封装了以下重复模式：
 *   1. 在 onMounted(nextTick) 中批量 init + setOption
 *   2. watch 各数据来源，数据就绪后调用 setOption
 *   3. window resize 时批量 resize
 *   4. onBeforeUnmount 时批量 dispose
 *
 * 使用方式：
 * ```ts
 * useEChartsManager([
 *   { domRef: barChartRef, dataRef: barChart, buildOption: buildBarOption },
 *   { domRef: pieChartRef, dataRef: pieChart, buildOption: buildPieOption },
 * ])
 * ```
 */
export function useEChartsManager(descriptors: ChartDescriptor<any>[]) {
  // 内部保存所有 ECharts 实例（与 descriptors 下标一一对应）
  const instances: (echarts.ECharts | null)[] = descriptors.map(() => null)

  /** 初始化所有图表实例，在 nextTick 后确保 DOM 已就绪 */
  function initAll() {
    descriptors.forEach((desc, i) => {
      if (!desc.domRef.value)
        return
      instances[i] = echarts.init(desc.domRef.value)
      instances[i]!.setOption(desc.buildOption(desc.dataRef.value))
    })
  }

  /** 批量 resize */
  function resizeAll() {
    instances.forEach(inst => inst?.resize())
  }

  /** 批量 dispose */
  function disposeAll() {
    instances.forEach(inst => inst?.dispose())
  }

  // 每个图表独立 watch 数据源，互不阻塞
  descriptors.forEach((desc, i) => {
    watch(desc.dataRef, (data) => {
      instances[i]?.setOption(desc.buildOption(data))
    })
  })

  // DOM 就绪后初始化图表，并注册 resize 监听（VueUse 自动清理）
  onMounted(() => {
    nextTick(() => {
      initAll()
      useEventListener(window, 'resize', resizeAll)
    })
  })

  // 组件卸载前释放所有实例，防止内存泄漏
  onBeforeUnmount(disposeAll)
}
