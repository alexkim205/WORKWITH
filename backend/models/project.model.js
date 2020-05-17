const mongoose = require("mongoose");

const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema.Types;

/**
 * @swagger
 *  components:
 *    schemas:
 *      Project:
 *        type: object
 *        required:
 *          - title
 *          - authors
 *        properties:
 *          _id:
 *            type: string
 *            description: The unique identifier.
 *            readOnly: true
 *          title:
 *            type: string
 *            description: The title of the project.
 *          authors:
 *            type: array
 *            items:
 *              type: string
 *            description: The authors for the project.
 *          users:
 *            type: array
 *            items:
 *              type: string
 *            description: The users allowed to access the project.
 *          private:
 *            type: boolean
 *            default: false
 *          deleted:
 *            type: boolean
 *            default: false
 *          createdAt:
 *            type: string
 *            format: date-time
 *            description: The datetime that the project was created.
 *            readOnly: true
 *          updatedAt:
 *            type: string
 *            format: date-time
 *            description: The datetime that the project was last updated.
 *            readOnly: true
 *        example:
 *          title: My Project
 *          users: [5df9778c0f65fddc651e6167, 5df97791556bc5bc928b32fb]
 *          private: true
 */

const projectSchema = new Schema(
  {
    title: String,
    authors: [{ type: ObjectId, ref: "User", required: true }],
    users: [{ type: ObjectId, ref: "User" }],
    private: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
