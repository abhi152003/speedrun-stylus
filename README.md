# SpeedRunStylus

![SRE Thumbnail](./packages/nextjs/public/speedrun-logo-new.png)

Welcome to the **SpeedRunStylus** project, an enhanced platform for builders to engage with various challenges and unlock their builder profiles. This project is built with [Scaffold-ETH 2](https://github.com/scaffold-eth/scaffold-eth-2) and offers an expanded experience for developers.

## Features

- Interact with various BuidlGuidl curriculums.
- Share your builds and discover what other builders are creating.
- Earn badges for your achievements.
- Compete on the leaderboard with other builders.

You can find the repository containing the challenges [here](https://github.com/abhi152003/speedrun_stylus).

## Requirements

Before you begin, you need to install the following tools:

- [Node (>= v18.18)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)
- [Docker Engine](https://docs.docker.com/engine/install/)

## Development Quickstart

1. Install dependencies

   ```bash
   yarn install
   ```

2. Spin up the Postgres database service, create the database, and seed it

   ```bash
   docker compose up -d
   yarn drizzle-kit migrate
   yarn db:seed
   ```

3. Start your NextJS app:

   ```bash
   yarn start
   ```

   Visit your app at: `http://localhost:3000`.

4. You can explore the database with:

   ```bash
   yarn drizzle-kit studio
   ```

### Database Information

We are using Drizzle with Postgres for database management. You can run `drizzle-kit` commands from the root with `yarn drizzle-kit`.

#### Local Development Database

For local development, we use a Docker-based Postgres instance.

#### Production Database with Neon

For production, we recommend using [Neon DB](https://neon.tech), a serverless Postgres service optimized for Next.js applications. To configure Neon DB:

1. Sign up for a Neon account and create a project.
2. Get your connection string from the Neon dashboard.
3. Set the `POSTGRES_URL` environment variable with your Neon connection string.
4. Run migrations: `POSTGRES_URL=your-neon-connection-string yarn drizzle-kit migrate`.

For detailed setup instructions, see [docs/NEON_DB_SETUP.md](docs/NEON_DB_SETUP.md).

### Database Migration

Anytime we update the schema in `packages/nextjs/services/database/config/schema.ts`, we can generate a migration with:

```bash
yarn drizzle-kit generate
```

Then we can apply the migration with:

```bash
yarn drizzle-kit migrate
```

We also need to make sure we commit the migration to the repo.

### Database (dev info)

To iterate quickly on the database locally:

- Tweak the schema in `schema.ts`.
- Run `yarn drizzle-kit push` to apply the changes.
- Copy `seed.data.example.ts` to `seed.data.ts`, tweak as needed, and run `yarn db:seed` (this will delete existing data).
