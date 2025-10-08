import { useMemo } from 'react'

import Skeleton from '../../components/loaders/Skeleton'
import { formatCurrency, formatPercent } from '../../lib/formatters'
import useWatchlist from '../../store/useWatchlist'
import demoMarkets from '../market-data/data/demoMarkets'
import useMarketsQuery from '../market-data/hooks/useMarketsQuery'

const WatchlistPanel = () => {
  const watchlist = useWatchlist()
  const { data: liveMarkets, isLoading } = useMarketsQuery({ vsCurrency: 'usd', perPage: 100, page: 1 })
  const markets = liveMarkets ?? demoMarkets

  const items = useMemo(() => {
    if (!markets) {
      return []
    }
    return watchlist.items
      .map((item) => markets.find((market) => market.id === item.id))
      .filter(Boolean)
  }, [markets, watchlist.items])

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-12" />
        ))}
      </div>
    )
  }

  if (!items.length) {
    return <p className="text-sm text-slate-500">Add assets to your watchlist to track them here.</p>
  }

  return (
    <ul className="space-y-3">
      {items.map((market) => {
        if (!market) {
          return null
        }
        const isPositive = market.price_change_percentage_24h >= 0
        return (
          <li
            key={market.id}
            className="flex items-center justify-between rounded-xl border border-slate-800 bg-surface/70 px-4 py-3 text-sm"
          >
            <div>
              <p className="font-semibold text-slate-100">{market.name}</p>
              <p className="text-xs uppercase tracking-wide text-slate-500">{market.symbol}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-slate-100">{formatCurrency(market.current_price)}</p>
              <p className={`text-xs ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {formatPercent(market.price_change_percentage_24h)}
              </p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default WatchlistPanel
