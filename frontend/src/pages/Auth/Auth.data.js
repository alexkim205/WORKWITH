export const AUTH_KEYS = {
  LOGIN: 'LOGIN',
  REGISTER: 'REGISTER'
};

export const FIELD_KEYS = {
  NAME: 'NAME',
  EMAIL: 'EMAIL',
  PASSWORD: 'PASSWORD',
  PASSWORD2: 'PASSWORD2'
};

export const initializeFields = ({ password }) => ({
  [FIELD_KEYS.NAME]: {
    scope: [AUTH_KEYS.REGISTER],
    placeholder: 'Name',
    type: 'name',
    options: {
      required: 'Name is required.',
      maxLength: { value: 50, message: 'Name is too long.' }
    },
    toOmit: ['required']
  },
  [FIELD_KEYS.EMAIL]: {
    scope: [AUTH_KEYS.LOGIN, AUTH_KEYS.REGISTER],
    placeholder: 'Email',
    type: 'email',
    options: {
      required: 'Email is required.',
      pattern: { value: /^\S+@\S+$/i, message: 'Email is not valid.' }
    }
  },
  [FIELD_KEYS.PASSWORD]: {
    scope: [AUTH_KEYS.LOGIN, AUTH_KEYS.REGISTER],
    placeholder: 'Password',
    type: 'password',
    options: {
      required: 'Password is required.',
      minLength: {
        value: 6,
        message: 'Password must be 6 characters long.'
      }
    }
  },
  [FIELD_KEYS.PASSWORD2]: {
    scope: [AUTH_KEYS.REGISTER],
    placeholder: 'Confirm password',
    type: 'password',
    options: {
      required: 'Passwords must match.',
      minLength: {
        value: 6,
        message: 'Password must be 6 characters long.'
      },
      validate: v => v === password || 'Passwords must match.'
    },
    toOmit: ['required', 'validate']
  }
});
