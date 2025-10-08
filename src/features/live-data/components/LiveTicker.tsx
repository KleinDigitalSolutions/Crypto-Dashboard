import { useEffect, useMemo, useRef, useState } from 'react'

import Skeleton from '../../../components/loaders/Skeleton'
import { formatCurrency, formatPercent } from '../../../lib/formatters'
import useBinanceTicker from '../hooks/useBinanceTicker'

const LiveTicker = ({ symbols }: { symbols: string[] }) => {
  const { data, status, lastUpdate } = useBinanceTicker(symbols)

  const updates = useMemo(() => Object.values(data).sort((a, b) => b.eventTime - a.eventTime), [data])
  const previousPriceRef = useRef<Map<string, number>>(new Map())
  const [entries, setEntries] = useState<
    Array<{
      symbol: string
      price: number
      changePct: number
      quantity: number
      updatedAt: number
    }>
  >([])

  useEffect(() => {
    if (!updates.length) {
      return
    }

    const nextEntries = updates.slice(0, 6).map((update) => {
      const prevPrice = previousPriceRef.current.get(update.symbol) ?? update.price
      const changePct = prevPrice ? ((update.price - prevPrice) / prevPrice) * 100 : 0
      previousPriceRef.current.set(update.symbol, update.price)

      return {
        symbol: update.symbol,
        price: update.price,
        changePct,
        quantity: update.quantity,
        updatedAt: update.eventTime,
      }
    })

    setEntries(nextEntries)
  }, [updates])

  if (status === 'connecting' || status === 'reconnecting') {
    return <Skeleton className="h-24" />
  }

  if (status === 'closed' || updates.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-surface/70 p-6 text-sm text-slate-400">
        <p>No live data yet. Waiting for trades…</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-500">
        <span>Live Trades</span>
        {lastUpdate && <span>Updated {new Date(lastUpdate).toLocaleTimeString()}</span>}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {entries.map((entry) => {
          const isPositive = entry.changePct >= 0

          return (
            <article
              key={entry.symbol}
              className="rounded-2xl border border-slate-800 bg-surface/80 p-4 transition-transform duration-300 ease-out hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between text-sm font-semibold text-slate-100">
                <span className="uppercase tracking-wide">{entry.symbol}</span>
                <span className={isPositive ? 'text-emerald-400' : 'text-rose-400'}>
                  {formatPercent(entry.changePct, 2)}
                </span>
              </div>
              <p className="mt-3 text-lg font-semibold text-slate-100">{formatCurrency(entry.price)}</p>
              <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                <span>Qty: {entry.quantity.toFixed(4)}</span>
                <span>{new Date(entry.updatedAt).toLocaleTimeString()}</span>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}

export default LiveTicker
