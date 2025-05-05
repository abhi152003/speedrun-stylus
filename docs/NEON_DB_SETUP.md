# Setting Up Neon DB for Production

This guide will walk you through the process of setting up Neon DB as your production database for SpeedRunEthereum.

## Prerequisites

- A Neon account (sign up at [neon.tech](https://neon.tech))
- Your SpeedRunEthereum project ready for deployment

## Steps to Configure Neon DB

### 1. Create a Neon Project

1. Sign up or log in to [Neon](https://neon.tech)
2. Create a new project
3. Choose a name for your project (e.g., `speedrun-ethereum`)
4. Select a region closest to your users
5. Click "Create Project"

### 2. Get Your Connection String

1. In your Neon dashboard, go to your project
2. Find the connection string in the "Connection Details" section
3. It should look like: `postgres://user:password@hostname.neon.tech/database`

### 3. Configure Your Application

#### For Development

Create a `.env.development` file in your `packages/nextjs` directory:

```
# Local development PostgreSQL URL (Docker container)
POSTGRES_URL=postgres://postgres:postgres@localhost:5432/postgres
```

#### For Production

Create a `.env.production` file in your `packages/nextjs` directory:

```
# Neon DB connection string
POSTGRES_URL=postgres://your-actual-neon-connection-string
```

### 4. Run Migrations on Neon DB

Before deploying, you need to run your database migrations on Neon:

```
POSTGRES_URL=your-neon-connection-string yarn drizzle-kit migrate
```

### 5. Seed Your Database (Optional)

If you want to seed your production database:

```
POSTGRES_URL=your-neon-connection-string yarn db:seed
```

### 6. Deploy Your Application

When deploying to platforms like Vercel, add your Neon DB connection string as an environment variable:

1. In your Vercel project settings, add an environment variable:
   - Name: `POSTGRES_URL`
   - Value: Your Neon connection string
   
2. Redeploy your application

## How It Works

The application is already configured to detect Neon DB connections in `packages/nextjs/services/database/config/postgresClient.ts`:

```typescript
if (process.env.POSTGRES_URL?.includes("neondb") && isNextRuntime) {
  // Use neon-serverless for next runtimes
  poolInstance = new NeonPool({ connectionString: process.env.POSTGRES_URL as string });
  dbInstance = drizzleNeon(poolInstance as NeonPool, { schema, casing: "snake_case" });
}
```

This code automatically uses the Neon serverless driver when it detects a Neon connection string.

## Troubleshooting

- **Connection Issues**: Make sure your connection string is correctly formatted and that you've allowed connections from your deployment platform's IP addresses in Neon's connection settings.
- **Migration Errors**: If migrations fail, check that your Neon database is empty before running migrations.
- **Performance Issues**: Consider enabling the Neon Serverless Driver's connection pooling features for better performance. 