
export enum Sentiment {
    Positive = 'Tích cực',
    Neutral = 'Trung lập',
    Negative = 'Tiêu cực',
}

export enum UserRole {
  Admin = 'ADMIN',
  Officer = 'OFFICER'
}

export interface User {
  username: string;
  role: UserRole;
  fullName: string;
  rank?: string;
  position?: string;
  unit?: string;
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
    date: string;
}

export interface HistoryEntry {
  info: PersonnelInfo;
  analysis: AnalysisResult;
  operatorUsername: string;
  operatorName: string;
  operatorRank?: string;
  operatorPosition?: string;
  operatorUnit?: string;
  timestamp: string;    
}

export interface ActivityLog {
  id: string;
  operatorName: string;
  action: string;
  timestamp: string;
  targetPersonnel?: string;
}

export interface CentralDatabase {
  history: Record<string, HistoryEntry[]>;
  activities: ActivityLog[];
}
