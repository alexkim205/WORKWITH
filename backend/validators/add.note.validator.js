const _ = require("lodash");
const Validator = require("../_utils/validator.util");

const validateAddNoteInput = data => {
  const errors = {};
  const formattedData = {};

  // Convert empty fields to an empty string so we can use validator functions
  formattedData.projectId = !_.isEmpty(data.projectId) ? data.projectId : "";
  formattedData.title = !_.isEmpty(data.title) ? data.title : "";
  formattedData.authors = !_.isEmpty(data.authors) ? data.authors : "";
  formattedData.taggedUsers = !_.isEmpty(data.taggedUsers)
    ? data.taggedUsers
    : "";
  formattedData.body = !_.isEmpty(data.body) ? data.body : "";
  formattedData.minimized = !_.isEmpty(data.minimized) ? data.minimized : "";
  formattedData.private = !_.isEmpty(data.private) ? data.private : "";

  // Project ID checks
  if (Validator.isEmpty(formattedData.projectId)) {
    errors.projectId = "Project ID field is required";
  }
  if (
    !Validator.isEmpty(formattedData.projectId) &&
    !Validator.isObjectId(formattedData.projectId)
  ) {
    errors.projectId = "Project ID field is not an Object ID";
  }

  // Authors check
  if (_.isEmpty(formattedData.authors)) {
    errors.authors = "Author(s) field is required";
  }
  if (
    !_.isEmpty(formattedData.authors) &&
    !Validator.isArray(formattedData.authors)
  ) {
    errors.authors = "Authors field is not an array";
  }

  // Tagged Users check
  if (
    !_.isEmpty(formattedData.taggedUsers) &&
    !Validator.isArray(formattedData.taggedUsers)
  ) {
    errors.taggedUsers = "Tagged users field is not an array";
  }

  // Minimized check
  if (
    !_.isEmpty(formattedData.minimized) &&
    !Validator.isRealBoolean(formattedData.minimized)
  ) {
    errors.minimized = "Minimized field must be a boolean";
  }

  // Private check
  if (
    !_.isEmpty(formattedData.private) &&
    !Validator.isRealBoolean(formattedData.private)
  ) {
    errors.private = "Private field must be a boolean";
  }

  // Delete checks
  if (!_.isEmpty(formattedData.deleted)) {
    errors.deleted =
      "Delete field cannot be updated; Please use the DELETE endpoint";
  }

  return !_.isEmpty(errors) ? JSON.stringify(errors) : "";
};

module.exports = validateAddNoteInput;
