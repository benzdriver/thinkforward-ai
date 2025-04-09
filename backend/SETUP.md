# ThinkForward AI Backend Setup Guide

This guide will help you set up the ThinkForward AI backend application, including MongoDB configuration and environment variables.

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- OpenAI API key

## Environment Setup

1. Create a `.env` file in the backend directory by copying the `.env.example` file:

```bash
cp .env.example .env
```

2. Update the `.env` file with your actual values:

```
# MongoDB Configuration
MONGO_URL=mongodb://localhost:27017/thinkforward
# or for MongoDB Atlas:
# MONGO_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/thinkforward

# JWT Configuration
JWT_SECRET=your-jwt-secret-key

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
FRONTEND_URL=http://localhost:3000
```

## MongoDB Setup Options

### Option 1: Local MongoDB Installation

1. Install MongoDB on your local machine:

```bash
# Ubuntu
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB service
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify MongoDB is running
sudo systemctl status mongod
```

2. Use the following connection string in your `.env` file:

```
MONGO_URL=mongodb://localhost:27017/thinkforward
```

### Option 2: MongoDB Atlas (Cloud)

1. Create a free MongoDB Atlas account at [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (the free tier is sufficient for development)
3. Set up a database user with read/write permissions
4. Configure network access (IP whitelist)
5. Get your connection string from the Atlas dashboard
6. Update your `.env` file with the connection string:

```
MONGO_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/thinkforward
```

### Option 3: Docker MongoDB

1. Run MongoDB in a Docker container:

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

2. Use the following connection string in your `.env` file:

```
MONGO_URL=mongodb://localhost:27017/thinkforward
```

## Starting the Backend

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. The server should start on port 3001 (or the port specified in your `.env` file)

## Verifying the Setup

1. Check the console output for successful MongoDB connection:

```
info: Connected to MongoDB
info: Server running in development mode on port 3001
```

2. Test the health endpoint:

```bash
curl http://localhost:3001/health
```

You should receive a JSON response with status "ok".

## Troubleshooting

### MongoDB Connection Issues

- Verify MongoDB is running
- Check your connection string in the `.env` file
- Ensure network access is configured correctly (for MongoDB Atlas)

### OpenAI API Issues

- Verify your OpenAI API key is correct
- Check the OpenAI API status at [https://status.openai.com/](https://status.openai.com/)

### Other Issues

- Check the server logs for specific error messages
- Ensure all required environment variables are set in your `.env` file
