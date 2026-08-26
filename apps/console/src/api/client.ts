import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api'

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 30_000,
})

// Attach auth token if present
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('resonance_token')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

// Normalise errors
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('resonance_token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  },
)

export const WS_URL = import.meta.env.VITE_WS_URL ?? `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/ws`
