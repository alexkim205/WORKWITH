/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

const to = require("await-to-js").default;
const router = require("express").Router();
const isEmpty = require("is-empty");
const passport = require("passport");
const _ = require("lodash");
const { HttpStatus } = require("../_constants/error.constants");
const User = require("../models/user.model");
const validateRegisterInput = require("../validators/register.validator");
const validateLoginInput = require("../validators/login.validator");
const validateUpdateUserInput = require("../validators/update.user.validator");

/**
 * @swagger
 * path:
 *  /users/:
 *    get:
 *      summary: Get users
 *      tags: [Users]
 *      responses:
 *        "200":
 *          description: OK. Returns a list of user schemas
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/User'
 *        "204":
 *          description: NO_CONTENT. Returns an empty list
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/User'
 */
router.route("/").get(async (req, res) => {
  const [err, users] = await to(User.find());
  if (!isEmpty(err)) {
    return res.status(HttpStatus.BAD_REQUEST).send(err);
  }
  if (isEmpty(users)) {
    return res.status(HttpStatus.NO_CONTENT).send();
  }
  return res
    .status(HttpStatus.OK)
    .json({ users: _.map(users, user => user.getSafeUser()) });
});

/**
 * @swagger
 * path:
 *  /users/{id}:
 *    get:
 *      summary: Get a user by ID
 *      tags: [Users]
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
 *                $ref: '#/components/schemas/User'
 *        "404":
 *          description: NOT_FOUND. User not found
 */
router.route("/:id").get(async (req, res) => {
  const [err, user] = await to(User.findById(req.params.id));
  if (!isEmpty(err)) {
    return res.status(HttpStatus.BAD_REQUEST).send(err);
  }
  if (isEmpty(user)) {
    return res
      .status(HttpStatus.NOT_FOUND)
      .send(`User with id ${req.params.id} NOT_FOUND`);
  }
  return res.status(HttpStatus.OK).send({ user: user.getSafeUser() });
});

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
 *                $ref: '#/components/schemas/User'
 */
router.route("/add").post(async (req, res) => {
  // Validate form data
  const err1 = validateRegisterInput(req.body);
  if (!isEmpty(err1)) {
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).send(err1);
  }

  const user = new User({
    name: req.body.name,
    email: req.body.email
  });

  // Explicitly set salt and hash
  user.setPassword(req.body.password);

  const [err2, newUser] = await to(user.save());

  if (!isEmpty(err2)) {
    return res.status(HttpStatus.BAD_REQUEST).send(err2);
  }
  if (isEmpty(newUser)) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send("Bad request creating new user");
  }

  return res
    .status(HttpStatus.CREATED)
    .send({ user: user.getSafeUser(), token: user.generateJwt() });
});

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
 *                  - $ref: '#/components/schemas/User'
 *                  - type: object
 *                    properties:
 *                      token:
 *                        type: string
 *        "404":
 *          description: NOT_FOUND. User not found
 *
 */
router.route("/login").post(async (req, res) => {
  // Validate form data
  const err = validateLoginInput(req.body);
  if (!isEmpty(err)) {
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).send(err);
  }

  // Cannot use async/await b/c passport uses done/next logic
  return passport.authenticate("local", (passportErr, user, info) => {
    if (!isEmpty(passportErr)) {
      return res.status(HttpStatus.BAD_REQUEST).send(passportErr);
    }
    if (user) {
      return res
        .status(HttpStatus.OK)
        .send({ user: user.getSafeUser(), token: user.generateJwt() });
    }

    return res.status(HttpStatus.NOT_FOUND).send(JSON.stringify(info));
  })(req, res);
});

/**
 * @swagger
 * path:
 *  /users/update/{id}:
 *    put:
 *      summary: Update a user by ID
 *      tags: [Users]
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
 *                $ref: '#/components/schemas/User'
 */
router.route("/update/:id").put(async (req, res) => {
  // Validate form data
  req.body._id = req.params.id;
  const err = validateUpdateUserInput(req.body);
  if (!isEmpty(err)) {
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).send(err);
  }

  const [err1, user] = await to(User.findById(req.params.id));
  if (!isEmpty(err1)) {
    return res.status(HttpStatus.BAD_REQUEST).send(err1);
  }
  if (isEmpty(user)) {
    return res
      .status(HttpStatus.NOT_FOUND)
      .send(`User with id ${req.params.id} NOT_FOUND`);
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;

  const [err2, newUser] = await to(user.save());
  if (!isEmpty(err2)) {
    return res.status(HttpStatus.BAD_REQUEST).send(err2);
  }
  if (isEmpty(newUser)) {
    return res.status(HttpStatus.BAD_REQUEST).send("Bad request updating user");
  }
  return res.status(HttpStatus.OK).send({ user: newUser.getSafeUser() });
});

/**
 * @swagger
 * path:
 *  /users/{id}:
 *    delete:
 *      summary: Delete a user by ID
 *      tags: [Users]
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
 */
router.route("/:id").delete(async (req, res) => {
  const [err1, user] = await to(User.findById(req.params.id));
  if (!isEmpty(err1)) {
    return res.status(HttpStatus.BAD_REQUEST).send(err1);
  }
  if (isEmpty(user)) {
    return res
      .status(HttpStatus.NOT_FOUND)
      .send(`User with id ${req.params.id} NOT_FOUND`);
  }

  if (user.deleted) {
    return res.status(HttpStatus.OK).send("User has already been deleted");
  }

  user.deleted = true;

  const [err2, newUser] = await to(user.save());
  if (!isEmpty(err2)) {
    return res.status(HttpStatus.BAD_REQUEST).send(err2);
  }
  if (isEmpty(newUser)) {
    return res.status(HttpStatus.BAD_REQUEST).send("Bad request deleting user");
  }
  return res
    .status(HttpStatus.OK)
    .send(`User with id ${req.params.id} successfully deleted.`);
});

module.exports = router;
