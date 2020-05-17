import ServerError from './Server.error';

/* Most common authentication errors happen during registering
 * and logging in a user. Errors that are already caught on client
 * side are ignored. Refer to
 * `backend/routes/user.route.js#{login|register}` for which errors
 * are being thrown.
 *
 * Register
 * - User with email already exists.
 * - The user could not be created because of server error.
 *
 * Login
 * - Incorrect password.
 * - User does not exist.
 * - The user could not be logged in because of server error.
 */

class AuthError extends ServerError {
  constructor(statusCode) {
    super(statusCode);

    console.log(this);
  }

  toJSON() {
    return {
      code: this.code,
      name: this.name,
      message: this.message,
      stack: this.stack
    };
  }
}

export default AuthError;
