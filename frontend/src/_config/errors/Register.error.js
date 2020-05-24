import ServerError from './Server.error';
import HttpStatus from '../../_constants/httpErrors.constants';

/* Most common authentication errors happen during registering
 * and logging in a user. Errors that are already caught on client
 * side are ignored. Refer to
 * `backend/routes/user.route.js#register` for which errors
 * are being thrown.
 *
 * Register
 * - User with email already exists.
 * - The user could not be created because of server error.
 */

class RegisterError extends ServerError {
  constructor(err) {
    super(err);

    let message = '';
    switch (err.code) {
      case HttpStatus.BAD_REQUEST:
        message = 'User with email already exists.';
        break;
      default:
        // The global axios error handler will catch other
        // errors and assign a more specific message.
        message = this.message;
        break;
    }

    this.message = message;
  }
}

export const handleRegisterError = err => {
  throw new RegisterError(err);
};

export default RegisterError;
