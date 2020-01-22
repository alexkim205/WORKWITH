const _ = require("lodash");
const Validator = require("../_utils/validator.util");

const validateAddProjectInput = data => {
  const errors = {};
  const formattedData = {};

  formattedData.title = !_.isEmpty(data.title) ? data.title : "";
  formattedData.authors = !_.isEmpty(data.authors) ? data.authors : "";
  formattedData.users = !_.isEmpty(data.users) ? data.users : "";
  formattedData.body = !_.isEmpty(data.body) ? data.body : "";
  formattedData.private = !_.isEmpty(data.private) ? data.private : "";
  formattedData.deleted = !_.isEmpty(data.deleted) ? data.deleted : "";

  // Title check
  if (_.isEmpty(formattedData.title)) {
    errors.title = "Title field is required";
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

  // Users check
  if (
    !_.isEmpty(formattedData.users) &&
    !Validator.isArray(formattedData.users)
  ) {
    errors.users = "Users field is not an array";
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

module.exports = validateAddProjectInput;
