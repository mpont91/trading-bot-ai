import { Container } from '../../di'
import { ApiService } from '../../domain/services/api-service'
import { type Coin } from '../../domain/types/coin'

export default async function (): Promise<void> {
  const apiService: ApiService = Container.getApiService()
  const response: Coin[] = await apiService.getCoins()

  console.dir(response, { depth: null })
}
