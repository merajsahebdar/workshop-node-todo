# Shanbe API

_An API Boilerplate built on top of NestJS._

## Features

- Authentication and Authorization
- [Casbin](https://casbin.org) based Access Control
- User Email Verification
- Mailing Queue

## Requirements

- `Node.JS ^14.0.0`
- `PostgreSQL >=13.0.0`

## Environment Variables

- `APP_PORT`: The port number to start API on it
- `APP_KEY`: A strong and safe key to use as hash salt
- `APP_URL`: The url to the current running instance of API
- `APP_AUTH_VERIFY_REDIRECT_URL`: The url to redirect after user's email verification
- `TYPEORM_HOST`, `TYPEORM_PORT`, `TYPEORM_USERNAME`, `TYPEORM_PASSWORD`, `TYPEORM_DATABASE`: Database Connection Settings
- `JWT_PUBLIC_KEY=storage/jwt/public.key`: Path to a public key to use as jwt signature
- `JWT_PRIVATE_KEY=storage/jwt/private.key`: Path to a private key to use as jwt signature
- `JWT_PRiVATE_KEY_PASSPHRASE=password`: The passphrase belongs to the jwt private key
- `REDIS_HOST`, `REDIS_PORT`: Redis Connection Settings
- `MAILER_TRANSPORT`, `MAILER_DEFAULT_SENDER`: Mail Settings

## Running the API

```bash
# install dependencies
yarn install

# development
yarn run start

# watch mode
yarn run start:dev

# production mode
yarn run start:prod
```

## Test

```bash
# unit tests
yarn run test

# e2e tests
yarn run test:e2e

# test coverage
yarn run test:cov
```
