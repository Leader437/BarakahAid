// Dashboard statistics interface for admin panel
export interface DashboardStats {
  totalUsers: number;
  totalCampaigns: number;
  totalDonations: number;
  totalAmountRaised: number;
  activeDonors: number;
  activeNGOs: number;
  pendingRequests: number;
  pendingVerifications: number;
  recentSignups: number;
}

export interface UserStats {
  DONOR: number;
  NGO: number;
  VOLUNTEER: number;
  ADMIN: number;
  RECIPIENT: number;
}

export interface CampaignStats {
  DRAFT: number;
  ACTIVE: number;
  COMPLETED: number;
  CANCELLED: number;
}

export interface DonationStats {
  completed: number;
  pending: number;
  failed: number;
  refunded: number;
  totalAmount: number;
}

export interface RequestStats {
  pending: number;
  approved: number;
  rejected: number;
  fulfilled: number;
  total: number;
}

export interface RecentActivity {
  id: string;
  type: 'donation' | 'campaign' | 'user' | 'request';
  description: string;
  amount?: number;
  userName?: string;
  date: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
