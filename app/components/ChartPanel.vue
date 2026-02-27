<script setup lang="ts">
/**
 * ChartPanel — 图表面板组件
 * 统一的面板结构：标题行 + 图表区域
 * 通过 template ref 将图表容器 DOM 暴露给父组件
 */
defineProps<{
  /** 面板标题 */
  title: string
  /** 是否显示边框样式 */
  bordered?: boolean
  /** 是否显示标题背景图 */
  titleBg?: boolean
}>()

const chartEl = ref<HTMLElement>()

// 将图表容器 DOM 暴露给父组件
defineExpose({ chartEl })
</script>

<template>
  <div class="chart-panel" :class="{ 'chart-panel--bordered': bordered }">
    <div class="chart-panel__hd" :class="{ 'chart-panel__hd--bg': titleBg }">
      <img class="chart-panel__icon" :src="`${useRuntimeConfig().app.baseURL}/assets/icons/arrow-icon.png`" alt="">
      <span class="chart-panel__title">{{ title }}</span>
    </div>
    <div ref="chartEl" class="chart-panel__body" />
  </div>
</template>

<style scoped>
.chart-panel {
  position: relative;
  padding: 0 8px 10px 0;
  display: flex;
  flex-direction: column;
  min-height: 0;
}
.chart-panel--bordered {
  border-radius: 10px;
  background: radial-gradient(0.5% 0.675% at 50% 50%, rgba(8, 53, 108, 0) 0%, rgba(0, 58, 140, 0.7) 100%);
  border: 1px solid rgba(56, 200, 255, 1);
}
.chart-panel__hd {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  margin-bottom: 4px;
  padding: 10px 20px;
}
.chart-panel__hd--bg {
  height: 44px;
  line-height: 44px;
  font-size: 14px;
  text-align: center;
  background-image: url('/board/assets/images/page2_block_title_bg.png');
}
.chart-panel__icon {
  display: inline-block;
  width: 20px;
  height: 24px;
}
.chart-panel__title {
  font-size: 20px;
  color: #fff;
}
.chart-panel__body {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
</style>
