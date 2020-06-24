const to = require("await-to-js").default;
const _ = require("lodash");
const { BaseUser, Guest } = require("../models/user.model");
const Validator = require("./validator.util");

/* 
  Check by id or email if each contact exists. If account doesn't exist,
  create guest account. Each promise returns an Object Id or throws
  an error. Client can pass in either string email addresses or uuids in
  req.body.contacts. Backend will format this field into a list of uuids of
  existing users/guests or newly created guests.

  Input: array of emails or ids
  Output: array of promises returning found or created user id's.
*/
const findOrCreateBaseUser = baseUsers => {
  return baseUsers.map(async baseUserIdOrEmail => {
    // If Object Id is passed in, the user should exist.
    if (Validator.isObjectId(baseUserIdOrEmail)) {
      const [errBaseUser, baseUser] = await to(
        BaseUser.findById(baseUserIdOrEmail)
      );
      if (!_.isEmpty(errBaseUser)) {
        throw new Error(errBaseUser);
      }
      if (_.isEmpty(baseUser)) {
        throw new Error(
          `User contact with id ${baseUserIdOrEmail} was NOT_FOUND`
        );
      }
      return baseUser._id;
    }
    // Instead, if email is passed in, the guest should be created.
    if (Validator.isEmail(baseUserIdOrEmail)) {
      // Check if user with email is already a user
      const [errBaseUser, baseUser] = await to(
        BaseUser.findOne({ email: baseUserIdOrEmail })
      );
      if (!_.isEmpty(errBaseUser)) {
        throw new Error(errBaseUser);
      }
      // If not already found, create guest.
      if (_.isEmpty(baseUser)) {
        const guest = new Guest({ email: baseUserIdOrEmail });

        const [errGuest, newGuest] = await to(guest.save());

        if (!_.isEmpty(errGuest)) {
          throw new Error(errGuest);
        }
        if (_.isEmpty(newGuest)) {
          throw new Error(
            `Bad request creating new guest with email ${baseUserIdOrEmail}`
          );
        }
        return newGuest._id;
      }
      return baseUser._id;
    }
    // Should already be caught in validator at beginning of function.
    throw new Error(
      `User contact ${baseUserIdOrEmail} is not an Object ID or email.`
    );
  });
};

module.exports = findOrCreateBaseUser;
