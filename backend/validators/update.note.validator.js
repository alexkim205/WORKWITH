const _ = require("lodash");
const Validator = require("../_utils/validator.util");

const { formatFormData } = Validator;

const validateUpdateNoteInput = data => {
  const errors = {};
  const formattedData = {
    _id: formatFormData(data._id),
    projectId: formatFormData(data.projectId),
    title: formatFormData(data.title),
    authors: formatFormData(data.authors),
    taggedUsers: formatFormData(data.taggedUsers),
    body: formatFormData(data.body),
    minimized: formatFormData(data.minimized, true),
    private: formatFormData(data.private, true),
    deleted: formatFormData(data.deleted, true)
  };

  // Delete checks
  if (!_.isEmpty(formattedData.deleted)) {
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
  // Note ID checks
  if (
    !Validator.isEmpty(formattedData._id) &&
    !Validator.isObjectId(formattedData._id)
  ) {
    errors.projectId = "Note ID field is not an Object ID";
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
    !Validator.isBoolean(formattedData.minimized)
  ) {
    errors.minimized = "Minimized field must be a boolean";
  }

  // Private check
  if (
    !_.isEmpty(formattedData.private) &&
    !Validator.isBoolean(formattedData.private)
  ) {
    errors.private = "Private field must be a boolean";
  }

  return !_.isEmpty(errors) ? JSON.stringify(errors) : "";
};

module.exports = validateUpdateNoteInput;
