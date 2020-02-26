import React, { Fragment, useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Flipper, Flipped } from "react-flip-toolkit";
import _ from "lodash";

import useAction from "../../_utils/useAction.util";
import { useFlip } from "../../_utils/FlipProvider.util";
import { validEmailRegex } from "../../_utils/formCheckRegexes.util";
import { FormError } from "../../_config/errors";
import { login, register, logout } from "../../_actions/users.actions";
import FullScreenLoader from "../../components/FullScreenLoader";
import {
  loaderBackgroundColor,
  buttonColor
} from "../../_constants/theme.constants";

import FlippedButton from "../../components/Button/FlippedButton";
import LinkButton from "../../components/Button/LinkButton";
import { Input } from "../../components/Form";
import { Background, _onFieldExit, _onFieldAppear } from "./Auth.style";

const AuthBox = () => {
  /* Component Setup */
  const history = useHistory();
  const [fieldState, setFieldState] = useState({
    name: "",
    email: "",
    password: "",
    password2: ""
  });
  const [state, setState] = useState({
    formErrors: {
      ..._.mapValues(fieldState, ""),
      server: ""
    },
    authState: "LOGIN"
  });
  const _login = useAction(login);
  const _register = useAction(register);
  const _logout = useAction(logout);
  const backgroundRefs = _.mapValues(fieldState, useRef);
  const AUTH_STATE = {
    LOGIN: {
      key: "LOGIN",
      fields: ["email", "password"],
      callback: () => _login(fieldState.email, fieldState.password),
      switch: () =>
        setState({
          authState: "REGISTER",
          formErrors: _.mapValues(fieldState, "")
        }),
      switchText: "I am new here."
    },
    REGISTER: {
      key: "REGISTER",
      fields: ["name", "email", "password", "password2"],
      callback: () => _register(fieldState),
      switch: () =>
        setState({
          authState: "LOGIN",
          formErrors: _.mapValues(fieldState, "")
        }),
      switchText: "I've been here before."
    }
  };
  const FIELDS = {
    name: {
      scope: [AUTH_STATE.REGISTER.key],
      key: "name",
      placeholder: "Name",
      type: "name",
      backgroundRef: backgroundRefs.name,
      onExitEls: [],
      onAppearEls: _(backgroundRefs)
        .pick(["name", "password2"])
        .values()
        .map(ref => ref.current)
        .value()
    },
    email: {
      scope: [AUTH_STATE.LOGIN.key, AUTH_STATE.REGISTER.key],
      key: "email",
      placeholder: "Email",
      type: "email",
      backgroundRef: backgroundRefs.email
    },
    password: {
      scope: [AUTH_STATE.LOGIN.key, AUTH_STATE.REGISTER.key],
      key: "password",
      placeholder: "Password",
      type: "password",
      backgroundRef: backgroundRefs.password
    },
    password2: {
      scope: [AUTH_STATE.REGISTER.key],
      key: "password2",
      placeholder: "Confirm password",
      type: "password",
      backgroundRef: backgroundRefs.password2,
      onExitEls: _(backgroundRefs)
        .pick(["name", "password2"])
        .values()
        .map(ref => ref.current)
        .value(),
      onAppearEls: []
    }
  };
  const getAuthState = () => AUTH_STATE[state.authState];
  const getValidationString = {
    name: () => "",
    email: v => (!validEmailRegex.test(v) ? "Email is not valid." : ""),
    password: v => (v.length < 6 ? "Password must be 6 characters long." : ""),
    password2: v => (v !== fieldState.password ? "Passwords must match." : "")
  };
  const { setPending, isPending } = useFlip();
  /* Component Setup End */

  /* Action handle functions */
  const _formIsValidOnSubmit = () => {
    // Check if empty input
    const errors = state.formErrors;
    _(state.formErrors)
      .keys()
      .filter(v => _.includes(getAuthState().fields, v))
      .value()
      .forEach(name => {
        if (_.isEmpty(fieldState[name])) {
          errors[name] = "Field cannot be empty.";
        } else {
          errors[name] = getValidationString[name](fieldState[name]);
        }
      });
    setState(prevState => ({
      ...prevState,
      formErrors: errors
    }));
    return _(state.formErrors)
      .values()
      .every(_.isEmpty);
  };
  const _handleLoginOrRegister = async () => {
    if (!_formIsValidOnSubmit()) {
      throw new FormError("Incorrect form fields.");
    }
    await getAuthState().callback();
  };
  const _onSuccess = () => {
    history.push({ pathname: `/projects` });
  };
  const _onFailure = error => {
    // if failure, display server error
    if (error.name === "ServerError") {
      setState(prevState => ({
        ...prevState,
        formErrors: _.assign({}, prevState.formErrors, {
          server: error.message
        })
      }));
    }
  };
  const _handleChange = e => {
    e.preventDefault();
    const { name, value } = e.target;
    setFieldState(prevState => ({ ...prevState, [name]: value }));
  };
  useEffect(() => {
    // Logout if this page is requested
    _logout();
  }, []);

  const renderFields = () => (
    <Fragment>
      {_.values(FIELDS).map((field, i) => (
        <Input.Wrapper ref={field.backgroundRef} key={i}>
          {_.includes(field.scope, state.authState) && (
            <Flipped
              flipId={`field${i}`}
              stagger="field"
              translate
              onExit={(el, key, removeElement) =>
                _onFieldExit(
                  el,
                  key,
                  removeElement,
                  field.onExitEls,
                  _.includes(field.scope, state.authState)
                )
              }
              onAppear={(el, key) =>
                _onFieldAppear(
                  el,
                  key,
                  field.onAppearEls,
                  _.includes(field.scope, state.authState)
                )
              }
            >
              <div>
                <Input.Text
                  type={field.type}
                  name={field.key}
                  placeholder={field.placeholder}
                  value={fieldState[field.key]}
                  onChange={_handleChange}
                />
                <Input.Error>{state.formErrors[field.key]}</Input.Error>
              </div>
            </Flipped>
          )}
        </Input.Wrapper>
      ))}
    </Fragment>
  );
  return (
    <div className="form-box">
      {isPending ? (
        <FullScreenLoader
          flipId="auth-box"
          onComplete={_handleLoginOrRegister}
          onSuccess={_onSuccess}
          onFailure={_onFailure}
          backgroundColorCallback={buttonColor}
          setPending={setPending}
          scale
          translate
        />
      ) : (
        <Flipper flipKey={state.authState} spring={"veryGentle"}>
          <div className="form">
            <Input.Error>{state.formErrors.server}</Input.Error>
            <div className="fields-box">{renderFields()}</div>
            <div className="button-box">
              <FlippedButton
                flipId="auth-box"
                flipToBackgroundColorCallback={loaderBackgroundColor}
                onClick={() => {
                  setPending(true);
                }}
                scale
                opacity
              >
                {state.authState}
              </FlippedButton>
            </div>
            <LinkButton onClick={getAuthState().switch}>
              {getAuthState().switchText}
            </LinkButton>
          </div>
        </Flipper>
      )}
    </div>
  );
};

const Auth = () => (
  <Background>
    <AuthBox />
  </Background>
);
export default Auth;
