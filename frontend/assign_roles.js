require('dotenv').config({ path: '.env.local' });

console.log('Clerk Secret Key before initialization:', process.env.CLERK_SECRET_KEY);

// Example using Node.js with Clerk's API
const { createClerkClient } = require('@clerk/clerk-sdk-node');

const clerk = createClerkClient({
  apiKey: process.env.CLERK_SECRET_KEY,
});

async function createUserWithRole(role) {
  const user = await clerk.users.createUser({
    emailAddress: 'user@example.com',
    firstName: 'John',
    lastName: 'Doe',
    metadata: {
      role: role, // Assign role as metadata
    },
  });
  console.log(user);
}

// Create Admin, Consultant, and Client users
createUserWithRole('Admin');
createUserWithRole('Consultant');
createUserWithRole('Client');
