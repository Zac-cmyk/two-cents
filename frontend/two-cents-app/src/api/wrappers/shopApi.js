import { apiClient } from '../client'

export const shopApi = {
  createForUser: async (userId) => {
    const { data } = await apiClient.post('/api/shops', { userId })
    return data
  },

  getByUserId: async (userId) => {
    const { data } = await apiClient.get(`/api/shops/user/${userId}`)
    return data
  },

  getItemsByShopId: async (shopId) => {
    const { data } = await apiClient.get(`/api/shops/${shopId}/items`)
    return data
  },

  purchase: async ({ user_id, item_id }) => {
    const { data } = await apiClient.post('/api/shops/purchase', { user_id, item_id })
    return data
  },
}
