export interface DecisionMaker {
  analyze(marketData: string): Promise<void>
}
