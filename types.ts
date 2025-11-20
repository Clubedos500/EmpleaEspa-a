export enum UserRole {
  CANDIDATE = 'CANDIDATE',
  EMPLOYER = 'EMPLOYER',
  ADMIN = 'ADMIN'
}

export enum JobType {
  FULL_TIME = 'Jornada Completa',
  PART_TIME = 'Media Jornada',
  TEMPORARY = 'Temporal',
  INTERNSHIP = 'Prácticas'
}

export enum Modality {
  ONSITE = 'Presencial',
  HYBRID = 'Híbrido',
  REMOTE = 'Remoto'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  birthdate: string; // ISO Date
  nationality: string;
  documentId: string; // DNI/NIE
  skills: string[];
  consentVerified?: boolean; // For minors
  resumeUrl?: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  salaryRange: string;
  type: JobType;
  modality: Modality;
  minAge: number;
  isNightShift: boolean; // Restricted for <18
  tags: string[];
  postedAt: string;
}

export interface Application {
  id: string;
  jobId: string;
  userId: string;
  status: 'PENDING' | 'REVIEWING' | 'ACCEPTED' | 'REJECTED';
  appliedAt: string;
}

// Mock Auth Response
export interface AuthResponse {
  token: string;
  user: User;
}