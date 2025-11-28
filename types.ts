export interface LuckyResult {
  twoDigits: string[];
  threeDigits: string[];
  source: 'random' | 'ai';
  timestamp: number;
  description?: string; // For AI reasoning
}

export enum AppTab {
  RANDOM = 'RANDOM',
  DREAM = 'DREAM',
  HISTORY = 'HISTORY'
}

export interface DreamInterpretationResponse {
  twoDigits: string[];
  threeDigits: string[];
  reason: string;
}
