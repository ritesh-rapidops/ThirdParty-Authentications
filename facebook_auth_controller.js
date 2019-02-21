const express = require('express');
const app = express();

const passport = require('passport'), 
      FacebookStrategy = require('passport-facebook').Strategy;

const credentials = {
  app_id: "2214730581921536",
  app_secret: "2a2f6120ec3ae6d2efa2a607faa2ea2d",
  callback: "http://localhost:3000/facebook/callback"
}

passport.use('facebook', new FacebookStrategy({
  clientID: credentials.app_id,
  clientSecret: credentials.app_secret,
  callbackURL: credentials.callback,
  profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified']
  }, function(accessToken, refreshToken, profile, done) {
      done(null, profile);
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});
