# Vercel Deployment Guide for exp-1.3.3

This repository is now configured for deployment on Vercel.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
You MUST set the following environment variables in your Vercel Project Settings:

- `MONGO_URI`: Your MongoDB connection string (e.g., from MongoDB Atlas)
- `JWT_SECRET`: A secure random string for authentication
- `PORT`: (Optional, Vercel sets this automatically)

**Important:** Without `MONGO_URI`, the application will start but login/register will fail.

### 3. Local Development
```bash
npm run dev
```
This runs client and server concurrently.

## Deployment

1. Push to GitHub.
2. Import project in Vercel.
3. Add the environment variables mentioned above.
4. Deploy.

## Configuration Details

- **vercel.json**: Configures Vercel to build the client and server, and route API requests to the server.
- **package.json**: Root package.json manages workspaces for client and server.
- **Server**: Modified to serve the client static files and handle SPA routing.
- **Client**: Updated to use relative API paths (`/api/...`) instead of hardcoded `localhost:5000`.
