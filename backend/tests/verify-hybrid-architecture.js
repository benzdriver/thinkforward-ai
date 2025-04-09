/**
 * Hybrid Architecture Verification Script
 * 
 * This script tests both regular API endpoints and serverless functions
 * to ensure they work correctly together in the hybrid architecture.
 */
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const logger = require('../utils/logger');

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3001';
const SERVERLESS_BASE_URL = process.env.TEST_SERVERLESS_URL || 'http://localhost:3001';

const testProfile = {
  age: 30,
  education: {
    level: 'masters',
    field: 'Computer Science',
    country: 'India'
  },
  languageScores: {
    english: {
      speaking: 8,
      listening: 8,
      reading: 7,
      writing: 7
    }
  },
  workExperience: [
    {
      occupation: 'Software Developer',
      years: 5,
      noc: '21231'
    }
  ]
};

/**
 * Test regular API endpoint
 */
async function testRegularEndpoint() {
  logger.info('Testing regular API endpoint...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/canada/ai/recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ profile: testProfile })
    });
    
    const data = await response.json();
    logger.info('Regular API response status:', response.status);
    logger.info('Regular API response data:', JSON.stringify(data, null, 2));
    
    return {
      success: response.status === 200 && data.success,
      status: response.status,
      data
    };
  } catch (error) {
    logger.error('Error testing regular API endpoint:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Test serverless API endpoint
 */
async function testServerlessEndpoint() {
  logger.info('Testing serverless API endpoint...');
  
  try {
    const response = await fetch(`${SERVERLESS_BASE_URL}/api/serverless/canada/recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ profile: testProfile })
    });
    
    const data = await response.json();
    logger.info('Serverless API response status:', response.status);
    logger.info('Serverless API response data:', JSON.stringify(data, null, 2));
    
    return {
      success: response.status === 200 && data.success,
      status: response.status,
      data
    };
  } catch (error) {
    logger.error('Error testing serverless API endpoint:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Run all tests
 */
async function runTests() {
  logger.info('=== Starting Hybrid Architecture Verification ===');
  
  const regularResult = await testRegularEndpoint();
  
  const serverlessResult = await testServerlessEndpoint();
  
  const resultsMatch = JSON.stringify(regularResult.data) === JSON.stringify(serverlessResult.data);
  
  logger.info('=== Hybrid Architecture Verification Results ===');
  logger.info(`Regular API endpoint: ${regularResult.success ? 'SUCCESS' : 'FAILED'}`);
  logger.info(`Serverless API endpoint: ${serverlessResult.success ? 'SUCCESS' : 'FAILED'}`);
  logger.info(`Results match: ${resultsMatch ? 'YES' : 'NO'}`);
  
  if (regularResult.success && serverlessResult.success && resultsMatch) {
    logger.info('✅ Hybrid architecture is working correctly!');
    return true;
  } else {
    logger.error('❌ Hybrid architecture verification failed!');
    return false;
  }
}

if (require.main === module) {
  runTests()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      logger.error('Unexpected error during verification:', error);
      process.exit(1);
    });
}

module.exports = {
  testRegularEndpoint,
  testServerlessEndpoint,
  runTests
};
