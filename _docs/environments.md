# Environments

## Development and Production

The development environment variables that define the port and Mongo Atlas connection URLs lie in the `backend/.env` and `frontend/.env` files.

The production environment variables are set in AWS using a VSCode extension.

## Available Environments

- _development_
- _production_
- _testing_
  - Autonomous testing of backend and frontend using offline mongod instance and nock mock http service respectively.
- _testing-connection_
  - On backend, this env is used to serve a local server on port 8889.
  - ~~On frontend, this env is used to test the service calls to the local server on 8889.~~
  - ~~When both scripts are run concurrently, the connection between frontend and backend are tested.~~
  - Frontend tests just the server connection, and uses mock services otherwise.
