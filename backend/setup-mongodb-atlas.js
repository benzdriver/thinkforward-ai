const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function setupMongoDBAtlas() {
  console.log('=== MongoDB Atlas Setup for ThinkForward AI ===');
  console.log('This script will help you set up MongoDB Atlas for your hybrid architecture deployment');
  console.log('\nPlease provide the following information:');
  
  const atlasUri = await prompt('\nMongoDB Atlas Connection String: ');
  
  if (!atlasUri.startsWith('mongodb+srv://')) {
    console.error('\nError: Invalid MongoDB Atlas connection string. It should start with mongodb+srv://');
    process.exit(1);
  }
  
  const envPath = path.join(__dirname, '.env');
  let envContent = '';
  
  try {
    envContent = fs.readFileSync(envPath, 'utf8');
  } catch (error) {
    console.error(`\nError reading .env file: ${error.message}`);
    process.exit(1);
  }
  
  const updatedEnvContent = envContent.replace(
    /MONGO_URL=.*/,
    `MONGO_URL=${atlasUri}`
  );
  
  try {
    fs.writeFileSync(envPath, updatedEnvContent);
    console.log('\nSuccessfully updated .env file with MongoDB Atlas connection string');
  } catch (error) {
    console.error(`\nError updating .env file: ${error.message}`);
    process.exit(1);
  }
  
  console.log('\nUpdating Vercel environment variable...');
  try {
    try {
      execSync('vercel --version', { stdio: 'ignore' });
    } catch (error) {
      console.log('\nVercel CLI not found. Installing...');
      execSync('npm install -g vercel', { stdio: 'inherit' });
    }
    
    console.log('\nTo set the MongoDB Atlas connection string in Vercel, run:');
    console.log(`vercel env add MONGO_URL`);
    console.log('\nWhen prompted, paste your MongoDB Atlas connection string.');
  } catch (error) {
    console.warn('\nWarning: Could not update Vercel environment variable automatically.');
    console.log('Please set the MONGO_URL environment variable manually in your Vercel project settings.');
  }
  
  console.log('\nMongoDB Atlas setup completed successfully!');
  console.log('You can now deploy your application with the hybrid architecture');
  
  console.log('\n=== How to Create a Free MongoDB Atlas Account ===');
  console.log('1. Go to https://www.mongodb.com/cloud/atlas/register');
  console.log('2. Sign up for a free account');
  console.log('3. Create a new project');
  console.log('4. Build a free tier cluster (M0)');
  console.log('5. Set up database access (username and password)');
  console.log('6. Set up network access (IP whitelist or allow access from anywhere for development)');
  console.log('7. Get your connection string from the "Connect" button on your cluster');
  console.log('8. Replace <username> and <password> in the connection string with your actual credentials');
  
  rl.close();
}

setupMongoDBAtlas();
