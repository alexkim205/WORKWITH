import ServerError from './Server.error';
// import HttpStatus from '../../_constants/httpErrors.constants';

/* Like register and login errors, most project errors will
 * be caught client side. For the most part, the backend should
 * return a pretty descriptive error message, but in the case it
 * doesn't, I'll temporarily handle them here until the backend
 * is updated.
 *
 * I think only MongoDB errors will be handled specifically here.
 * Errors that are manually caught in the backend should have a
 * clear enough message in `response.data`, so reassign
 * `this.message` as response.data.
 *
 */

class ProjectError extends ServerError {
  constructor(err) {
    super(err);

    let message = '';
    switch (err.code) {
      default:
        message = this.response.data;
        break;
    }

    this.message = message;
  }
}

export const handleProjectError = err => {
  throw new ProjectError(err);
};

export default ProjectError;
