// Job-related types for Rigger Platform

import { Address } from './user';

export enum JobType {
  CRANE_OPERATION = 'CRANE_OPERATION',
  RIGGING = 'RIGGING',
  SCAFFOLDING = 'SCAFFOLDING',
  HEAVY_LIFTING = 'HEAVY_LIFTING',
  CONSTRUCTION = 'CONSTRUCTION',
  MAINTENANCE = 'MAINTENANCE',
  INSPECTION = 'INSPECTION',
  TRAINING = 'TRAINING',
  OTHER = 'OTHER',
}

export enum UrgencyLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum PayType {
  HOURLY = 'HOURLY',
  DAILY = 'DAILY',
  PROJECT = 'PROJECT',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
}

export enum JobStatus {
  DRAFT = 'DRAFT',
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  ON_HOLD = 'ON_HOLD',
}

export enum ApplicationStatus {
  PENDING = 'PENDING',
  REVIEWED = 'REVIEWED',
  SHORTLISTED = 'SHORTLISTED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
}

export interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  location: Address;
  
  // Job details
  jobType: JobType;
  urgencyLevel: UrgencyLevel;
  estimatedDuration?: string; // e.g., "2 weeks", "3 months"
  startDate?: Date;
  endDate?: Date;
  
  // Compensation
  payType: PayType;
  payAmount?: number; // Per hour/day/project
  currency: string;
  
  // Safety & Requirements
  safetyRequirements: string[];
  requiredSkillIds: string[];
  requiredCertificationIds: string[];
  
  // Status
  status: JobStatus;
  maxApplicants?: number;
  
  // Relations (IDs for shared types)
  posterId: string;
  assignedWorkerId?: string;
  applicationIds: string[];
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  completedAt?: Date;
}

export interface CreateJobRequest {
  title: string;
  description: string;
  requirements: string[];
  location: Address;
  jobType: JobType;
  urgencyLevel: UrgencyLevel;
  estimatedDuration?: string;
  startDate?: Date;
  endDate?: Date;
  payType: PayType;
  payAmount?: number;
  currency?: string;
  safetyRequirements: string[];
  requiredSkillIds: string[];
  requiredCertificationIds: string[];
  maxApplicants?: number;
}

export interface UpdateJobRequest {
  title?: string;
  description?: string;
  requirements?: string[];
  location?: Address;
  urgencyLevel?: UrgencyLevel;
  estimatedDuration?: string;
  startDate?: Date;
  endDate?: Date;
  payType?: PayType;
  payAmount?: number;
  safetyRequirements?: string[];
  requiredSkillIds?: string[];
  requiredCertificationIds?: string[];
  maxApplicants?: number;
  status?: JobStatus;
}

export interface JobApplication {
  id: string;
  jobId: string;
  applicantId: string;
  
  // Application details
  coverLetter?: string;
  proposedRate?: number;
  availability?: string; // When can start
  
  // Status
  status: ApplicationStatus;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  reviewedAt?: Date;
}

export interface CreateApplicationRequest {
  jobId: string;
  coverLetter?: string;
  proposedRate?: number;
  availability?: string;
}

export interface UpdateApplicationRequest {
  coverLetter?: string;
  proposedRate?: number;
  availability?: string;
}

export interface UpdateApplicationStatusRequest {
  status: ApplicationStatus;
  notes?: string;
}

// Job search and filtering
export interface JobSearchFilters {
  jobType?: JobType[];
  urgencyLevel?: UrgencyLevel[];
  payType?: PayType[];
  status?: JobStatus[];
  location?: {
    city?: string;
    state?: string;
    radius?: number; // km
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  payRange?: {
    min?: number;
    max?: number;
  };
  startDateFrom?: Date;
  startDateTo?: Date;
  requiredSkills?: string[];
  requiredCertifications?: string[];
  searchTerm?: string;
}

export interface JobSearchResult {
  jobs: JobSummary[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface JobSummary {
  id: string;
  title: string;
  description: string;
  jobType: JobType;
  urgencyLevel: UrgencyLevel;
  location: {
    suburb: string;
    city: string;
    state: string;
  };
  payType: PayType;
  payAmount?: number;
  currency: string;
  status: JobStatus;
  createdAt: Date;
  publishedAt?: Date;
  applicationsCount: number;
  maxApplicants?: number;
  posterName: string;
  requiredSkills: string[];
  estimatedDuration?: string;
}

export interface JobDetails extends Job {
  poster: {
    id: string;
    firstName: string;
    lastName: string;
    companyName?: string;
    avatar?: string;
    rating: number;
    totalJobs: number;
  };
  requiredSkills: Array<{
    id: string;
    name: string;
    category: string;
  }>;
  requiredCertifications: Array<{
    id: string;
    name: string;
    issuingAuthority: string;
  }>;
  applications: Array<{
    id: string;
    applicantId: string;
    applicantName: string;
    applicantAvatar?: string;
    status: ApplicationStatus;
    appliedAt: Date;
    rating: number;
  }>;
  assignedWorker?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    rating: number;
  };
}

// Dashboard and analytics
export interface JobMetrics {
  totalJobs: number;
  activeJobs: number;
  completedJobs: number;
  averageCompletionTime: number; // in days
  totalApplications: number;
  averageApplicationsPerJob: number;
  topJobTypes: Array<{
    type: JobType;
    count: number;
  }>;
  jobsByUrgency: Array<{
    urgency: UrgencyLevel;
    count: number;
  }>;
  jobsByLocation: Array<{
    location: string;
    count: number;
  }>;
}

export interface ApplicationMetrics {
  totalApplications: number;
  pendingApplications: number;
  acceptedApplications: number;
  rejectedApplications: number;
  averageResponseTime: number; // in hours
  applicationsByStatus: Array<{
    status: ApplicationStatus;
    count: number;
  }>;
  topApplicants: Array<{
    id: string;
    name: string;
    applicationCount: number;
    successRate: number;
  }>;
}