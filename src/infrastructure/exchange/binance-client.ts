import { type RestTradeTypes } from '@binance/connector-typescript'
import { type Exchange } from '../../application/exchange'
import { BinanceSpot } from './binance-spot'
import { type Coin } from '../../domain/types/coin'

export class BinanceClient implements Exchange {
  constructor(private readonly api: BinanceSpot) {}

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
