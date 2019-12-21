const createActionCreator = (constants, constantPrefix) => ({
  actionPending: () => ({ type: constants[`${constantPrefix}_PENDING`] }),
  actionSuccess: payload => ({
    type: constants[`${constantPrefix}_SUCCESS`],
    payload
  }),
  actionError: error => ({ type: constants[`${constantPrefix}_ERROR`], error })
});

export default createActionCreator;
