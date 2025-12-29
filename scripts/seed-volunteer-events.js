const axios = require('axios');

const API_URL = 'http://localhost:3000/api';

const events = [
  {
    title: 'Community Food Drive',
    description: 'Join us to distribute food packages to families in need. We need volunteers to help organize, pack, and distribute essential food items to over 500 families.',
    location: {
      address: '123 Community Center, Downtown',
      coordinates: [40.7128, -74.0060]
    },
    eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
    requiredSkills: ['Organization', 'Heavy Lifting', 'Teamwork'],
    maxVolunteers: 20
  },
  {
    title: 'Medical Camp Support',
    description: 'Assist medical professionals in our weekend health camp. Roles include registration, guiding patients, and basic logistical support.',
    location: {
      address: 'City General Hospital Grounds',
      coordinates: [40.7580, -73.9855]
    },
    eventDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks from now
    requiredSkills: ['Communication', 'Patience', 'Basic First Aid (Bonus)'],
    maxVolunteers: 15
  },
  {
    title: 'Virtual Mentorship Session',
    description: 'Mentor students from underprivileged backgrounds over a Zoom call. Help them with career guidance and basic subject tutoring.',
    location: {
      address: 'Remote',
    },
    eventDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    requiredSkills: ['Teaching', 'Mentoring', 'Zoom Proficiency'],
    maxVolunteers: 30
  },
  {
    title: 'Park Cleanup Day',
    description: 'Help us keep our city green and clean! We will be collecting litter and planting new saplings in the central park.',
    location: {
      address: 'Central Park, West Gate',
      coordinates: [40.7851, -73.9683]
    },
    eventDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
    requiredSkills: ['Gardening', 'Environmental Awareness'],
    maxVolunteers: 50
  }
];

async function seedVolunteerEvents() {
  try {
    // 1. Login as NGO
    console.log('Logging in as NGO...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'ngo_demo@barakahaid.com',
      password: 'password123'
    });
    const token = loginResponse.data.accessToken || loginResponse.data.data?.accessToken;
    console.log('Login successful. Token:', token ? 'Token received' : 'No token found');
    if (!token) {
        console.error('Full response data:', JSON.stringify(loginResponse.data, null, 2));
        return;
    }
    console.log('Admin/NGO logged in successfully.');

    // 2. Clear Existing Events
    console.log('Clearing existing events...');
    try {
        const existingEventsResponse = await axios.get(`${API_URL}/volunteers/events`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        // Log to debug
        console.log('Fetch events response status:', existingEventsResponse.status);
        console.log('Fetch events data type:', typeof existingEventsResponse.data);
        console.log('Fetch events isArray:', Array.isArray(existingEventsResponse.data));

        const existingEvents = Array.isArray(existingEventsResponse.data) ? existingEventsResponse.data : (existingEventsResponse.data.data || []);
        
        console.log(`Found ${existingEvents.length} existing events.`);
        
        for (const event of existingEvents) {
            await axios.delete(`${API_URL}/volunteers/events/${event.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(`Deleted event: ${event.title}`);
        }
        console.log('All existing events cleared.');
    } catch (err) {
        console.warn('Failed to clear events (might be empty or error):', err.message);
    }

    // 3. Create Events
    console.log('Creating volunteer events...');
    for (const event of events) {
      try {
        await axios.post(`${API_URL}/volunteers/events`, event, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log(`Created event: ${event.title}`);
      } catch (err) {
        console.error(`Failed to create event ${event.title}:`, err.response?.data?.message || err.message);
      }
    }

    console.log('Seeding complete!');
  } catch (error) {
    console.error('Seeding failed:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

seedVolunteerEvents();
