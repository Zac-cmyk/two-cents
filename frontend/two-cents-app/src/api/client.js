import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://two-cents-omega.vercel.app'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 15000,
})

export const getApiErrorMessage = (error, fallback = 'Something went wrong') => {
  if (error?.response?.data?.error) {
    return error.response.data.error
  }

  if (error?.message) {
    return error.message
  }

  return fallback
}
