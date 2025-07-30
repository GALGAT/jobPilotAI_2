
# JobPilotAI Local Setup Guide

## Prerequisites

1. **Node.js** (v18 or later)
2. **PostgreSQL** (v12 or later)
3. **Google Cloud Project** with OAuth 2.0 credentials

## Database Setup

1. Install PostgreSQL locally
2. Create a database named `jobpilotai`:
   ```sql
   CREATE DATABASE jobpilotai;
   ```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
7. Copy the Client ID and Client Secret

## Environment Configuration

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your values:
   - Set `DATABASE_URL` to your PostgreSQL connection string
   - Add your Google OAuth credentials
   - Generate a random session secret

## Installation & Running

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run database migrations:
   ```bash
   npm run db:push
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:5000`

## Important Notes

- The app will run on port 5000 by default
- Make sure PostgreSQL is running before starting the app
- Users will sign in using their Google accounts
- All existing functionality remains the same, just with Google authentication
