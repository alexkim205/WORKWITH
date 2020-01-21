// https://www.restapitutorial.com/httpstatuscodes.html

const HttpStatus = {
  // 2xx Success
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,

  // 4xx Client Error
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  IM_A_TEAPOT: 418,
  UNPROCESSABLE_ENTITY: 422, // incorrect form data

  // 5xx Server Error
  INTERNAL_SERVER_ERROR: 500,
  NETWORK_CONNECT_TIMEOUT: 599
};

export default HttpStatus;
