import { type Api } from '../../application/api'
import { type Coin } from '../types/coin'

export class ApiService {
  constructor(private readonly api: Api) {}

  async getCoins(): Promise<Coin[]> {
    return this.api.getCoins()
  }
}
