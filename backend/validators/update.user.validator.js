const isEmpty = require("is-empty");
const Validator = require("../_utils/validator.util");

const validateUpdateUserInput = data => {
  const errors = {};
  const formattedData = {};

  formattedData._id = !isEmpty(data._id) ? data._id : "";
  formattedData.name = !isEmpty(data.name) ? data.name : "";
  formattedData.email = !isEmpty(data.email) ? data.email : "";
  formattedData.deleted = !isEmpty(data.deleted) ? data.deleted : "";

  // Delete checks
  if (!isEmpty(formattedData.deleted)) {
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

  return !isEmpty(errors) ? JSON.stringify(errors) : "";
};

module.exports = validateUpdateUserInput;
