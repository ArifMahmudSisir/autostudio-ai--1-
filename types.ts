
export enum UserRole {
  ADMIN = 'ADMIN',
  PHOTOGRAPHER = 'PHOTOGRAPHER'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Dealership {
  id: string;
  name: string;
  brandColor: string;
  logoUrl?: string;
  backgroundUrl?: string; // Branded background for replacement
  backgroundPrompt?: string; // AI prompt fallback
}

export interface ProcessedPhoto {
  id: string;
  originalUrl: string;
  processedUrl?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  dealershipId: string;
  photographerId: string;
  createdAt: number;
}
