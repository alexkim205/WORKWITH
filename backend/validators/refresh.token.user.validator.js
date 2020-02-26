const _ = require("lodash");
const Validator = require("../_utils/validator.util");
const Role = require("../_utils/roles.util");

const validateRefreshTokenInput = data => {
  const errors = {};
  const formattedData = {};

  // User object check
  if (!data.user || _.isEmpty(data.user)) {
    errors.user = "Request body must have user field.";
    return JSON.stringify(errors);
  }

  formattedData._id = !_.isEmpty(data.user._id) ? data.user._id : "";
  formattedData.name = !_.isEmpty(data.user.name) ? data.user.name : "";
  formattedData.email = !_.isEmpty(data.user.email) ? data.user.email : "";
  formattedData.role = !_.isEmpty(data.user.role) ? data.user.role : "";
  formattedData.refreshToken = !_.isEmpty(data.refreshToken)
    ? data.refreshToken
    : "";

  // User ID checks
  if (Validator.isEmpty(formattedData._id)) {
    errors.projectId = "User ID field is required";
  } else if (!Validator.isObjectId(formattedData._id)) {
    errors.projectId = "User ID field is not an Object ID";
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
  } else if (!_.includes(_.values(Role), formattedData.role)) {
    errors.role = "Role is invalid";
  }

  // Refresh Token checks
  if (Validator.isEmpty(formattedData.refreshToken)) {
    errors.refreshToken = "Refresh token field is required";
  }

  return !_.isEmpty(errors) ? JSON.stringify(errors) : "";
};

module.exports = validateRefreshTokenInput;
