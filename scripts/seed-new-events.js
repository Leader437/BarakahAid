const axios = require('axios');

const API_URL = 'http://localhost:3000/api';

const newEvents = [
  {
    title: 'Beach Cleanup Drive',
    description: 'Join us for a morning of cleaning up our local beaches to protect marine life.',
    location: {
      address: 'Sunset Beach',
      coordinates: [40.7128, -74.0060] // Placeholder
    },
    // Set date to 7 days from now
    eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), 
    requiredSkills: ['Physical Stamina'],
    maxVolunteers: 30
  },
  {
    title: 'Senior Home Visit',
    description: 'Spend an afternoon chatting and playing games with residents at the Golden Years Home.',
    location: {
      address: 'Golden Years Nursing Home',
      coordinates: [40.7580, -73.9855] // Placeholder
    },
    // Set date to 10 days from now
    eventDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    requiredSkills: ['Empathy', 'Communication'],
    maxVolunteers: 10
  }
];

async function seedNewEvents() {
  try {
    // 1. Login as NGO
    console.log('Logging in as NGO...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'ngo_demo@barakahaid.com',
      password: 'password123'
    });
    const ngoToken = loginResponse.data.accessToken || loginResponse.data.data?.accessToken;
    console.log('NGO logged in.');

    // 2. Create Events
    console.log('Creating new events...');
    for (const event of newEvents) {
      try {
        const res = await axios.post(`${API_URL}/volunteers/events`, event, {
          headers: { Authorization: `Bearer ${ngoToken}` }
        });
        const createdEvent = res.data || res.data.data;
        const id = createdEvent.id || createdEvent.data?.id; 
        
        if (id) {
             console.log(`Created new event: ${event.title} (ID: ${id})`);
        } else {
             console.log(`Created event: ${event.title}`);
        }
       
      } catch (err) {
        console.error(`Failed to create event ${event.title}:`, err.response?.data?.message || err.message);
      }
    }
    console.log('New events seeding complete!');

  } catch (error) {
    console.error('Script failed:', error.message);
  }
}

seedNewEvents();
