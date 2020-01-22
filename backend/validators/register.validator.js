const _ = require("lodash");
const Validator = require("../_utils/validator.util");

const validateRegisterInput = data => {
  const errors = {};
  const formattedData = {};

  formattedData.name = !_.isEmpty(data.name) ? data.name : "";
  formattedData.email = !_.isEmpty(data.email) ? data.email : "";
  formattedData.password = !_.isEmpty(data.password) ? data.password : "";
  formattedData.password2 = !_.isEmpty(data.password2) ? data.password2 : "";

  // Name checks
  if (Validator.isEmpty(formattedData.name)) {
    errors.name = "Name field is required";
  }

  // Email checks
  if (Validator.isEmpty(formattedData.email)) {
    errors.email = "Email field is required";
  } else if (!Validator.isEmail(formattedData.email)) {
    errors.email = "Email is invalid";
  }

  // Password checks
  if (Validator.isEmpty(formattedData.password)) {
    errors.password = "Password field is required";
  }
  if (Validator.isEmpty(formattedData.password2)) {
    errors.password2 = "Confirm password field is required";
  }
  if (!Validator.isLength(formattedData.password, { min: 6, max: 30 })) {
    errors.password = "Password must be at least 6 and at most 30 characters";
  }
  if (!Validator.equals(formattedData.password, formattedData.password2)) {
    errors.password2 = "Passwords must match";
  }
  return !_.isEmpty(errors) ? JSON.stringify(errors) : "";
};

module.exports = validateRegisterInput;
