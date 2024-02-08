# About

TBA

## Tech Stack

- [**S**ST](https://sst.dev)
- [**P**risma](https://prisma.io)
- [Svelte**K**it](https://kit.svelte.dev)
- [**L**ucia](https://lucia-auth.com)

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
   1. `pnpm start` (run `pnpm start --host` if you want to access the server from other devices on your network)
4. The app should be viewable at `localhost:5173` by default. Changes to the code will automatically update the page. If you ran `pnpm start --host`, you can access the app from other devices on your network at `host-ip:5173`.

### Committing Changes

- Follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/#summary) specification when writing commit messages.
  - E.g., `git commit -m "feat: add this feature"`; `git commit -m "fix: fix this bug"`.
- Keep commits and PRs atomic.
  - A PR should be a single feature or bug fix.
  - A commit should be a single logical change.

### Environment Variables

If you need credentials for the `.env` file, contact the project lead ([Minh](https://github.com/minhxNguyen7/)).

After changes to the .env file, run `pnpm run check` to update SvelteKit's auto-generated environment variable types. 
