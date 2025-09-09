# Environment Setup Guide

This guide explains how to set up environment variables for the frontend application.

## Quick Start

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Update the values in `.env.local` with your actual configuration

## Environment Variables

### Required Variables

#### NextAuth Configuration
- `NEXTAUTH_URL`: The URL of your frontend application (e.g., `http://localhost:3000`)
- `NEXTAUTH_SECRET`: A random 32-character string for JWT encryption

#### OAuth Providers
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `FACEBOOK_CLIENT_ID`: Facebook OAuth client ID (optional)
- `FACEBOOK_CLIENT_SECRET`: Facebook OAuth client secret (optional)

#### API Configuration
- `NEXT_PUBLIC_API_BASE_URL`: Backend API base URL (e.g., `http://localhost:3001/api`)
- `NEXT_PUBLIC_BACKEND_URL`: Backend application URL (e.g., `http://localhost:3001`)

#### Sanity CMS
- `NEXT_PUBLIC_SANITY_PROJECT_ID`: Your Sanity project ID
- `NEXT_PUBLIC_SANITY_DATASET`: Sanity dataset name (usually `production`)

### Optional Variables

#### Analytics
- `NEXT_PUBLIC_GA_TRACKING_ID`: Google Analytics tracking ID
- `NEXT_PUBLIC_HOTJAR_ID`: Hotjar tracking ID

#### Error Tracking
- `NEXT_PUBLIC_SENTRY_DSN`: Sentry DSN for error tracking

## Setting Up OAuth Providers

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" and create OAuth 2.0 Client ID
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)

### Facebook OAuth Setup

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Facebook Login product
4. Configure Valid OAuth Redirect URIs:
   - `http://localhost:3000/api/auth/callback/facebook` (development)
   - `https://yourdomain.com/api/auth/callback/facebook` (production)

## Environment Validation

The application includes automatic environment validation. If required variables are missing, you'll see an error message listing the missing variables.

The validation is handled in `src/lib/env.ts` and runs automatically when the application starts.

## Security Notes

- Never commit `.env.local` to version control
- Use different values for development and production
- Rotate secrets regularly
- Use strong, random values for `NEXTAUTH_SECRET`

## Troubleshooting

### Common Issues

1. **"Missing required environment variables" error**
   - Check that all required variables are set in `.env.local`
   - Ensure variable names match exactly (case-sensitive)

2. **OAuth login not working**
   - Verify OAuth client IDs and secrets
   - Check redirect URIs in OAuth provider settings
   - Ensure `NEXTAUTH_URL` matches your application URL

3. **API calls failing**
   - Verify `NEXT_PUBLIC_API_BASE_URL` points to your backend
   - Ensure backend is running and accessible

### Getting Help

If you encounter issues:
1. Check the console for error messages
2. Verify all environment variables are set correctly
3. Ensure the backend application is running
4. Check network connectivity between frontend and backend