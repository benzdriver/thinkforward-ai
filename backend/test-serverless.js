const fetch = require('node-fetch');

async function testServerlessEndpoint() {
  console.log('Testing serverless recommendations endpoint...');
  
  const mockProfile = {
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
  
  try {
    const response = await fetch('http://localhost:3001/api/serverless/canada/recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ profile: mockProfile })
    });
    
    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('✅ Serverless endpoint is working correctly!');
    } else {
      console.log('❌ Serverless endpoint returned an error:', data.error || 'Unknown error');
    }
  } catch (error) {
    console.error('❌ Error testing serverless endpoint:', error.message);
  }
}

testServerlessEndpoint();
