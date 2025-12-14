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

## Running Tests

Tests are integration tests for the REST API and service layer.

1. Have npm installed
2. *npm run clean* (dist directory must not exist)
3. *npm run test*

Integration tests are run using an ad-hoc MySQL container.

## Building

Run

```
./build
```

or

```
./build omit_tests
```

This will produce the Docker image *icecreamparlor-orderservice*.

