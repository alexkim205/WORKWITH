const mongoose = require("mongoose");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const { Schema } = mongoose;

/**
 * @swagger
 *  components:
 *    schemas:
 *      User:
 *        type: object
 *        required:
 *          - name
 *          - email
 *          - hash
 *          - salt
 *        properties:
 *          _id:
 *            type: string
 *            description: The unique identifier.
 *            readOnly: true
 *          name:
 *            type: string
 *          screenName:
 *            type: string
 *            description: The user's screen name.
 *          email:
 *            type: string
 *            format: email
 *            description: The user's email address. It must be unique.
 *          deleted:
 *            type: boolean
 *            default: false
 *          hash:
 *            type: string
 *            description: The hash of user's password.
 *            readOnly: true
 *          salt:
 *            type: string
 *            description: The salt of user's password.
 *            readOnly: true
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
 *          _id: 5dfb32da9856601e60ea80a4
 *          name: Alex Kim
 *          username: alexkim
 *          email: alexkim@dev.com
 *          createdAt: 2019-12-19T08:20:42.974Z
 *          updatedAt: 2019-12-19T08:20:42.974Z
 *      UserRegister:
 *        type: object
 *        required:
 *          - name
 *          - email
 *          - password
 *          - password2
 *        properties:
 *          name:
 *            type: string
 *            description: The user's name.
 *          email:
 *            type: string
 *            format: email
 *            description: The user's email address. It must be unique.
 *          password:
 *            type: string
 *            description: The user's password.
 *          password2:
 *            type: string
 *            description: Must be exactly the same as user's password.
 *        example:
 *          name: Alex Kim
 *          email: alexkim@dev.com
 *          password: Iamapassword01234!
 *          password2: Iamapassword01234!
 *      UserLogin:
 *        type: object
 *        required:
 *          - email
 *          - password
 *        properties:
 *          email:
 *            type: string
 *            format: email
 *            description: The user's email address. It must be unique.
 *          password:
 *            type: string
 *            description: The user's password.
 *        example:
 *          email: alexkim@dev.com
 *          password: Iamapassword01234!
 */
const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    screenName: {
      type: String,
      trim: true,
      minlength: 3
    },
    email: {
      type: String,
      validate: {
        validator(v) {
          return /^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
        },
        message: props => `${props.value} is not a valid email address!`
      },
      required: [true, "Email address required"],
      unique: true,
      trim: true
    },
    deleted: { type: Boolean, default: false },
    hash: String,
    salt: String
  },
  {
    timestamps: true
  }
);

userSchema.methods.setPassword = password => {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
    .toString("hex");
  return [this.salt, this.hash];
};

userSchema.methods.validPassword = password => {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
    .toString("hex");
  return this.hash === hash;
};

userSchema.methods.generateJwt = () => {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
      exp: parseInt(expiry.getTime() / 1000, 10)
    },
    process.env.JWT_SECRET
  );
};

const User = mongoose.model("User", userSchema);
module.exports = User;
