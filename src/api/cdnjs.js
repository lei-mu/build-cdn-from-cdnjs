import cdnHttp from '@/request/cdnHttp'

// 搜索
export const search = (params) => cdnHttp.get('/libraries', { params })

// 查询特定库
export const packageInfo = (library, params) => cdnHttp.get(`/libraries/${library}`, { params })

// 查询特定库特定版本
export const packageCurrentInfo = (library, version, params) => cdnHttp.get(`/libraries/${library}/${version}`, { params })
