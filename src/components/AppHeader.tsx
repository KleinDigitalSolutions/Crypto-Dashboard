import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import demoMarkets from '../features/market-data/data/demoMarkets'
import useMarketsQuery from '../features/market-data/hooks/useMarketsQuery'
import useWatchlist from '../store/useWatchlist'

const ThemeToggle = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
    // Placeholder: actual theme switch can be wired to CSS variables later
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-accent hover:text-accent"
      aria-label="Toggle theme"
    >
      <span className="h-2 w-2 rounded-full bg-accent" />
      {theme === 'dark' ? 'Dark' : 'Light'} Mode
    </button>
  )
}

const SearchBar = () => {
  const [search, setSearch] = useState('')
  const watchlist = useWatchlist()
  const navigate = useNavigate()
  const { data: liveMarkets } = useMarketsQuery({ vsCurrency: 'usd', perPage: 50, page: 1 })

  const markets = liveMarkets ?? demoMarkets

  const filtered = useMemo(() => {
    if (!search.trim()) {
      return []
    }
    const query = search.toLowerCase()
    return markets
      .filter((market) =>
        market.name.toLowerCase().includes(query) || market.symbol.toLowerCase().includes(query),
      )
      .slice(0, 6)
  }, [markets, search])

  const handleAdd = (marketId: string) => {
    const market = markets.find((entry) => entry.id === marketId)
    if (!market) {
      return
    }
    watchlist.add({ id: market.id, symbol: market.symbol, name: market.name })
    setSearch('')
  }

  const handleNavigate = (marketId: string) => {
    setSearch('')
    navigate(`/coins/${marketId}`)
  }

  return (
    <div className="relative w-full max-w-md">
      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search markets…"
        className="w-full rounded-2xl border border-slate-700 bg-surface/70 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-accent"
        aria-label="Search markets"
      />
      {search && (
        <ul className="absolute z-30 mt-2 w-full divide-y divide-slate-800 overflow-hidden rounded-2xl border border-slate-800 bg-surface/95 shadow-lg">
          {filtered.length === 0 && (
            <li className="px-4 py-3 text-xs text-slate-400">No matches</li>
          )}
          {filtered.map((market) => {
            const isWatched = watchlist.items.some((item) => item.id === market.id)
            return (
              <li key={market.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                <button
                  type="button"
                  onClick={() => handleNavigate(market.id)}
                  className="text-left"
                >
                  <p className="font-medium text-slate-100">{market.name}</p>
                  <p className="text-xs uppercase tracking-wide text-slate-500">{market.symbol}</p>
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-300 transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={() => handleAdd(market.id)}
                  disabled={isWatched}
                >
                  {isWatched ? 'Tracked' : 'Watch'}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

const AppHeader = () => {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-800 bg-surface/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-lg font-semibold text-slate-100">Crypto Dashboard</p>
          <p className="text-sm text-slate-400">Market pulse at a glance</p>
        </div>
        <div className="flex flex-1 flex-col items-stretch gap-3 lg:flex-row lg:items-center lg:gap-4">
          <SearchBar />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <nav className="hidden items-center gap-4 text-sm text-slate-300 md:flex" aria-label="Primary navigation">
              <a className="transition hover:text-accent" href="https://vite.dev" target="_blank" rel="noreferrer noopener">
                Vite Docs
              </a>
              <a className="transition hover:text-accent" href="https://react.dev" target="_blank" rel="noreferrer noopener">
                React Docs
              </a>
              <a className="transition hover:text-accent" href="https://tailwindcss.com" target="_blank" rel="noreferrer noopener">
                Tailwind Docs
              </a>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}

export default AppHeader
