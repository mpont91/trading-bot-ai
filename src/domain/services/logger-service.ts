import colors from '@colors/colors'
import { ActivityRepository } from '../../application/repositories/activity-repository'
import { ActivityLevel } from '@prisma/client'
import { Activity } from '../types/activity'

export class LoggerService {
  private readonly context = '📜  Logger-Service'

  constructor(private readonly activityRepository: ActivityRepository) {}

  debug(context: string, message: string): void {
    console.log(`[${context}] ${colors.gray('●')} ${message}`)
  }

  dump(context: string, message: string, payload: unknown): void {
    console.log(`[${context}] ${colors.gray('●')} ${message}`)
    console.dir(payload, { depth: null, colors: true })
  }

  info(context: string, message: string): void {
    console.log(`[${context}] ${colors.blue('●')} ${message}`)
    this.saveActivity(ActivityLevel.INFO, context, message).catch((error) => {
      this.error(this.context, `Error saving info log into DB:`, error)
    })
  }

  warn(context: string, message: string): void {
    console.warn(`[${context}] ${colors.yellow('⚠')} ${message}`)
    this.saveActivity(ActivityLevel.WARN, context, message).catch((error) => {
      this.error(this.context, `Error saving warn log into DB:`, error)
    })
  }

  success(context: string, message: string): void {
    console.log(`[${context}] ${colors.green('✔')} ${message}`)
    this.saveActivity(ActivityLevel.SUCCESS, context, message).catch(
      (error) => {
        this.error(this.context, `Error saving success log into DB:`, error)
      },
    )
  }

  error(context: string, message: string, error?: unknown): void {
    const prefix = `[${context}] ${colors.red('✖')} ${message}`

    if (error) {
      console.error(prefix, error)
    } else {
      console.error(prefix)
    }

    this.saveActivity(ActivityLevel.ERROR, context, message).catch((error) => {
      console.error(
        `[${this.context}] ${colors.red('✖')} Error saving error log into DB`,
        error,
      )
    })
  }

  private async saveActivity(
    level: ActivityLevel,
    context: string,
    message: string,
  ): Promise<Activity> {
    return this.activityRepository.save({
      level,
      context,
      message,
      createdAt: new Date(),
    })
  }
}
