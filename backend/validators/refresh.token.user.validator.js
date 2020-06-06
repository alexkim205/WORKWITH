const _ = require("lodash");
const Validator = require("../_utils/validator.util");
const Role = require("../_utils/roles.util");

const { formatFormData } = Validator;

const validateRefreshTokenInput = data => {
  const errors = {};

  // User object check
  if (!data.user || _.isEmpty(data.user)) {
    errors.user = "Request body must have user field.";
    return JSON.stringify(errors);
  }

  const formattedData = {
    _id: formatFormData(data.user._id),
    name: formatFormData(data.user.name),
    email: formatFormData(data.user.email),
    role: formatFormData(data.user.role),
    refreshToken: formatFormData(data.refreshToken)
  };

  // User ID checks
  if (Validator.isEmpty(formattedData._id)) {
    errors._id = "User ID field is required";
  } else if (!Validator.isObjectId(formattedData._id)) {
    errors._id = "User ID field is not an Object ID";
  }

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

  // Role checks
  if (Validator.isEmpty(formattedData.role)) {
    errors.role = "Role field is required";
  } else if (!_.values(Role).includes(formattedData.role)) {
    errors.role = "Role is invalid";
  }

  // Refresh Token checks
  if (Validator.isEmpty(formattedData.refreshToken)) {
    errors.refreshToken = "Refresh token field is required";
  }

  return !_.isEmpty(errors) ? JSON.stringify(errors) : "";
};

module.exports = validateRefreshTokenInput;
