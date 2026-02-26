<script setup lang="ts">
/**
 * BoardHeader — 看板公共头部组件
 * 包含：实时时钟 + 看板标题 + 全屏切换按钮 + 底部装饰线
 */
defineProps<{
  /** 看板标题文字 */
  title: string
  /** 是否显示星期（在途看板显示，工单看板不显示） */
  showWeek?: boolean
}>()

const { currentTime, currentDate, currentWeek } = useBoardClock({ showDate: true, showWeek: true })
const { isFullscreen, toggle: toggleFullscreen } = useFullscreen()
</script>

<template>
  <header class="board-header">
    <div class="board-header__time">
      <div class="board-header__clock">
        {{ currentTime }}
      </div>
      <div class="board-header__date">
        <span>{{ currentDate }}</span>
        <span v-if="showWeek">{{ currentWeek }}</span>
      </div>
    </div>

    <div class="board-header__title">
      <h1 class="board-header__title-text">
        {{ title }}
      </h1>
    </div>

    <div class="board-header__actions">
      <button class="board-header__btn" @click="toggleFullscreen">
        <!-- 进入全屏 -->
        <svg v-if="!isFullscreen" viewBox="0 0 24 24" class="board-header__icon" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
        </svg>
        <!-- 退出全屏 -->
        <svg v-else viewBox="0 0 24 24" class="board-header__icon" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
        </svg>
      </button>
    </div>

    <div class="board-header__line" />
  </header>
</template>

<style scoped>
.board-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  margin-bottom: 10px;
  position: relative;
  flex-shrink: 0;
}
.board-header__time {
  min-width: 200px;
  display: flex;
  gap: 15px;
  align-items: center;
  font-family: initial;
}
.board-header__clock {
  font-size: 32px;
  color: #fff;
  line-height: 1.1;
}
.board-header__date {
  font-size: 12px;
  color: #fff;
  margin-top: 3px;
  display: flex;
  flex-direction: column;
}
.board-header__title {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background-image: url('/assets/images/page2_title_bg.png');
  background-position: center bottom;
  background-repeat: no-repeat;
  height: 70px;
}
.board-header__title-text {
  font-size: 34px;
  color: #ebf9ff;
  letter-spacing: 6px;
  font-weight: bold;
  white-space: nowrap;
  text-shadow: 0px 2px 6px rgba(0, 190, 231, 1);
  line-height: 45px;
  margin-top: -20px;
}
.board-header__actions {
  min-width: 200px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
.board-header__btn {
  background: transparent;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 4px;
  transition: color 0.3s;
}
.board-header__btn:hover { color: #00f0ff; }
.board-header__icon { width: 20px; height: 20px; }
.board-header__line {
  position: absolute;
  bottom: 0;
  left: 5%;
  right: 5%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 240, 255, 0.5), transparent);
}
</style>
