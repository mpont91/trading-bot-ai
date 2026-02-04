import { type Exchange } from '../../application/exchange'
import { type Coin } from '../types/coin'

export class ExchangeService {
  constructor(private readonly api: Exchange) {}

  async getCoins(): Promise<Coin[]> {
    return this.api.getCoins()
  }
}
