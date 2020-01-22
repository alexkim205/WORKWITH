const _ = require("lodash");
const Validator = require("../_utils/validator.util");

const validateLoginInput = data => {
  const errors = {};
  const formattedData = {};

  // Convert empty fields to an empty string so we can use validator functions
  formattedData.email = !_.isEmpty(data.email) ? data.email : "";
  formattedData.password = !_.isEmpty(data.password) ? data.password : "";

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

  return !_.isEmpty(errors) ? JSON.stringify(errors) : "";
};

module.exports = validateLoginInput;
