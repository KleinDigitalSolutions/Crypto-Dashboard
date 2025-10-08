import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { delay, http,HttpResponse } from 'msw'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { server } from '../../../tests/server'
import MarketsTable from './MarketsTable'

const marketsFixture = [
  {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    current_price: 50000,
    market_cap: 900000000,
    market_cap_rank: 1,
    total_volume: 1000000,
    price_change_percentage_24h: 2.5,
  },
  {
    id: 'ethereum',
    symbol: 'eth',
    name: 'Ethereum',
    image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    current_price: 3000,
    market_cap: 400000000,
    market_cap_rank: 2,
    total_volume: 500000,
    price_change_percentage_24h: -1.2,
  },
  {
    id: 'solana',
    symbol: 'sol',
    name: 'Solana',
    image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
    current_price: 180,
    market_cap: 82000000,
    market_cap_rank: 3,
    total_volume: 200000,
    price_change_percentage_24h: 5.1,
  },
]

const setupQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  })

const renderMarketsTable = () => {
  const queryClient = setupQueryClient()
  return render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <MarketsTable vsCurrency="usd" />
      </QueryClientProvider>
    </MemoryRouter>,
  )
}

describe('MarketsTable', () => {
  beforeEach(() => {
    server.use(
      http.get('https://api.coingecko.com/api/v3/coins/markets', () =>
        HttpResponse.json(marketsFixture),
      ),
    )
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('renders market rows once data is resolved', async () => {
    renderMarketsTable()

    expect(await screen.findByText(/bitcoin/i)).toBeInTheDocument()
    expect(screen.getByText(/ethereum/i)).toBeInTheDocument()
  })

  it('sorts markets when a sorter is selected', async () => {
    const user = userEvent.setup()
    renderMarketsTable()

    await screen.findByText(/bitcoin/i)

    await user.click(screen.getByRole('button', { name: /price/i }))

    const rows = screen.getAllByRole('row').slice(1) // skip header
    const firstRow = within(rows[0])
    expect(firstRow.getByText(/bitcoin/i)).toBeInTheDocument()
  })

  it('shows loading skeletons before data arrives', () => {
    server.use(
      http.get('https://api.coingecko.com/api/v3/coins/markets', async () => {
        await delay(200)
        return HttpResponse.json(marketsFixture)
      }),
    )

    renderMarketsTable()

    expect(screen.getAllByRole('status').length).toBeGreaterThan(0)
  })

  it('shows cached data warning when live request fails', async () => {
    server.use(
      http.get('https://api.coingecko.com/api/v3/coins/markets', () =>
        new HttpResponse(null, { status: 500 }),
      ),
    )

    renderMarketsTable()

    expect(await screen.findByText(/Live data ist aktuell nicht erreichbar/i)).toBeInTheDocument()
    expect(screen.getByText(/bitcoin/i)).toBeInTheDocument()
  })
})
