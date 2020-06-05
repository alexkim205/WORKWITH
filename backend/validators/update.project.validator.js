const _ = require("lodash");
const Validator = require("../_utils/validator.util");

const { formatFormData } = Validator;

const validateUpdateProjectInput = data => {
  const errors = {};
  const formattedData = {
    _id: formatFormData(data._id),
    title: formatFormData(data.title),
    authors: formatFormData(data.authors),
    users: formatFormData(data.users),
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
    Validator.isEmpty(formattedData.title) &&
    _.isEmpty(formattedData.authors) &&
    _.isEmpty(formattedData.users) &&
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
    !_.isEmpty(formattedData.authors) &&
    !Validator.isArray(formattedData.authors)
  ) {
    errors.authors = "Authors field is not an array";
  }
  if (
    !_.isEmpty(formattedData.authors) &&
    Validator.isArray(formattedData.authors)
  ) {
    const authorIdErrors = formattedData.authors.map((authorId, i) => {
      return !Validator.isObjectId(authorId)
        ? `Id for author ${i} is not an Object ID`
        : null;
    });
    if (_.some(authorIdErrors)) {
      errors.authors = authorIdErrors.join();
    }
  }

  // Users check
  if (
    !_.isEmpty(formattedData.users) &&
    !Validator.isArray(formattedData.users)
  ) {
    errors.users = "Users field is not an array";
  }
  if (
    !_.isEmpty(formattedData.users) &&
    Validator.isArray(formattedData.users)
  ) {
    const userIdErrors = formattedData.users
      .map((userId, i) => {
        return !Validator.isObjectId(userId)
          ? `Id for user ${i} is not an Object ID`
          : "";
      })
      .join();
    if (!_.isEmpty(userIdErrors)) {
      errors.users = userIdErrors;
    }
  }

  // Private check
  if (
    !_.isEmpty(formattedData.private) &&
    !Validator.isRealBoolean(formattedData.private)
  ) {
    errors.private = "Private field must be a boolean";
  }
  return !_.isEmpty(errors) ? JSON.stringify(errors) : "";
};

module.exports = validateUpdateProjectInput;
