/**
 * @swagger
 * tags:
 *   name: Notes
 *   description: Notes management
 */

const to = require("await-to-js").default;
const router = require("express").Router();
const _ = require("lodash");
const { HttpStatus } = require("../_constants/error.constants");
const User = require("../models/user.model");
const Project = require("../models/project.model");
const Note = require("../models/note.model");
const Role = require("../_utils/roles.util");
const authorize = require("../_utils/authorize.util");
const validateAddNoteInput = require("../validators/add.note.validator");
const validateUpdateNoteInput = require("../validators/update.note.validator");

/**
 * @swagger
 * path:
 *  /notes/:
 *    get:
 *      summary: Get notes
 *      tags: [Notes]
 *      security:
 *        - bearerAuth: []
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
 *        "401":
 *          $ref: '#/components/responses/UnauthorizedError'
 */
const getNotes = async (req, res) => {
  const [err, notes] = await to(Note.find());
  if (!_.isEmpty(err)) {
    return res.status(HttpStatus.BAD_REQUEST).send(err);
  }
  if (_.isEmpty(notes)) {
    return res.status(HttpStatus.NO_CONTENT).send();
  }
  return res.status(HttpStatus.OK).send({ notes });
};
router.route("/").get(authorize(Role.ADMIN), getNotes);

/**
 * @swagger
 * path:
 *  /notes/{id}:
 *    get:
 *      summary: Get a note by ID
 *      tags: [Notes]
 *      security:
 *        - bearerAuth: []
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
 *        "401":
 *          $ref: '#/components/responses/UnauthorizedError'
 */
const getNote = async (req, res) => {
  const [err, note] = await to(Note.findById(req.params.id));
  if (!_.isEmpty(err)) {
    return res.status(HttpStatus.BAD_REQUEST).send(err);
  }
  if (_.isEmpty(note)) {
    return res
      .status(HttpStatus.NOT_FOUND)
      .send(`Note with id ${req.params.id} NOT_FOUND`);
  }
  return res.status(HttpStatus.OK).send({ note });
};
router.route("/:id").get(authorize(), getNote);

/**
 * @swagger
 * path:
 *  /notes/project/{id}:
 *    get:
 *      summary: Get notes by project ID
 *      tags: [Notes]
 *      security:
 *        - bearerAuth: []
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
 *        "401":
 *          $ref: '#/components/responses/UnauthorizedError'
 */
const getNotesByProject = async (req, res) => {
  const [err, notes] = await to(Note.find({ projectId: req.params.id }));
  if (err) {
    return res.status(HttpStatus.BAD_REQUEST).send(err);
  }
  if (!notes) {
    return res
      .status(HttpStatus.NOT_FOUND)
      .send(
        `There are no notes in the project with id ${req.params.id}; NOT_FOUND`
      );
  }
  return res.status(HttpStatus.OK).send({ notes });
};
router.route("/project/:id").get(authorize(), getNotesByProject);

/**
 * @swagger
 * path:
 *  /notes/add:
 *    post:
 *      summary: Create a new note
 *      tags: [Notes]
 *      security:
 *        - bearerAuth: []
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
 *        "401":
 *          $ref: '#/components/responses/UnauthorizedError'
 */
const createNote = async (req, res) => {
  // Validate form data
  const err1 = validateAddNoteInput(req.body);
  if (!_.isEmpty(err1)) {
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).send(err1);
  }

  // Add requesting user to authors and taggedUsers arrays
  req.body.authors = req.body.authors || [];
  req.body.taggedUsers = req.body.taggedUsers || [];
  if (!req.body.authors.includes(req.user._id)) {
    req.body.authors = [...req.body.authors, req.user._id];
  }
  if (!req.body.taggedUsers.includes(req.user._id)) {
    req.body.taggedUsers = [...req.body.taggedUsers, req.user._id];
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

  // Check if all tagged users exist
  const checkTaggedUserPromises = req.body.taggedUsers.map(
    async taggedUserId => {
      const [errTaggedUser, user] = await to(User.findById(taggedUserId));
      if (!_.isEmpty(errTaggedUser)) {
        throw new Error(errTaggedUser);
      }
      if (_.isEmpty(user)) {
        throw new Error(`Tagged user with id ${taggedUserId} was NOT_FOUND`);
      }
      return user;
    }
  );
  const [err3, taggedUsers] = await to(Promise.all(checkTaggedUserPromises));
  if (!_.isEmpty(err3)) {
    return res.status(HttpStatus.NOT_FOUND).send(err3);
  }
  if (!_.isEmpty(req.body.taggedUsers) && _.isEmpty(taggedUsers)) {
    return res.status(HttpStatus.NOT_FOUND).send(`Tagged users were NOT_FOUND`);
  }

  // Check if project exists
  const [err4, project] = await to(Project.findById(req.body.projectId));
  if (!_.isEmpty(err4)) {
    return res.status(HttpStatus.BAD_REQUEST).send(err4);
  }
  if (_.isEmpty(project)) {
    return res
      .status(HttpStatus.NOT_FOUND)
      .send(`Project with id ${req.body.projectId} was NOT_FOUND`);
  }

  const note = new Note(
    _.pick(req.body, [
      "projectId",
      "title",
      "authors",
      "taggedUsers",
      "body",
      "minimized",
      "private"
    ])
  );

  const [err5, newNote] = await to(note.save());
  if (!_.isEmpty(err5)) {
    return res.status(HttpStatus.BAD_REQUEST).send(err5);
  }
  if (_.isEmpty(newNote)) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .send("Bad request creating new note");
  }
  return res.status(HttpStatus.CREATED).send({ note: newNote });
};
router.route("/add").post(authorize([Role.ADMIN, Role.USER]), createNote);

/**
 * @swagger
 * path:
 *  /notes/update/{id}:
 *    put:
 *      summary: Update a note by ID
 *      tags: [Notes]
 *      security:
 *        - bearerAuth: []
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
 *        "401":
 *          $ref: '#/components/responses/UnauthorizedError'
 */
const updateNote = async (req, res) => {
  // Validate form data
  req.body._id = req.params.id;
  const err1 = validateUpdateNoteInput(req.body);
  if (!_.isEmpty(err1)) {
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).send(err1);
  }

  // Check that note exists
  const [err2, note] = await to(Note.findById(req.params.id));
  if (!_.isEmpty(err2)) {
    return res.status(HttpStatus.BAD_REQUEST).send(err2);
  }
  if (_.isEmpty(note)) {
    return res
      .status(HttpStatus.NOT_FOUND)
      .send(`Note with id ${req.params.id} NOT_FOUND`);
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

  // Check if all tagged users exist
  req.body.taggedUsers = _.isEmpty(req.body.taggedUsers)
    ? []
    : req.body.taggedUsers;
  const checkTaggedUserPromises = req.body.taggedUsers.map(
    async taggedUserId => {
      const [errTaggedUser, user] = await to(User.findById(taggedUserId));
      if (!_.isEmpty(errTaggedUser)) {
        throw new Error(errTaggedUser);
      }
      if (_.isEmpty(user)) {
        throw new Error(`Tagged user with id ${taggedUserId} was NOT_FOUND`);
      }
      return user;
    }
  );
  const [err4, taggedUsers] = await to(Promise.all(checkTaggedUserPromises));
  if (!_.isEmpty(err4)) {
    return res.status(HttpStatus.NOT_FOUND).send(err4);
  }
  if (!_.isEmpty(req.body.taggedUsers) && _.isEmpty(taggedUsers)) {
    return res.status(HttpStatus.NOT_FOUND).send(`Tagged users were NOT_FOUND`);
  }

  // Check if project exists
  if (!_.isEmpty(req.body.projectId)) {
    const [err5, project] = await to(Project.findById(req.body.projectId));
    if (!_.isEmpty(err5)) {
      return res.status(HttpStatus.BAD_REQUEST).send(err5);
    }
    if (_.isEmpty(project)) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .send(`Project with id ${req.body.projectId} was NOT_FOUND`);
    }
  }

  note.projectId = req.body.projectId || note.projectId; // should this even be allowed?
  note.title = req.body.title || note.title;
  note.authors = req.body.authors || note.authors;
  note.taggedUsers = req.body.taggedUsers || note.taggedUsers;
  note.body = req.body.body || note.body;
  note.minimized = _.isEmpty(req.body.minimized)
    ? note.minimized
    : req.body.minimized;
  note.private = _.isEmpty(req.body.private) ? note.private : req.body.private;

  const [err6, newNote] = await to(note.save());
  if (!_.isEmpty(err6)) {
    return res.status(HttpStatus.BAD_REQUEST).send(err6);
  }
  if (_.isEmpty(newNote)) {
    return res.status(HttpStatus.BAD_REQUEST).send("Bad request updating note");
  }
  return res.status(HttpStatus.OK).send({ note: newNote });
};
router.route("/update/:id").put(authorize([Role.ADMIN, Role.USER]), updateNote);

/**
 * @swagger
 * path:
 *  /notes/{id}:
 *    delete:
 *      summary: Delete a note by ID
 *      tags: [Notes]
 *      security:
 *        - bearerAuth: []
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
 *        "401":
 *          $ref: '#/components/responses/UnauthorizedError'
 */
const deleteNote = async (req, res) => {
  const [err1, note] = await to(Note.findById(req.params.id));
  if (!_.isEmpty(err1)) {
    return res.status(HttpStatus.BAD_REQUEST).send(err1);
  }
  if (_.isEmpty(note)) {
    return res
      .status(HttpStatus.NOT_FOUND)
      .send(`Note with id ${req.params.id} NOT_FOUND`);
  }

  if (note.deleted) {
    return res.status(HttpStatus.OK).send("Note has already been deleted");
  }

  note.deleted = true;

  const [err2, newNote] = await to(note.save());
  if (!_.isEmpty(err2)) {
    return res.status(HttpStatus.BAD_REQUEST).send(err2);
  }
  if (_.isEmpty(newNote)) {
    return res.status(HttpStatus.BAD_REQUEST).send("Bad request deleting note");
  }
  return res
    .status(HttpStatus.OK)
    .send(`Note with id ${req.params.id} successfully deleted.`);
};
router.route("/:id").delete(authorize([Role.ADMIN, Role.USER]), deleteNote);

module.exports = router;
