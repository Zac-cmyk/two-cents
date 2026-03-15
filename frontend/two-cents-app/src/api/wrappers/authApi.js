import { apiClient } from '../client'

export const authApi = {
  login: async ({ identifier, password }) => {
    const { data } = await apiClient.post('/api/auth/login', { identifier, password })
    return data
  },

  register: async ({ email, username, name, password, profile_picture = null }) => {
    const { data } = await apiClient.post('/api/auth/register', {
      email,
      username,
      name,
      password,
      profile_picture,
    })
    return data
  },

  me: async () => {
    const { data } = await apiClient.get('/api/auth/me')
    return data
  },

  logout: async () => {
    const { data } = await apiClient.post('/api/auth/logout')
    return data
  },

  googleLogin: async ({ idToken }) => {
    const { data } = await apiClient.post('/api/auth/google', { idToken })
    return data
  },
}
