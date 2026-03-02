import { Activity } from '../../domain/types/activity'

export interface ActivityRepository {
  save(activity: Activity): Promise<Activity>
}
