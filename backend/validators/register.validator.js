const Validator = require("validator");
const isEmpty = require("is-empty");

const validateRegisterInput = data => {
  const errors = {};
  const formattedData = {};

  // Convert empty fields to an empty string so we can use validator functions
  formattedData.name = !isEmpty(data.name) ? data.name : "";
  formattedData.email = !isEmpty(data.email) ? data.email : "";
  formattedData.password = !isEmpty(data.password) ? data.password : "";
  formattedData.password2 = !isEmpty(data.password2) ? data.password2 : "";

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
    errors.password = "Password must be at least 6 characters";
  }
  if (!Validator.equals(formattedData.password, formattedData.password2)) {
    errors.password2 = "Passwords must match";
  }
  return !isEmpty(errors) ? JSON.stringify(errors) : "";
};

module.exports = validateRegisterInput;
