/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Projects management
 */

const to = require("await-to-js").default;
const router = require("express").Router();
const _ = require("lodash");
const { HttpStatus } = require("../_constants/error.constants");
const User = require("../models/user.model");
const Project = require("../models/project.model");
const Role = require("../_utils/roles.util");
const authorize = require("../_utils/authorize.util");
const validateAddProjectInput = require("../validators/add.project.validator");
const validateUpdateProjectInput = require("../validators/update.project.validator");

/**
 * @swagger
 * path:
 *  /projects/:
 *    get:
 *      summary: Get projects
 *      tags: [Projects]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        "200":
 *          description: OK. Returns a list of projects
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Project'
 *        "204":
 *          description: NO_CONTENT. Returns an empty list
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Project'
 *        "401":
 *          $ref: '#/components/responses/UnauthorizedError'
 */
const getProjects = async (req, res) => {
  const [err, projects] = await to(Project.find());
  if (!_.isEmpty(err)) {
    return res.status(HttpStatus.BAD_REQUEST).send(err);
  }
  if (_.isEmpty(projects)) {
    return res.status(HttpStatus.NO_CONTENT).send();
  }
  return res.status(HttpStatus.OK).send({ projects });
};
router.route("/").get(authorize(Role.ADMIN), getProjects);

/**
 * @swagger
 * path:
 *  /projects/{id}:
 *    get:
 *      summary: Get a project by ID
 *      tags: [Projects]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: Object ID of the project to get
 *      responses:
 *        "200":
 *          description: OK. Returns a project
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Project'
 *        "404":
 *          description: NOT_FOUND. Project not found
 *        "401":
 *          $ref: '#/components/responses/UnauthorizedError'
 */
const getProject = async (req, res) => {
  const [err, project] = await to(Project.findById(req.params.id));
  if (!_.isEmpty(err)) {
    return res.status(HttpStatus.BAD_REQUEST).send(err);
  }
  if (_.isEmpty(project)) {
    return res
      .status(HttpStatus.NOT_FOUND)
      .send(`Project with id ${req.params.id} NOT_FOUND`);
  }
  const requestUserId = String(req.user._id);

  // Only admins can access other user projects
  if (!project.users.includes(requestUserId) && req.user.role !== Role.ADMIN) {
    return res.status(HttpStatus.UNAUTHORIZED).send("Request is UNAUTHORIZED");
  }
  return res.status(HttpStatus.OK).send({ project });
};
router.route("/:id").get(authorize([Role.ADMIN, Role.USER]), getProject);

/**
 * @swagger
 * path:
 *  /projects/user/{id}:
 *    get:
 *      summary: Get projects by user ID
 *      tags: [Projects]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: Object ID of user
 *      responses:
 *        "200":
 *          description: OK. Returns a list of project
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Project'
 *        "204":
 *          description: NO_CONTENT. Returns an empty list
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Project'
 *        "401":
 *          $ref: '#/components/responses/UnauthorizedError'
 */
const getProjectsByUser = async (req, res) => {
  // Only admins can get other users' projects
  if (req.params.id !== req.user._id && req.user.role !== Role.ADMIN) {
    return res.status(HttpStatus.UNAUTHORIZED).send("Request is UNAUTHORIZED");
  }
  // https://stackoverflow.com/questions/18148166/find-document-with-array-that-contains-a-specific-value
  const [err, projects] = await to(Project.find({ users: req.params.id }));
  if (!_.isEmpty(err)) {
    return res.status(HttpStatus.BAD_REQUEST).send(err);
  }
  if (_.isEmpty(projects)) {
    return res
      .status(HttpStatus.NO_CONTENT)
      .send(
        `User with id ${req.params.id} doesn't have any projects; NOT_FOUND`
      );
  }
  return res.status(HttpStatus.OK).send({ projects });
};
router
  .route("/user/:id")
  .get(authorize([Role.ADMIN, Role.USER]), getProjectsByUser);

/**
 * @swagger
 * path:
 *  /projects/add:
 *    post:
 *      summary: Create a new project
 *      tags: [Projects]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Project'
 *      responses:
 *        "201":
 *          description: CREATED. Returns a project
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Project'
 *        "401":
 *          $ref: '#/components/responses/UnauthorizedError'
 */
const createProject = async (req, res) => {
  // Validate form data
  const err1 = validateAddProjectInput(req.body);
  if (!_.isEmpty(err1)) {
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).send(err1);
  }
  // Add requesting user to authors and users arrays
  req.body.authors = req.body.authors || [];
  req.body.users = req.body.users || [];
  if (!req.body.authors.includes(req.user._id)) {
    req.body.authors = [...req.body.authors, req.user._id];
  }
  if (!req.body.users.includes(req.user._id)) {
    req.body.users = [...req.body.users, req.user._id];
  }

  // Check if all authors exist
  const checkAuthorPromises = req.body.authors.map(async authorId => {
    const [errAuthor, user] = await to(User.findById(authorId));
    if (!_.isEmpty(errAuthor)) {
      throw new Error(errAuthor);
    }
    if (_.isEmpty(user)) {
      throw new Error(`Author with id ${authorId} was NOT_FOUND`);
    }
    return user;
  });
  const [err2, authors] = await to(Promise.all(checkAuthorPromises));
  if (!_.isEmpty(err2)) {
    return res.status(HttpStatus.NOT_FOUND).send(err2);
  }
  if (_.isEmpty(authors)) {
    return res.status(HttpStatus.NOT_FOUND).send(`Authors were NOT_FOUND`);
  }

  // Check if all users exist
  const checkUsersPromises = req.body.users.map(async userId => {
    const [errUser, user] = await to(User.findById(userId));
    if (!_.isEmpty(errUser)) {
      throw new Error(errUser);
    }
    if (_.isEmpty(user)) {
      throw new Error(`User with id ${userId} was NOT_FOUND`);
    }
    return user;
  });
  const [err3, users] = await to(Promise.all(checkUsersPromises));
  if (!_.isEmpty(err3)) {
    return res.status(HttpStatus.NOT_FOUND).send(err3);
  }
  if (!_.isEmpty(req.body.users) && _.isEmpty(users)) {
    return res.status(HttpStatus.NOT_FOUND).send(`Users were NOT_FOUND`);
  }

  const project = new Project(
    _.pick(req.body, ["title", "authors", "users", "private"])
  );

  const [err4, newProject] = await to(project.save());
  if (!_.isEmpty(err4)) {
    return res.status(HttpStatus.BAD_REQUEST).send(err4);
  }
  if (_.isEmpty(newProject)) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send("Bad request creating new project");
  }
  return res.status(HttpStatus.CREATED).send({ project: newProject });
};
router.route("/add").post(authorize([Role.ADMIN, Role.USER]), createProject);

/**
 * @swagger
 * path:
 *  /projects/update/{id}:
 *    put:
 *      summary: Update a project by ID
 *      tags: [Projects]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: Object ID of the project to update
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Project'
 *      responses:
 *        "200":
 *          description: OK. Returns a project
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Project'
 *        "401":
 *          $ref: '#/components/responses/UnauthorizedError'
 */
const updateProject = async (req, res) => {
  // Validate form data
  req.body._id = req.params.id;
  const err1 = validateUpdateProjectInput(req.body);
  if (!_.isEmpty(err1)) {
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).send(err1);
  }

  // Check that project exists
  const [err2, project] = await to(Project.findById(req.params.id));
  if (!_.isEmpty(err2)) {
    return res.status(HttpStatus.BAD_REQUEST).send(err2);
  }
  if (_.isEmpty(project)) {
    return res
      .status(HttpStatus.NOT_FOUND)
      .send(`Project with id ${req.params.id} NOT_FOUND`);
  }

  const requestUserId = req.user._id;
  // Only admins can access other user projects
  if (!project.users.includes(requestUserId) && req.user.role !== Role.ADMIN) {
    return res.status(HttpStatus.UNAUTHORIZED).send("Request is UNAUTHORIZED");
  }

  // Check if all authors exist
  req.body.authors = _.isEmpty(req.body.authors) ? [] : req.body.authors;
  const checkAuthorPromises = req.body.authors.map(async authorId => {
    const [errAuthor, user] = await to(User.findById(authorId));
    if (!_.isEmpty(errAuthor)) {
      throw new Error(errAuthor);
    }
    if (_.isEmpty(user)) {
      throw new Error(`Author with id ${authorId} was NOT_FOUND`);
    }
    return user;
  });
  const [err3, authors] = await to(Promise.all(checkAuthorPromises));
  if (!_.isEmpty(err3)) {
    return res.status(HttpStatus.NOT_FOUND).send(err3);
  }
  if (!_.isEmpty(req.body.authors) && _.isEmpty(authors)) {
    return res.status(HttpStatus.NOT_FOUND).send(`Authors were NOT_FOUND`);
  }

  // Check if all users exist
  req.body.users = _.isEmpty(req.body.users) ? [] : req.body.users;
  const checkUsersPromises = req.body.users.map(async userId => {
    const [errUser, user] = await to(User.findById(userId));
    if (!_.isEmpty(errUser)) {
      throw new Error(errUser);
    }
    if (_.isEmpty(user)) {
      throw new Error(`User with id ${userId} was NOT_FOUND`);
    }
    return user;
  });
  const [err4, users] = await to(Promise.all(checkUsersPromises));
  if (!_.isEmpty(err4)) {
    return res.status(HttpStatus.NOT_FOUND).send(err4);
  }
  if (!_.isEmpty(req.body.users) && _.isEmpty(users)) {
    return res.status(HttpStatus.NOT_FOUND).send(`Users were NOT_FOUND`);
  }

  project.title = req.body.title || project.title;
  project.authors = req.body.users || project.users;
  project.private = _.isEmpty(req.body.private)
    ? project.private
    : req.body.private;

  const [err5, newProject] = await to(project.save());
  if (!_.isEmpty(err5)) {
    return res.status(HttpStatus.BAD_REQUEST).send(err5);
  }
  if (_.isEmpty(newProject)) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send("Bad request updating project");
  }
  return res.status(HttpStatus.OK).send({ project: newProject });
};
router
  .route("/update/:id")
  .put(authorize([Role.ADMIN, Role.USER]), updateProject);

/**
 * @swagger
 * path:
 *  /projects/{id}:
 *    delete:
 *      summary: Delete a project by ID
 *      tags: [Projects]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: Object ID of the project to delete
 *      responses:
 *        "200":
 *          description: OK. Project soft deleted.
 *          schema:
 *            type: string
 *        "404":
 *          description: NOT_FOUND. Project not found
 *        "401":
 *          $ref: '#/components/responses/UnauthorizedError'
 */
const deleteProject = async (req, res) => {
  const [err1, project] = await to(Project.findById(req.params.id));
  if (!_.isEmpty(err1)) {
    return res.status(HttpStatus.BAD_REQUEST).send(err1);
  }
  if (_.isEmpty(project)) {
    return res
      .status(HttpStatus.NOT_FOUND)
      .send(`Project with id ${req.params.id} NOT_FOUND`);
  }

  const requestUserId = String(req.user._id);
  // Only admins can access other user projects
  if (!project.users.includes(requestUserId) && req.user.role !== Role.ADMIN) {
    return res.status(HttpStatus.UNAUTHORIZED).send("Request is UNAUTHORIZED");
  }

  if (project.deleted) {
    return res.status(HttpStatus.OK).send("Project has already been deleted");
  }

  project.deleted = true;

  const [err2, newProject] = await to(project.save());
  if (!_.isEmpty(err2)) {
    return res.status(HttpStatus.BAD_REQUEST).send(err2);
  }
  if (_.isEmpty(newProject)) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send("Bad request deleting project");
  }
  return res
    .status(HttpStatus.OK)
    .send(`Project with id ${req.params.id} successfully deleted.`);
};
router.route("/:id").delete(authorize([Role.ADMIN, Role.USER]), deleteProject);

module.exports = router;
