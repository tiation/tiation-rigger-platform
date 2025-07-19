// User-related types for Rigger Platform

export enum UserRole {
  ADMIN = 'ADMIN',
  WORKER = 'WORKER',
  EMPLOYER = 'EMPLOYER',
  SAFETY_OFFICER = 'SAFETY_OFFICER',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
}

export interface Address {
  street: string;
  suburb: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface User {
  id: string;
  email: string;
  emailVerified: Date | null;
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  avatar?: string;
  dateOfBirth?: Date;
  address?: Address;
  
  // Profile
  bio?: string;
  role: UserRole;
  status: UserStatus;
  
  // Relations (IDs only for shared types)
  certificationIds: string[];
  skillIds: string[];
  experienceIds: string[];
  safetyRecordIds: string[];
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

export interface CreateUserRequest {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  address?: Address;
  role?: UserRole;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  avatar?: string;
  dateOfBirth?: Date;
  address?: Address;
  bio?: string;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  role: UserRole;
  status: UserStatus;
  phoneNumber?: string;
  address?: Address;
  joinedAt: Date;
  lastActive?: Date;
  
  // Stats
  completedJobs: number;
  safetyRating: number;
  verifiedCertifications: number;
  totalExperience: number; // in months
}

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  emailVerified: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RegisterRequest extends CreateUserRequest {
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirmRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// User search and filtering
export interface UserSearchFilters {
  role?: UserRole;
  status?: UserStatus;
  location?: string;
  skills?: string[];
  certifications?: string[];
  experienceLevel?: 'entry' | 'intermediate' | 'senior' | 'expert';
  availableFrom?: Date;
  searchTerm?: string;
}

export interface UserSearchResult {
  users: UserProfile[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}