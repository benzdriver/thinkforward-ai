# MongoDB Setup Guide for ThinkForward AI

This guide provides instructions for setting up MongoDB for your ThinkForward AI application, with options for both local development and production deployment using MongoDB Atlas.

## Option 1: Local MongoDB (Development)

### Using Docker (Recommended)

The easiest way to run MongoDB locally is using Docker:

```bash
# Pull the MongoDB image
docker pull mongo:latest

# Run MongoDB container
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Verify it's running
docker ps
```

Your connection string will be: `mongodb://localhost:27017/thinkforward`

### Native Installation

Alternatively, you can install MongoDB directly on your system:

#### Ubuntu
```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Create list file for MongoDB
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Reload local package database
sudo apt-get update

# Install MongoDB packages
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod

# Enable MongoDB to start on boot
sudo systemctl enable mongod

# Verify MongoDB is running
sudo systemctl status mongod
```

Your connection string will be: `mongodb://localhost:27017/thinkforward`

## Option 2: MongoDB Atlas (Production)

MongoDB Atlas is a fully-managed cloud database service that's ideal for production deployments. They offer a free tier that's suitable for small applications.

### Creating a Free MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and sign up for a free account
2. Create a new project
3. Build a free tier cluster (M0)
4. Set up database access:
   - Create a database user with a secure password
   - Note: This is different from your Atlas account credentials
5. Set up network access:
   - For development: Allow access from anywhere (0.0.0.0/0)
   - For production: Add specific IP addresses for your servers
6. Get your connection string:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Select your driver and version
   - Copy the connection string
   - Replace `<username>`, `<password>`, and `<dbname>` with your actual values

### Connecting ThinkForward AI to MongoDB Atlas

1. Run our setup script:
   ```bash
   node setup-mongodb-atlas.js
   ```
   
2. When prompted, paste your MongoDB Atlas connection string
   
3. The script will update your local `.env` file and provide instructions for updating your Vercel environment variables

## Vercel Integration

When deploying to Vercel, you'll need to add your MongoDB Atlas connection string as an environment variable:

1. In the Vercel dashboard, go to your project
2. Navigate to Settings > Environment Variables
3. Add a new variable with:
   - Name: `MONGO_URL`
   - Value: Your MongoDB Atlas connection string
4. Deploy your application

## Troubleshooting

### Connection Issues

If you're having trouble connecting to MongoDB:

1. Check that MongoDB is running:
   ```bash
   # For local installation
   sudo systemctl status mongod
   
   # For Docker
   docker ps
   ```

2. Verify your connection string format:
   - Local: `mongodb://localhost:27017/thinkforward`
   - Atlas: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/thinkforward?retryWrites=true&w=majority`

3. For MongoDB Atlas:
   - Ensure your IP address is whitelisted in the Network Access settings
   - Verify your database user credentials
   - Check that your cluster is active

### Data Management

To manage your MongoDB data:

1. MongoDB Compass (GUI tool):
   - Download from [mongodb.com/products/compass](https://www.mongodb.com/products/compass)
   - Connect using your connection string

2. MongoDB Shell (command line):
   ```bash
   # For local MongoDB
   mongosh
   
   # For MongoDB Atlas
   mongosh "mongodb+srv://<username>:<password>@<cluster>.mongodb.net/thinkforward"
   ```

## Need Help?

If you encounter any issues with your MongoDB setup, please:

1. Check the MongoDB documentation at [docs.mongodb.com](https://docs.mongodb.com/)
2. Visit the MongoDB Community Forums at [community.mongodb.com](https://community.mongodb.com/)
3. For Atlas-specific questions, see [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com/)
