const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const to = require("await-to-js").default;
const User = require("../models/user.model");

// https://www.wlaurance.com/2018/09/async-await-passportjs-local-strategy/
const config = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password"
      },
      async (email, password, done) => {
        const [err, user] = await to(User.findOne({ email }));
        // Return if server error
        if (err) {
          return done(err);
        }
        // Return if user not found in database
        if (!user) {
          return done(null, false, {
            message: "User not found"
          });
        }
        // Return if password is wrong
        if (!user.validPassword(password, user.hash, user.salt)) {
          return done(null, false, {
            message: "Password is incorrect"
          });
        }
        // Return user if correct
        return done(null, user);
      }
    )
  );
};

module.exports.config = config;
