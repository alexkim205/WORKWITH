const isEmpty = require("is-empty");
const Validator = require("../_utils/validator.util");

const validateUpdateProjectInput = data => {
  const errors = {};
  const formattedData = {};

  formattedData._id = !isEmpty(data._id) ? data._id : "";
  formattedData.title = !isEmpty(data.title) ? data.title : "";
  formattedData.authors = !isEmpty(data.authors) ? data.authors : "";
  formattedData.users = !isEmpty(data.users) ? data.users : "";
  formattedData.body = !isEmpty(data.body) ? data.body : "";
  formattedData.private = !isEmpty(data.private) ? data.private : "";
  formattedData.deleted = !isEmpty(data.deleted) ? data.deleted : "";

  // Delete checks
  if (!isEmpty(formattedData.deleted)) {
    errors.deleted =
      "Delete field cannot be updated; Please use the DELETE endpoint";
  }

  // Number of fields check
  if (
    Validator.isEmpty(formattedData.title) &&
    Validator.isEmpty(formattedData.authors) &&
    Validator.isEmpty(formattedData.users) &&
    Validator.isEmpty(formattedData.body) &&
    Validator.isEmpty(formattedData.private)
  ) {
    errors.general = "At least one field must be updated";
  }

  // Project ID checks
  if (
    !Validator.isEmpty(formattedData._id) &&
    !Validator.isObjectId(formattedData._id)
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
  if (
    !isEmpty(formattedData.authors) &&
    Validator.isArray(formattedData.authors)
  ) {
    const authorIdErrors = formattedData.authors
      .map((authorId, i) => {
        return !Validator.isObjectId(authorId)
          ? `Id for author ${i} is not an Object ID`
          : "";
      })
      .join();
    if (!isEmpty(authorIdErrors)) {
      errors.authors = authorIdErrors;
    }
  }

  // Users check
  if (
    !isEmpty(formattedData.users) &&
    !Validator.isArray(formattedData.users)
  ) {
    errors.users = "Users field is not an array";
  }
  if (!isEmpty(formattedData.users) && Validator.isArray(formattedData.users)) {
    const userIdErrors = formattedData.users
      .map((userId, i) => {
        return !Validator.isObjectId(userId)
          ? `Id for user ${i} is not an Object ID`
          : "";
      })
      .join();
    if (!isEmpty(userIdErrors)) {
      errors.users = userIdErrors;
    }
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

module.exports = validateUpdateProjectInput;
