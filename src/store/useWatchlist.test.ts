import { act } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import useWatchlist from './useWatchlist'

const STORAGE_KEY = 'crypto-watchlist'

const resetStore = () => {
  useWatchlist.setState({ items: [] })
  localStorage.removeItem(STORAGE_KEY)
}

afterEach(() => {
  resetStore()
})

describe('useWatchlist store', () => {
  it('adds, deduplicates, removes, and persists items', () => {
    act(() => {
      useWatchlist.getState().add({ id: 'bitcoin', symbol: 'btc', name: 'Bitcoin' })
    })

    expect(useWatchlist.getState().items).toHaveLength(1)
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{"state":{"items":[]}}').state.items).toEqual([
      { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin' },
    ])

    act(() => {
      useWatchlist.getState().add({ id: 'bitcoin', symbol: 'btc', name: 'Bitcoin' })
    })

    expect(useWatchlist.getState().items).toHaveLength(1)

    act(() => {
      useWatchlist.getState().remove('bitcoin')
    })

    expect(useWatchlist.getState().items).toHaveLength(0)
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{"state":{"items":[]}}').state.items).toEqual([])
  })
})
