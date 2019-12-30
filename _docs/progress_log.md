# Log

## Backlog Todo

- Breakdown components
- Create detailed routing outline
- Figure out clear TDD pipeline for frontend
- Write frontend tests for services
  - Decide if I want to use mock http (more time to implement, but best practice) or serve client server (less time)

## 12/30/2019

- Finish writing client notes tests
- Fix bug Mocha scope bug
- Added frontend reducers
- Authentication service on client side
  - Connect it with redux

## 12/27/2019

- Continue writing backend tests for notes api

## 12/26/2019

- Workaround Travis .env encryption by using local mongod for testing
- Write backend tests for notes api
  - Extend Validator library
  - Add note validators

## 12/25/2019

- Setup database for each environment
- Implement getEnv config util for backend
- Write backend tests for users api (Mocha + Chai)
- Better environment configuration
- Fixed address in use error during backend testing

## 12/24/2019

- Setup linter with Airbnb JS standards
- Setup test continuous integration with Travis CI
- Move linter from directories to project root

## 12/23/2019

- Server
  - Add Project collection
    - Add project_id field to note
    - Add model
    - Add router
  - Reflect changes in Note and User
  - Replace username field in User with screenName
  - Add authentication in backend
    - Setup hash, salt, jwt, passport
    - Implement login and register endpoints
- Client
  - Implement notes, projects, and users services

## 12/21/2019

- Figure out enzyme testing configuration
- Add constants
- Add reducer util files

## 12/20/2019

- Setup frontend boilerplate
  - Theming, store (+ persist), and routing
- Moved frontend stuff into separate folder
- Environments in VSCode
- Add README.md

## 12/19/2019

- Setup backend with Express
  - Notes and users models
  - Notes and users routes
- Setup Swagger API documentation
