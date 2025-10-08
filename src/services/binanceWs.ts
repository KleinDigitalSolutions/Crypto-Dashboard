const DEFAULT_WS_ENDPOINT =
  import.meta.env.VITE_BINANCE_WS_ENDPOINT ?? 'wss://data-stream.binance.vision'

export type ConnectionStatus = 'idle' | 'connecting' | 'open' | 'reconnecting' | 'closed'

export type BinanceTradePayload = {
  e: 'trade'
  E: number
  s: string
  t: number
  p: string
  q: string
  b: number
  a: number
  T: number
  m: boolean
  M: boolean
}

export type CombinedStreamMessage = {
  stream: string
  data: BinanceTradePayload
}

export type BinanceTickerUpdate = {
  symbol: string
  price: number
  quantity: number
  tradeId: number
  eventTime: number
  tradeTime: number
  isBuyerMaker: boolean
  raw: BinanceTradePayload
}

type BinanceWebSocketHandlers = {
  onMessage: (update: BinanceTickerUpdate) => void
  onStatusChange?: (status: ConnectionStatus) => void
  onError?: (event: Event) => void
}

const toStreamName = (symbol: string) => `${symbol.toLowerCase()}@trade`

const createTickerUpdate = (payload: BinanceTradePayload): BinanceTickerUpdate => {
  return {
    symbol: payload.s.toLowerCase(),
    price: Number(payload.p),
    quantity: Number(payload.q),
    tradeId: payload.t,
    eventTime: payload.E,
    tradeTime: payload.T,
    isBuyerMaker: payload.m,
    raw: payload,
  }
}

export class BinanceWebSocketClient {
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private heartbeatTimer: number | null = null;
  private lastMessageAt = Date.now();
  private closedByUser = false;
  private symbols: string[];
  private handlers: BinanceWebSocketHandlers;
  private endpoint: string;

  constructor(
    symbols: string[],
    handlers: BinanceWebSocketHandlers,
    endpoint: string = DEFAULT_WS_ENDPOINT,
  ) {
    this.symbols = symbols;
    this.handlers = handlers;
    this.endpoint = endpoint;
  }

  connect() {
    if (!this.symbols.length) {
      return
    }

    this.closedByUser = false
    this.handlers.onStatusChange?.(this.reconnectAttempts ? 'reconnecting' : 'connecting')

    const streamPath = this.symbols.map(toStreamName).join('/')
    const url = `${this.endpoint}/stream?streams=${streamPath}`

    this.socket = new WebSocket(url)

    this.socket.addEventListener('open', () => {
      this.reconnectAttempts = 0
      this.handlers.onStatusChange?.('open')
      this.startHeartbeat()
    })

    this.socket.addEventListener('message', (event) => {
      this.lastMessageAt = Date.now()
      try {
        const parsed: CombinedStreamMessage = JSON.parse(event.data)
        if (parsed?.data?.e === 'trade') {
          this.handlers.onMessage(createTickerUpdate(parsed.data))
        }
      } catch (error) {
        console.error('Failed to parse Binance message', error)
      }
    })

    this.socket.addEventListener('close', () => {
      this.stopHeartbeat()
      this.handlers.onStatusChange?.('closed')
      if (!this.closedByUser) {
        this.scheduleReconnect()
      }
    })

    this.socket.addEventListener('error', (event) => {
      this.handlers.onError?.(event)
      if (!this.closedByUser) {
        this.socket?.close()
      }
    })
  }

  disconnect() {
    this.closedByUser = true
    this.stopHeartbeat()
    if (this.socket && this.socket.readyState <= WebSocket.OPEN) {
      this.socket.close()
    }
    this.socket = null
    this.handlers.onStatusChange?.('closed')
  }

  private startHeartbeat() {
    this.stopHeartbeat()
    this.heartbeatTimer = window.setInterval(() => {
      if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
        return
      }

      const idleFor = Date.now() - this.lastMessageAt
      if (idleFor > 45_000) {
        try {
          this.socket.send(JSON.stringify({ method: 'PING' }))
        } catch (error) {
          console.warn('Failed to send heartbeat', error)
        }
      }
    }, 30_000)
  }

  private stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }

  private scheduleReconnect() {
    this.reconnectAttempts += 1;
    const delay = Math.min(1000 * 2 ** (this.reconnectAttempts - 1), 15_000);
    this.handlers.onStatusChange?.('reconnecting');

    window.setTimeout(() => {
      if (this.closedByUser) {
        return;
      }
      this.connect();
    }, delay);
  }
}

export default BinanceWebSocketClient;
