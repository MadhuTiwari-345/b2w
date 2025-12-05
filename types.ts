
export interface VideoService {
  id: string;
  title: string;
  description: string;
  category: string;
  subCategory?: string;
  iconName: string; // Used to map to Lucide icons
  sampleImage: string; // URL for the sample work image
}

export interface RecommendationItem {
  serviceId: string;
  reason: string;
  matchedKeywords: string[];
}

export interface RecommendationResponse {
  recommendations: RecommendationItem[];
}

export enum LoadingState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}
