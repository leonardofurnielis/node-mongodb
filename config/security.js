/* eslint-disable global-require */

'use strict';

const passport = require('passport');
const uuid = require('uuid');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');

module.exports = () => {
  const Users = require('../app/api/v1/users/users-model');
  const secret = process.env.PW_SECRET || uuid.v1();
  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromHeader('x-iam-key');
  opts.secretOrKey = secret;
  passport.use(
    new JwtStrategy(opts, async (jwtPayload, done) => {
      try {
        let user = await Users.find(jwtPayload._id);
        // eslint-disable-next-line prefer-destructuring
        user = user.docs[0];
        if (user && user.active === true) {
          return done(null, user);
        }
        done(null, false);
      } catch (err) {
        return done(err, false);
      }
    })
  );
  process.env.PW_SECRET = secret;
};
