import ServerError from './Server.error';
import HttpStatus from '../../_constants/httpErrors.constants';

const handleError = error => {
  // https://github.com/axios/axios/issues/383
  if (!error.response) {
    // network error
    throw new ServerError(HttpStatus.NETWORK_CONNECT_TIMEOUT);
  }
  console.log(error);
  throw new ServerError(error.response.status);
};

export default handleError;
