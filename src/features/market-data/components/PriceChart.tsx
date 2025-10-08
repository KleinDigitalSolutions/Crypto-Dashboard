import { useMemo, useState } from 'react'
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import Skeleton from '../../../components/loaders/Skeleton'
import { formatCurrency } from '../../../lib/formatters'
import useCoinHistoryQuery from '../hooks/useCoinHistoryQuery'

const RANGE_OPTIONS = [
  { label: '24h', value: '1' },
  { label: '7d', value: '7' },
  { label: '30d', value: '30' },
]

type PriceChartProps = {
  coinId: string
  vsCurrency: string
}

const PriceChart = ({ coinId, vsCurrency }: PriceChartProps) => {
  const [range, setRange] = useState<string>('7')
  const { data, isLoading } = useCoinHistoryQuery({ id: coinId, days: range, interval: 'hourly' })

  const chartData = useMemo(() => {
    if (!data?.prices) {
      return []
    }
    return data.prices.map(([timestamp, price]) => ({
      time: new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price,
    }))
  }, [data])

  if (isLoading) {
    return <Skeleton className="h-64" />
  }

  if (!chartData.length) {
    return <p className="text-sm text-slate-500">No chart data available.</p>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">Price History</h3>
          <p className="text-xs text-slate-500">{coinId.toUpperCase()} vs {vsCurrency.toUpperCase()}</p>
        </div>
        <div className="flex gap-2">
          {RANGE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setRange(option.value)}
              className={`rounded-xl px-3 py-1 text-xs font-semibold transition ${
                range === option.value
                  ? 'bg-accent/20 text-accent'
                  : 'bg-slate-800/50 text-slate-400 hover:text-accent'
              }`}
              aria-pressed={range === option.value}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
          <XAxis dataKey="time" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} minTickGap={24} />
          <YAxis
            stroke="#475569"
            fontSize={12}
            tickFormatter={(value) => formatCurrency(value, vsCurrency.toUpperCase())}
            width={100}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ stroke: '#38bdf880', strokeWidth: 1 }}
            contentStyle={{
              backgroundColor: '#0f172a',
              borderRadius: 12,
              border: '1px solid #1e293b',
              color: '#e2e8f0',
            }}
            labelStyle={{ color: '#94a3b8' }}
            formatter={(value: number) => formatCurrency(value, vsCurrency.toUpperCase())}
          />
          <Line type="monotone" dataKey="price" stroke="#38bdf8" strokeWidth={2} dot={false} activeDot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default PriceChart
