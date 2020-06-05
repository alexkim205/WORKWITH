const _ = require("lodash");
const Validator = require("../_utils/validator.util");

const validateUpdateUserInput = data => {
  const errors = {};
  const formattedData = {};

  formattedData._id = !_.isEmpty(data._id) ? data._id : "";
  formattedData.name = !_.isEmpty(data.name) ? data.name : "";
  formattedData.email = !_.isEmpty(data.email) ? data.email : "";
  formattedData.contacts = !_.isEmpty(data.contacts) ? data.contacts : "";
  formattedData.deleted = !_.isUndefined(data.deleted) ? "true" : "";

  // Delete checks
  if (!_.isEmpty(formattedData.deleted)) {
    errors.deleted =
      "Delete field cannot be updated; Please use the DELETE endpoint";
  }

  // Number of fields check
  if (
    Validator.isEmpty(formattedData.email) &&
    Validator.isEmpty(formattedData.name)
  ) {
    errors.general = "At least one field must be updated";
  }

  // User ID checks
  if (
    !Validator.isEmpty(formattedData._id) &&
    !Validator.isObjectId(formattedData._id)
  ) {
    errors.projectId = "User ID field is not an Object ID";
  }

  // Email checks
  if (
    !Validator.isEmpty(formattedData.email) &&
    !Validator.isEmail(formattedData.email)
  ) {
    errors.email = "Email is invalid";
  }

  return !_.isEmpty(errors) ? JSON.stringify(errors) : "";
};

module.exports = validateUpdateUserInput;
