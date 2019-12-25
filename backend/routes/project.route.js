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
const Project = require("../models/project.model");

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
    return res.status(HttpStatus.BAD_REQUEST).send(`Error: ${err}`);
  }
  if (isEmpty(projects)) {
    return res.status(HttpStatus.NO_CONTENT).send({ projects });
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
    return res.status(HttpStatus.BAD_REQUEST).send(`Error: ${err}`);
  }
  if (isEmpty(project)) {
    return res
      .status(HttpStatus.NOT_FOUND)
      .send(`Error: Project with id ${req.params.id} NOT_FOUND`);
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
    return res.status(HttpStatus.BAD_REQUEST).send(`Error: ${err}`);
  }
  if (isEmpty(projects)) {
    return res
      .status(HttpStatus.NO_CONTENT)
      .send(
        `Error: User with id ${req.params.id} doesn't have any projects; NOT_FOUND`
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
  const project = new Project({
    title: req.body.title,
    users: req.body.users,
    private: req.body.private
  });

  const [err, newProject] = await to(project.save());
  if (!isEmpty(err)) {
    return res.status(HttpStatus.BAD_REQUEST).send(`Error: ${err}`);
  }
  if (isEmpty(newProject)) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send("Error: Bad request creating new project");
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
  const [err1, project] = await to(Project.findById(req.params.id));
  if (!isEmpty(err1)) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send(`Error while finding project: ${err1}`);
  }
  if (isEmpty(project)) {
    return res
      .status(HttpStatus.NOT_FOUND)
      .send(`Error: Project with id ${req.params.id} NOT_FOUND`);
  }

  project.title = req.body.title || project.title;
  project.authors = req.body.users || project.users;
  project.private = isEmpty(req.body.private)
    ? project.private
    : req.body.private;

  const [err2, newProject] = await to(project.save());
  if (!isEmpty(err2)) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send(`Error while updating project: ${err2}`);
  }
  if (isEmpty(newProject)) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send("Error: Bad request updating project");
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
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send(`Error while finding project: ${err1}`);
  }
  if (isEmpty(project)) {
    return res
      .status(HttpStatus.NOT_FOUND)
      .send(`Error: Project with id ${req.params.id} NOT_FOUND`);
  }

  if (project.deleted) {
    return res.status(HttpStatus.OK).send("Project has already been deleted");
  }

  project.deleted = true;

  const [err2, newProject] = await to(project.save());
  if (!isEmpty(err2)) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send(`Error while deleting project: ${err2}`);
  }
  if (isEmpty(newProject)) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send("Error: Bad request deleting project");
  }
  return res
    .status(HttpStatus.OK)
    .send(`Project with id ${req.params.id} successfully deleted.`);
});

module.exports = router;
