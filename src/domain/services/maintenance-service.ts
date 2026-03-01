import { ExchangeService } from './exchange-service'
import { MaintenanceSettings } from '../types/settings'
import { OrderRequest } from '../types/order'

export class MaintenanceService {
  constructor(
    private readonly exchangeService: ExchangeService,
    private readonly settings: MaintenanceSettings,
  ) {}

  async bnbRefill(): Promise<void> {
    const bnbBalance = await this.exchangeService.getBalance('BNB')

    if (bnbBalance >= this.settings.bnbMinThreshold) return

    console.log(
      `[🛠️ Maintenance-Service] BNB balance is low (${bnbBalance.toFixed(4)}). Refilling...`,
    )

    const bnbPrice = await this.exchangeService.getPrice('BNBUSDC')
    const quantityToBuy = this.settings.bnbRefillAmountUsd / bnbPrice

    const orderRequest: OrderRequest = {
      symbol: 'BNBUSDC',
      side: 'BUY',
      quantity: quantityToBuy,
    }
    await this.exchangeService.submitOrder(orderRequest)

    console.log(
      `[🛠️ Maintenance-Service] ✅ Refill completed. Bought ~${quantityToBuy.toFixed(4)} BNB @ $${this.settings.bnbRefillAmountUsd}.`,
    )
  }
}
