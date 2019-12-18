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
 *          name:
 *            type: string
 *          username:
 *            type: string
 *            description: The user's username. It must be unique.
 *          email:
 *            type: string
 *            format: email
 *            description: The user's email address.
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
 *          _id: 5df96a498bb8f9495cac1855
 *          name: Alex Kim
 *          username: alexkim
 *          email: alexkim@dev.com
 *          createdAt: 2019-12-17T23:52:41.066Z
 *          updatedAt: 2019-12-17T23:52:41.066Z
 */
const userSchema = new Schema(
  {
    name: {type: String, required: true, trim: true},
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
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
