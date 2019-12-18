const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

/**
 * @swagger
 *  components:
 *    schemas:
 *      Note:
 *        type: object
 *        required:
 *          - authors
 *        properties:
 *          _id:
 *            type: string
 *            description: The unique identifier.
 *          title:
 *            type: string
 *            description: The users mentioned in this note.
 *          authors:
 *            type: array
 *            items:
 *              type: string
 *            description: The authors who created and/or edited this note.
 *          taggedUsers:
 *            type: array
 *            items:
 *              type: string
 *            description: The users mentioned in this note.
 *          body:
 *            type: string
 *            description: The body of the note.
 *          minimized:
 *            type: boolean
 *            default: false
 *          private:
 *            type: boolean
 *            default: false
 *          deleted:
 *            type: boolean
 *            default: false
 *          createdAt:
 *            type: string
 *            format: date-time
 *            description: The datetime that the note was created.
 *            readOnly: true
 *          updatedAt:
 *            type: string
 *            format: date-time
 *            description: The datetime that the note was last updated.
 *            readOnly: true
 *        example:
 *          title: Hello World!
 *          authors: [5df9778c0f65fddc651e6167]
 *          taggedUsers: [5df97791556bc5bc928b32fb]
 *          body: This is my body.
 *          hidden: false
 */
const noteSchema = new Schema(
  {
    title: String,
    authors: [{ type: ObjectId, ref: "User", required: true }],
    taggedUsers: [{ type: ObjectId, ref: "User" }],
    body: { type: String, required: false },
    minimized: { type: Boolean, default: false },
    private: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
