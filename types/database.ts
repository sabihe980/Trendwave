// =====================================================================
// SAVVYGROW AI - CORE DATABASE AND MODEL TYPESCRIPT TYPES
// File: /types/database.ts
// =====================================================================

export type UserRole = "Admin" | "Agency" | "User";
export type PostStatus = "draft" | "scheduled" | "publishing" | "published" | "failed";
export type SubscriptionTier = "Free" | "Pro" | "Agency";
export type SubscriptionStatus = "active" | "trialing" | "past_due" | "paused" | "canceled" | "unpaid";
export type MediaType = "image" | "video" | "gif";

export interface Profile {
  id: string; // matches auth.users UUID
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  role: UserRole;
  currentWorkspaceId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface SocialAccount {
  id: string;
  workspaceId: string;
  platform: "instagram" | "facebook" | "linkedin" | "tiktok" | "pinterest" | "youtube";
  platformUserId: string;
  username: string;
  avatarUrl: string | null;
  accessToken: string; // always encrypted / server-side stored
  refreshToken: string | null;
  expiresAt: string | null;
  scope: string[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: string;
  workspaceId: string;
  userId: string;
  title: string | null;
  content: string;
  status: PostStatus;
  targetPlatforms: Array<"instagram" | "facebook" | "linkedin" | "tiktok" | "pinterest" | "youtube">;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduledPost {
  id: string;
  postId: string;
  socialAccountId: string;
  scheduledAt: string;
  publishedAt: string | null;
  status: PostStatus;
  errorMessage: string | null;
  externalPostId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PostMedia {
  id: string;
  postId: string;
  fileUrl: string;
  mediaPreset: MediaType;
  fileSize: number | null;
  dimensionsAspect: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AiGeneration {
  id: string;
  userId: string;
  featureType: "caption" | "image" | "copypaper" | "analytics";
  promptText: string;
  responseData: Record<string, any>;
  tokensUsed: number;
  createdAt: string;
  updatedAt: string;
}

export interface CaptionGeneration {
  id: string;
  userId: string;
  originalPrompt: string;
  platform: string | null;
  captionText: string;
  variants: Array<{ index: number; text: string }> | null;
  createdAt: string;
  updatedAt: string;
}

export interface ImageGeneration {
  id: string;
  userId: string;
  prompt: string;
  imageUrl: string;
  stylePreset: string | null;
  aspectRatio: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsRecord {
  id: string;
  socialAccountId: string;
  recordedDate: string; // YYYY-MM-DD
  followersCount: number;
  impressions: number;
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  clicks: number;
  engagementRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  stripeSubscriptionId: string | null;
  stripeCustomerId: string | null;
  planTier: SubscriptionTier;
  status: SubscriptionStatus;
  billingCycle: "monthly" | "yearly" | null;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  userId: string;
  subscriptionId: string | null;
  amount: number;
  currency: string;
  stripePaymentIntentId: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  type: "publish_success" | "publish_failed" | "billing" | "alert" | "general";
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  workspaceId: string | null;
  action: string;
  details: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  userId: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  targetResource: string;
  actionType: string;
  createdAt: string;
  updatedAt: string;
}

export interface UsageTracking {
  id: string;
  userId: string;
  monthYear: string; // "YYYY-MM"
  postsCount: number;
  aiWordsCount: number;
  imagesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiKey {
  id: string;
  userId: string;
  keyHash: string;
  name: string;
  scope: string[];
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// Supabase client-compatible custom helper representation mapping snakes to camels
export type DbSchemaJsonRow = Record<string, any>;
