# Vercel Deployment Guide

This project has been configured for Vercel deployment with the following setup:

## Project Structure for Vercel

- `api/` - Serverless functions (replaces Express routes)
- `client/` - React frontend
- `shared/` - Shared schemas and types
- `server/` - Backend services (used by API functions)

## Deployment Steps

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Set up environment variables in Vercel**:
   ```bash
   vercel env add DATABASE_URL
   ```
   Enter your Supabase database URL: `postgresql://postgres:#Darasimi1@db.scoainxnzpvfflpnmuiq.supabase.co:5432/postgres`

   ```bash
   vercel env add OPENAI_API_KEY
   ```
   Enter your OpenAI API key

3. **Deploy to Vercel**:
   ```bash
   vercel --prod
   ```

## API Endpoints (Serverless Functions)

Your API routes have been converted to Vercel serverless functions:

- `/api/users` - User management
- `/api/articles` - Article operations  
- `/api/vocabulary` - Vocabulary management
- `/api/progress` - User progress tracking
- `/api/define` - Word definitions
- `/api/adapt-article` - Article adaptation
- `/api/comprehension-questions` - Generate questions

## Frontend Build

The frontend is built using Vite and served as static files from the `client/dist` directory.

## Database

Your Supabase database is already configured and ready to use with the serverless functions.

## Notes

- The current local development server combines frontend and backend, but Vercel separates them
- All API routes work the same way, just hosted as serverless functions
- Static assets are served from the build directory