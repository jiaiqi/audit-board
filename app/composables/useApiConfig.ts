/**
 * 统一管理接口地址，支持 mock/真实接口一键切换
 * useMock=true  -> 走 Nuxt server 端 mock 接口 /api/...
 * useMock=false -> 走真实后端地址（runtimeConfig.public.apiBase + path）
 */
export function useApiConfig() {
  const { public: { useMock, apiBase } } = useRuntimeConfig()

  /**
   * 根据配置返回接口 URL
   * @param mockPath  - mock 接口路径，例如 '/api/audit-board/stats'
   * @param realPath  - 真实接口路径，会拼接到 apiBase 后面
   */
  function getUrl(mockPath: string, realPath?: string): string {
    if (useMock) return mockPath
    return `${apiBase}${realPath ?? mockPath}`
  }

  return { useMock: useMock as boolean, getUrl }
}
