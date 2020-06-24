const _ = require("lodash");
const Validator = require("../_utils/validator.util");

const { formatFormData } = Validator;

const validateAddProjectInput = data => {
  const errors = {};

  const formattedData = {
    title: formatFormData(data.title),
    authors: formatFormData(data.authors),
    users: formatFormData(data.users),
    body: formatFormData(data.body),
    private: formatFormData(data.private, true)
  };

  // Title check
  if (_.isEmpty(formattedData.title)) {
    errors.title = "Title field is required";
  }

  // Authors check
  if (
    !_.isEmpty(formattedData.authors) &&
    !Validator.isArray(formattedData.authors)
  ) {
    errors.authors = "Authors field is not an array";
  }

  // Users check
  if (!_.isEmpty(formattedData.users)) {
    if (!Validator.isArray(formattedData.users)) {
      // If users data isn't array
      errors.users = "Users field is not an array";
    } else {
      // If users data is array
      const userIdErrors = formattedData.users.map((userIdOrEmail, i) => {
        return _.isString(userIdOrEmail) &&
          (Validator.isObjectId(userIdOrEmail) ||
            Validator.isEmail(userIdOrEmail))
          ? null
          : `User ${i} is not an Object ID or email.`;
      });
      if (_.some(userIdErrors)) {
        errors.users = userIdErrors.join();
      }
    }
  }

  // Private check
  if (
    !_.isEmpty(formattedData.private) &&
    !Validator.isBoolean(formattedData.private)
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
