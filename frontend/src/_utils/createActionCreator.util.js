const createActionCreator = (constants, constantPrefix) => ({
  actionPending: () => ({ type: constants[`${constantPrefix}_PENDING`] }),
  actionSuccess: payload => ({
    type: constants[`${constantPrefix}_SUCCESS`],
    payload,
    error: null
  }),
  actionError: error => ({
    type: constants[`${constantPrefix}_ERROR`],
    error: error.toJSON() // error drops message when stringified normally
  })
});

export default createActionCreator;
