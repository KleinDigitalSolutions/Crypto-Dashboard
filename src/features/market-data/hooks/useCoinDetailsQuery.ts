import { useQuery } from '@tanstack/react-query'

import { type CoinDetails,getCoinDetails } from '../../../services/coingecko'

const useCoinDetailsQuery = (id: string | undefined) => {
  return useQuery<CoinDetails>({
    queryKey: ['coin-details', id],
    queryFn: () => getCoinDetails(id!),
    enabled: Boolean(id),
    staleTime: 5 * 60_000,
    retry: 2,
  })
}

export default useCoinDetailsQuery
