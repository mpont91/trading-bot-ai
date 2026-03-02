import { Activity } from '../../domain/types/activity'
import { Paginated } from '../../domain/types/paginated'
import { ActivityFilter } from '../../domain/filters/activity-filter'

export interface ActivityRepository {
  save(activity: Activity): Promise<Activity>
  list(filters: ActivityFilter): Promise<Paginated<Activity>>
}
