/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

const to = require("await-to-js").default;
const router = require("express").Router();
const HttpStatus = require("../constants/error.constants").HttpStatus;
let User = require("../models/user.model");

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
  let err, users;

  [err, users] = await to(User.find());

  if (err) {
    return res.status(HttpStatus.BAD_REQUEST).send("Error: " + err);
  }
  if (!users) {
    return res.status(HttpStatus.NO_CONTENT).send({ users });
  }
  return res.status(HttpStatus.OK).send({ users });
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
  let err, user;

  [err, user] = await to(User.findById(req.params.id));
  if (err) {
    return res.status(HttpStatus.BAD_REQUEST).send("Error: " + err);
  }
  if (!user) {
    return res
      .status(HttpStatus.NOT_FOUND)
      .send(`Error: User with id ${req.params.id} NOT_FOUND`);
  }
  return res.status(HttpStatus.OK).send({ user });
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
 *              $ref: '#/components/schemas/User'
 *      responses:
 *        "201":
 *          description: CREATED. Returns a user schema
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 */
router.route("/add").post(async (req, res) => {
  let err, user, newUser;

  user = new User({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email
  });
  [err, newUser] = await to(user.save());

  if (err) {
    return res.status(HttpStatus.BAD_REQUEST).send("Error: " + err);
  }
  if (!newUser) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send("Error: Bad request creating new user");
  }
  return res.status(HttpStatus.CREATED).send({ newUser });
});

/**
 * @swagger
 * path:
 *  /users/update/{id}:
 *    post:
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
router.route("/update/:id").post(async (req, res) => {
  let err, user, newUser;

  [err, user] = await to(User.findById(req.params.id));
  if (err) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send("Error while finding user: " + err);
  }
  if (!user) {
    return res
      .status(HttpStatus.NOT_FOUND)
      .send(`Error: User with id ${req.params.id} NOT_FOUND`);
  }

  user.name = req.body.name || user.name;
  user.username = req.body.username || user.username;
  user.email = req.body.email || user.email;

  [err, newUser] = await to(user.save());
  if (err) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send("Error while updating user: " + err);
  }
  if (!newUser) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send("Error: Bad request updating user");
  }
  return res.status(HttpStatus.OK).send({ user: newUser });
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
  let err, user, newUser;

  [err, user] = await to(User.findById(req.params.id));
  if (err) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send("Error while finding user: " + err);
  }
  if (!user) {
    return res
      .status(HttpStatus.NOT_FOUND)
      .send(`Error: User with id ${req.params.id} NOT_FOUND`);
  }

  if (user.deleted) {
    return res.status(HttpStatus.OK).send("User has already been deleted");
  }

  user.deleted = true;

  [err, newUser] = await to(user.save());
  if (err) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send("Error while deleting user: " + err);
  }
  if (!newUser) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send("Error: Bad request deleting user");
  }
  return res
    .status(HttpStatus.OK)
    .send(`User with id ${req.params.id} successfully deleted.`);
});

module.exports = router;
