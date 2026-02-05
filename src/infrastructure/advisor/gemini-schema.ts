import { SchemaType, type Schema } from '@google/generative-ai'

export const geminiSchema: Schema = {
  description: 'Trading decision based on technical analysis',
  type: SchemaType.OBJECT,
  properties: {
    action: {
      type: SchemaType.STRING,
      format: 'enum',
      enum: ['BUY', 'SELL', 'HOLD'],
      description: 'The strategic action to take right now.',
      nullable: false,
    },
    confidence: {
      type: SchemaType.NUMBER,
      description:
        'Confidence level between 0.0 (uncertain) and 1.0 (certain).',
      nullable: false,
    },
    reasoning: {
      type: SchemaType.STRING,
      description:
        'A concise explanation (max 2 sentences) of why this decision was made, referencing specific indicators.',
      nullable: false,
    },
  },
  required: ['action', 'confidence', 'reasoning'],
}
