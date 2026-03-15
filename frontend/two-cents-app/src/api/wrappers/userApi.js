import { apiClient } from '../client'

export const userApi = {
  getMe: async () => {
    const { data } = await apiClient.get('/api/users/me')
    return data
  },

  setIncome: async (income) => {
    const { data } = await apiClient.put('/api/users/income', { income })
    return data
  },

  setPayPeriod: async (pay_period) => {
    const { data } = await apiClient.put('/api/users/pay_period', { pay_period })
    return data
  },

  setActiveDay: async () => {
    const { data } = await apiClient.put('/api/users/active_day')
    return data
  },
}
