import Bottleneck from 'bottleneck'

export async function executeWithRateLimit<T>(
  limiter: Bottleneck,
  task: () => Promise<T>,
): Promise<T> {
  // eslint-disable-next-line no-useless-catch
  try {
    return await limiter.schedule(task)
  } catch (error) {
    throw error // Throw again the error to outside.
  }
}
