import { Container } from '../../di'
import { MaintenanceService } from '../../domain/services/maintenance-service'
import { contextScript } from '../run'

export default async function (): Promise<void> {
  const loggerService = Container.getLoggerService()
  const maintenanceService: MaintenanceService =
    Container.getMaintenanceService()
  await maintenanceService.bnbRefill()

  loggerService.debug(contextScript, 'BNB refill process completed')
}
