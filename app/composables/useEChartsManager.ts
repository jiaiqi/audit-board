import type { EChartsOption } from 'echarts'
import type { ComputedRef, Ref } from 'vue'
import * as echarts from 'echarts'

/** 单个图表描述符 */
export interface ChartDescriptor<T = unknown> {
  /** 图表容器 DOM 的 ref（由 template 中 ref="xxx" 绑定） */
  domRef: Ref<HTMLElement | undefined>
  /** 接口数据来源（Ref 或 ComputedRef，数据就绪时自动触发 watch 更新） */
  dataRef: Ref<T | null> | ComputedRef<T | null>
  /** 接口请求进行中状态（可选） */
  pendingRef?: Ref<boolean>
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
 *   1. onMounted → 初始化并建立实例
 *   2. watch 各 dataRef → 数据就绪后 setOption 并触发 resize
 *   3. watch 各 pendingRef → 控制 showLoading/hideLoading
 *   4. useScreenScale.onScaled → resize（与缩放同步）
 *   5. onBeforeUnmount → 批量 dispose
 */
export function useEChartsManager(
  descriptors: ChartDescriptor<any>[],
  onScaled?: (cb: () => void) => void,
) {
  const instances: (echarts.ECharts | null)[] = descriptors.map(() => null)

  /** 初始化所有图表实例 */
  async function initAll() {
    for (const [index, element] of descriptors.entries()) {
      if (!element?.domRef.value) {
        continue
      }
      // 不再使用硬编码的延时
      instances[index] = echarts.init(element.domRef.value)

      // 初始加载状态处理
      if (element.pendingRef?.value) {
        instances[index]!.showLoading('default', {
          text: '数据加载中...',
          color: '#00f0ff',
          textColor: '#fff',
          maskColor: 'rgba(11, 17, 26, 0.8)', // 匹配深色看板风格
          zlevel: 0,
        })
      }
      else {
        instances[index]!.setOption(element.buildOption(element.dataRef.value))
      }
    }
  }

  /** 批量 resize */
  async function resizeAll() {
    for (const element of instances) {
      if (element) {
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
    // 监听数据改变
    watch(desc.dataRef, (data) => {
      const inst = instances[i]
      if (inst) {
        inst.setOption(desc.buildOption(data))
        // 图表数据更新后自动 resize 确保布局适应内容
        nextTick(() => inst.resize())
      }
    })

    // 监听 pending 状态改变
    if (desc.pendingRef) {
      watch(desc.pendingRef, (isPending) => {
        const inst = instances[i]
        if (inst) {
          if (isPending) {
            inst.showLoading('default', {
              text: '数据加载中...',
              color: '#00f0ff',
              textColor: '#a3a6ad',
              maskColor: 'rgba(11, 17, 26, 0.6)',
              zlevel: 0,
            })
          }
          else {
            inst.hideLoading()
          }
        }
      })
    }
  })

  onMounted(async () => {
    await nextTick()
    // 之前有个延时 1000ms 的硬编码已移除，如果在特殊生命周期存在渲染不足，通过组件封装的外部控制更好
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
