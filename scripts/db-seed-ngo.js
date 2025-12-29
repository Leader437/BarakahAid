
const API_URL = 'http://localhost:3000/api';

// Demo Credentials
const USERS = {
    admin: { email: 'admin@barakahaid.com', password: 'password123' },
    ngo: { email: 'ngo_demo@barakahaid.com', password: 'password123' },
    donor: { email: 'donor_demo@barakahaid.com', password: 'password123' },
    volunteer: { email: 'volunteer_demo@barakahaid.com', password: 'password123' }
};

// Data to Seed
const CAMPAIGNS = [
    {
        title: 'Emergency Food Relief - Gaza',
        description: 'Providing urgent food packages to families in Gaza. Each package feeds a family for a month.',
        goalAmount: 50000,
        startDate: new Date().toISOString(),
        endDate: '2026-12-31T23:59:59Z',
        isEmergency: true
    },
    {
        title: 'Winter Clothing Drive',
        description: 'Collecting and distributing winter jackets, blankets, and essential warm clothing for refugees.',
        goalAmount: 25000,
        startDate: new Date().toISOString(),
        endDate: '2026-03-31T23:59:59Z',
        isEmergency: false
    },
    {
        title: 'Clean Water for Villages',
        description: 'Building wells and water purification systems for remote villages suffering from drought.',
        goalAmount: 75000,
        startDate: new Date().toISOString(),
        endDate: '2026-06-30T23:59:59Z',
        isEmergency: false
    }
];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function apiRequest(endpoint, method, body, token = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const config = {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined
    };

    try {
        const response = await fetch(`${API_URL}${endpoint}`, config);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || response.statusText);
        }
        return data; 
    } catch (error) {
        throw error;
    }
}

async function login(role, email, password) {
    try {
        console.log(`Logging in as ${role}...`);
        const responseData = await apiRequest('/auth/login', 'POST', { email, password });
        
        // Handle wrapped response or direct response
        const payload = responseData.data || responseData;
        const { accessToken } = payload;
        
        if (!accessToken) throw new Error('No access token returned');
        
        console.log(`✅ Logged in as ${role}`);
        return accessToken;
    } catch (error) {
        console.error(`❌ Failed to login as ${role}:`, error.message);
        return null;
    }
}

async function createCampaigns(token, campaigns) {
    const created = [];
    for (const campaign of campaigns) {
        try {
            console.log(`Creating campaign: ${campaign.title}...`);
            const responseData = await apiRequest('/campaigns', 'POST', campaign, token);
            const data = responseData.data || responseData;
            created.push(data);
            console.log(`✅ Created campaign: ${data.id}`);
            
            // Activate the campaign
            console.log(`Activating campaign ${data.id}...`);
            await apiRequest(`/campaigns/${data.id}`, 'PUT', { status: 'ACTIVE' }, token);
            console.log(`✅ Activated campaign: ${data.id}`);

            await sleep(500); // reduced delay
        } catch (error) {
            console.error(`❌ Failed to create campaign ${campaign.title}:`, error.message);
        }
    }
    return created;
}

async function fetchCategories() {
    try {
        console.log('Fetching categories...');
        const responseData = await apiRequest('/categories', 'GET');
        const data = responseData.data || responseData;
        console.log(`✅ Fetched ${data.length} categories`);
        return data;
    } catch (error) {
        console.error('❌ Failed to fetch categories:', error.message);
        return [];
    }
}

async function ensureCategories() {
    console.log('Checking if categories exist (required for Requests)...');
    let categories = await fetchCategories();
    
    if (categories.length === 0) {
        console.log('⚠️ No categories found. Logging in as Admin to create them (Requests need Categories)...');
        
        let adminToken = await login('Admin', USERS.admin.email, USERS.admin.password);
        
        if (!adminToken) {
            console.error('❌ Admin login failed. Please ensure admin@barakahaid.com exists with password123.');
            console.error('❌ Skipping category creation.');
            return [];
        }

        const defaults = ['Medical', 'Education', 'Food', 'Emergency', 'Water'];
        for (const name of defaults) {
            try {
                await apiRequest('/categories', 'POST', { name, description: `Campaigns for ${name}` }, adminToken);
                console.log(`✅ Created category: ${name}`);
            } catch (err) {
                console.error(`Failed to create category ${name}:`, err.message);
            }
        }
        categories = await fetchCategories();
    }
    return categories;
}

async function createDonationRequests(token, categories) {
    if (!categories || categories.length === 0) {
        console.log('⚠️ No categories found, skipping Donation Requests creation.');
        return;
    }

    // Define requests template
    const requests = [
        {
            title: 'Medical Supplies for Clinic',
            description: 'Urgent request for antibiotics and first aid kits for our mobile clinic.',
            urgency: 'HIGH', // Might need mapping if enum mismatch
            status: 'PENDING',
             location: {
                type: 'Point',
                coordinates: [34.0522, -118.2437],
                address: '123 Health St, Gazatown'
            }
        },
        {
            title: 'School Supplies for Orphanage',
            description: 'Textbooks, notebooks, and pencils for 50 children.',
            urgency: 'MEDIUM',
            status: 'PENDING',
             location: {
                type: 'Point',
                coordinates: [34.0522, -118.2437],
                address: '456 Edu Lane, Somaliville'
            }
        }
    ];

    for (const req of requests) {
        try {
            console.log(`Creating donation request: ${req.title}...`);
            // Assign random category
            const randomCategory = categories[Math.floor(Math.random() * categories.length)];
            const payload = { ...req, category: randomCategory.id }; // Entity expects object or ID? TypeORM usually handles ID if name matches relation column + Id, but plain relation needs object or ID. Let's try ID.

            const responseData = await apiRequest('/donations/requests', 'POST', payload, token);
            const data = responseData.data || responseData;
            console.log(`✅ Created request: ${data.id}`);
            await sleep(500);
        } catch (error) {
             console.error(`❌ Failed to create request ${req.title}:`, error.message);
        }
    }
}

async function makeDonations(token, campaigns) {
    if (campaigns.length === 0) return;

    const donorAmounts = [500, 100, 250, 1000, 50];

    for (const campaign of campaigns) {
        // Make 2 random donations per campaign
        for (let i = 0; i < 2; i++) {
            const amount = donorAmounts[Math.floor(Math.random() * donorAmounts.length)];
            try {
                console.log(`Donating $${amount} to ${campaign.title}...`);
                const responseData = await apiRequest('/transactions', 'POST', {
                    campaignId: campaign.id,
                    amount: amount,
                    paymentGateway: 'CARD', 
                    currency: 'USD',
                }, token);
                console.log(`✅ Donation successful`);
                await sleep(500);
            } catch (error) {
                console.error(`❌ Donation failed:`, error.message);
            }
        }
    }
}

async function main() {
    console.log('🚀 Starting NGO Data Seeding (using fetch)...');

    // 1. Ensure Categories exist (requires Admin if missing)
    const categories = await ensureCategories();

    // 2. Login as NGO
    const ngoToken = await login('NGO', USERS.ngo.email, USERS.ngo.password);
    if (!ngoToken) return;

    // 3. Create Campaigns
    const createdCampaigns = await createCampaigns(ngoToken, CAMPAIGNS);

    // 4. Create requests (using categories)
    if (categories && categories.length > 0) {
        await createDonationRequests(ngoToken, categories);
    } else {
        console.log('⚠️ No categories available, skipping request seeding.');
    }

    // 5. Login as Donor
    const donorToken = await login('Donor', USERS.donor.email, USERS.donor.password);
    if (!donorToken) return;

    // 6. Make Donations
    await makeDonations(donorToken, createdCampaigns);

    console.log('✨ Seeding complete!');
    process.exit(0);
}

main();
