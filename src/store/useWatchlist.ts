import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type WatchlistItem = {
  id: string
  symbol: string
  name: string
}

type WatchlistState = {
  items: WatchlistItem[]
  add: (item: WatchlistItem) => void
  remove: (id: string) => void
  clear: () => void
}

const useWatchlist = create<WatchlistState>()(
  persist(
    (set) => ({
      items: [],
      add: (item) =>
        set((state) => {
          if (state.items.some((existing) => existing.id === item.id)) {
            return state
          }
          return { items: [...state.items, item] }
        }),
      remove: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      clear: () => set({ items: [] }),
    }),
    {
      name: 'crypto-watchlist',
      partialize: (state) => ({ items: state.items }),
    },
  ),
)

export default useWatchlist
