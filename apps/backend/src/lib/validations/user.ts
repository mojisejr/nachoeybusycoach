import { z } from 'zod';

/**
 * User profile validation schema for updating user information
 * Used in PUT /api/users/profile endpoint
 */
export const userProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Invalid email format'),
  image: z.string().url('Invalid image URL').optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  phone: z.string().regex(/^[+]?[0-9\s-()]+$/, 'Invalid phone number format').optional(),
  dateOfBirth: z.string().datetime().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  weight: z.number().positive('Weight must be positive').optional(),
  height: z.number().positive('Height must be positive').optional(),
  fitnessLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  goals: z.array(z.string()).optional(),
  medicalConditions: z.string().optional(),
  emergencyContact: z.object({
    name: z.string().min(1, 'Emergency contact name is required'),
    phone: z.string().regex(/^[+]?[0-9\s-()]+$/, 'Invalid phone number format'),
    relationship: z.string().min(1, 'Relationship is required')
  }).optional()
});

/**
 * User role validation schema
 * Used for role-based access control
 */
export const userRoleSchema = z.object({
  role: z.enum(['runner', 'coach', 'admin']),
  permissions: z.array(z.string()).optional(),
  coachId: z.string().optional(), // For runners assigned to a coach
  runners: z.array(z.string()).optional() // For coaches managing runners
});

/**
 * Type definitions derived from schemas
 */
export type UserProfile = z.infer<typeof userProfileSchema>;
export type UserRole = z.infer<typeof userRoleSchema>;

/**
 * Partial user profile schema for PATCH operations
 */
export const partialUserProfileSchema = userProfileSchema.partial();
export type PartialUserProfile = z.infer<typeof partialUserProfileSchema>;