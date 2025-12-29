const axios = require('axios');

const API_URL = 'http://localhost:3000/api';

async function verifyData() {
  try {
    // Login
    console.log('Logging in as Volunteer...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'volunteer_demo@barakahaid.com',
      password: 'password123'
    });
    const token = loginResponse.data.accessToken || loginResponse.data.data?.accessToken;
    const userId = loginResponse.data.user?.id || loginResponse.data.data?.user?.id;
    console.log(`Logged in. User ID: ${userId}`);

    // Get Profile
    console.log('Fetching Profile...');
    const profileResponse = await axios.get(`${API_URL}/volunteers/profile`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    console.log('--- Full Response Data ---');
    console.log(JSON.stringify(profileResponse.data, null, 2));
    
    const profile = profileResponse.data.data || profileResponse.data;
    
    console.log('--- Profile Data ---');
    console.log('ID:', profile.id);
    console.log('Hours Logged:', profile.hoursLogged);
    console.log('Events Count:', profile.events?.length);
    console.log('Events:', JSON.stringify(profile.events, null, 2));

  } catch (error) {
    console.error('Verification failed:', error.message);
    if (error.response) {
        console.error('Response:', error.response.data);
    }
  }
}

verifyData();
