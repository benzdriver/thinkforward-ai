#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

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

async function deployToVercel() {
  console.log('=== ThinkForward AI Hybrid Architecture Deployment ===');
  console.log('This script will help you deploy your application to Vercel');
  
  try {
    try {
      execSync('vercel --version', { stdio: 'ignore' });
      console.log('Vercel CLI is already installed');
    } catch (error) {
      console.log('Installing Vercel CLI...');
      execSync('npm install -g vercel', { stdio: 'inherit' });
    }
    
    try {
      execSync('vercel whoami', { stdio: 'ignore' });
      console.log('Already logged in to Vercel');
    } catch (error) {
      console.log('Please log in to Vercel:');
      execSync('vercel login', { stdio: 'inherit' });
    }
    
    console.log('\n=== Deploying Backend ===');
    
    const backendEnvPath = path.join(__dirname, 'backend', '.env');
    let backendEnvContent = '';
    
    try {
      backendEnvContent = fs.readFileSync(backendEnvPath, 'utf8');
    } catch (error) {
      console.error(`Error reading backend .env file: ${error.message}`);
      console.log('Creating a new .env file...');
      backendEnvContent = fs.readFileSync(path.join(__dirname, 'backend', '.env.example'), 'utf8');
      fs.writeFileSync(backendEnvPath, backendEnvContent);
    }
    
    if (!backendEnvContent.includes('mongodb+srv://')) {
      const setupMongoDB = await prompt('\nYour MongoDB connection is not set to MongoDB Atlas. Would you like to set it up now? (y/n): ');
      
      if (setupMongoDB.toLowerCase() === 'y') {
        const mongoAtlasUri = await prompt('\nPlease enter your MongoDB Atlas connection string: ');
        
        if (!mongoAtlasUri.startsWith('mongodb+srv://')) {
          console.error('\nError: Invalid MongoDB Atlas connection string. It should start with mongodb+srv://');
          process.exit(1);
        }
        
        backendEnvContent = backendEnvContent.replace(
          /MONGO_URL=.*/,
          `MONGO_URL=${mongoAtlasUri}`
        );
        
        fs.writeFileSync(backendEnvPath, backendEnvContent);
        console.log('MongoDB Atlas connection string updated in .env file');
      } else {
        console.log('Continuing with current MongoDB configuration');
      }
    }
    
    console.log('\nSetting up backend environment variables...');
    
    if (!backendEnvContent.includes('CRON_SECRET=')) {
      const cronSecret = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      backendEnvContent += `\nCRON_SECRET=${cronSecret}`;
      fs.writeFileSync(backendEnvPath, backendEnvContent);
      console.log('Generated CRON_SECRET for serverless functions');
    }
    
    console.log('\nDeploying backend to Vercel...');
    console.log('This may take a few minutes...');
    
    execSync('cd backend && vercel --prod', { stdio: 'inherit' });
    
    const backendUrl = await prompt('\nEnter the deployed backend URL (from Vercel): ');
    
    console.log('\n=== Deploying Frontend ===');
    
    const frontendEnvPath = path.join(__dirname, 'frontend', '.env.local');
    let frontendEnvContent = '';
    
    try {
      frontendEnvContent = fs.readFileSync(frontendEnvPath, 'utf8');
    } catch (error) {
      console.log('Creating frontend .env.local file...');
      frontendEnvContent = '';
    }
    
    if (frontendEnvContent.includes('NEXT_PUBLIC_API_URL=')) {
      frontendEnvContent = frontendEnvContent.replace(
        /NEXT_PUBLIC_API_URL=.*/,
        `NEXT_PUBLIC_API_URL=${backendUrl}`
      );
    } else {
      frontendEnvContent += `\nNEXT_PUBLIC_API_URL=${backendUrl}`;
    }
    
    fs.writeFileSync(frontendEnvPath, frontendEnvContent);
    console.log('Updated frontend environment with backend URL');
    
    console.log('\nBuilding and deploying frontend to Vercel...');
    console.log('This may take a few minutes...');
    
    execSync('cd frontend && vercel --prod', { stdio: 'inherit' });
    
    const frontendUrl = await prompt('\nEnter the deployed frontend URL (from Vercel): ');
    
    console.log('\n=== Updating Backend Configuration ===');
    
    backendEnvContent = fs.readFileSync(backendEnvPath, 'utf8');
    
    backendEnvContent = backendEnvContent.replace(
      /CORS_ORIGIN=.*/,
      `CORS_ORIGIN=${frontendUrl}`
    );
    
    backendEnvContent = backendEnvContent.replace(
      /FRONTEND_URL=.*/,
      `FRONTEND_URL=${frontendUrl}`
    );
    
    fs.writeFileSync(backendEnvPath, backendEnvContent);
    
    console.log('\nRedeploying backend with updated CORS settings...');
    execSync('cd backend && vercel --prod', { stdio: 'inherit' });
    
    console.log('\n=== Setting Up Scheduled Tasks ===');
    console.log('To set up the user synchronization cron job:');
    console.log('1. Go to your Vercel project dashboard');
    console.log('2. Navigate to Settings > Cron Jobs');
    console.log('3. Add a new cron job with the following details:');
    console.log('   - Name: User Synchronization');
    console.log('   - Schedule: 0 2 * * * (runs at 2 AM UTC daily)');
    console.log('   - Command: curl -X GET -H "X-Cron-Secret: YOUR_CRON_SECRET" https://your-backend-url/api/serverless/scheduled/syncUsers');
    console.log('   - Replace YOUR_CRON_SECRET with the value in your backend .env file');
    console.log('   - Replace your-backend-url with your actual backend URL');
    
    console.log('\n=== Deployment Complete ===');
    console.log(`Frontend: ${frontendUrl}`);
    console.log(`Backend: ${backendUrl}`);
    console.log('\nYour ThinkForward AI application has been successfully deployed with hybrid architecture!');
    
  } catch (error) {
    console.error('Deployment failed:', error.message);
  }
  
  rl.close();
}

deployToVercel();
