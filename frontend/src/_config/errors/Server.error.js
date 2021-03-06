import HttpStatus from '../../_constants/httpErrors.constants';

class ServerError extends Error {
  constructor(err) {
    // If error.response doesn't exist, it's a server can't be reached error.
    // https://github.com/axios/axios/issues/383
    const statusCode = err.response
      ? err.response.status
      : HttpStatus.NETWORK_CONNECT_TIMEOUT;

    let message = '';
    switch (statusCode) {
      case HttpStatus.UNAUTHORIZED:
        message = 'That request is unauthorized.';
        break;
      case HttpStatus.FORBIDDEN:
        message = 'That request is forbidden.';
        break;
      case HttpStatus.NOT_FOUND:
        message = `Object not found.`;
        break;
      case HttpStatus.CONFLICT:
        message = 'There was a conflict with that request.';
        break;
      case HttpStatus.UNPROCESSABLE_ENTITY:
        message = 'The form request is invalid.';
        break;
      case HttpStatus.NETWORK_CONNECT_TIMEOUT:
        message = "Network couldn't connect to the server.";
        break;
      default:
        // 400
        message = 'That request is bad.';
        break;
    }
    super(message);
    this.code = statusCode;
    this.name = 'ServerError';
    this.response = err.response;
    this.message = message;
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

export default ServerError;
