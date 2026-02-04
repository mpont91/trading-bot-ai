import { type Coin } from '../domain/types/coin'

export interface Exchange {
  getCoins(): Promise<Coin[]>
}
