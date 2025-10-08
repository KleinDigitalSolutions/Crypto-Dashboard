import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'

import AppFooter from '../components/AppFooter'
import AppHeader from '../components/AppHeader'
import Skeleton from '../components/loaders/Skeleton'
import PriceChart from '../features/market-data/components/PriceChart'
import demoMarkets from '../features/market-data/data/demoMarkets'
import useCoinDetailsQuery from '../features/market-data/hooks/useCoinDetailsQuery'
import useMarketsQuery from '../features/market-data/hooks/useMarketsQuery'
import usePageMetadata from '../hooks/usePageMetadata'
import { formatCurrency, formatPercent } from '../lib/formatters'

const CoinPage = () => {
  const { id = '' } = useParams()
  const { data: markets, isLoading: isMarketsLoading } = useMarketsQuery({ vsCurrency: 'usd', perPage: 100, page: 1 })
  const { data: coinDetails, isLoading: isCoinLoading, isError } = useCoinDetailsQuery(id)

  const fallbackCoin = useMemo(() => {
    const source = Array.isArray(markets) ? markets : demoMarkets
    return source.find((entry) => entry.id === id)
  }, [id, markets])

  const targetCoinId = id ?? fallbackCoin?.id ?? ''

  const displayName = coinDetails?.name ?? fallbackCoin?.name
  const displaySymbol = (coinDetails?.symbol ?? fallbackCoin?.symbol)?.toUpperCase()
  const imageUrl = coinDetails?.image?.large ?? fallbackCoin?.image

  const marketData = coinDetails?.market_data
  const currentPrice = marketData?.current_price?.usd ?? fallbackCoin?.current_price
  const marketCap = marketData?.market_cap?.usd ?? fallbackCoin?.market_cap
  const priceChange24h = marketData?.price_change_percentage_24h ?? fallbackCoin?.price_change_percentage_24h
  const high24h = marketData?.high_24h?.usd
  const low24h = marketData?.low_24h?.usd
  const circulatingSupply = marketData?.circulating_supply
  const totalSupply = marketData?.total_supply ?? undefined

  const description = useMemo(() => {
    const raw = coinDetails?.description?.en
    if (!raw) {
      return undefined
    }
    const plain = raw.replace(/<[^>]+>/g, '').replace(/\n+/g, ' ').trim()
    return plain.length > 320 ? `${plain.slice(0, 320)}…` : plain
  }, [coinDetails])

  usePageMetadata({
    title: displayName ? `${displayName} · Crypto Dashboard` : 'Asset Details · Crypto Dashboard',
    description: displayName
      ? `Analyse price history and stats for ${displayName}${displaySymbol ? ` (${displaySymbol})` : ''}.`
      : 'Asset detail view with interactive price chart.',
  })

  const isLoadingState = (!fallbackCoin && isMarketsLoading) || (isCoinLoading && !coinDetails)

  return (
    <div className="flex min-h-screen flex-col bg-background text-slate-100">
      <AppHeader />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
        <Link to="/" className="text-xs font-semibold uppercase tracking-wide text-accent">
          ← Back to dashboard
        </Link>
        {isLoadingState ? (
          <div className="space-y-4">
            <Skeleton className="h-16" />
            <Skeleton className="h-72" />
          </div>
        ) : displayName ? (
          <section className="space-y-6 rounded-2xl border border-slate-800 bg-surface/70 p-6">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                {imageUrl ? (
                  <img src={imageUrl} alt="" className="h-12 w-12 rounded-full" loading="lazy" />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-slate-800" />
                )}
                <div>
                  <h1 className="text-2xl font-semibold text-slate-100">{displayName}</h1>
                  {displaySymbol && (
                    <p className="text-sm uppercase tracking-wide text-slate-500">{displaySymbol}</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                {currentPrice !== undefined && (
                  <p className="text-lg font-semibold text-slate-100">
                    {formatCurrency(currentPrice, 'USD')}
                  </p>
                )}
                {fallbackCoin?.market_cap_rank && (
                  <p className="text-xs text-slate-500">Market Cap #{fallbackCoin.market_cap_rank}</p>
                )}
              </div>
            </header>
            {description && (
              <p className="text-sm leading-relaxed text-slate-300">{description}</p>
            )}
            <div className="grid gap-4 rounded-xl border border-slate-800/60 bg-surface/60 p-4 text-sm text-slate-300 sm:grid-cols-2">
              {priceChange24h !== undefined && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">24h Change</p>
                  <p className={`mt-1 font-semibold ${priceChange24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {formatPercent(priceChange24h)}
                  </p>
                </div>
              )}
              {marketCap !== undefined && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Market Cap</p>
                  <p className="mt-1 font-semibold text-slate-100">{formatCurrency(marketCap)}</p>
                </div>
              )}
              {high24h !== undefined && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">24h High</p>
                  <p className="mt-1 font-semibold text-slate-100">{formatCurrency(high24h)}</p>
                </div>
              )}
              {low24h !== undefined && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">24h Low</p>
                  <p className="mt-1 font-semibold text-slate-100">{formatCurrency(low24h)}</p>
                </div>
              )}
              {circulatingSupply !== undefined && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Circulating Supply</p>
                  <p className="mt-1 font-semibold text-slate-100">
                    {circulatingSupply.toLocaleString()} {displaySymbol}
                  </p>
                </div>
              )}
              {totalSupply !== undefined && totalSupply !== null && (
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Total Supply</p>
                  <p className="mt-1 font-semibold text-slate-100">
                    {totalSupply ? totalSupply.toLocaleString() : '—'} {displaySymbol}
                  </p>
                </div>
              )}
            </div>
            {targetCoinId ? <PriceChart coinId={targetCoinId} vsCurrency="usd" /> : null}
            {isError && (
              <p className="text-xs text-amber-300">
                Live Detaildaten konnten nicht aktualisiert werden. Angezeigte Werte stammen aus zuletzt bekannten Daten.
              </p>
            )}
          </section>
        ) : (
          <section className="rounded-2xl border border-rose-800/60 bg-rose-500/10 p-6 text-sm text-rose-200">
            <p>We could not find this asset. Please return to the dashboard.</p>
          </section>
        )}
      </main>
      <AppFooter />
    </div>
  )
}

export default CoinPage
