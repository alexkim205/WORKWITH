/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Projects management
 */

const to = require("await-to-js").default;
const router = require("express").Router();
const HttpStatus = require("../_constants/error.constants").HttpStatus;
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
  let err, projects;

  [err, projects] = await to(Project.find());
  if (err) {
    return res.status(HttpStatus.BAD_REQUEST).send("Error: " + err);
  }
  if (!projects) {
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
  let err, project;

  [err, project] = await to(Project.findById(req.params.id));
  if (err) {
    return res.status(HttpStatus.BAD_REQUEST).send("Error: " + err);
  }
  if (!project) {
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
  let err, projects;

  // https://stackoverflow.com/questions/18148166/find-document-with-array-that-contains-a-specific-value
  [err, projects] = await to(Project.find({ users: req.params.id }));
  if (err) {
    return res.status(HttpStatus.BAD_REQUEST).send("Error: " + err);
  }
  if (!projects) {
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
  let err, project, newProject;

  project = new Project({
    title: req.body.title,
    users: req.body.users,
    private: req.body.private
  });

  [err, newProject] = await to(project.save());
  if (err) {
    return res.status(HttpStatus.BAD_REQUEST).send("Error: " + err);
  }
  if (!newProject) {
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
 *    post:
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
router.route("/update/:id").post(async (req, res) => {
  let err, project, newProject;

  [err, project] = await to(Project.findById(req.params.id));
  if (err) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send("Error while finding project: " + err);
  }
  if (!project) {
    return res
      .status(HttpStatus.NOT_FOUND)
      .send(`Error: Project with id ${req.params.id} NOT_FOUND`);
  }

  project.title = req.body.title || project.title;
  project.authors = req.body.users || project.users;
  project.private = req.body.private || project.private;

  [err, newProject] = await to(project.save());
  if (err) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send("Error while updating project: " + err);
  }
  if (!newProject) {
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
  let err, project, newProject;

  [err, project] = await to(Project.findById(req.params.id));
  if (err) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send("Error while finding project: " + err);
  }
  if (!project) {
    return res
      .status(HttpStatus.NOT_FOUND)
      .send(`Error: Project with id ${req.params.id} NOT_FOUND`);
  }

  if (project.deleted) {
    return res.status(HttpStatus.OK).send("Project has already been deleted");
  }

  project.deleted = true;

  [err, newProject] = await to(project.save());
  if (err) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send("Error while deleting project: " + err);
  }
  if (!newProject) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send("Error: Bad request deleting project");
  }
  return res
    .status(HttpStatus.OK)
    .send(`Project with id ${req.params.id} successfully deleted.`);
});

module.exports = router;
