import AppFooter from '../components/AppFooter'
import AppHeader from '../components/AppHeader'
import LiveTicker from '../features/live-data/components/LiveTicker'
import MarketOverview from '../features/market-data/components/MarketOverview'
import MarketsTable from '../features/market-data/components/MarketsTable'
import PriceChart from '../features/market-data/components/PriceChart'
import WatchlistPanel from '../features/watchlist/WatchlistPanel'
import usePageMetadata from '../hooks/usePageMetadata'

const sidebarLinks = [
  { label: 'Dashboard', href: '#dashboard' },
  { label: 'Markets', href: '#markets' },
  { label: 'Watchlist', href: '#watchlist' },
  { label: 'Activity', href: '#activity' },
]

const DashboardPage = () => {
  usePageMetadata({
    title: 'Crypto Dashboard · Markets Overview',
    description: 'Track top crypto markets, your watchlist, live trades, and price charts in one dashboard.',
  })

  return (
    <div className="flex min-h-screen flex-col bg-background text-slate-100">
      <AppHeader />
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row">
        <aside className="order-last hidden w-full max-w-xs flex-shrink-0 rounded-2xl border border-slate-800 bg-surface/70 p-5 lg:order-first lg:block">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Navigation</h2>
          <nav className="mt-4 space-y-2" aria-label="Sidebar">
            {sidebarLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800/80 hover:text-accent"
              >
                <span>{link.label}</span>
                <span aria-hidden className="text-xs text-slate-500">{'>'}</span>
              </a>
            ))}
          </nav>
        </aside>
        <main className="flex-1 space-y-6" id="dashboard">
          <section
            id="markets"
            aria-labelledby="market-overview-title"
            className="rounded-2xl border border-slate-800 bg-surface/70 p-6 shadow-lg shadow-black/10"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-xl font-semibold text-slate-100">Market Overview</h1>
                <p className="text-sm text-slate-400">Aggregated snapshot of leading crypto assets</p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-4 py-2 text-xs text-slate-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" /> Live data
              </span>
            </div>
            <div className="mt-6">
              <MarketOverview />
            </div>
          </section>

          <section
            id="markets-table"
            aria-labelledby="markets-table-title"
            className="rounded-2xl border border-slate-800 bg-surface/70 p-6"
          >
            <h2 id="markets-table-title" className="text-lg font-semibold text-slate-100">
              Top Markets
            </h2>
            <p className="text-sm text-slate-400">Sort and filter leading cryptocurrencies</p>
            <div className="mt-6">
              <MarketsTable vsCurrency="usd" />
            </div>
          </section>

          <section
            id="ticker"
            aria-labelledby="live-ticker-title"
            className="rounded-2xl border border-slate-800 bg-surface/70 p-6"
          >
            <div className="flex items-center justify-between">
              <h2 id="live-ticker-title" className="text-lg font-semibold text-slate-100">
                Live Ticker
              </h2>
              <span className="text-xs text-slate-500">BTCUSDT · ETHUSDT · SOLUSDT</span>
            </div>
            <div className="mt-5">
              <LiveTicker symbols={['btcusdt', 'ethusdt', 'solusdt']} />
            </div>
          </section>

          <section
            id="watchlist"
            aria-labelledby="watchlist-title"
            className="rounded-2xl border border-slate-800 bg-surface/70 p-6"
          >
            <div className="flex items-center justify-between">
              <h2 id="watchlist-title" className="text-lg font-semibold text-slate-100">
                Watchlist
              </h2>
            </div>
            <div className="mt-4">
              <WatchlistPanel />
            </div>
          </section>

          <section
            id="price-chart"
            aria-labelledby="price-chart-title"
            className="rounded-2xl border border-slate-800 bg-surface/70 p-6"
          >
            <h2 id="price-chart-title" className="text-lg font-semibold text-slate-100">
              BTC Price Chart
            </h2>
            <p className="text-sm text-slate-400">Switch ranges to explore trends</p>
            <div className="mt-6">
              <PriceChart coinId="bitcoin" vsCurrency="usd" />
            </div>
          </section>
        </main>
      </div>
      <AppFooter />
    </div>
  )
}

export default DashboardPage
