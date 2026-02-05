import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai'
import { GeminiSettings } from '../../domain/types/settings'
import { Advisor } from '../../application/advisor'
import { Analysis } from '../../domain/types/analysis'
import { Advice, adviceSchema } from '../../domain/types/advice'
import { geminiSchema } from './gemini-schema'
import { geminiBuildPrompt } from './gemini-prompt'
import Bottleneck from 'bottleneck'
import { executeWithRateLimit } from '../helpers/execute-with-rate-limit'

export class GeminiClient implements Advisor {
  private readonly model: GenerativeModel
  private readonly limiter: Bottleneck

  constructor(settings: GeminiSettings) {
    this.limiter = new Bottleneck({
      maxConcurrent: settings.bottleneckMaxConcurrent,
      minTime: settings.bottleneckMinTime,
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

  async advice(analysis: Analysis): Promise<Advice> {
    const task = async (): Promise<Advice> => {
      const prompt = geminiBuildPrompt(analysis)

      const result = await this.model.generateContent(prompt)
      const responseText = result.response.text()
      return adviceSchema.parse(JSON.parse(responseText))
    }

    return executeWithRateLimit(this.limiter, task)
  }
}
