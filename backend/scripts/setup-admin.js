const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
let adminToken = '';

// Create admin account
async function createAdmin() {
  try {
    const response = await axios.post(`${API_URL}/admin-auth/create-admin`, {
      name: 'Admin',
      email: 'admin@example.com',
      password: '123456'
    });
    console.log('Admin created:', response.data);
  } catch (error) {
    if (error.response?.data?.message === 'Admin account already exists') {
      console.log('Admin account already exists, proceeding to login...');
    } else {
      console.error('Error creating admin:', error.response?.data || error.message);
    }
  }
}

// Login as admin
async function loginAdmin() {
  try {
    const response = await axios.post(`${API_URL}/admin-auth/login`, {
      email: 'admin@example.com',
      password: '123456'
    });
    adminToken = response.data.token;
    console.log('Admin logged in successfully');
    return adminToken;
  } catch (error) {
    console.error('Error logging in:', error.response?.data || error.message);
    console.log('Full error:', error.response || error);
  }
}

// Test creating a coach
async function createCoach(token) {
  try {
    const response = await axios.post(
      `${API_URL}/coaches`,
      {
        name: 'John Doe',
        specialization: 'Boxing',
        experience: 5,
        bio: 'Experienced boxing coach'
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Coach created:', response.data);
  } catch (error) {
    console.error('Error creating coach:', error.response?.data || error.message);
    console.log('Full error:', error.response || error);
  }
}

// Run the setup
async function setup() {
  try {
    console.log('Creating admin account...');
    await createAdmin();
    
    console.log('Logging in as admin...');
    const token = await loginAdmin();
    
    if (token) {
      console.log('Creating test coach...');
      await createCoach(token);
    } else {
      console.log('Failed to get admin token');
    }
  } catch (error) {
    console.error('Setup failed:', error);
  }
}

setup(); 