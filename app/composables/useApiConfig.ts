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
      return null
    }
    return adaptFn ? adaptFn(raw.data) : (raw.data as T)
  }

  /**
   * 统一请求函数 — 直接返回业务数据，不暴露 ApiResponse 外壳
   *
   * @param serviceName - 真实后端服务名
   * @param mockData    - 本地兜底数据，格式与真实接口返回完全一致（含 state/data 字段）
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
      catch (err) {
        console.warn(`[apiFetch] ${serviceName} 请求失败，降级使用本地数据`, err)
        return processResponse<T>(mockData, adaptFn, `[fallback] ${serviceName}`)
      }
    })
  }

  return { useMock: useMock as boolean, apiFetch }
}
