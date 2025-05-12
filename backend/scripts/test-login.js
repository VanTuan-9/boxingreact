const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
let adminToken = '';

// Test login with duchung account
async function testLogin() {
  try {
    console.log('Testing login with duchung account...');
    const response = await axios.post(`${API_URL}/admin-auth/login`, {
      email: 'duchung', // Using username
      password: 'daikaanh'
    });

    if (response.data.success) {
      adminToken = response.data.token;
      console.log('Login successful!');
      console.log('User details:', response.data.user);
      console.log('Token:', adminToken);
      return adminToken;
    }
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
  }
}

// Test creating a coach with token
async function testCreateCoach(token) {
  try {
    console.log('\nTesting create coach...');
    const response = await axios.post(
      `${API_URL}/coaches`,
      {
        name: 'Test Coach',
        specialization: 'Boxing',
        experience: 5,
        bio: 'Test coach bio'
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.success) {
      console.log('Coach created successfully!');
      console.log('Coach details:', response.data.data);
    }
  } catch (error) {
    console.error('Create coach error:', error.response?.data || error.message);
  }
}

// Run tests
async function runTests() {
  const token = await testLogin();
  if (token) {
    await testCreateCoach(token);
  }
}

runTests(); 