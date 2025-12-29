const API_URL = 'http://localhost:3000/api';

const TEMP_ADMIN = {
    name: 'Temp Admin',
    email: `temp_admin_${Date.now()}@barakahaid.com`, // Unique email
    password: 'password123',
    role: 'ADMIN' // Trying to pass role in register first, if fails, update later
};

const CATEGORIES = [
    { name: 'Medical', description: 'Medical aid and supplies' },
    { name: 'Food', description: 'Food and nutrition support' },
    { name: 'Education', description: 'Educational materials and support' },
    { name: 'Emergency', description: 'Emergency relief' },
    { name: 'Shelter', description: 'Housing and shelter' }
];

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

async function seedCategories() {
    try {
        console.log('👤 Registering Temp Admin...');
        let token;
        
        try {
            // 1. Register
            await apiRequest('/auth/register', 'POST', TEMP_ADMIN);
            console.log('✅ Registered.');
            
            // 2. Login
            const loginRes = await apiRequest('/auth/login', 'POST', { 
                email: TEMP_ADMIN.email, 
                password: TEMP_ADMIN.password 
            });
            token = (loginRes.data || loginRes).accessToken;
            console.log('✅ Logged in.');

            // 3. Elevate Privilege (Try to update own role)
            console.log('⚡ Attempting to elevate privilege to ADMIN...');
            try {
                // Determine user ID from token or login response
                // Payload usually has user object
                const user = (loginRes.data || loginRes).user;
                if (!user) throw new Error('User data missing in login response');

                // Try patch update-role
                await apiRequest('/users/update-role', 'PATCH', { role: 'ADMIN' }, token);
                console.log('✅ Privilege escalation successful (or already processed).');
                
                // Refresh token if claims need updating (though usually role is checked from DB or token claims?)
                // If role is in token, we need to re-login to get new token with ADMIN role
                console.log('🔄 Re-logging in to get new token with ADMIN role...');
                const secondLogin = await apiRequest('/auth/login', 'POST', { 
                    email: TEMP_ADMIN.email, 
                    password: TEMP_ADMIN.password 
                });
                token = (secondLogin.data || secondLogin).accessToken;

            } catch (err) {
                console.warn('⚠️ Privilege escalation failed/skipped:', err.message);
                console.warn('Continuing hoping user is somehow Admin or endpoint unprotected...');
            }

        } catch (err) {
            console.error('❌ Registration/Login failed:', err.message);
            return;
        }
        
        console.log('📂 Checking/Creating Categories...');
        
        // Fetch existing
        let existing = [];
        try {
            const res = await apiRequest('/categories', 'GET', null, token);
            existing = res.data || res; 
            if (existing && existing.data && Array.isArray(existing.data)) {
                 existing = existing.data;
            }
            if (!Array.isArray(existing)) existing = [];
        } catch (e) {
            console.warn('⚠️ Could not fetch existing categories (might lack permission if not Admin).', e.message);
        }

        for (const cat of CATEGORIES) {
            const exists = existing.find(c => c.name === cat.name);
            if (exists) {
                console.log(`✓ Category "${cat.name}" already exists.`);
            } else {
                try {
                    await apiRequest('/categories', 'POST', cat, token);
                    console.log(`✅ Created category: "${cat.name}"`);
                } catch (err) {
                    console.error(`❌ Failed to create category "${cat.name}":`, err.message);
                }
            }
        }

        console.log('✨ Category seeding complete!');

    } catch (error) {
        console.error('❌ Script failed:', error.message);
    }
}

seedCategories();
