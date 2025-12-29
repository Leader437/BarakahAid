const axios = require('axios');

const API_URL = 'http://localhost:3000/api';

async function verifyDonorData() {
  try {
    // Login
    console.log('Logging in as Donor...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'donor_demo@barakahaid.com',
      password: 'password123'
    });
    const token = loginResponse.data.accessToken || loginResponse.data.data?.accessToken;
    const userId = loginResponse.data.user?.id || loginResponse.data.data?.user?.id;
    console.log(`Logged in. User ID: ${userId}`);

    // Get My Donations
    console.log('Fetching Donations...');
    const res = await axios.get(`${API_URL}/transactions/my-donations`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const donations = res.data.data || res.data;

    console.log('--- My Donations ---');
    console.log(`Total Count: ${donations.length}`);
    if (donations.length > 0) {
        donations.forEach(d => {
            console.log(`- ${d.amount} USD | Status: ${d.status} | Campaign: ${d.campaign?.title}`);
        });
    } else {
        console.log('No donations found.');
    }

  } catch (error) {
    console.error('Verification failed:', error.message);
    if (error.response) {
        console.error('Response:', error.response.data);
    }
  }
}

verifyDonorData();
