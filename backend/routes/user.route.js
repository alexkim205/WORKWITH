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

module.exports = router;
