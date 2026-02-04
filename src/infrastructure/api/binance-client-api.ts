import { type RestTradeTypes } from '@binance/connector-typescript'
import { type Api } from '../../application/api'
import { BinanceSpotApi } from './binance-spot-api'
import { type Coin } from '../../domain/types/coin'

export class BinanceClientApi implements Api {
  constructor(private readonly api: BinanceSpotApi) {}

  async getCoins(): Promise<Coin[]> {
    const balances: RestTradeTypes.accountInformationBalances[] = (
      await this.api.accountInformation()
    ).balances

    const coins: Coin[] = []

    for (const balance of balances) {
      coins.push({
        name: balance.asset,
        quantity: parseFloat(balance.free),
      })
    }

    return coins
  }
}
