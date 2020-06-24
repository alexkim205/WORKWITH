/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

const to = require("await-to-js").default;
const router = require("express").Router();
const passport = require("passport");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const { switchEnvs } = require("../_config/getEnv.config");
const { HttpStatus } = require("../_constants/error.constants");
const { BaseUser, User } = require("../models/user.model");
const Role = require("../_utils/roles.util");
const authorize = require("../_utils/authorize.util");
const findOrCreateBaseUser = require("../_utils/findOrCreateBaseUser");
const validateRegisterInput = require("../validators/register.validator");
const validateLoginInput = require("../validators/login.validator");
const validateUpdateUserInput = require("../validators/update.user.validator");
const validateRefreshTokenInput = require("../validators/refresh.token.user.validator");

/**
 * @swagger
 * path:
 *  /users/:
 *    get:
 *      summary: Get users
 *      tags: [Users]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        "200":
 *          description: OK. Returns a list of user schemas
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/UserSafe'
 *        "204":
 *          description: NO_CONTENT. Returns an empty list
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/UserSafe'
 *        "401":
 *          $ref: '#/components/responses/UnauthorizedError'
 */
const getUsers = async (req, res) => {
  const [err, users] = await to(BaseUser.find());
  if (!_.isEmpty(err)) {
    return res.status(HttpStatus.BAD_REQUEST).send(err);
  }
  if (_.isEmpty(users)) {
    return res.status(HttpStatus.NO_CONTENT).send();
  }
  return res
    .status(HttpStatus.OK)
    .json({ users: _.map(users, user => user.getSafeUser()) });
};
router.route("/").get(authorize(Role.ADMIN), getUsers);

/**
 * @swagger
 * path:
 *  /users/{id}/contacts:
 *    get:
 *      summary: Get contacts by user ID
 *      tags: [Users]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        "200":
 *          description: OK. Returns a list of contact user schemas
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Contact'
 *        "204":
 *          description: NO_CONTENT. Returns an empty list
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/UserSafe'
 *        "401":
 *          $ref: '#/components/responses/UnauthorizedError'
 */
const getContactsByUser = async (req, res) => {
  // Only admins can access other users' contacts
  if (req.params.id !== req.user._id && req.user.role !== Role.ADMIN) {
    return res.status(HttpStatus.UNAUTHORIZED).send("Request is UNAUTHORIZED");
  }
  const [err, user] = await to(BaseUser.findById(req.params.id));
  if (!_.isEmpty(err)) {
    return res.status(HttpStatus.BAD_REQUEST).send(err);
  }
  if (_.isEmpty(user)) {
    return res
      .status(HttpStatus.NOT_FOUND)
      .send(`User with id ${req.params.id} NOT_FOUND`);
  }
  if (_.isEmpty(user.contacts)) {
    return res
      .status(HttpStatus.NO_CONTENT)
      .send(`User with id ${req.params.id} has no contacts.`);
  }
  // `updateUser` function ensures contact will always exist,
  // either as a guest or user.
  const findContactPromises = user.contacts.map(async contactId => {
    const [errContact, contact] = await to(BaseUser.findById(contactId));
    if (!_.isEmpty(errContact)) {
      throw new Error(errContact);
    }
    if (_.isEmpty(contact)) {
      throw new Error(`Contact with id ${contactId} was not found.`);
    }
    return contact.getContactUser();
  });
  const [err2, contacts] = await to(
    Promise.allSettled(findContactPromises).then(results =>
      _(results)
        .filter(r => r.status === "fulfilled")
        .map(r => r.value)
        .value()
    )
  );
  if (!_.isEmpty(err2)) {
    return res.status(HttpStatus.BAD_REQUEST).send(err2);
  }

  return res
    .status(HttpStatus.OK)
    .json({ user: _.assign({}, user.getSafeUser(), { contacts }) });
};
router
  .route("/:id/contacts")
  .get(authorize([Role.ADMIN, Role.USER]), getContactsByUser);

/**
 * @swagger
 * path:
 *  /users/{id}:
 *    get:
 *      summary: Get a user by ID
 *      tags: [Users]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: Object ID of the user to get
 *      responses:
 *        "201":
 *          description: CREATED. Returns a user schema
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/UserSafe'
 *        "404":
 *          description: NOT_FOUND. User not found
 *        "401":
 *          $ref: '#/components/responses/UnauthorizedError'
 */
const getUser = async (req, res) => {
  // Only admins can access other user records
  if (req.params.id !== req.user._id && req.user.role !== Role.ADMIN) {
    return res.status(HttpStatus.UNAUTHORIZED).send("Request is UNAUTHORIZED");
  }
  const [err, user] = await to(BaseUser.findById(req.params.id));
  if (!_.isEmpty(err)) {
    return res.status(HttpStatus.BAD_REQUEST).send(err);
  }
  if (_.isEmpty(user)) {
    return res
      .status(HttpStatus.NOT_FOUND)
      .send(`User with id ${req.params.id} NOT_FOUND`);
  }
  return res.status(HttpStatus.OK).send({ user: user.getSafeUser() });
};
router.route("/:id").get(authorize([Role.ADMIN, Role.USER]), getUser);

/**
 * @swagger
 * path:
 *  /users/add:
 *    post:
 *      summary: Create a new user
 *      tags: [Users]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserRegister'
 *      responses:
 *        "201":
 *          description: CREATED. Returns a user schema
 *          content:
 *            application/json:
 *              schema:
 *                allOf:
 *                  - $ref: '#/components/schemas/UserSafe'
 *                  - type: object
 *                    properties:
 *                      token:
 *                        type: string
 *                      refreshToken:
 *                        type: string
 *        "401":
 *          $ref: '#/components/responses/UnauthorizedError'
 */
const register = async (req, res) => {
  // Validate form data
  const err1 = validateRegisterInput(req.body);
  if (!_.isEmpty(err1)) {
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).send(err1);
  }

  const user = new User(_.pick(req.body, ["name", "email", "role"]));

  user.setPassword(req.body.password);

  const [err2, newUser] = await to(user.save());

  if (!_.isEmpty(err2)) {
    return res.status(HttpStatus.BAD_REQUEST).send(err2);
  }
  if (_.isEmpty(newUser)) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send("Bad request creating new user");
  }

  return res
    .status(HttpStatus.CREATED)
    .send({ user: user.getSafeUser(), ...user.generateJwt() });
};
router.route("/add").post(register);

/**
 * @swagger
 * path:
 *  /users/login:
 *    post:
 *      summary: Login as a user
 *      tags: [Users]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserLogin'
 *      responses:
 *        "200":
 *          description: OK. Returns a user schema
 *          content:
 *            application/json:
 *              schema:
 *                allOf:
 *                  - $ref: '#/components/schemas/UserSafe'
 *                  - type: object
 *                    properties:
 *                      token:
 *                        type: string
 *                      refreshToken:
 *                        type: string
 *        "404":
 *          description: NOT_FOUND. User not found
 *        "401":
 *          $ref: '#/components/responses/UnauthorizedError'
 *
 */
const login = async (req, res) => {
  // Validate form data
  const err = validateLoginInput(req.body);
  if (!_.isEmpty(err)) {
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).send(err);
  }

  // Cannot use async/await b/c passport uses done/next logic
  return passport.authenticate("local", (passportErr, user, info) => {
    if (!_.isEmpty(passportErr)) {
      return res.status(HttpStatus.BAD_REQUEST).send(passportErr);
    }
    if (user) {
      return res
        .status(HttpStatus.OK)
        .send({ user: user.getSafeUser(), ...user.generateJwt() });
    }

    return res.status(HttpStatus.NOT_FOUND).send(JSON.stringify(info));
  })(req, res);
};
router.route("/login").post(login);

/**
 * @swagger
 * path:
 *  /users/token:
 *    post:
 *      summary: Refresh user token
 *      tags: [Users]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              allOf:
 *                - $ref: '#/components/schemas/User'
 *                - type: object
 *                  properties:
 *                    token:
 *                      type: string
 *                    refreshToken:
 *                      type: string
 *      responses:
 *        "200":
 *          description: OK. Returns a token
 *          content:
 *            application/json:
 *              schema:
 *                allOf:
 *                  - $ref: '#/components/schemas/UserSafe'
 *                  - type: object
 *                    properties:
 *                      token:
 *                        type: string
 *                      refreshToken:
 *                        type: string
 *        "401":
 *          description: UNAUTHORIZED. Refresh token is invalid or has expired.
 */
const refreshToken = async (req, res) => {
  // Validate form data
  const err1 = validateRefreshTokenInput(req.body);
  if (!_.isEmpty(err1)) {
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).send(err1);
  }

  const refreshSecret = switchEnvs({
    generic: process.env.PRODUCTION_REFRESH_JWT_SECRET,
    dev: process.env.DEVELOPMENT_REFRESH_JWT_SECRET,
    test: process.env.TESTING_REFRESH_JWT_SECRET,
    testConnection: process.env.TESTING_REFRESH_JWT_SECRET
  });

  // jwt functions aren't promisifed yet
  return jwt.verify(req.body.refreshToken, refreshSecret, (err2, user) => {
    if (!_.isEmpty(err2) || _.isEmpty(user)) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .send("Refresh token is invalid");
    }
    return BaseUser.findById(user._id)
      .then(dbUser => {
        if (
          _.isEmpty(dbUser) ||
          // check if request body and db user matches
          !_.isEqual(req.body.user, {
            ...dbUser.getSafeUser(),
            _id: dbUser._id.toString()
          })
        ) {
          return res
            .status(HttpStatus.UNAUTHORIZED)
            .send("Refresh token is invalid");
        }
        // Sign new JWT token
        return res
          .status(HttpStatus.OK)
          .send({ user: dbUser.getSafeUser(), ...dbUser.generateJwt() });
      })
      .catch(err3 => {
        return res.status(HttpStatus.BAD_REQUEST).send(err3);
      });
  });
};
router.route("/token").post(refreshToken);

/**
 * @swagger
 * path:
 *  /users/update/{id}:
 *    put:
 *      summary: Update a user by ID
 *      tags: [Users]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: Object ID of the user to get
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      responses:
 *        "200":
 *          description: OK. Returns a user schema
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/UserSafe'
 *        "401":
 *          $ref: '#/components/responses/UnauthorizedError'
 */
const updateUser = async (req, res) => {
  // Only admins can update other user records
  if (req.params.id !== req.user._id && req.user.role !== Role.ADMIN) {
    return res.status(HttpStatus.UNAUTHORIZED).send("Request is UNAUTHORIZED");
  }
  // Validate form data
  req.body._id = req.params.id;
  const err = validateUpdateUserInput(req.body);
  if (!_.isEmpty(err)) {
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).send(err);
  }

  const [err1, user] = await to(BaseUser.findById(req.params.id));
  if (!_.isEmpty(err1)) {
    return res.status(HttpStatus.BAD_REQUEST).send(err1);
  }
  if (_.isEmpty(user)) {
    return res
      .status(HttpStatus.NOT_FOUND)
      .send(`User with id ${req.params.id} NOT_FOUND`);
  }

  // Check by id or email if each contact exists. If account doesn't exist,
  // create guest account.
  req.body.contacts = req.body.contacts || [];
  const findOrCreateContactsPromises = findOrCreateBaseUser(req.body.contacts);
  const [err2, contacts] = await to(Promise.all(findOrCreateContactsPromises));
  if (!_.isEmpty(err2)) {
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).send(err2);
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.contacts = _(user.contacts)
    .concat(contacts)
    .uniqBy(id => id.toString())
    .value();

  const [err3, newUser] = await to(user.save());
  if (!_.isEmpty(err3)) {
    return res.status(HttpStatus.BAD_REQUEST).send(err3);
  }
  if (_.isEmpty(newUser)) {
    return res.status(HttpStatus.BAD_REQUEST).send("Bad request updating user");
  }
  return res.status(HttpStatus.OK).send({ user: newUser.getSafeUser() });
};
router.route("/update/:id").put(authorize([Role.ADMIN, Role.USER]), updateUser);

/**
 * @swagger
 * path:
 *  /users/{id}:
 *    delete:
 *      summary: Delete a user by ID
 *      tags: [Users]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: Object ID of the user to get
 *      responses:
 *        "200":
 *          description: OK. User soft deleted.
 *          schema:
 *            type: string
 *        "404":
 *          description: NOT_FOUND. User not found
 *        "401":
 *          $ref: '#/components/responses/UnauthorizedError'
 */
const deleteUser = async (req, res) => {
  // Only admins can access other user records
  if (req.params.id !== req.user._id && req.user.role !== Role.ADMIN) {
    return res.status(HttpStatus.UNAUTHORIZED).send("Request is UNAUTHORIZED");
  }
  const [err1, user] = await to(BaseUser.findById(req.params.id));
  if (!_.isEmpty(err1)) {
    return res.status(HttpStatus.BAD_REQUEST).send(err1);
  }
  if (_.isEmpty(user)) {
    return res
      .status(HttpStatus.NOT_FOUND)
      .send(`User with id ${req.params.id} NOT_FOUND`);
  }

  if (user.deleted) {
    return res.status(HttpStatus.OK).send("User has already been deleted");
  }

  user.deleted = true;

  const [err2, newUser] = await to(user.save());
  if (!_.isEmpty(err2)) {
    return res.status(HttpStatus.BAD_REQUEST).send(err2);
  }
  if (_.isEmpty(newUser)) {
    return res.status(HttpStatus.BAD_REQUEST).send("Bad request deleting user");
  }
  return res
    .status(HttpStatus.OK)
    .send(`User with id ${req.params.id} successfully deleted.`);
};
router.route("/:id").delete(authorize([Role.ADMIN, Role.USER]), deleteUser);

module.exports = router;
