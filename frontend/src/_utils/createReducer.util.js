// https://github.com/Agillic/create-reducer/blob/master/src/index.js
const createReducer = (initialState, actions, mode = 'setState') => {
  // const {mode = 'setState'} = options || {}; // default merge old state with new one
  return (state = initialState, action) => {
    const identifiedAction = actions[action.type];
    if (identifiedAction) {
      const stateTransformation =
        (typeof identifiedAction === 'function' && identifiedAction) ||
        identifiedAction.setState ||
        identifiedAction.replaceState;
      const mergeState =
        identifiedAction.setState ||
        (mode === 'setState' && !identifiedAction.replaceState);
      return mergeState
        ? { ...state, ...stateTransformation({ state, action }) }
        : stateTransformation({ state, action });
    }
    return state;
  };
};

/* Creates pending, success, error reducer part from constants, constantPrefix, payloadProp

   Inputs:
     constants: Object (containing all constants for reducer)
     constantPrefix: String (beginning of constant, part before _{PENDING/SUCCESS/ERROR})
     payloadProp: String
     pendingProp: String (if different from default pending prop)
     errorProp: String (if different from default error prop)

   Output:
     {
       pendingConstant: () => ({pending: true}),
       successConstant: ({action}) => ({pending: false, payloadProp: action.payload, error: null},
       errorConstant: ({action}) => ({pending: false, error: action.error})
     }
 */
const createReducerPart = (
  constants,
  constantPrefix,
  payloadProp = null,
  pendingProp = 'pending',
  errorProp = 'error'
) => {
  const payloadPropArray =
    payloadProp?.constructor === Array ? payloadProp : [payloadProp];
  return {
    [constants[`${constantPrefix}_PENDING`]]: () => ({
      [pendingProp]: true,
      [errorProp]: null
    }),
    ...(payloadProp && {
      [constants[`${constantPrefix}_SUCCESS`]]: ({ action }) => ({
        [pendingProp]: false,
        [errorProp]: null,
        ...payloadPropArray.reduce((res, prop) => {
          res[prop] =
            payloadProp?.constructor === Array
              ? action.payload[prop]
              : action.payload;
          return res;
        }, {})
      })
    }),
    [constants[`${constantPrefix}_ERROR`]]: ({ action }) => ({
      [pendingProp]: false,
      [errorProp]: action.error
    })
  };
};

export { createReducer, createReducerPart };
