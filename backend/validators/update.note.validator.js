const isEmpty = require("is-empty");
const Validator = require("../_utils/validator.util");

const validateUpdateNoteInput = data => {
  const errors = {};
  const formattedData = {};

  // Convert empty fields to an empty string so we can use validator functions
  formattedData.projectId = !isEmpty(data.projectId) ? data.projectId : "";
  formattedData.title = !isEmpty(data.title) ? data.title : "";
  formattedData.authors = !isEmpty(data.authors) ? data.authors : "";
  formattedData.taggedUsers = !isEmpty(data.taggedUsers)
    ? data.taggedUsers
    : "";
  formattedData.body = !isEmpty(data.body) ? data.body : "";
  formattedData.minimized = !isEmpty(data.minimized) ? data.minimized : "";
  formattedData.private = !isEmpty(data.private) ? data.private : "";
  formattedData.deleted = !isEmpty(data.deleted) ? data.deleted : "";

  // Delete checks
  if (!isEmpty(formattedData.deleted)) {
    errors.deleted =
      "Delete field cannot be updated; Please use the DELETE endpoint";
  }

  // Number of fields check
  if (
    Validator.isEmpty(formattedData.projectId) &&
    Validator.isEmpty(formattedData.title) &&
    Validator.isEmpty(formattedData.authors) &&
    Validator.isEmpty(formattedData.taggedUsers) &&
    Validator.isEmpty(formattedData.body) &&
    Validator.isEmpty(formattedData.minimized) &&
    Validator.isEmpty(formattedData.private)
  ) {
    errors.general = "At least one field must be updated";
  }
  // Project ID checks
  if (
    !Validator.isEmpty(formattedData.projectId) &&
    !Validator.isObjectId(formattedData.projectId)
  ) {
    errors.projectId = "Project ID field is not an Object ID";
  }

  // Authors check
  if (
    !isEmpty(formattedData.authors) &&
    !Validator.isArray(formattedData.authors)
  ) {
    errors.authors = "Authors field is not an array";
  }

  // Tagged Users check
  if (
    !isEmpty(formattedData.taggedUsers) &&
    !Validator.isArray(formattedData.taggedUsers)
  ) {
    errors.taggedUsers = "Tagged users field is not an array";
  }

  // Minimized check
  if (
    !isEmpty(formattedData.minimized) &&
    !Validator.isRealBoolean(formattedData.minimized)
  ) {
    errors.minimized = "Minimized field must be a boolean";
  }

  // Private check
  if (
    !isEmpty(formattedData.private) &&
    !Validator.isRealBoolean(formattedData.private)
  ) {
    errors.private = "Private field must be a boolean";
  }

  return !isEmpty(errors) ? JSON.stringify(errors) : "";
};

module.exports = validateUpdateNoteInput;
