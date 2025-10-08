import { keepPreviousData,useQuery } from '@tanstack/react-query'

import type { GetMarketsParams, Market } from '../../../services/coingecko'
import { getMarkets } from '../../../services/coingecko'

export const useMarketsQuery = (params: GetMarketsParams) => {
  return useQuery<Market[]>({
    queryKey: ['markets', params.vsCurrency, params.perPage, params.page],
    queryFn: () => getMarkets(params),
    staleTime: 60_000,
    refetchInterval: 60_000,
    placeholderData: keepPreviousData,
  })
}

export default useMarketsQuery
