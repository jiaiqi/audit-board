<script setup lang="ts">
import { useRouter } from 'vue-router'
import BoardHeader from '~/components/BoardHeader.vue'

const router = useRouter()

function goPage(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="page-root page-enter-active">
    <!-- 统一的顶部标题组件 -->
    <BoardHeader title="交通稽核大数据中心" />

    <!-- 响应式主体入口区域 -->
    <div class="nav-container">
      <!-- 卡片 1：在途稽核看板 -->
      <div class="nav-card" @click="goPage('/in-transit-audit')">
        <div class="card-glow" />
        <div class="card-inner">
          <div class="card-icon-wrapper">
            <div class="i-carbon-radar card-icon" />
          </div>
          <div class="card-title">
            在途稽核看板
          </div>
          <div class="card-desc">
            实时监测全路网设备心跳健康态，全面统筹在途稽核数据，为高效指挥调度提供精准支撑。
          </div>
        </div>
        <!-- 装饰线条 -->
        <div class="card-border-top" />
        <div class="card-border-bottom" />
      </div>

      <!-- 卡片 2：工单看板 -->
      <div class="nav-card" @click="goPage('/work-order')">
        <div class="card-glow" />
        <div class="card-inner">
          <div class="card-icon-wrapper">
            <div class="i-carbon-analytics card-icon" />
          </div>
          <div class="card-title">
            工单大数据看板
          </div>
          <div class="card-desc">
            深度挖掘业务工单流转历程，多维解构异常与追缴状态，洞悉财务指标变化趋势全景图。
          </div>
        </div>
        <div class="card-border-top" />
        <div class="card-border-bottom" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 响应式深色大屏底座规范 */
.page-root {
  display: flex;
  flex-direction: column;
  width: 100vw;
  min-height: 100vh;
  background-color: #0b111a;
  background-image:
    radial-gradient(circle at 50% 50%, rgba(0, 240, 255, 0.08) 0%, transparent 60%),
    linear-gradient(to bottom, rgba(0, 15, 30, 0.9) 0%, rgba(10, 20, 35, 0.95) 100%);
  overflow-x: hidden;
  overflow-y: auto;
  font-family: inherit;
  color: #fff;
}
.page-enter-active {
  animation: page-fade-in 1s ease-out forwards;
}

/* 响应式导航容器 */
.nav-container {
  display: flex;
  flex-wrap: wrap; /* 允许小屏自动换行下落 */
  justify-content: center;
  align-items: center;
  align-content: center;
  gap: clamp(40px, 8vw, 120px); /* 间距随屏幕尺寸弹簧式收缩 */
  flex: 1; /* 撑满剩余垂直空间 */
  padding: 40px 20px 80px;
}

/* 核心：卡片骨架结构 */
.nav-card {
  position: relative;
  width: clamp(320px, 40vw, 480px); /* 最小 320，自适应 40vw，最大 480 */
  height: clamp(450px, 50vw, 600px); /* 让高度也具有一定等缩比响应 */
  background: rgba(13, 27, 46, 0.6);
  border: 1px solid rgba(0, 240, 255, 0.2);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

/* 动态背景光晕特效 */
.card-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at 50% 50%, rgba(0, 240, 255, 0.15), transparent 60%);
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none;
}

/* Hover 状态互动 */
.nav-card:hover {
  transform: translateY(-20px) scale(1.02);
  border-color: rgba(0, 240, 255, 0.6);
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.5),
    0 0 40px rgba(0, 240, 255, 0.2) inset,
    0 0 20px rgba(0, 240, 255, 0.4);
}
.nav-card:hover .card-glow {
  opacity: 1;
  /* 增加光晕旋转 */
  animation: glow-spin 10s linear infinite;
}
.nav-card:hover .card-icon {
  transform: scale(1.1) translateY(-10px);
  filter: drop-shadow(0 0 15px rgba(0, 240, 255, 0.8));
  color: #fff;
}
.nav-card:hover .card-title {
  color: #00f0ff;
  text-shadow: 0 0 10px rgba(0, 240, 255, 0.6);
}

/* 内部图文排版 */
.card-inner {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 40px;
}

.card-icon-wrapper {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(0, 240, 255, 0.1) 0%, rgba(0, 100, 255, 0.05) 100%);
  border: 1px solid rgba(0, 240, 255, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.1) inset;
  transition: all 0.4s ease;
}

.card-icon {
  font-size: 56px;
  color: rgba(0, 240, 255, 0.8);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.card-title {
  font-family: PangMenZhengDao, sans-serif;
  font-size: 42px;
  letter-spacing: 4px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 24px;
  transition: all 0.3s ease;
}

.card-desc {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.8;
  max-width: 80%;
  font-weight: 300;
}

/* 科幻风边角修饰线 */
.card-border-top,
.card-border-bottom {
  position: absolute;
  width: 60px;
  height: 4px;
  background: #00f0ff;
  transition: width 0.4s ease;
}
.card-border-top {
  top: 0;
  left: 0;
  box-shadow: 0 2px 10px rgba(0, 240, 255, 0.5);
}
.card-border-bottom {
  bottom: 0;
  right: 0;
  box-shadow: 0 -2px 10px rgba(0, 240, 255, 0.5);
}

.nav-card:hover .card-border-top,
.nav-card:hover .card-border-bottom {
  width: 100%;
}

@keyframes glow-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes page-fade-in {
  from {
    opacity: 0;
    transform: scale(1.02);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
