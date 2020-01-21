/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Projects management
 */

const to = require("await-to-js").default;
const router = require("express").Router();
const isEmpty = require("is-empty");
const { HttpStatus } = require("../_constants/error.constants");
const User = require("../models/user.model");
const Project = require("../models/project.model");
const validateAddProjectInput = require("../validators/add.project.validator");
const validateUpdateProjectInput = require("../validators/update.project.validator");

/**
 * @swagger
 * path:
 *  /projects/:
 *    get:
 *      summary: Get projects
 *      tags: [Projects]
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
 */
router.route("/").get(async (req, res) => {
  const [err, projects] = await to(Project.find());
  if (!isEmpty(err)) {
    return res.status(HttpStatus.BAD_REQUEST).send(err);
  }
  if (isEmpty(projects)) {
    return res.status(HttpStatus.NO_CONTENT).send();
  }
  return res.status(HttpStatus.OK).send({ projects });
});

/**
 * @swagger
 * path:
 *  /projects/{id}:
 *    get:
 *      summary: Get a project by ID
 *      tags: [Projects]
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
 */
router.route("/:id").get(async (req, res) => {
  const [err, project] = await to(Project.findById(req.params.id));
  if (!isEmpty(err)) {
    return res.status(HttpStatus.BAD_REQUEST).send(err);
  }
  if (isEmpty(project)) {
    return res
      .status(HttpStatus.NOT_FOUND)
      .send(`Project with id ${req.params.id} NOT_FOUND`);
  }
  return res.status(HttpStatus.OK).send({ project });
});

/**
 * @swagger
 * path:
 *  /projects/user/{id}:
 *    get:
 *      summary: Get projects by user ID
 *      tags: [Projects]
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
 */
router.route("/user/:id").get(async (req, res) => {
  // https://stackoverflow.com/questions/18148166/find-document-with-array-that-contains-a-specific-value
  const [err, projects] = await to(Project.find({ users: req.params.id }));
  if (!isEmpty(err)) {
    return res.status(HttpStatus.BAD_REQUEST).send(err);
  }
  if (isEmpty(projects)) {
    return res
      .status(HttpStatus.NO_CONTENT)
      .send(
        `User with id ${req.params.id} doesn't have any projects; NOT_FOUND`
      );
  }
  return res.status(HttpStatus.OK).send({ projects });
});

/**
 * @swagger
 * path:
 *  /projects/add:
 *    post:
 *      summary: Create a new project
 *      tags: [Projects]
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
 */
router.route("/add").post(async (req, res) => {
  // Validate form data
  const err1 = validateAddProjectInput(req.body);
  if (!isEmpty(err1)) {
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).send(err1);
  }

  // Check if all authors exist
  const checkAuthorPromises = req.body.authors.map(async authorId => {
    const [errAuthor, user] = await to(User.findById(authorId));
    if (!isEmpty(errAuthor)) {
      throw new Error(errAuthor);
    }
    if (isEmpty(user)) {
      throw new Error(`Author with id ${authorId} was NOT_FOUND`);
    }
    return user;
  });
  const [err2, authors] = await to(Promise.all(checkAuthorPromises));
  if (!isEmpty(err2)) {
    return res.status(HttpStatus.NOT_FOUND).send(err2);
  }
  if (isEmpty(authors)) {
    return res.status(HttpStatus.NOT_FOUND).send(`Authors were NOT_FOUND`);
  }

  // Check if all users exist
  req.body.users = isEmpty(req.body.users) ? [] : req.body.users;
  const checkUsersPromises = req.body.users.map(async userId => {
    const [errUser, user] = await to(User.findById(userId));
    if (!isEmpty(errUser)) {
      throw new Error(errUser);
    }
    if (isEmpty(user)) {
      throw new Error(`User with id ${userId} was NOT_FOUND`);
    }
    return user;
  });
  const [err3, users] = await to(Promise.all(checkUsersPromises));
  if (!isEmpty(err3)) {
    return res.status(HttpStatus.NOT_FOUND).send(err3);
  }
  if (!isEmpty(req.body.users) && isEmpty(users)) {
    return res.status(HttpStatus.NOT_FOUND).send(`Users were NOT_FOUND`);
  }

  const project = new Project({
    title: req.body.title,
    authors: req.body.authors,
    users: req.body.users,
    private: req.body.private
  });

  const [err4, newProject] = await to(project.save());
  if (!isEmpty(err4)) {
    return res.status(HttpStatus.BAD_REQUEST).send(err4);
  }
  if (isEmpty(newProject)) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send("Bad request creating new project");
  }
  return res.status(HttpStatus.CREATED).send({ project: newProject });
});

/**
 * @swagger
 * path:
 *  /projects/update/{id}:
 *    put:
 *      summary: Update a project by ID
 *      tags: [Projects]
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
 */
router.route("/update/:id").put(async (req, res) => {
  // Validate form data
  req.body._id = req.params.id;
  const err1 = validateUpdateProjectInput(req.body);
  if (!isEmpty(err1)) {
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).send(err1);
  }

  // Check that project exists
  const [err2, project] = await to(Project.findById(req.params.id));
  if (!isEmpty(err2)) {
    return res.status(HttpStatus.BAD_REQUEST).send(err2);
  }
  if (isEmpty(project)) {
    return res
      .status(HttpStatus.NOT_FOUND)
      .send(`Project with id ${req.params.id} NOT_FOUND`);
  }

  // Check if all authors exist
  req.body.authors = isEmpty(req.body.authors) ? [] : req.body.authors;
  const checkAuthorPromises = req.body.authors.map(async authorId => {
    const [errAuthor, user] = await to(User.findById(authorId));
    if (!isEmpty(errAuthor)) {
      throw new Error(errAuthor);
    }
    if (isEmpty(user)) {
      throw new Error(`Author with id ${authorId} was NOT_FOUND`);
    }
    return user;
  });
  const [err3, authors] = await to(Promise.all(checkAuthorPromises));
  if (!isEmpty(err3)) {
    return res.status(HttpStatus.NOT_FOUND).send(err3);
  }
  if (!isEmpty(req.body.authors) && isEmpty(authors)) {
    return res.status(HttpStatus.NOT_FOUND).send(`Authors were NOT_FOUND`);
  }

  // Check if all users exist
  req.body.users = isEmpty(req.body.users) ? [] : req.body.users;
  const checkUsersPromises = req.body.users.map(async userId => {
    const [errUser, user] = await to(User.findById(userId));
    if (!isEmpty(errUser)) {
      throw new Error(errUser);
    }
    if (isEmpty(user)) {
      throw new Error(`User with id ${userId} was NOT_FOUND`);
    }
    return user;
  });
  const [err4, users] = await to(Promise.all(checkUsersPromises));
  if (!isEmpty(err4)) {
    return res.status(HttpStatus.NOT_FOUND).send(err4);
  }
  if (!isEmpty(req.body.users) && isEmpty(users)) {
    return res.status(HttpStatus.NOT_FOUND).send(`Users were NOT_FOUND`);
  }

  project.title = req.body.title || project.title;
  project.authors = req.body.users || project.users;
  project.private = isEmpty(req.body.private)
    ? project.private
    : req.body.private;

  const [err5, newProject] = await to(project.save());
  if (!isEmpty(err5)) {
    return res.status(HttpStatus.BAD_REQUEST).send(err5);
  }
  if (isEmpty(newProject)) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send("Bad request updating project");
  }
  return res.status(HttpStatus.OK).send({ project: newProject });
});

/**
 * @swagger
 * path:
 *  /projects/{id}:
 *    delete:
 *      summary: Delete a project by ID
 *      tags: [Projects]
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
 */
router.route("/:id").delete(async (req, res) => {
  const [err1, project] = await to(Project.findById(req.params.id));
  if (!isEmpty(err1)) {
    return res.status(HttpStatus.BAD_REQUEST).send(err1);
  }
  if (isEmpty(project)) {
    return res
      .status(HttpStatus.NOT_FOUND)
      .send(`Project with id ${req.params.id} NOT_FOUND`);
  }

  if (project.deleted) {
    return res.status(HttpStatus.OK).send("Project has already been deleted");
  }

  project.deleted = true;

  const [err2, newProject] = await to(project.save());
  if (!isEmpty(err2)) {
    return res.status(HttpStatus.BAD_REQUEST).send(err2);
  }
  if (isEmpty(newProject)) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send("Bad request deleting project");
  }
  return res
    .status(HttpStatus.OK)
    .send(`Project with id ${req.params.id} successfully deleted.`);
});

module.exports = router;
