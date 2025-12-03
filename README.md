# Ice-Cream Parlor: Order Service

This NodeJS microservice implements the *Order API* of Ice-Cream Parlor demo app.

## Technologies used:
- NodeJS 24 with ES6 modules
- Express
- TypeScript ES6
- Knex - MySQL queries
- Zod - Validation

### For Testing
- Jest - Test framework
- Supertest - HTTP API test automation

## Building

Run

```
build
```

This will run tests, then build the app and wrap it in a Docker container.

By default, tests are run against an ad-hoc mysql service. Look into *.env* to find the mysql config. To use an existing mysql service, override *orderservice_spinup_test_container* to *false* and override the mysql params.

## Additional points
- A test container with MySQL 9 spins up at the start of tests
- Tests are integration tests for the REST API and service layer
