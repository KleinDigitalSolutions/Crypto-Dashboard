import axios from 'axios'

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'https://api.coingecko.com/api/v3',
  timeout: 10_000,
})

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API error', error.response.status, error.response.data)
    } else {
      console.error('Network error', error.message)
    }
    return Promise.reject(error)
  },
)

export default axiosClient
