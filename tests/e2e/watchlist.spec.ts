import { expect, test } from '@playwright/test'

const SEARCH_INPUT = 'input[placeholder="Search markets…"]'

const clearWatchlist = async (page: import('@playwright/test').Page) => {
  await page.addInitScript(() => {
    localStorage.removeItem('crypto-watchlist')
  })
}

test.describe('Watchlist flow', () => {
  test.beforeEach(async ({ page }) => {
    await clearWatchlist(page)
  })

  test('adds asset to watchlist and persists after reload', async ({ page }) => {
    await page.goto('/')

    const searchInput = page.locator(SEARCH_INPUT)
    await searchInput.click()
    await searchInput.fill('bitcoin')

    const watchButton = page.locator('ul li button', { hasText: 'Watch' }).first()
    await watchButton.waitFor({ state: 'visible' })
    await watchButton.click()

    const watchlistSection = page.locator('#watchlist')
    await expect(watchlistSection.getByText(/bitcoin/i)).toBeVisible()

    await page.reload()
    await expect(watchlistSection.getByText(/bitcoin/i)).toBeVisible()
  })
})
