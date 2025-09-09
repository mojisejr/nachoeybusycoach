// Test script for notification creation functionality
const { createClient } = require('@sanity/client');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Initialize Sanity client
const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || 'u0rtdnil',
  dataset: process.env.SANITY_DATASET || 'production',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
});

// Test notification creation
async function testNotificationCreation() {
  console.log('Testing notification creation...');
  
  try {
    // First, let's check if there are any existing users
    console.log('Checking for existing users...');
    const users = await client.fetch('*[_type == "user"] | order(_createdAt desc) [0...1]');
    
    let testUserId;
    if (users.length > 0) {
      testUserId = users[0]._id;
      console.log('Using existing user:', testUserId);
    } else {
      // Create a test user if none exist
      console.log('Creating test user...');
      const testUser = await client.create({
        _type: 'user',
        name: 'Test Runner',
        email: 'test@example.com',
        role: 'runner'
      });
      testUserId = testUser._id;
      console.log('Created test user:', testUserId);
    }
    
    // Test 1: Create a new workout plan notification
    const workoutPlanNotification = {
      _type: 'notification',
      type: 'new_workout_plan',
      title: 'New Workout Plan Available',
      message: 'Your coach has created a new workout plan for this week.',
      recipient: {
        _type: 'reference',
        _ref: testUserId
      },
      sender: {
        _type: 'reference', 
        _ref: testUserId // Using same user as sender for testing
      },
      read: false,
      createdAt: new Date().toISOString()
    };
    
    console.log('Creating workout plan notification...');
    const result1 = await client.create(workoutPlanNotification);
    console.log('✅ Workout plan notification created:', result1._id);
    
    // Test 2: Create a coach feedback notification
    const feedbackNotification = {
      _type: 'notification',
      type: 'coach_feedback',
      title: 'New Feedback from Coach',
      message: 'Your coach has provided feedback on your recent workout.',
      recipient: {
        _type: 'reference',
        _ref: testUserId
      },
      sender: {
        _type: 'reference',
        _ref: testUserId
      },
      read: false,
      createdAt: new Date().toISOString()
    };
    
    console.log('Creating feedback notification...');
    const result2 = await client.create(feedbackNotification);
    console.log('✅ Feedback notification created:', result2._id);
    
    // Test 3: Create a workout reminder notification
    const reminderNotification = {
      _type: 'notification',
      type: 'workout_reminder',
      title: 'Workout Reminder',
      message: 'Don\'t forget about your scheduled workout today!',
      recipient: {
        _type: 'reference',
        _ref: testUserId
      },
      read: false,
      createdAt: new Date().toISOString()
    };
    
    console.log('Creating reminder notification...');
    const result3 = await client.create(reminderNotification);
    console.log('✅ Reminder notification created:', result3._id);
    
    // Test 4: Query notifications
    console.log('\nQuerying all notifications...');
    const notifications = await client.fetch(`
      *[_type == "notification"] | order(createdAt desc) [0...10] {
        _id,
        type,
        title,
        message,
        read,
        createdAt
      }
    `);
    
    console.log(`✅ Found ${notifications.length} notifications:`);
    notifications.forEach((notif, index) => {
      console.log(`  ${index + 1}. [${notif.type}] ${notif.title} - ${notif.read ? 'Read' : 'Unread'}`);
    });
    
    console.log('\n🎉 All notification tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Error testing notifications:', error.message);
    if (error.details) {
      console.error('Details:', error.details);
    }
  }
}

// Run the test
testNotificationCreation();