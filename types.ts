export enum Sentiment {
    Positive = 'Tích cực',
    Neutral = 'Trung lập',
    Negative = 'Tiêu cực',
}

export interface PersonnelInfo {
  fullName: string;
  dob: string;
  rank: string;
  position: string;
  unit: string;
}

export interface AnalysisResult {
    sentimentScore: number;
    sentimentCategory: Sentiment;
    keyThemes: string[];
    summary: string;
    insights: string;
    officerRecommendations: string;
    date: string; // Added to track when the entry was analyzed
}

export interface HistoryEntry {
  info: PersonnelInfo;
  analysis: AnalysisResult;
}
