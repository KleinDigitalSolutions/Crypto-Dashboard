import { useQuery } from '@tanstack/react-query'

import type { CoinHistory, GetCoinHistoryParams } from '../../../services/coingecko'
import { getCoinHistory } from '../../../services/coingecko'

export const useCoinHistoryQuery = (params: GetCoinHistoryParams) => {
  return useQuery<CoinHistory>({
    queryKey: ['coin-history', params.id, params.days, params.interval],
    queryFn: () => getCoinHistory(params),
    staleTime: 5 * 60_000,
    refetchInterval: 60_000,
  })
}

export default useCoinHistoryQuery
