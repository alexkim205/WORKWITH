/**
 * @swagger
 * tags:
 *   name: Notes
 *   description: Notes management
 */

const to = require("await-to-js").default;
const router = require("express").Router();
const isEmpty = require("is-empty");
const { HttpStatus } = require("../_constants/error.constants");
const User = require("../models/user.model");
const Project = require("../models/project.model");
const Note = require("../models/note.model");
const validateAddNoteInput = require("../validators/add.note.validator");
// const validateUpdateNoteInput = require("../validators/update.note.validator");

/**
 * @swagger
 * path:
 *  /notes/:
 *    get:
 *      summary: Get notes
 *      tags: [Notes]
 *      responses:
 *        "200":
 *          description: OK. Returns a list of notes
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Note'
 *        "204":
 *          description: NO_CONTENT. Returns an empty list
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Note'
 */
router.route("/").get(async (req, res) => {
  const [err, notes] = await to(Note.find());
  if (!isEmpty(err)) {
    return res.status(HttpStatus.BAD_REQUEST).send(`Error: ${err}`);
  }
  if (isEmpty(notes)) {
    return res.status(HttpStatus.NO_CONTENT).send();
  }
  return res.status(HttpStatus.OK).send({ notes });
});

/**
 * @swagger
 * path:
 *  /notes/{id}:
 *    get:
 *      summary: Get a note by ID
 *      tags: [Notes]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: Object ID of the note to get
 *      responses:
 *        "200":
 *          description: OK. Returns a note
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Note'
 *        "404":
 *          description: NOT_FOUND. Note not found
 */
router.route("/:id").get(async (req, res) => {
  const [err, note] = await to(Note.findById(req.params.id));
  if (!isEmpty(err)) {
    return res.status(HttpStatus.BAD_REQUEST).send(`Error: ${err}`);
  }
  if (isEmpty(note)) {
    return res
      .status(HttpStatus.NOT_FOUND)
      .send(`Error: Note with id ${req.params.id} NOT_FOUND`);
  }
  return res.status(HttpStatus.OK).send({ note });
});

/**
 * @swagger
 * path:
 *  /notes/project/{id}:
 *    get:
 *      summary: Get notes by project ID
 *      tags: [Notes]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: Object ID of project
 *      responses:
 *        "200":
 *          description: OK. Returns a list of notes
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Note'
 *        "204":
 *          description: NO_CONTENT. Returns an empty list
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Note'
 */
router.route("/project/:id").get(async (req, res) => {
  const [err, notes] = await to(Note.find({ projectId: req.params.id }));
  if (err) {
    return res.status(HttpStatus.BAD_REQUEST).send(`Error: ${err}`);
  }
  if (!notes) {
    return res
      .status(HttpStatus.NOT_FOUND)
      .send(
        `Error: There are no notes in the project with id ${req.params.id}; NOT_FOUND`
      );
  }
  return res.status(HttpStatus.OK).send({ notes });
});

/**
 * @swagger
 * path:
 *  /notes/add:
 *    post:
 *      summary: Create a new note
 *      tags: [Notes]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Note'
 *      responses:
 *        "201":
 *          description: CREATED. Returns a note schema
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Note'
 *        "404":
 *          description: NOT_FOUND. Either authors or project with projectId doesn't exist
 */
router.route("/add").post(async (req, res) => {
  // Validate form data
  const err1 = validateAddNoteInput(req.body);
  if (!isEmpty(err1)) {
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).send(`Error: ${err1}`);
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
    return res.status(HttpStatus.NOT_FOUND).send(`Error: ${err2}`);
  }
  if (isEmpty(authors)) {
    return res
      .status(HttpStatus.NOT_FOUND)
      .send(`Error: Authors were NOT_FOUND`);
  }

  // Check if project exists
  const [err3, project] = await to(Project.findById(req.body.projectId));
  if (!isEmpty(err3)) {
    return res.status(HttpStatus.BAD_REQUEST).send(`Error: ${err3}`);
  }
  if (isEmpty(project)) {
    return res
      .status(HttpStatus.NOT_FOUND)
      .send(`Error: Project with id ${req.body.projectId} was NOT_FOUND`);
  }

  const note = new Note({
    projectId: req.body.projectId,
    title: req.body.title,
    authors: req.body.authors,
    taggedUsers: req.body.taggedUsers,
    body: req.body.body,
    minimized: req.body.minimized,
    private: req.body.private
  });

  const [err4, newNote] = await to(note.save());
  if (!isEmpty(err4)) {
    return res.status(HttpStatus.BAD_REQUEST).send(`Error: ${err4}`);
  }
  if (isEmpty(newNote)) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send("Error: Bad request creating new note");
  }
  return res.status(HttpStatus.CREATED).send({ note: newNote });
});

/**
 * @swagger
 * path:
 *  /notes/update/{id}:
 *    put:
 *      summary: Update a note by ID
 *      tags: [Notes]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: Object ID of the note to update
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Note'
 *      responses:
 *        "200":
 *          description: OK. Returns a note
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Note'
 */
router.route("/update/:id").put(async (req, res) => {
  const [err1, note] = await to(Note.findById(req.params.id));
  if (isEmpty(err1)) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send(`Error while finding note: ${err1}`);
  }
  if (isEmpty(note)) {
    return res
      .status(HttpStatus.NOT_FOUND)
      .send(`Error: Note with id ${req.params.id} NOT_FOUND`);
  }

  note.projectId = req.body.projectId || note.projectId; // should this even be allowed?
  note.title = req.body.title || note.title;
  note.authors = req.body.authors || note.authors;
  note.taggedUsers = req.body.taggedUsers || note.taggedUsers;
  note.body = req.body.body || note.body;
  note.minimized = isEmpty(req.body.minimized)
    ? note.minimized
    : req.body.minimized;
  note.private = isEmpty(req.body.private) ? note.private : req.body.private;

  const [err2, newNote] = await to(note.save());
  if (!isEmpty(err2)) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send(`Error while updating note: ${err2}`);
  }
  if (isEmpty(newNote)) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send("Error: Bad request updating note");
  }
  return res.status(HttpStatus.OK).send({ note: newNote });
});

/**
 * @swagger
 * path:
 *  /notes/{id}:
 *    delete:
 *      summary: Delete a note by ID
 *      tags: [Notes]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: Object ID of the note to delete
 *      responses:
 *        "200":
 *          description: OK. Note soft deleted.
 *          schema:
 *            type: string
 *        "404":
 *          description: NOT_FOUND. Note not found
 */
router.route("/:id").delete(async (req, res) => {
  const [err1, note] = await to(Note.findById(req.params.id));
  if (!isEmpty(err1)) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send(`Error while finding note: ${err1}`);
  }
  if (isEmpty(note)) {
    return res
      .status(HttpStatus.NOT_FOUND)
      .send(`Error: Note with id ${req.params.id} NOT_FOUND`);
  }

  if (note.deleted) {
    return res.status(HttpStatus.OK).send("Note has already been deleted");
  }

  note.deleted = true;

  const [err2, newNote] = await to(note.save());
  if (!isEmpty(err2)) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send(`Error while deleting note: ${err2}`);
  }
  if (isEmpty(newNote)) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send("Error: Bad request deleting note");
  }
  return res
    .status(HttpStatus.OK)
    .send(`Note with id ${req.params.id} successfully deleted.`);
});

module.exports = router;
