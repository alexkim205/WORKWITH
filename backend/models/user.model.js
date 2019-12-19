const mongoose = require("mongoose");

const Schema = mongoose.Schema;
/**
 * @swagger
 *  components:
 *    schemas:
 *      User:
 *        type: object
 *        required:
 *          - name
 *          - username
 *          - email
 *        properties:
 *          _id:
 *            type: string
 *            description: The unique identifier.
 *            readOnly: true
 *          name:
 *            type: string
 *          username:
 *            type: string
 *            description: The user's username. It must be unique.
 *          email:
 *            type: string
 *            format: email
 *            description: The user's email address.
 *          deleted:
 *            type: boolean
 *            default: false
 *          createdAt:
 *            type: string
 *            format: date-time
 *            description: The datetime that the user was created.
 *            readOnly: true
 *          updatedAt:
 *            type: string
 *            format: date-time
 *            description: The datetime that the user was last updated.
 *            readOnly: true
 *        example:
 *          name: Alex Kim
 *          username: alexkim
 *          email: alexkim@dev.com
 */
const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    username: {
      type: String,
      required: [true, "Username required"],
      unique: true,
      trim: true,
      minlength: 3
    },
    email: {
      type: String,
      validate: {
        validator: function(v) {
          return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
        },
        message: props => `${props.value} is not a valid email address!`
      },
      required: [true, "Email address required"]
    },
    deleted: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
