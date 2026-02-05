import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai'
import { GeminiSettings } from '../../domain/types/settings'
import { DecisionMaker } from '../../application/decision-maker'
import { TechnicalAnalysis } from '../../domain/types/technical-analysis'
import { DecisionTrade, decisionTradeSchema } from '../../domain/types/decision'
import { geminiSchema } from './gemini-schema'
import { geminiBuildPrompt } from './gemini-prompt'

export class GeminiClient implements DecisionMaker {
  private readonly model: GenerativeModel

  constructor(settings: GeminiSettings) {
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

  async decide(analysis: TechnicalAnalysis): Promise<DecisionTrade> {
    const prompt = geminiBuildPrompt(analysis)

    const result = await this.model.generateContent(prompt)
    const responseText = result.response.text()
    return decisionTradeSchema.parse(JSON.parse(responseText))
  }
}
