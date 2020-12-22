/* eslint-disable global-require */

'use strict';

const passport = require('passport');
const uuid = require('uuid');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');

module.exports = {
  passport: () => {
    const users = require('../../api/models/users');
    const secret = process.env.PW_SECRET || uuid.v1();
    const opts = {};
    opts.jwtFromRequest = ExtractJwt.fromHeader('x-iam-key');
    opts.secretOrKey = secret;
    passport.use(
      new JwtStrategy(opts, async (jwtPayload, done) => {
        try {
          const user = await users.findOne({ _id: jwtPayload._id });

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
  },
};
