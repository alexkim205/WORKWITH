const _ = require("lodash");
const Validator = require("../_utils/validator.util");
const Role = require("../_utils/roles.util");

const { formatFormData } = Validator;

const validateUpdateUserInput = data => {
  const errors = {};
  const formattedData = {
    _id: formatFormData(data._id),
    name: formatFormData(data.name),
    email: formatFormData(data.email),
    contacts: formatFormData(data.contacts),
    role: formatFormData(data.role, true),
    deleted: formatFormData(data.deleted, true)
  };
  // Delete checks
  if (!_.isEmpty(formattedData.deleted)) {
    errors.deleted =
      "Delete field cannot be updated; Please use the DELETE endpoint";
  }

  // Number of fields check
  if (
    Validator.isEmpty(formattedData.email) &&
    Validator.isEmpty(formattedData.name) &&
    _.isEmpty(formattedData.contacts)
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

  // User contacts check
  if (
    !_.isEmpty(formattedData.contacts) &&
    !Validator.isArray(formattedData.contacts)
  ) {
    errors.contacts = "Contacts field is not an array";
  }
  if (
    !_.isEmpty(formattedData.contacts) &&
    Validator.isArray(formattedData.contacts)
  ) {
    const contactIdErrors = formattedData.contacts.map(
      (contactIdOrEmail, i) => {
        return Validator.isObjectId(contactIdOrEmail) ||
          Validator.isEmail(contactIdOrEmail)
          ? null
          : `User contact ${i} is not an Object ID or email.`;
      }
    );
    if (_.some(contactIdErrors)) {
      errors.contacts = contactIdErrors.join();
    }
  }

  // Role checks
  if (
    !Validator.isEmpty(formattedData.role) &&
    !_.values(Role).includes(formattedData.role)
  ) {
    errors.role = "Role is invalid";
  }

  return !_.isEmpty(errors) ? JSON.stringify(errors) : "";
};

module.exports = validateUpdateUserInput;
