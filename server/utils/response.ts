/**
 * 统一接口响应格式工具函数
 */
export interface PageInfo {
  total: number
  pageNo: number
  rownumber: number
}

export interface ApiResponse<T = unknown> {
  data: T
  page?: PageInfo
  state: 'SUCCESS' | 'ERROR'
  message?: string
}

/** 创建成功响应 */
export function createSuccessResponse<T>(
  data: T,
  page?: PageInfo,
): ApiResponse<T> {
  const res: ApiResponse<T> = { data, state: 'SUCCESS' }
  if (page) res.page = page
  return res
}

/** 创建错误响应 */
export function createErrorResponse(message: string): ApiResponse<null> {
  return { data: null, state: 'ERROR', message }
}
