const _ = require("lodash");
const Validator = require("../_utils/validator.util");
const Role = require("../_utils/roles.util");

const { formatFormData } = Validator;

const validateRegisterInput = data => {
  const errors = {};

  const formattedData = {
    name: formatFormData(data.name),
    email: formatFormData(data.email),
    password: formatFormData(data.password),
    password2: formatFormData(data.password2),
    role: formatFormData(data.role)
  };

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

  // Role checks
  if (
    !Validator.isEmpty(formattedData.role) &&
    !_.values(Role).includes(formattedData.role)
  ) {
    errors.role = "Role is invalid";
  }
  return !_.isEmpty(errors) ? JSON.stringify(errors) : "";
};

module.exports = validateRegisterInput;
