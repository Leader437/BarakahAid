const axios = require('axios');

const API_URL = 'http://localhost:3000/api';

async function seedDonations() {
  try {
    // 1. Login as NGO to get Campaigns
    console.log('Logging in as NGO to fetch campaigns...');
    const ngoLogin = await axios.post(`${API_URL}/auth/login`, {
      email: 'ngo_demo@barakahaid.com',
      password: 'password123'
    });
    const ngoToken = ngoLogin.data.accessToken || ngoLogin.data.data?.accessToken;
    
    // Fetch campaigns
    const campaignsRes = await axios.get(`${API_URL}/campaigns/my-campaigns`, {
        headers: { Authorization: `Bearer ${ngoToken}` }
    });
    const campaigns = campaignsRes.data.data || campaignsRes.data;
    
    if (!campaigns || campaigns.length === 0) {
        console.error('No campaigns found. Please seed campaigns first.');
        return;
    }
    console.log(`Found ${campaigns.length} campaigns.`);

    // 2. Login as Donor
    console.log('Logging in as Donor...');
    const donorLogin = await axios.post(`${API_URL}/auth/login`, {
      email: 'donor_demo@barakahaid.com',
      password: 'password123'
    });
    const donorToken = donorLogin.data.accessToken || donorLogin.data.data?.accessToken;
    const donorId = donorLogin.data.user?.id || donorLogin.data.data?.user?.id;
    console.log(`Donor logged in: ${donorId}`);

    // 3. Create Transactions (Donations)
    const donationAmounts = [50, 100, 250, 500, 1000];
    const transactions = [];

    console.log('Creating donations...');
    for (let i = 0; i < 5; i++) {
        const campaign = campaigns[i % campaigns.length];
        const amount = donationAmounts[i % donationAmounts.length];
        
        try {
            const res = await axios.post(`${API_URL}/transactions`, {
                amount: amount,
                campaignId: campaign.id,
                currency: 'USD',
                paymentGateway: 'CARD'
            }, {
                headers: { Authorization: `Bearer ${donorToken}` }
            });
            const tx = res.data.data || res.data;
            transactions.push(tx);
            console.log(`Created donation: $${amount} for "${campaign.title}" (ID: ${tx.id})`);
        } catch (err) {
            console.error(`Failed to donate to ${campaign.title}:`, err.response?.data?.message || err.message);
        }
    }

    // 4. Login as Admin to Complete Transactions
    console.log('Logging in as Admin to approve transactions...');
    const adminLogin = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@barakahaid.com',
      password: 'password123'
    });
    const adminToken = adminLogin.data.accessToken || adminLogin.data.data?.accessToken;

    console.log('Approving transactions...');
    for (const tx of transactions) {
        try {
            // PUT /transactions/:id/status
            await axios.put(`${API_URL}/transactions/${tx.id}/status`, {
                status: 'COMPLETED'
            }, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            console.log(`Transaction ${tx.id} marked as COMPLETED.`);
        } catch (err) {
             console.error(`Failed to approve transaction ${tx.id}:`, err.response?.data?.message || err.message);
        }
    }

    console.log('Donation seeding complete!');

  } catch (error) {
    console.error('Script failed:', error.message);
    if (error.response) console.error('Response:', error.response.data);
  }
}

seedDonations();
