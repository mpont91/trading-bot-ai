import { ExchangeService } from './exchange-service'
import { MaintenanceSettings } from '../types/settings'
import { OrderRequest } from '../types/order'
import { LoggerService } from './logger-service'
import { ActivityRepository } from '../../application/repositories/activity-repository'

export class MaintenanceService {
  private readonly context = '🛠️  Maintenance-Service'

  constructor(
    private readonly loggerService: LoggerService,
    private readonly exchangeService: ExchangeService,
    private readonly activityRepository: ActivityRepository,
    private readonly settings: MaintenanceSettings,
  ) {}

  async bnbRefill(): Promise<void> {
    const bnbBalance = await this.exchangeService.getBalance('BNB')

    if (bnbBalance >= this.settings.bnbMinThreshold) return

    this.loggerService.info(
      this.context,
      `BNB balance is low (${bnbBalance.toFixed(4)}). Refilling.`,
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

  async cleanOldActivity(): Promise<void> {
    try {
      const cutoffDate = new Date()
      cutoffDate.setDate(
        cutoffDate.getDate() - this.settings.activityRetentionDays,
      )

      const deletedCount =
        await this.activityRepository.deleteOlderThan(cutoffDate)

      if (deletedCount > 0) {
        this.loggerService.success(
          this.context,
          `Old activity cleaned (${this.settings.activityRetentionDays} retention days): ${deletedCount} old activities removed from DB.`,
        )
      }
    } catch (error) {
      this.loggerService.error(
        this.context,
        'Error cleaning old activity logs:',
        error,
      )
    }
  }
}
