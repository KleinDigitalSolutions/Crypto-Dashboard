import type { AxiosError, AxiosRequestConfig } from 'axios'

import axiosClient from '../lib/axios'

const API_KEY = import.meta.env.VITE_COINGECKO_API_KEY
const API_KEY_PARAM = import.meta.env.VITE_COINGECKO_API_KEY_PARAM ?? 'x_cg_demo_api_key'

const withRetry = async <T>(request: () => Promise<T>, retries = 3, baseDelay = 500): Promise<T> => {
  let attempt = 0
  while (true) {
    try {
      return await request()
    } catch (err) {
      const error = err as AxiosError
      const status = error.response?.status
      if (status === 429 && attempt < retries) {
        const delay = baseDelay * 2 ** attempt
        await new Promise((resolve) => setTimeout(resolve, delay))
        attempt += 1
        continue
      }
      throw error
    }
  }
}

const appendKey = (config: AxiosRequestConfig) => {
  if (!API_KEY) {
    return config
  }

  const params = {
    ...(config.params ?? {}),
    [API_KEY_PARAM]: API_KEY,
  }

  return {
    ...config,
    params,
  }
}

export type GetMarketsParams = {
  vsCurrency: string
  perPage?: number
  page?: number
}

export type Market = {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  total_volume: number
  price_change_percentage_24h: number
}

export const getMarkets = async ({
  vsCurrency,
  perPage = 20,
  page = 1,
}: GetMarketsParams): Promise<Market[]> => {
  const config = appendKey({
    url: '/coins/markets',
    method: 'GET',
    params: {
      vs_currency: vsCurrency,
      per_page: perPage,
      page,
      order: 'market_cap_desc',
      price_change_percentage: '1h,24h,7d',
      sparkline: false,
    },
  })

  const response = await withRetry(() => axiosClient.request<Market[]>(config))
  return response.data
}

export type GetCoinHistoryParams = {
  id: string
  days: number | string
  interval?: 'minutely' | 'hourly' | 'daily'
}

export type CoinHistory = {
  prices: [number, number][]
  market_caps: [number, number][]
  total_volumes: [number, number][]
}

export const getCoinHistory = async ({ id, days, interval }: GetCoinHistoryParams): Promise<CoinHistory> => {
  const config = appendKey({
    url: `/coins/${id}/market_chart`,
    method: 'GET',
    params: {
      days,
      interval,
    },
  })

  const response = await withRetry(() => axiosClient.request<CoinHistory>(config))
  return response.data
}

export type CoinDetails = {
  id: string
  symbol: string
  name: string
  description: {
    en?: string
  }
  image: {
    large?: string
    small?: string
    thumb?: string
  }
  market_data?: {
    current_price?: Record<string, number>
    market_cap?: Record<string, number>
    high_24h?: Record<string, number>
    low_24h?: Record<string, number>
    price_change_percentage_24h?: number
    circulating_supply?: number
    total_supply?: number | null
  }
}

export const getCoinDetails = async (id: string): Promise<CoinDetails> => {
  const config = appendKey({
    url: `/coins/${id}`,
    method: 'GET',
    params: {
      localization: false,
      tickers: false,
      community_data: false,
      developer_data: false,
      sparkline: false,
    },
  })

  const response = await withRetry(() => axiosClient.request<CoinDetails>(config))
  return response.data
}
