import { ExchangeService } from './exchange-service'
import { MaintenanceSettings } from '../types/settings'
import { OrderRequest } from '../types/order'
import { LoggerService } from './logger-service'

export class MaintenanceService {
  private readonly context = '🛠️  Maintenance-Service'

  constructor(
    private readonly loggerService: LoggerService,
    private readonly exchangeService: ExchangeService,
    private readonly settings: MaintenanceSettings,
  ) {}

  async bnbRefill(): Promise<void> {
    const bnbBalance = await this.exchangeService.getBalance('BNB')

    if (bnbBalance >= this.settings.bnbMinThreshold) return

    this.loggerService.info(
      this.context,
      `BNB balance is low (${bnbBalance.toFixed(4)}). Refilling...`,
    )

    const bnbPrice = await this.exchangeService.getPrice('BNBUSDC')
    const quantityToBuy = this.settings.bnbRefillAmountUsd / bnbPrice

    const orderRequest: OrderRequest = {
      symbol: 'BNBUSDC',
      side: 'BUY',
      quantity: quantityToBuy,
    }
    await this.exchangeService.submitOrder(orderRequest)

    this.loggerService.info(
      this.context,
      `Refill completed. Bought ~${quantityToBuy.toFixed(4)} BNB @ $${this.settings.bnbRefillAmountUsd}.`,
    )
  }
}
