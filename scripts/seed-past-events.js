const axios = require('axios');

const API_URL = 'http://localhost:3000/api';

const pastEvents = [
  {
    title: 'Archive: Summer Food Drive',
    description: 'Past event: Distributed food during the summer heat.',
    location: {
      address: 'Old Town Square',
      coordinates: [40.7128, -74.0060]
    },
    // Set date to 30 days ago
    eventDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), 
    requiredSkills: ['Organization'],
    maxVolunteers: 50
  },
  {
    title: 'Archive: Health Checkup Camp',
    description: 'Past event: Free health checkups for the elderly.',
    location: {
      address: 'Community Hall',
      coordinates: [40.7580, -73.9855]
    },
    // Set date to 15 days ago
    eventDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    requiredSkills: ['Medical'],
    maxVolunteers: 20
  }
];

async function seedPastEvents() {
  try {
    // 1. Login as NGO to create events
    console.log('Logging in as NGO...');
    let loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'ngo_demo@barakahaid.com',
      password: 'password123'
    });
    const ngoToken = loginResponse.data.accessToken || loginResponse.data.data?.accessToken;
    console.log('NGO logged in.');

    const createdEventIds = [];

    // 2. Create Past Events
    console.log('Creating past events...');
    for (const event of pastEvents) {
      try {
        const res = await axios.post(`${API_URL}/volunteers/events`, event, {
          headers: { Authorization: `Bearer ${ngoToken}` }
        });
        const createdEvent = res.data || res.data.data;
        // Check if createdEvent has ID directly or nested
        const id = createdEvent.id || createdEvent.data?.id; 
        if (id) {
             console.log(`Created past event: ${event.title} (ID: ${id})`);
             createdEventIds.push(id);
        } else {
            console.warn('Created event but ID missing from response:', createdEvent);
        }
       
      } catch (err) {
        console.error(`Failed to create event ${event.title}:`, err.response?.data?.message || err.message);
      }
    }

    // 3. Login as Volunteer to sign up
    console.log('Logging in as Volunteer...');
    loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'volunteer_demo@barakahaid.com',
      password: 'password123'
    });
    const volToken = loginResponse.data.accessToken || loginResponse.data.data?.accessToken;
    console.log('Volunteer logged in.');

    // 4. Sign up for past events
    for (const eventId of createdEventIds) {
        try {
            console.log(`Signing up for event ID: ${eventId}...`);
            await axios.post(`${API_URL}/volunteers/events/${eventId}/signup`, {}, {
                headers: { Authorization: `Bearer ${volToken}` }
            });
            console.log(`Successfully signed up for past event.`);
            
            // 4.1 Log hours for the past event
            console.log(`Logging hours for event ID: ${eventId}...`);
            await axios.post(`${API_URL}/volunteers/hours`, {
                hours: 5
            }, {
                headers: { Authorization: `Bearer ${volToken}` }
            });
            console.log('Logged 5 hours.');

        } catch (err) {
            console.error(`Signup/Log hours failed:`, err.response?.data?.message || err.message);
        }
    }
    console.log('Past events seeding complete!');

  } catch (error) {
    console.error('Script failed:', error.message);
  }
}

seedPastEvents();
