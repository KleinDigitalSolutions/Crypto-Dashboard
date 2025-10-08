import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/outline'
import { useMemo, useState } from 'react'

import Skeleton from '../../../components/loaders/Skeleton'
import { formatCurrency, formatPercent } from '../../../lib/formatters'
import type { Market } from '../../../services/coingecko'
import useWatchlist from '../../../store/useWatchlist'
import demoMarkets from '../data/demoMarkets'
import useMarketsQuery from '../hooks/useMarketsQuery'

const sorters = {
  price: (a: Market, b: Market) => b.current_price - a.current_price,
  change24h: (a: Market, b: Market) => b.price_change_percentage_24h - a.price_change_percentage_24h,
  marketCap: (a: Market, b: Market) => b.market_cap - a.market_cap,
}

type SortKey = keyof typeof sorters

const SORT_OPTIONS: { label: string; key: SortKey }[] = [
  { label: 'Price', key: 'price' },
  { label: '24h %', key: 'change24h' },
  { label: 'Market Cap', key: 'marketCap' },
]

type MarketsTableProps = {
  vsCurrency: string
}

const MarketsTable = ({ vsCurrency }: MarketsTableProps) => {
  const { data, isLoading, isError, refetch } = useMarketsQuery({ vsCurrency, perPage: 20, page: 1 })
  const [sortKey, setSortKey] = useState<SortKey>('marketCap')
  const [showOnlyTop10, setShowOnlyTop10] = useState(false)
  const watchlist = useWatchlist();

  const markets = useMemo(() => {
    const source = Array.isArray(data) ? data : demoMarkets;
    const sorted = [...source].sort(sorters[sortKey]);
    return showOnlyTop10 ? sorted.slice(0, 10) : sorted;
  }, [data, showOnlyTop10, sortKey]);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-14" />
        ))}
      </div>
    )
  }

  if (isError && markets.length === 0) {
    return (
      <div className="space-y-2 rounded-2xl border border-rose-800/60 bg-rose-500/10 p-6 text-sm text-rose-200">
        <p>Failed to load markets right now.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-lg border border-rose-400/40 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-rose-200"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!markets.length) {
    return <p className="text-sm text-slate-400">No market data available.</p>
  }

  return (
    <div className="space-y-4">
      {isError && markets.length > 0 && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-xs text-amber-200">
          Live data ist aktuell nicht erreichbar. Zeige gecachte Werte.
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setSortKey(option.key)}
              className={`flex items-center gap-1 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                sortKey === option.key
                  ? 'border-accent/60 bg-accent/10 text-accent'
                  : 'border-slate-700 bg-slate-800/40 text-slate-300 hover:border-accent/40 hover:text-accent'
              }`}
              aria-pressed={sortKey === option.key}
            >
              {option.label}
              {sortKey === option.key ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-xs text-slate-400">
          <input
            type="checkbox"
            checked={showOnlyTop10}
            onChange={(event) => setShowOnlyTop10(event.target.checked)}
            className="h-4 w-4 rounded border-slate-600 bg-slate-800 accent-accent"
          />
          Show Top 10 only
        </label>
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-800">
        <table className="min-w-full divide-y divide-slate-800 text-sm">
          <thead className="bg-surface/90 text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th scope="col" className="px-4 py-3 text-left">
                Coin
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                Price ({vsCurrency.toUpperCase()})
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                24h %
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                Market Cap
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                Volume 24h
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                Watchlist
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {markets.map((market) => {
              const isPositive = market.price_change_percentage_24h >= 0
              const isWatched = watchlist.items.some((item) => item.id === market.id)
              return (
                <tr
                  key={market.id}
                  className="bg-surface/60 transition hover:bg-surface/90"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={market.image} alt="" className="h-8 w-8 rounded-full" loading="lazy" />
                      <div>
                        <p className="font-semibold text-slate-100">{market.name}</p>
                        <p className="text-xs uppercase tracking-wide text-slate-500">{market.symbol}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-slate-100">
                    {formatCurrency(market.current_price, vsCurrency.toUpperCase())}
                  </td>
                  <td
                    className={`px-4 py-3 text-right text-sm font-semibold ${
                      isPositive ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {formatPercent(market.price_change_percentage_24h)}
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-slate-300">
                    {formatCurrency(market.market_cap, vsCurrency.toUpperCase())}
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-slate-300">
                    {formatCurrency(market.total_volume, vsCurrency.toUpperCase())}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() =>
                        isWatched
                          ? watchlist.remove(market.id)
                          : watchlist.add({ id: market.id, name: market.name, symbol: market.symbol })
                      }
                      className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                        isWatched
                          ? 'border-emerald-500/40 text-emerald-400 hover:border-emerald-400'
                          : 'border-slate-700 text-slate-300 hover:border-accent hover:text-accent'
                      }`}
                    >
                      {isWatched ? 'Remove' : 'Add'}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MarketsTable
