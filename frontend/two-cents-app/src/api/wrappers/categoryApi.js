import { apiClient } from '../client'

export const categoryApi = {
  getAll: async () => {
    const { data } = await apiClient.get('/api/category')
    return data
  },

  getTotals: async () => {
    const { data } = await apiClient.get('/api/category/totals')
    return data
  },

  create: async (payload) => {
    const { data } = await apiClient.post('/api/category', payload)
    return data
  },

  update: async (categoryId, payload) => {
    const { data } = await apiClient.put(`/api/category/${categoryId}`, payload)
    return data
  },

  remove: async (categoryId) => {
    const { data } = await apiClient.delete(`/api/category/${categoryId}`)
    return data
  },

  logExpenditure: async (categoryId, amount) => {
    const { data } = await apiClient.post(`/api/category/${categoryId}/log-expenditure`, { amount })
    return data
  },
}
