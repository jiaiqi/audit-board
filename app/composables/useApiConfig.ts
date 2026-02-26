import { $fetch as rawFetch } from 'ofetch'

/**
 * 统一管理接口地址与请求封装
 *
 * useMock=true  -> 直接返回本地 mockData（无网络请求）
 * useMock=false -> POST {apiBase}/aud/select/{serviceName}，失败时降级返回 mockData
 *
 * apiBase 读取优先级：
 *   1. top.window.pathConfig.gateway
 *   2. window.__APP_CONFIG__.apiBase
 *   3. nuxt.config runtimeConfig.public.apiBase
 */
export function useApiConfig() {
  const { public: { useMock, apiBase: configApiBase } } = useRuntimeConfig()

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

  /** 从 sessionStorage 读取认证票据 */
  function getAuthHeaders(): Record<string, string> {
    if (!import.meta.client)
      return {}
    const ticket = sessionStorage.getItem('bx_auth_ticket') || sessionStorage.getItem('bx-auth-ticket') || ''
    return ticket ? { 'bx-auth-ticket': ticket, 'bx_auth_ticket': ticket } : {}
  }

  /**
   * 统一请求函数 — 直接返回业务数据，不暴露 ApiResponse 外壳
   *
   * @param serviceName - 真实后端服务名
   * @param mockData    - 本地兜底数据（纯业务数据，非 ApiResponse 包装）
   * @param adaptData   - 可选，将真实接口的 data 字段转换为前端所需格式
   *
   * 返回 useAsyncData 的结果，其中 data 为 Ref<T | null>，T 是纯业务类型
   */
  function apiFetch<T>(
    serviceName: string,
    mockData: T,
    adaptData?: (rawData: any) => T,
  ) {
    if (useMock) {
      return useAsyncData<T>(serviceName, () => Promise.resolve(mockData))
    }

    const url = `${getApiBase()}/aud/select/${serviceName}`
    return useAsyncData<T>(serviceName, async () => {
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
        })
        if (raw?.state !== 'SUCCESS') {
          console.warn(`[apiFetch] ${serviceName} 返回 state=${raw?.state}，使用本地数据`)
          return mockData
        }
        // 提取 data 并做字段适配
        return adaptData ? adaptData(raw.data) : raw.data as T
      }
      catch (err) {
        console.warn(`[apiFetch] ${serviceName} 请求失败，使用本地数据`, err)
        return mockData
      }
    })
  }

  return { useMock: useMock as boolean, apiFetch }
}
