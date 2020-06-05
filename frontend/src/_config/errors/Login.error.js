import ServerError from './Server.error';
import HttpStatus from '../../_constants/httpErrors.constants';

/* Most common authentication errors happen during registering
 * and logging in a user. Errors that are already caught on client
 * side are ignored. Refer to
 * `backend/routes/user.route.js#login` for which errors
 * are being thrown.
 *
 * Login
 * - Incorrect password.
 * - User does not exist.
 * - The user could not be logged in because of server error.
 */

class LoginError extends ServerError {
  constructor(err) {
    super(err);

    let message = '';
    switch (err.code) {
      case HttpStatus.NOT_FOUND: // Incorrect password.
        if (err.response.data.message.startsWith('User')) {
          message = "This user doesn't exist.";
          break;
        } else if (err.response.data.message.startsWith('Password')) {
          message = 'Password is incorrect.';
          break;
        }
      // eslint-disable-next-line no-fallthrough
      default:
        // The global axios error handler will catch other
        // errors and assign a more specific message.
        message = this.message;
        break;
    }

    this.message = message;
  }
}

export const handleLoginError = err => {
  throw new LoginError(err);
};

export default LoginError;
