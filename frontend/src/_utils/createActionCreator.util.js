import { HttpStatus } from "../../../backend/constants/error.constants";

const createActionCreator = (constants, constantPrefix) => ({
  actionPending: () => ({ type: constants[`${constantPrefix}_PENDING`] }),
  actionSuccess: payload => ({
    type: constants[`${constantPrefix}_SUCCESS`],
    payload
  }),
  actionError: (error, kind = HttpStatus.BAD_REQUEST) => ({
    type: constants[`${constantPrefix}_ERROR`],
    kind,
    error
  })
});

export default createActionCreator;
