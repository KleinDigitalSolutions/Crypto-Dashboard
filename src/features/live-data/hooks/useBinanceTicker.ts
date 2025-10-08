import { useEffect, useMemo, useRef, useState } from 'react'

import BinanceWebSocketClient, {
  type BinanceTickerUpdate,
  type ConnectionStatus,
} from '../../../services/binanceWs'

type BinanceTickerState = Record<string, BinanceTickerUpdate>

type UseBinanceTickerResult = {
  data: BinanceTickerState
  status: ConnectionStatus
  lastUpdate?: number
}

const normaliseSymbols = (symbols: string[]) => symbols.map((symbol) => symbol.toLowerCase())

const useBinanceTicker = (symbols: string[]): UseBinanceTickerResult => {
  const [status, setStatus] = useState<ConnectionStatus>('idle')
  const [tickers, setTickers] = useState<BinanceTickerState>({})
  const [lastUpdate, setLastUpdate] = useState<number | undefined>(undefined)
  const clientRef = useRef<BinanceWebSocketClient | null>(null)

  const normalised = useMemo(() => normaliseSymbols(symbols).sort(), [symbols])
  const key = normalised.join(',')

  useEffect(() => {
    if (!normalised.length) {
      clientRef.current?.disconnect()
      setTickers({})
      setStatus('closed')
      return
    }

    const client = new BinanceWebSocketClient(normalised, {
      onMessage: (update) => {
        setTickers((prev) => ({ ...prev, [update.symbol]: update }))
        setLastUpdate(Date.now())
      },
      onStatusChange: setStatus,
      onError: (event) => {
        console.error('Binance WebSocket error', event)
      },
    })

    clientRef.current = client
    client.connect()

    return () => {
      clientRef.current?.disconnect()
      clientRef.current = null
    }
  }, [key, normalised])

  return {
    data: tickers,
    status,
    lastUpdate,
  }
}

export default useBinanceTicker
