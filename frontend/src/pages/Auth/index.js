import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Flipped } from 'react-flip-toolkit';
import _ from 'lodash';
import { useForm } from 'react-hook-form';

import useAction from '../../_utils/useAction.util';
import { login, register, logout } from '../../_actions/users.actions';
import { getUsersPendingAndError } from '../../_selectors/users.selectors';

import { Input } from '../../components/Form';
import { FormButton, LinkButton } from '../../components/Button';
import {
  Background,
  _onButtonExit,
  _onButtonEnter,
  _onFieldExit,
  _onFieldEnter
} from './Auth.style';
import { AUTH_KEYS, initializeFields } from './Auth.data';

const AuthBox = () => {
  /* Component Setup */
  const [authState, setAuthState] = useState(AUTH_KEYS.LOGIN);
  const _login = useAction(login);
  const _register = useAction(register);
  const _logout = useAction(logout);
  const { pending } = useSelector(getUsersPendingAndError);
  const formRef = useRef();
  const {
    register: registerField,
    unregister: unregisterField,
    handleSubmit,
    errors,
    setError,
    clearError,
    watch
  } = useForm();
  const FIELDS = initializeFields({ password: watch('password') });

  /* Component Setup End */

  /* Form functions */
  const _onSubmit = async data => {
    try {
      if (authState === AUTH_KEYS.LOGIN) {
        // If on login form
        await _login(data.email, data.password);
      } else {
        // If on register form
        await _register(data);
      }
    } catch (error) {
      // if failure, display server error
      if (error.name === 'ServerError') {
        setError('general', 'serverError', error.message);
      }
    }
  };

  const _onSwitch = async () => {
    // Animate old button text and fields exiting
    await _onButtonExit(formRef.current);

    // Switch auth state, reset form
    clearError();
    unregisterField(_.keys(FIELDS));

    if (authState === AUTH_KEYS.LOGIN) {
      // Login --> Register
      setAuthState(AUTH_KEYS.REGISTER);
      await _onFieldEnter(formRef.current);
    } else {
      // Register --> Login
      setAuthState(AUTH_KEYS.LOGIN);
      await _onFieldExit(formRef.current);
    }

    // Animate new button text entering
    _onButtonEnter(formRef.current);
  };
  /* Form functions end */

  useEffect(() => {
    // Logout if this page is requested
    _logout();
  }, []);

  return (
    <div className="form-box">
      <form onSubmit={handleSubmit(_onSubmit)} ref={formRef}>
        <div className="fields-box">
          <Input.Error>{errors?.general?.message}</Input.Error>
          {_.values(FIELDS).map((field, i) => {
            const shouldFade = _.isEqual(field.scope, _.values(AUTH_KEYS));
            const isHidden = !field.scope.includes(authState);
            return (
              <Input.Wrapper
                key={i}
                data-field-fade={shouldFade ? null : ''}
                hidden={isHidden}
              >
                <Input.Text
                  disabled={isHidden}
                  type={field.type}
                  name={field.key}
                  placeholder={field.placeholder}
                  ref={registerField(
                    _.omit(
                      field.options,
                      !isHidden ? [] : field.toOmit // If field is not in auth state scope, don't require
                    )
                  )}
                />
                <Input.Error>{errors?.[field.key]?.message}</Input.Error>
              </Input.Wrapper>
            );
          })}
        </div>
        <div className="button-box">
          <FormButton data-button-fade type="submit" disabled={pending}>
            {authState}
          </FormButton>
          <LinkButton
            data-button-fade
            type="button"
            onClick={_onSwitch}
            disabled={pending}
          >
            {authState === AUTH_KEYS.LOGIN
              ? 'I am new here.'
              : "I've been here before."}
          </LinkButton>
        </div>
      </form>
    </div>
  );
};

const Auth = () => (
  <Flipped
    flipId="page" // eslint-disable-next-line no-unused-vars
    shouldFlip={({ location: prevLoc }, { location: currLoc }) =>
      currLoc === '/auth'
    }
  >
    <Background>
      <AuthBox />
    </Background>
  </Flipped>
);
export default Auth;
