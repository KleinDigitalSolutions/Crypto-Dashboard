import { http,HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'

import { server } from '../tests/server'
import { getCoinDetails, getCoinHistory, getMarkets } from './coingecko'

describe('coingecko service', () => {
  it('fetches market data successfully', async () => {
    server.use(
      http.get('https://api.coingecko.com/api/v3/coins/markets', () =>
        HttpResponse.json([
          {
            id: 'bitcoin',
            symbol: 'btc',
            name: 'Bitcoin',
            image: '',
            current_price: 123,
            market_cap: 1,
            market_cap_rank: 1,
            total_volume: 1,
            price_change_percentage_24h: 0,
          },
        ]),
      ),
    )

    const data = await getMarkets({ vsCurrency: 'usd', perPage: 1, page: 1 })
    expect(data).toHaveLength(1)
    expect(data[0].id).toBe('bitcoin')
  })

  it('retries market request on HTTP 429', async () => {
    let attempts = 0
    server.use(
      http.get('https://api.coingecko.com/api/v3/coins/markets', () => {
        attempts += 1
        if (attempts < 2) {
          return new HttpResponse(null, { status: 429 })
        }
        return HttpResponse.json([
          {
            id: 'ethereum',
            symbol: 'eth',
            name: 'Ethereum',
            image: '',
            current_price: 2000,
            market_cap: 1,
            market_cap_rank: 2,
            total_volume: 1,
            price_change_percentage_24h: 0,
          },
        ])
      }),
    )

    const data = await getMarkets({ vsCurrency: 'usd', perPage: 1, page: 1 })
    expect(attempts).toBe(2)
    expect(data[0].id).toBe('ethereum')
  })

  it('fetches coin history with correct params', async () => {
    server.use(
      http.get('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart', () =>
        HttpResponse.json({
          prices: [[1, 100], [2, 110]],
          market_caps: [],
          total_volumes: [],
        }),
      ),
    )

    const history = await getCoinHistory({ id: 'bitcoin', days: 7, interval: 'hourly' })
    expect(history.prices).toHaveLength(2)
  })

  it('fetches coin details', async () => {
    server.use(
      http.get('https://api.coingecko.com/api/v3/coins/bitcoin', () =>
        HttpResponse.json({
          id: 'bitcoin',
          symbol: 'btc',
          name: 'Bitcoin',
          description: { en: 'The first cryptocurrency.' },
          image: { large: 'https://example.com/btc.png' },
          market_data: {
            current_price: { usd: 123 },
            market_cap: { usd: 123456 },
          },
        }),
      ),
    )

    const details = await getCoinDetails('bitcoin')
    expect(details.name).toBe('Bitcoin')
    expect(details.market_data?.current_price?.usd).toBe(123)
  })
})
