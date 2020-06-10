# Log

## Backlog Todo

## 6/9/2020

- Cache projects, don't update component unless projects are different.
- Add multi-select contact options.
- Multi-select logic working with react-hook-form. TODO standardize styling.

## 6/7/2020

- Add user contacts action in frontend and hook into addprojectbutton modal.
- Add test coverage and make more comprehensive tests for user and project routes.
- Update frontend Jest snapshots.

## 6/6/2020

- Add multiinput sharing input and dropdown contact search.
- Add backend request to get information about contact user objects with {name, email, \_id} if user or {email, \_id} if guest.

## 6/4/2020

- Add sharing input when creating new project in modal.
- Make project cards layout more responsive.
- Add ability to share with people.

## 6/3/2020

- Restrict projects with same name from being made.
- Fix create new project service, and hook it up to add project button.

## 5/23/2020

- Finish making register errors human readable. Encapsulate RegisterError and LoginError into ServerError and clean up axios response interceptor handle error.
- Start working on adding projects.
- Add create new project modal. Figure out why error is thrown when I try to open the modal.

## 5/17/2020

- Make general errors on authentication page more human readable.

## 4/30/2020

- Fixed annoying eslint + prettier + vscode + airbnb + lint-staged + husky bug
- Remove full page auth loader because it's buggy and slow.
- Also removes nested Flipper elements.
- Fields were NOT registered again when switched between login and register. Fixed.
- Had trouble pushing history from login/register to projects. Moved history into action creator.
- Made animations really nice on authentication page. Fixed little registration/login bugs in services.

## 4/29/2020

- Figured out why project page to projects page transition wasn't working. If fetch was pending, cached projects wouldn't render, which would interrupt the animation.
- Fixed bug where project cards would animate without transitioning between pages.

## 3/22/2020

- Try to get project --> projects page transition working

## 3/21/2020

- Replace lodash `include` with easier to understand `Array.prototype.includes`.
- Replace `location.search.replace("?","")` with more sugary `{ ignoreQueryPrefix: true }`
- Store query params in session storage in projects and project pages

## 3/17/2020

- Fixed refresh tokens. Refreshing on `/projects` with expired token works if refresh token is valid. If it's invalid, then redirect to `/auth`.
- Preserve query params between project and projects pages

## 3/16/2020

- Refactored global axios instance to baseAxios and authAxios to account for different types of requests
- Implemented axios middleware to request new token and make request again.
- Check for user pending and error states in Projects page

## 2/26/2020

- Frontend
  - Animate caret in dropdown
- Backend
  - Add refresh token to payload and refresh `/token` route
  - Update swagger documentation
  - Add token route tests

## 2/25/2020

- Add profile dropdown and style navbar
- Make card clickable
- Add card routes
- Add animation to single project page

## 2/24/2020

- Finalize styling and animation of dropdown filter
- Added outside click hook
- Add sort alphabetically filter

## 2/22/2020

- Added ToggleSwitch and Dropdown filter components

## 2/18/2020

- Add testing-offline start script to serve mock data when I'm on a train and can't connect to online Mongod.
- Fix breakpoints, use humblebee custom breakpoints instead of styled-components-breakpoints
- Beautiful grid <-> list animations
- Worked a bit on toggle switch components

## 2/12/2020

- Added debounce hook for project search input
- Fix get projects by user frontend error
- Styling of project cards

## 2/5/2020

- Add fuzzy searching for projects with fuse.js
- Adjust sorting algorithm

## 2/3/2020

- Added request and response interceptors to add tokens and handle server errors, respectively.
- Fix user, project, and note services to return object

## 1/29/2020

- Add user creating project/note to authors and users/taggedUsers arrays. Change way validateAdd{Project|Note}Input validates.

## 1/28/2020

- Fix user selector
- Add token authentication to service calls
- Make get project by user work on Projects page
- Refactor and cleanup fullscreen loader
- Nice looking animation to transform fullscreen loader into logout button on Projects page
- TODO: work on user navbar
- TODO: fix bad request on register

## 1/23/2020

- Figure out how to check if user is authorized to get notes, in other words, determine relationship between User and Note in routes or models.
  - Protect project routes by crosschecking user ids. Just authorize note routes for now.
- Add role field to model and role checking to route
- Add tokens to headers of test requests (use mock admin user for now)
- Updated user action snapshot tests
- TODO: Projects page

## 1/22/2020

- Add role authorization and authentication in backend
- Protect routes

## 1/21/2020

- Made registration and login using auth forms work
- Remove sensitive info from register/login client requests
- Fix payload in returned JWT to include user
- Return safe user model
- Fix binding of salt and hash to model instance
- Add /me route and corresponding action

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
