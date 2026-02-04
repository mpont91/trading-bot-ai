import { Ai } from '../../application/ai'

export class AiService {
  constructor(private readonly api: Ai) {}

  async analize(marketData: string): Promise<void> {
    return this.api.analyze(marketData)
  }
}
