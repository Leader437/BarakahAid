const axios = require('axios');

const API_URL = 'http://localhost:3000/api';

async function seedSignup() {
  try {
    // 1. Login as Volunteer
    console.log('Logging in as Volunteer...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'volunteer_demo@barakahaid.com',
      password: 'password123'
    });
    const token = loginResponse.data.accessToken || loginResponse.data.data?.accessToken;
    console.log('Volunteer logged in.');

    // 1.5 Create Profile if not exists
    try {
        await axios.get(`${API_URL}/volunteers/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Profile exists.');
    } catch (err) {
        if (err.response?.status === 404) {
            console.log('Creating volunteer profile...');
            await axios.post(`${API_URL}/volunteers/profile`, {
                skills: ['Teaching', 'First Aid'],
                availability: 'Weekends'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Profile created.');
        } else {
            console.warn('Profile check error:', err.message);
        }
    }

    // 2. Get Events
    const eventsResponse = await axios.get(`${API_URL}/volunteers/events`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const events = Array.isArray(eventsResponse.data) ? eventsResponse.data : (eventsResponse.data.data || []);
    console.log(`Found ${events.length} events.`);
    
    if (events.length === 0) {
        console.log('No events to sign up for.');
        return;
    }

    const eventId = events[0].id; // Sign up for the first one
    console.log(`Signing up for event: ${events[0].title} (${eventId})...`);

    // 3. Sign Up
    try {
        await axios.post(`${API_URL}/volunteers/events/${eventId}/signup`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Successfully signed up!');
    } catch (err) {
        console.log('Signup failed (maybe already signed up):', err.response?.data?.message || err.message);
    }

  } catch (error) {
    console.error('Script failed:', error.message);
  }
}

seedSignup();
