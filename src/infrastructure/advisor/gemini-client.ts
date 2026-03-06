import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai'
import { GeminiSettings } from '../../domain/types/settings'
import { Advisor } from '../../application/advisor'
import { Analysis } from '../../domain/types/analysis'
import { Advice, adviceSchema } from '../../domain/types/advice'
import { geminiSchema } from './gemini-schema'
import { geminiBuildPrompt } from './gemini-prompt'
import Bottleneck from 'bottleneck'
import { executeWithRateLimit } from '../helpers/execute-with-rate-limit'
import { Position } from '../../domain/types/position'
import { TimeFrame } from '../../domain/types/time-frame'

export class GeminiClient implements Advisor {
  private readonly model: GenerativeModel
  private readonly limiter: Bottleneck

  constructor(settings: GeminiSettings) {
    this.limiter = new Bottleneck({
      maxConcurrent: settings.bottleneckMaxConcurrent,
      minTime: settings.bottleneckMinTime,
    })

    this.limiter.on('failed', async (error: unknown, jobInfo) => {
      const err = error as { status?: number; message?: string }
      const status = err?.status
      const message = err?.message || String(error)

      const isTransientError =
        status === 503 ||
        status === 429 ||
        message.includes('503') ||
        message.includes('429')

      if (isTransientError && jobInfo.retryCount < 3) {
        const waitTime = Math.pow(2, jobInfo.retryCount) * 2000

        console.warn(
          `[Gemini API] Transient error detected. Retrying in ${waitTime}ms... (Attempt ${jobInfo.retryCount + 1}/3)`,
        )
        return waitTime
      }
    })

    const googleGenerativeAI = new GoogleGenerativeAI(settings.geminiApiKey)

    this.model = googleGenerativeAI.getGenerativeModel({
      model: settings.modelName,
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: geminiSchema,
        temperature: settings.temperature,
      },
    })
  }

  async advice(
    symbol: string,
    timeFrame: TimeFrame,
    analysis: Analysis,
    position: Position | null,
  ): Promise<Advice> {
    const task = async (): Promise<Advice> => {
      const timeFrameString = TimeFrame[timeFrame]
      const prompt = geminiBuildPrompt(
        symbol,
        timeFrameString,
        analysis,
        position,
      )

      const result = await this.model.generateContent(prompt)
      const responseText = result.response.text()
      return adviceSchema.parse(JSON.parse(responseText))
    }

    return executeWithRateLimit(this.limiter, task)
  }
}
