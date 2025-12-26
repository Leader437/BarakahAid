// Admin API Helper - Mock Data Implementation
// Matches client-side behavior by using dummyData

import { 
  mockUsers, 
  mockDonations, 
  mockRequests, 
  mockCampaigns, 
  mockAnalytics,
  mockVerificationRequests
} from '../../../client/src/utils/dummyData';

// Simulate network delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Dashboard & Overview
 */
export const getOverview = async () => {
  await delay();
  return {
    users: mockUsers.length,
    donations: mockDonations.length,
    campaigns: mockCampaigns.length,
    requests: mockRequests.length,
    totalDonationsAmount: mockAnalytics.totalDonations,
    recentActivity: mockAnalytics.recentActivity
  };
};

export const getReports = async () => {
  await delay();
  return mockAnalytics;
};

/**
 * Users Management
 */
export const getUsers = async (params = {}) => {
  await delay();
  // Simple filtering implementation
  let filtered = [...mockUsers];
  
  if (params.role) {
    filtered = filtered.filter(u => u.role === params.role);
  }
  
  return {
    data: filtered,
    total: filtered.length,
    page: 1,
    lastPage: 1
  };
};

export const getUserById = async (id) => {
  await delay();
  const user = mockUsers.find(u => u.id === id);
  if (!user) throw new Error('User not found');
  return user;
};

export const updateUserStatus = async (id, status) => {
  await delay();
  const user = mockUsers.find(u => u.id === id);
  if (user) {
    // In a real app we'd update the DB. Here we just return success.
    return { ...user, status };
  }
  throw new Error('User not found');
};

export const deleteUser = async (id) => {
  await delay();
  return { success: true, id };
};

/**
 * Donations Management
 */
export const getDonations = async (params = {}) => {
  await delay();
  return {
    data: mockDonations,
    total: mockDonations.length,
    page: 1,
    lastPage: 1
  };
};

export const getDonationById = async (id) => {
  await delay();
  const donation = mockDonations.find(d => d.id === id);
  if (!donation) throw new Error('Donation not found');
  return donation;
};

export const updateDonationStatus = async (id, status) => {
  await delay();
  return { success: true, id, status };
};

/**
 * Requests Management
 */
export const getRequests = async (params = {}) => {
  await delay();
  return {
    data: mockRequests,
    total: mockRequests.length,
    page: 1,
    lastPage: 1
  };
};

export const getRequestById = async (id) => {
  await delay();
  const request = mockRequests.find(r => r.id === id);
  if (!request) throw new Error('Request not found');
  return request;
};

export const approveRequest = async (id) => {
  await delay();
  return { success: true, id, status: 'approved' };
};

export const rejectRequest = async (id) => {
  await delay();
  return { success: true, id, status: 'rejected' };
};

/**
 * Campaigns Management
 */
export const getCampaigns = async (params = {}) => {
  await delay();
  return {
    data: mockCampaigns,
    total: mockCampaigns.length,
    page: 1,
    lastPage: 1
  };
};

export const getCampaignById = async (id) => {
  await delay();
  const campaign = mockCampaigns.find(c => c.id === id);
  if (!campaign) throw new Error('Campaign not found');
  return campaign;
};

export const updateCampaignStatus = async (id, status) => {
  await delay();
  return { success: true, id, status };
};

export const publishCampaign = async (id) => {
  await delay();
  return { success: true, id, status: 'active' };
};

export const cancelCampaign = async (id) => {
  await delay();
  return { success: true, id, status: 'cancelled' };
};

// =============================================================================
// EXPORT ALL
// =============================================================================

const adminApi = {
  getOverview,
  getReports,
  getUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
  getDonations,
  getDonationById,
  updateDonationStatus,
  getRequests,
  getRequestById,
  approveRequest,
  rejectRequest,
  getCampaigns,
  getCampaignById,
  updateCampaignStatus,
  publishCampaign,
  cancelCampaign,
};

export default adminApi;
