/* eslint-disable consistent-return */
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const { HttpStatus } = require("../_constants/error.constants");
const { switchEnvs } = require("../_config/getEnv.config");

const authorize = (roles = []) => {
  const rolesArray = typeof roles === "string" ? [roles] : roles;

  return [
    // authenticate JWT token and attach user to request object (req.user)
    (req, res, next) => {
      let token = req.headers.authorization;
      if (_.isEmpty(token)) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .send("Authorization token is missing");
      }
      token = token.replace("Bearer", "").trim();
      const secret = switchEnvs({
        generic: process.env.PRODUCTION_JWT_SECRET,
        dev: process.env.DEVELOPMENT_JWT_SECRET,
        test: process.env.TESTING_JWT_SECRET,
        testConnection: process.env.TESTING_JWT_SECRET
      });

      // jwt functions aren't promisifed yet
      jwt.verify(token, secret, (err, user) => {
        if (!_.isEmpty(err) || _.isEmpty(user)) {
          return res
            .status(HttpStatus.UNAUTHORIZED)
            .send("Authorization token is invalid");
        }
        req.user = user;
        next();
      });
    },
    (req, res, next) => {
      if (!_.isEmpty(rolesArray) && !rolesArray.includes(req.user.role)) {
        // user's role is not authorized
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .send("Request is UNAUTHORIZED");
      }
      // authentication and authorization successful
      next();
    }
  ];
};

module.exports = authorize;
