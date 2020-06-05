const _ = require("lodash");
const Validator = require("../_utils/validator.util");

const { formatFormData } = Validator;

const validateAddNoteInput = data => {
  const errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  const formattedData = {
    projectId: formatFormData(data.projectId),
    title: formatFormData(data.title),
    authors: formatFormData(data.authors),
    taggedUsers: formatFormData(data.taggedUsers),
    body: formatFormData(data.body),
    minimized: formatFormData(data.minimized, true),
    private: formatFormData(data.private, true)
  };

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
