# Log

## Backlog Todo

- Breakdown components
- Create detailed routing outline

## 1/21/2020

- Made registration and login using auth forms work
- Remove sensitive info from register/login client requests
- Fix payload in returned JWT to include user
- Return safe user model
- Fix binding of salt and hash to model instance

## 1/20/2020

- Fixed bug with jumping auth button at initial state
- Removed useless animatingOut prop from flipped button and fullscreenloader components
- Add timeout to disable button until animation end

## 1/16/2020

- Refactored auth field animations

## 1/15/2020

- Animations in auth page
- Fixed bug with fields being removed in register state

## 1/13/2020

- Added a cooler animation for loading, pending, success
- Add error handling to client services
- Fix snapshots for App.js and users.actions
- Remove `Error:` prefixes from server error responses
- TODO: make sure server errors correspond to client errors
- TODO: map server field errors to corresponding form fields client

## 1/10/2020

- Fixed animations for full screen pending loader

## 1/9/2020

- Add login and register forms for auth page
- Create Flip hook, context, and provider
- Jank animating between auth pages

## 1/8/2020

- Figure out animations using react-flip-toolkit
- Add routing for projects dashboard
- Add functional projects page component
- Add redux selectors for auth

## 1/7/2020

- Scrap comprehensive testing-connect, rather just have simple service.test.js that tests if connection to database can be made.
- Unit test actions separately
- Finish action tests
- Finish writing backend tests for projects (finish backend tests)
- Create detailed routing and pages outline in App/index.js

## 1/5/2020

- create helper functions in test.constants.js for notes and projects
- TODO: implement notes and projects action tests

## 1/4/2020

- Implement online (testing-connect) and offline (testing) tests for actions
- Script to setup online testing-connect database and populate (finished for users.actions.test)

## 1/2/2020

- Write users actions tests.

## 1/1/2020

- Implemented mock services without using nock

## 12/31/2019

- Backend
  - Create new "testing-connection" environment
- Frontend
  - Create new "testing-connection" environment
  - Refactored actions into separate services
  - Added mock services
  - Wrote service tests
    - Use nock (mock http) when testing actions + reducers offline
    - To test if backend and frontend are connected (i.e., services hit server in testing mode; ENV=testing-connection), use npm script to concurrently start test server and use mocha + chai to test responses

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
