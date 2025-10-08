import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, vi } from 'vitest'

import DashboardPage from './DashboardPage'

vi.mock('../features/live-data/components/LiveTicker', () => ({
  default: () => <div data-testid="live-ticker" />,
}))

const createTestClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

let queryClient: QueryClient

beforeEach(() => {
  queryClient = createTestClient()
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
  ]

  queryClient.setQueryData(['markets', 'usd', 50, 1], marketsFixture)
  queryClient.setQueryData(['markets', 'usd', 20, 1], marketsFixture)
  queryClient.setQueryData(['markets', 'usd', 100, 1], marketsFixture)

  queryClient.setQueryData(['coin-history', 'bitcoin', '7', 'hourly'], {
    prices: [
      [Date.now(), 50000],
      [Date.now() - 86_400_000, 48000],
    ],
    market_caps: [],
    total_volumes: [],
  })
})

const renderWithClient = () =>
  render(
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <DashboardPage />
      </QueryClientProvider>
    </MemoryRouter>,
  )

describe('DashboardPage', () => {
  it('renders the market overview and default assets', () => {
    renderWithClient()

    expect(screen.getByRole('heading', { name: /market overview/i })).toBeInTheDocument()
    expect(screen.getAllByText(/bitcoin/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/ethereum/i).length).toBeGreaterThan(0)
  })
})
