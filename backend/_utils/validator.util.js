// https://github.com/validatorjs/validator.js/issues/525
const ValidatorBase = require("validator");
const mongoose = require("mongoose");
const _ = require("lodash");

function Validator() {}

Object.keys(ValidatorBase).forEach(key => {
  if (Object.prototype.hasOwnProperty.call(ValidatorBase, key))
    Validator.prototype[key] = ValidatorBase[key];
});

Validator.prototype.isArray = v => {
  return v instanceof Array;
};

Validator.prototype.isObjectId = v => {
  return mongoose.Types.ObjectId.isValid(v);
};

Validator.prototype.isRealBoolean = v => {
  return typeof v === "boolean";
};

Validator.prototype.formatFormData = (value, shouldBeBoolean = false) => {
  if (shouldBeBoolean) {
    const boolString = typeof value === "boolean" ? value.toString() : value;
    return !_.isUndefined(value) ? boolString : "";
  }
  return !_.isEmpty(value) ? value : "";
};

const validator = new Validator();

module.exports = validator;
