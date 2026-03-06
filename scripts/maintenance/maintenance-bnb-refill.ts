import { Container } from '../../src/di'
import { MaintenanceService } from '../../src/domain/services/maintenance-service'
import { contextScript } from '../run'

export default async function (): Promise<void> {
  const loggerService = Container.getLoggerService()
  const maintenanceService: MaintenanceService =
    Container.getMaintenanceService()
  await maintenanceService.bnbRefill()

  loggerService.debug(contextScript, 'BNB refill process completed')
}
