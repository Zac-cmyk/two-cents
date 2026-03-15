import { apiClient } from '../client'

export const healthApi = {
  check: async () => {
    const { data } = await apiClient.get('/api/health')
    return data
  },
}
