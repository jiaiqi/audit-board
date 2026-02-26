import type { EChartsOption } from 'echarts'

/**
 * ECharts 看板主题公共配置
 * 所有图表共享的基础样式 token，减少每个 build 函数中的重复代码
 */

/** 基础 option：透明背景 + 统一字体 */
export const baseOption: EChartsOption = {
  backgroundColor: 'transparent',
  textStyle: { fontFamily: 'Microsoft YaHei, sans-serif' },
}

/** 深色 tooltip 样式（青色边框） */
export const darkTooltip = {
  backgroundColor: 'rgba(11,17,26,0.9)',
  borderColor: '#00f0ff',
  textStyle: { color: '#fff' },
} as const

/** 深色 tooltip 样式（橙色边框） */
export const orangeTooltip = {
  ...darkTooltip,
  borderColor: '#ff9f00',
} as const

/** 通用坐标轴样式 */
export const axisStyle = {
  /** 隐藏的轴线 */
  hiddenLine: { show: false },
  /** 青色半透明轴线 */
  cyanLine: { lineStyle: { color: 'rgba(0,240,255,0.3)' } },
  /** 橙色半透明轴线 */
  orangeLine: { lineStyle: { color: 'rgba(255,159,0,0.3)' } },
  /** 白色标签 */
  whiteLabel: { color: '#fff' },
  /** 小号白色标签 */
  smallLabel: { color: '#fff', fontSize: 9 },
  /** 隐藏刻度 */
  noTick: { show: false },
  /** 青色半透明网格线 */
  cyanSplit: { lineStyle: { color: 'rgba(0,240,255,0.1)' } },
  /** 橙色半透明网格线 */
  orangeSplit: { lineStyle: { color: 'rgba(255,159,0,0.1)' } },
} as const

/** 通用图例样式（小号白色文字） */
export const smallLegend = {
  textStyle: { color: '#fff', fontSize: 10 },
  top: 0,
  right: 'center',
  itemWidth: 12,
  itemHeight: 8,
} as const

/** 看板调色盘 */
export const palette = {
  cyan: '#00f0ff',
  orange: '#ff9f00',
  green: '#00e676',
  blue: '#2979ff',
} as const
