# Saas UI Pro - Next.js Starter Kit

## Getting started

To get started you can follow the instructions below.

For more information and detailed guides please visit [the official documentation](https://saas-ui.dev/docs/nextjs-starter-kit).

## Branches

- `main` is the latest version with Better Auth
- `supabase` is the version with Supabase Auth

## Installation

### Cloning the starter project

Clone this repository to get started.

```bash
git clone --single-branch --branch=main git@github.com:saas-js/saas-ui-pro-nextjs-starter-kit.git my-project
```

[Read full instructions to clone this repository](https://saas-ui.dev/docs/nextjs-starter-kit/installation/clone-repository).

Install the dependencies.

```bash
yarn
```

Create a `.env` file:

```bash
yarn turbo gen env
```

    > If you're on Windows, you need to manualy link or copy the .env to `apps/web/.env`.

## Running the app

To run the Next.js app, use the following command:

```bash
yarn dev:web
```

## License

See [LICENSE](./LICENSE).
