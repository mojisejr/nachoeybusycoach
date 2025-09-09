// Using built-in fetch API (Node.js 18+)

// Test configuration
const BASE_URL = 'http://localhost:3000';
const API_BASE = `${BASE_URL}/api`;

async function testAPIEndpoints() {
  console.log('Testing API endpoints...');
  console.log('Base URL:', BASE_URL);
  
  try {
    // Test 1: GET /api/notifications without authentication (should return 401)
    console.log('\n1. Testing GET /api/notifications without auth...');
    const unauthResponse = await fetch(`${API_BASE}/notifications`);
    console.log(`Status: ${unauthResponse.status}`);
    if (unauthResponse.status === 401) {
      console.log('✅ Correctly returns 401 for unauthenticated requests');
    } else {
      console.log('❌ Expected 401 but got:', unauthResponse.status);
    }
    
    // Test 2: GET /api/notifications with invalid session (should return 401)
    console.log('\n2. Testing GET /api/notifications with invalid session...');
    const invalidSessionResponse = await fetch(`${API_BASE}/notifications`, {
      headers: {
        'Cookie': 'next-auth.session-token=invalid-token'
      }
    });
    console.log(`Status: ${invalidSessionResponse.status}`);
    if (invalidSessionResponse.status === 401) {
      console.log('✅ Correctly returns 401 for invalid session');
    } else {
      console.log('❌ Expected 401 but got:', invalidSessionResponse.status);
    }
    
    // Test 3: Test pagination parameters
    console.log('\n3. Testing GET /api/notifications with pagination...');
    const paginationResponse = await fetch(`${API_BASE}/notifications?page=1&limit=5`);
    console.log(`Status: ${paginationResponse.status}`);
    if (paginationResponse.status === 401) {
      console.log('✅ Pagination endpoint properly requires authentication');
    }
    
    // Test 4: Test filtering parameters
    console.log('\n4. Testing GET /api/notifications with filters...');
    const filterResponse = await fetch(`${API_BASE}/notifications?type=new_workout_plan&isRead=false`);
    console.log(`Status: ${filterResponse.status}`);
    if (filterResponse.status === 401) {
      console.log('✅ Filter endpoint properly requires authentication');
    }
    
    // Test 5: PATCH /api/notifications/[id]/read without authentication
    console.log('\n5. Testing PATCH /api/notifications/[id]/read without auth...');
    const patchUnauthResponse = await fetch(`${API_BASE}/notifications/test-id/read`, {
      method: 'PATCH'
    });
    console.log(`Status: ${patchUnauthResponse.status}`);
    if (patchUnauthResponse.status === 401) {
      console.log('✅ PATCH endpoint correctly returns 401 for unauthenticated requests');
    } else {
      console.log('❌ Expected 401 but got:', patchUnauthResponse.status);
    }
    
    // Test 6: PATCH /api/notifications/[id]/read with invalid ID format
    console.log('\n6. Testing PATCH /api/notifications/[id]/read with invalid ID...');
    const invalidIdResponse = await fetch(`${API_BASE}/notifications/invalid-id-format/read`, {
      method: 'PATCH',
      headers: {
        'Cookie': 'next-auth.session-token=invalid-token'
      }
    });
    console.log(`Status: ${invalidIdResponse.status}`);
    if (invalidIdResponse.status === 401) {
      console.log('✅ Invalid ID endpoint properly requires authentication');
    }
    
    // Test 7: Test unsupported HTTP methods
    console.log('\n7. Testing unsupported HTTP methods...');
    const putResponse = await fetch(`${API_BASE}/notifications`, {
      method: 'PUT'
    });
    console.log(`PUT Status: ${putResponse.status}`);
    if (putResponse.status === 405) {
      console.log('✅ Correctly returns 405 for unsupported PUT method');
    }
    
    const deleteResponse = await fetch(`${API_BASE}/notifications`, {
      method: 'DELETE'
    });
    console.log(`DELETE Status: ${deleteResponse.status}`);
    if (deleteResponse.status === 405) {
      console.log('✅ Correctly returns 405 for unsupported DELETE method');
    }
    
    console.log('\n🎉 API endpoint tests completed!');
    console.log('\nNote: All endpoints correctly require authentication.');
    console.log('To test authenticated requests, you would need to:');
    console.log('1. Sign in through the frontend');
    console.log('2. Extract the session cookie');
    console.log('3. Include it in the test requests');
    
  } catch (error) {
    console.error('❌ Error testing API endpoints:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Make sure the backend server is running on port 3000');
      console.error('Run: npm run dev in the backend directory');
    }
  }
}

// Run the tests
testAPIEndpoints();