import { $fetch as rawFetch } from 'ofetch'

/**
 * 统一管理接口地址与请求封装
 *
 * useMock=true  -> 直接使用本地 mockData（格式与真实接口一致，同样执行 adaptData）
 * useMock=false -> POST {apiBase}/aud/select/{serviceName}，失败时降级使用 mockData
 *
 * apiBase 读取优先级：
 *   1. top.window.pathConfig.gateway
 *   2. window.__APP_CONFIG__.apiBase
 *   3. nuxt.config runtimeConfig.public.apiBase
 *
 * apiTimeout 读取优先级：
 *   1. window.__APP_CONFIG__.apiTimeout
 *   2. nuxt.config runtimeConfig.public.apiTimeout（默认 5000ms）
 */

/**
 * 原生全局轻提示工具，不依赖第三方 UI 库，支持多实例错开排列
 */
const activeToasts: HTMLElement[] = []

function showToast(message: string, type: 'error' | 'warning' = 'error') {
  if (!import.meta.client)
    return

  const el = document.createElement('div')
  el.textContent = message

  // 基础偏移与每个 Toast 占据的高度阈值
  const baseTop = 20
  const gap = 16
  const toastHeight = 40 // 预估平均高度
  const currentTop = baseTop + activeToasts.length * (toastHeight + gap)

  Object.assign(el.style, {
    position: 'fixed',
    top: `${currentTop}px`,
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: type === 'error' ? 'rgba(255, 77, 79, 0.9)' : 'rgba(250, 173, 20, 0.9)',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '4px',
    zIndex: '9999',
    fontSize: '14px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    transition: 'all 0.3s ease-in-out',
    opacity: '0', // 初始透明度用于实现淡入
  })

  document.body.appendChild(el)
  activeToasts.push(el)

  // 触发淡入动画
  requestAnimationFrame(() => {
    el.style.opacity = '1'
  })

  // 定时移除
  setTimeout(() => {
    el.style.opacity = '0'
    el.style.transform = 'translate(-50%, -20px)'

    // 从活动列表中移除
    const index = activeToasts.indexOf(el)
    if (index > -1) {
      activeToasts.splice(index, 1)
    }

    // 重新计算剩余 Toast 的位置并触发上移动画
    activeToasts.forEach((toastEl, i) => {
      const newTop = baseTop + i * (toastHeight + gap)
      toastEl.style.top = `${newTop}px`
    })

    // 等待淡出动画结束后卸载 DOM
    setTimeout(() => el.remove(), 300)
  }, 4000)
}

export function useApiConfig() {
  const { public: { useMock, apiBase: configApiBase, apiTimeout: configTimeout } } = useRuntimeConfig()

  /** 获取运行时 apiBase */
  function getApiBase(): string {
    if (import.meta.client) {
      const pathConfig = (top as any)?.window?.pathConfig
      if (pathConfig?.gateway)
        return pathConfig.gateway
      const appConfig = (window as any).__APP_CONFIG__
      if (appConfig?.apiBase)
        return appConfig.apiBase
    }
    return configApiBase
  }

  /** 获取运行时超时时长（毫秒） */
  function getTimeout(): number {
    if (import.meta.client) {
      const appConfig = (window as any).__APP_CONFIG__
      if (typeof appConfig?.apiTimeout === 'number')
        return appConfig.apiTimeout
    }
    return configTimeout ?? 5000
  }

  /** 从 sessionStorage 读取认证票据 */
  function getAuthHeaders(): Record<string, string> {
    if (!import.meta.client)
      return {}
    const ticket = sessionStorage.getItem('bx_auth_ticket') || sessionStorage.getItem('bx-auth-ticket') || ''
    return ticket ? { 'bx-auth-ticket': ticket, 'bx_auth_ticket': ticket } : {}
  }

  /**
   * 统一处理接口响应（mock 和真实接口共用同一路径）
   * 1. 检查 state === 'SUCCESS'
   * 2. 对 data 字段执行 adaptData（若提供）
   */
  function processResponse<T>(raw: { state: string, data: any }, adaptFn?: (d: any) => T, label = ''): T | null {
    if (raw?.state !== 'SUCCESS') {
      console.warn(`[apiFetch] ${label} state=${raw?.state}，跳过`)
      showToast(`接口请求失败(${label}): 状态异常 [${raw?.state}]`, 'error')
      return null
    }

    // 检查 data 无值或空数组
    if (raw.data === null || raw.data === undefined || (Array.isArray(raw.data) && raw.data.length === 0)) {
      showToast(`空数据提示(${label}): 接口请求成功但返回了空内容/空数组`, 'warning')
    }

    return adaptFn ? adaptFn(raw.data) : (raw.data as T)
  }

  /**
   * 统一请求函数 — 直接返回业务数据，不暴露 ApiResponse 外壳
   *
   * @param serviceName - 真实后端服务名
   * @param mockData    - 本地兜底数据，格式与真实接口返回完全一致（含 state/data 字段）
   * @param mockData.state - 本地兜底数据的状态码
   * @param mockData.data - 本地兜底数据的载荷
   * @param adaptFn     - 可选，将接口 data 字段转换为前端格式（mock 和真实接口均会执行）
   *
   * 返回 useAsyncData 结果，.data 为 Ref<T | null>
   */
  function apiFetch<T>(
    serviceName: string,
    mockData: { state: string, data: any, [k: string]: any },
    adaptFn?: (rawData: any) => T,
  ) {
    if (useMock) {
      return useAsyncData<T | null>(serviceName, () =>
        Promise.resolve(processResponse<T>(mockData, adaptFn, `[mock] ${serviceName}`)))
    }

    const url = `${getApiBase()}/aud/select/${serviceName}`
    return useAsyncData<T | null>(serviceName, async () => {
      try {
        const raw = await rawFetch<any>(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
          body: {
            serviceName,
            colNames: ['*'],
            condition: [],
            page: { pageNo: 1, rownumber: 999 },
          },
          timeout: getTimeout(),
        })
        return processResponse<T>(raw, adaptFn, serviceName)
      }
      catch (err: any) {
        console.warn(`[apiFetch] ${serviceName} 请求失败`, err)
        showToast(`网络异常: 访问接口 ${serviceName} 失败 (${err.message})`, 'error')

        if (import.meta.dev || useMock) {
          console.warn(`[apiFetch] 允许 mock 兜底，降级使用本地数据`)
          return processResponse<T>(mockData, adaptFn, `[fallback] ${serviceName}`)
        }
        return null
      }
    })
  }

  return { useMock: useMock as boolean, apiFetch }
}
