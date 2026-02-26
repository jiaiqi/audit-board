/**
 * useBoardClock — 看板实时时钟 Composable
 *
 * 同时提供：
 *   - currentTime  时间字符串，格式 HH:mm:ss
 *   - currentDate  日期字符串，格式 YYYY年MM月DD日 星期X（可选，不需要时不会计算）
 *
 * 使用方式：
 *   const { currentTime, currentDate } = useBoardClock()           // 带日期
 *   const { currentTime } = useBoardClock({ showDate: false })     // 仅时间
 */
export interface BoardClockOptions {
  /** 是否计算并暴露日期，默认 true */
  showDate?: boolean
  /** 是否计算并暴露星期，默认 true */
  showWeek?: boolean
}

export function useBoardClock(options: BoardClockOptions = {}) {
  const { showDate = true, showWeek = true } = options

  // 时间字符串，格式：HH:mm:ss
  const currentTime = ref('')
  // 日期字符串，格式：YYYY年MM月DD日
  const currentDate = ref('')
  // 星期字符串，格式：星期X
  const currentWeek = ref('')

  function updateTime() {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0') // 月份从0开始
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')

    currentTime.value = `${hours}:${minutes}:${seconds}`

    if (showDate) {
      currentDate.value = `${year}年${month}月${day}日`
    }
    if (showWeek) {
      const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
      currentWeek.value = ` ${weekDays[now.getDay()]}`
    }
  }

  // 每秒刷新一次，组件卸载时 VueUse 自动停止
  useIntervalFn(updateTime, 1000)
  // 首次挂载立即执行，避免首屏空白
  onMounted(updateTime)

  return { currentTime, currentDate, currentWeek }
}
