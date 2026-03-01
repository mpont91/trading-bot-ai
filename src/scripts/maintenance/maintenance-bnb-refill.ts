import { Container } from '../../di'
import { MaintenanceService } from '../../domain/services/maintenance-service'

export default async function (): Promise<void> {
  const maintenanceService: MaintenanceService =
    Container.getMaintenanceService()
  await maintenanceService.bnbRefill()
}
