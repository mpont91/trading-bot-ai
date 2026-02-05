import {
  GoogleGenerativeAI,
  SchemaType,
  type Schema,
  GenerativeModel,
} from '@google/generative-ai'
import { GeminiSettings } from '../../domain/types/settings'
import { DecisionMaker } from '../../application/decision-maker'

const tradingSchema: Schema = {
  description: 'Trading decision based on market analysis',
  type: SchemaType.OBJECT,
  properties: {
    decision: {
      type: SchemaType.STRING,
      format: 'enum',
      enum: ['BUY', 'SELL', 'HOLD'],
      description: 'The action to take',
      nullable: false,
    },
    confidence: {
      type: SchemaType.NUMBER,
      description: 'Confidence level between 0 and 1',
    },
    reasoning: {
      type: SchemaType.STRING,
      description: 'Brief explanation of why this decision was made',
    },
  },
  required: ['decision', 'confidence', 'reasoning'],
}

export class GeminiClient implements DecisionMaker {
  private readonly googleGenerativeAI: GoogleGenerativeAI
  private readonly model: GenerativeModel

  constructor(settings: GeminiSettings) {
    this.googleGenerativeAI = new GoogleGenerativeAI(settings.geminiApiKey)
    this.model = this.googleGenerativeAI.getGenerativeModel({
      model: 'gemini-2.5-flash-lite',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: tradingSchema,
      },
    })
  }

  async analyze(marketData: string): Promise<void> {
    const prompt = `
      You are an expert crypto day trader. Analyze the following technical indicators and market data.
      Be aggressive but manage risk.
      
      Market Data:
      ${marketData}
    `

    try {
      const result = await this.model.generateContent(prompt)
      const response = result.response
      console.log(response.text())
      return JSON.parse(response.text())
    } catch (error) {
      console.error('Error asking Gemini:', error)
      throw error
    }
  }
}
