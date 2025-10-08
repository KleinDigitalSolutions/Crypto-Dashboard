import { useMemo, useState } from 'react'

import useInterval from '../../../hooks/useInterval'
import { formatCompactNumber, formatCurrency, formatPercent } from '../../../lib/formatters'

type Asset = {
  name: string
  symbol: string
  price: number
  change24h: number
  volume: number
  marketCap: number
}

const seedAssets: Asset[] = [
  {
    name: 'Bitcoin',
    symbol: 'BTC',
    price: 67123,
    change24h: 1.85,
    volume: 32_120_000_000,
    marketCap: 1_320_000_000_000,
  },
  {
    name: 'Ethereum',
    symbol: 'ETH',
    price: 3450.22,
    change24h: -0.74,
    volume: 16_940_000_000,
    marketCap: 420_000_000_000,
  },
  {
    name: 'Solana',
    symbol: 'SOL',
    price: 182.56,
    change24h: 3.24,
    volume: 4_320_000_000,
    marketCap: 82_000_000_000,
  },
  {
    name: 'Avalanche',
    symbol: 'AVAX',
    price: 49.72,
    change24h: 0.94,
    volume: 1_520_000_000,
    marketCap: 18_200_000_000,
  },
]

const generateDelta = () => (Math.random() * 2 - 1) * 1.2

const MarketOverview = () => {
  const [assets, setAssets] = useState<Asset[]>(seedAssets)

  const trendSummary = useMemo(() => {
    const movers = assets.reduce(
      (acc, asset) => {
        if (asset.change24h >= 0) {
          acc.gainers += 1
        } else {
          acc.decliners += 1
        }
        return acc
      },
      { gainers: 0, decliners: 0 },
    )

    return `${movers.gainers} gainers · ${movers.decliners} decliners`
  }, [assets])

  useInterval(() => {
    setAssets((current) =>
      current.map((asset) => {
        const delta = generateDelta()
        const price = Math.max(asset.price * (1 + delta / 100), 0)
        const change24h = Math.max(Math.min(asset.change24h + delta / 8, 12), -12)

        return {
          ...asset,
          price,
          change24h,
          volume: Math.max(asset.volume * (1 + delta / 10), 0),
          marketCap: Math.max(asset.marketCap * (1 + delta / 12), 0),
        }
      }),
    )
  }, 5000)

  return (
    <>
      <p className="text-sm text-slate-400" aria-live="polite">
        {trendSummary}
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {assets.map((asset) => {
          const isPositive = asset.change24h >= 0

          return (
            <article
              key={asset.symbol}
              className="group space-y-4 rounded-2xl border border-slate-800 bg-surface/80 p-5 transition hover:-translate-y-1 hover:border-accent/60"
            >
              <header className="flex items-center justify-between text-sm font-semibold text-accent">
                <span>{asset.name}</span>
                <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs uppercase tracking-wide text-accent">
                  {asset.symbol}
                </span>
              </header>
              <p className="text-2xl font-semibold text-slate-100">{formatCurrency(asset.price)}</p>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span
                  className={
                    isPositive
                      ? 'font-semibold text-emerald-400'
                      : 'font-semibold text-rose-400'
                  }
                >
                  {formatPercent(asset.change24h)}
                </span>
                <span>24h Vol · {formatCompactNumber(asset.volume)}</span>
              </div>
              <div
                className="flex items-center justify-between text-xs text-slate-500"
                aria-label="Market capitalization"
              >
                <span>Market Cap</span>
                <span>{formatCompactNumber(asset.marketCap)}</span>
              </div>
            </article>
          )
        })}
      </div>
    </>
  )
}

export default MarketOverview
