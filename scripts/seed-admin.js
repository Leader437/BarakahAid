/**
 * Seed Admin User Script
 * Creates an admin user in the database via the registration API
 * 
 * Run with: node scripts/seed-admin.js
 */

const API_URL = 'http://localhost:5000/api';

const ADMIN_USER = {
    name: 'Final Admin',
    email: 'admin@barakahaid.com',
    password: 'barakahAid@admin007',
    role: 'ADMIN'
};

async function seedAdmin() {
    console.log('🚀 Seeding Admin User...\n');

    try {
        // Try to register the admin user
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ADMIN_USER)
        });

        const data = await response.json();

        if (response.ok) {
            console.log('✅ Admin user created successfully!');
            console.log(`   Email: ${ADMIN_USER.email}`);
            console.log(`   Password: ${ADMIN_USER.password}`);
            console.log(`   Role: ${ADMIN_USER.role}`);
        } else if (data.message?.includes('already exists') || data.message?.includes('duplicate')) {
            console.log('ℹ️  Admin user already exists in database.');
            console.log(`   Email: ${ADMIN_USER.email}`);
            console.log(`   Password: ${ADMIN_USER.password}`);
        } else {
            console.error('❌ Failed to create admin:', data.message || response.statusText);
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.log('\n⚠️  Make sure the server is running on http://localhost:3000');
    }
}

seedAdmin();
