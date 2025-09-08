export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  role: 'runner' | 'coach';
  createdAt: Date;
  updatedAt: Date;
}

export interface Runner extends User {
  role: 'runner';
  coachId?: string;
  profile?: RunnerProfile;
}

export interface Coach extends User {
  role: 'coach';
  runners: string[]; // Array of runner IDs
  profile?: CoachProfile;
}

export interface RunnerProfile {
  age?: number;
  weight?: number;
  height?: number;
  runningExperience?: string;
  goals?: string;
  injuries?: string;
  preferences?: {
    preferredDistance?: string;
    preferredTime?: string;
    trainingDays?: number;
  };
}

export interface CoachProfile {
  experience?: string;
  specialization?: string[];
  certifications?: string[];
  bio?: string;
  contactInfo?: {
    phone?: string;
    line?: string;
    facebook?: string;
  };
}

export type UserRole = 'runner' | 'coach';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  image?: string;
  role?: UserRole;
}