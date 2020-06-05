const _ = require("lodash");
const Validator = require("../_utils/validator.util");

const { formatFormData } = Validator;

const validateLoginInput = data => {
  const errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  const formattedData = {
    email: formatFormData(data.email),
    password: formatFormData(data.password)
  };

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
