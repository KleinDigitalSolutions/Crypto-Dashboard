import { expect, test } from '@playwright/test'

test.describe('Coin page', () => {
  test('shows price chart and key metrics', async ({ page }) => {
    await page.goto('/coins/bitcoin')

    await expect(page.getByRole('heading', { name: /bitcoin/i })).toBeVisible()
    await expect(page.getByText(/Price History/i)).toBeVisible()
    await expect(page.getByText(/24h Change/i)).toBeVisible()
  })
})
