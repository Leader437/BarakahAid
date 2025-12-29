const axios = require('axios');

const API_URL = 'http://localhost:3000/api';

const donationRequests = [
  {
    title: 'Emergency Food Relief - Gaza',
    description: 'Urgent food packages needed for displaced families in Gaza. Each package feeds a family for one week.',
    categoryId: null,
  },
  {
    title: 'Winter Clothing Drive',
    description: 'Warm clothing and blankets for refugees facing harsh winter conditions.',
    categoryId: null,
  },
  {
    title: 'Clean Water for Villages',
    description: 'Building wells and water purification systems for rural communities without clean water access.',
    categoryId: null,
  },
  {
    title: 'Education Supplies for Orphans',
    description: 'School supplies, books, and uniforms for orphaned children.',
    categoryId: null,
  },
  {
    title: 'Medical Aid for Syria',
    description: 'Essential medical supplies and equipment for hospitals in conflict zones.',
    categoryId: null,
  },
];

async function seedDonationRequests() {
  try {
    // 1. Login as NGO
    console.log('Logging in as NGO...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'ngo_demo@barakahaid.com',
      password: 'password123'
    });
    const token = loginResponse.data.accessToken || loginResponse.data.data?.accessToken;
    console.log('NGO logged in.');

    // 2. Fetch categories
    console.log('Fetching categories...');
    let categories = [];
    try {
      const catRes = await axios.get(`${API_URL}/categories`);
      categories = catRes.data.data || catRes.data || [];
      console.log(`Found ${categories.length} categories.`);
    } catch (e) {
      console.log('No categories found, proceeding without categoryId.');
    }

    // 3. Create donation requests
    console.log('Creating donation requests...');
    for (const req of donationRequests) {
      // Assign a category if available
      if (categories.length > 0) {
        req.categoryId = categories[Math.floor(Math.random() * categories.length)].id;
      }

      try {
        const res = await axios.post(`${API_URL}/donation-requests`, req, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const created = res.data.data || res.data;
        console.log(`Created request: "${req.title}" (ID: ${created.id})`);
      } catch (err) {
        console.error(`Failed to create "${req.title}":`, err.response?.data?.message || err.message);
      }
    }

    console.log('Donation requests seeding complete!');

  } catch (error) {
    console.error('Script failed:', error.message);
    if (error.response) console.error('Response:', error.response.data);
  }
}

seedDonationRequests();
