import { apiClient } from '../client'

export const petApi = {
  getMe: async () => {
    const { data } = await apiClient.get('/api/pets/me')
    return data
  },

  getProgress: async () => {
    const { data } = await apiClient.get('/api/pets/me/progress')
    return data
  },

  createMe: async (payload = {}) => {
    const { data } = await apiClient.post('/api/pets/me', payload)
    return data
  },

  updateMe: async (payload) => {
    const { data } = await apiClient.put('/api/pets/me', payload)
    return data
  },

  interact: async ({ affection = 1, feed = 0 } = {}) => {
    const { data } = await apiClient.post('/api/pets/me/interact', { affection, feed })
    return data
  },

  applyInactivity: async (inactive_days) => {
    const { data } = await apiClient.post('/api/pets/me/inactivity', { inactive_days })
    return data
  },
}
