export type Weight = 'open' | 'closed' | 'hybrid';

export interface LLMRecord {
  model: string;
  elo: number;
  price: number; // price per token in USD
  context: number; // context window size
  weight: Weight;
  reasoning: boolean;
  features: string[]; // e.g. ['image','speech']
}
