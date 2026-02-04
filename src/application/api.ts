import { type Coin } from '../domain/types/coin'

export interface Api {
  getCoins(): Promise<Coin[]>
}
