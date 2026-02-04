import { type Api } from './application/api'
import { BinanceClientApi } from './infrastructure/api/binance-client-api'
import { ApiService } from './domain/services/api-service'
import { settings } from './application/settings'
import { BinanceSpotApi } from './infrastructure/api/binance-spot-api'

class Container {
  private static apiService: ApiService

  static initialize(): void {
    const spot: BinanceSpotApi = new BinanceSpotApi(settings.binance)
    const api: Api = new BinanceClientApi(spot)
    this.apiService = new ApiService(api)
  }

  static getApiService(): ApiService {
    return this.apiService
  }
}

Container.initialize()
export { Container }
