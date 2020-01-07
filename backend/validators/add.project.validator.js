const isEmpty = require("is-empty");
const Validator = require("../_utils/validator.util");

const validateAddProjectInput = data => {
  const errors = {};
  const formattedData = {};

  formattedData.title = !isEmpty(data.title) ? data.title : "";
  formattedData.authors = !isEmpty(data.authors) ? data.authors : "";
  formattedData.users = !isEmpty(data.users) ? data.users : "";
  formattedData.body = !isEmpty(data.body) ? data.body : "";
  formattedData.private = !isEmpty(data.private) ? data.private : "";
  formattedData.deleted = !isEmpty(data.deleted) ? data.deleted : "";

  // Title check
  if (isEmpty(formattedData.title)) {
    errors.title = "Title field is required";
  }

  // Authors check
  if (isEmpty(formattedData.authors)) {
    errors.authors = "Author(s) field is required";
  }
  if (
    !isEmpty(formattedData.authors) &&
    !Validator.isArray(formattedData.authors)
  ) {
    errors.authors = "Authors field is not an array";
  }

  // Users check
  if (
    !isEmpty(formattedData.users) &&
    !Validator.isArray(formattedData.users)
  ) {
    errors.users = "Users field is not an array";
  }

  // Private check
  if (
    !isEmpty(formattedData.private) &&
    !Validator.isRealBoolean(formattedData.private)
  ) {
    errors.private = "Private field must be a boolean";
  }

  // Delete checks
  if (!isEmpty(formattedData.deleted)) {
    errors.deleted =
      "Delete field cannot be updated; Please use the DELETE endpoint";
  }

  return !isEmpty(errors) ? JSON.stringify(errors) : "";
};

module.exports = validateAddProjectInput;
