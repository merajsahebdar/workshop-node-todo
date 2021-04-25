# Shanbe Backend

_A Backend Boilerplate built on top of NestJS._

## Features

- [x] Microservice and CQRS Design
- [x] GraphQL, Apollo Federation
- [x] Authentication and Authorization
- [x] OAuth and SSO (Google, GitHub, Facebook)
- [x] User Email Verification (Signed Request Method)
- [x] Multiple email address for each user
- [x] [Casbin](https://casbin.org) based Access Control
- [x] Mailing Queue

## Requirements

| Name         | Version    |
| :----------- | :--------- |
| `Node.JS`    | `^14.0.0`  |
| `PostgreSQL` | `>=13.0.0` |
| `Redis`      | `^5.0.0`   |

## Environment Variables

| Variable                            | Description                                        |
| :---------------------------------- | :------------------------------------------------- |
| `APP_KEY`                           | A strong and safe key to use as hash salt          |
| `APP_SIGNED_REQUEST_EXPIRES`        | The expiration time in minutes for signed requests |
| `ACCOUNT_API_PORT`                  | The port number to start the Account API on it     |
| `ACCOUNT_API_USER_VERIFICATION_URL` | The URL for user verification                      |
| `GATEWAY_API_PORT`                  | The port number to start the Gateway API on it     |
| `TYPEORM_HOST`                      | The host address of database                       |
| `TYPEORM_PORT`                      | The port number of database                        |
| `TYPEORM_USERNAME`                  | The username for database access                   |
| `TYPEORM_PASSWORD`                  | The password for database access                   |
| `TYPEORM_DATABASE`                  | Database Connection Settings                       |
| `JWT_PUBLIC_KEY`                    | Path to a public key to use as jwt signature       |
| `JWT_PRIVATE_KEY`                   | Path to a private key to use as jwt signature      |
| `JWT_PRiVATE_KEY_PASSPHRASE`        | The passphrase belongs to the jwt private key      |
| `REDIS_HOST`                        | The host address of Redis server                   |
| `REDIS_PORT`                        | The port number of Redis server                    |
| `MAILER_TRANSPORT`                  | The mailing connection transport                   |
| `MAILER_DEFAULT_SENDER`             | The default email address to send mails from it    |
| `OAUTH_GOOGLE_CLIENT_ID`            | Google OAuth Client Id                             |
| `OAUTH_GOOGLE_CLIENT_SECRET`        | Google OAuth Client Secret                         |
| `OAUTH_GOOGLE_REDIRECT_URI`         | Google OAuth Redirect URI                          |
| `OAUTH_GITHUB_CLIENT_ID`            | GitHub OAuth Client Id                             |
| `OAUTH_GITHUB_CLIENT_SECRET`        | GitHub OAuth Client Secret                         |
| `OAUTH_GITHUB_REDIRECT_URI`         | GitHub OAuth Redirect URI                          |
| `OAUTH_FACEBOOK_CLIENT_ID`          | Facebook OAuth Client Id                           |
| `OAUTH_FACEBOOK_CLIENT_SECRET`      | Facebook OAuth Client Secret                       |
| `OAUTH_FACEBOOK_REDIRECT_URI`       | Facebook OAuth Redirect URI                        |

## Todos

- [ ] Add Tests

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
