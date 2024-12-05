# About

Simple, clean, and efficient meeting scheduling app.

## Tech Stack

- [SST](https://sst.dev)
- [Drizzle](https://orm.drizzle.team/)
- [Lucia](https://lucia-auth.com)
- [Next](https://nextjs.org/)

# Contributing

## Local Development

### Prerequisites

- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/en/)
- [pnpm](https://pnpm.io)
  - Just run `npm i -g pnpm` to install.

### Local Setup

1. Clone this repository locally
2. Navigate to the root directory and install the dependencies.
   1. `cd ZotMeet`
   2. `pnpm install`
3. Start the development server
   1. `pnpm dev` (run `pnpm dev --host` if you want to access the server from other devices on your network)
4. The app should be viewable at `localhost:3000` by default. Changes to the code will automatically update the page. If you ran `pnpm dev --host`, you can access the app from other devices on your network at `host-ip:3000`.

### Local Database Setup

1. Go to the [Postgres official website](https://www.postgresql.org/download/) and download the database for your specific OS. \([Here](https://www.postgresql.org/docs/16/tutorial-start.html) is more information, if you get stuck)
2. While running the setup, ensure that pgAdmin is downloaded alongside Postgres itself
3. Once connected to the Postgres Server, Right click on databases -> create -> database, and name it `zotmeet`.
4. In the ZotMeet project root directory, `pnpm db:generate` will generate any updated database migrations.
5. Create a .env file, and set `DATABASE_URL=postgres://yourusername:yourpassword@localhost:5432/zotmeet`
6. Run `pnpm db:migrate` to apply all the migration changes to your local database.

### Committing Changes

- Follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#summary) specification when writing commit messages.
  - E.g., `git commit -m "feat: add this feature"`; `git commit -m "fix: fix this bug"`.
- Keep commits and PRs atomic.
  - A PR should be a single feature or bug fix.
  - A commit should be a single logical change.

### Environment Variables

If you need credentials for the `.env` file, contact the project lead ([Sean](https://github.com/seancfong/)).

After changes to the .env file, run `pnpm run check` to update SvelteKit's auto-generated environment variable types.
