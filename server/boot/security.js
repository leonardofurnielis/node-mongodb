/* eslint-disable global-require */

'use strict';

const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');

module.exports = {
  passport: () => {
    const Users = require('../../api/models/users');

    const opts = {};
    opts.jwtFromRequest = ExtractJwt.fromHeader('authorization');
    opts.secretOrKey = process.env.PW_SECRET;
    passport.use(
      new JwtStrategy(opts, async (jwtPayload, done) => {
        try {
          const user = await Users.find(jwtPayload._id).docs[0];

          if (user && user.active === true) {
            return done(null, user);
          }
          done(null, false);
        } catch (err) {
          return done(err, false);
        }
      })
    );
  },
};
