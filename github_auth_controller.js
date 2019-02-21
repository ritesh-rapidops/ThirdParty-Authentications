const express = require('express');
const app = express();
const router = express.Router();
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;

const GITHUB_CLIENT_ID = "89f4efb30deb5f6c7b88"
const GITHUB_CLIENT_SECRET = "01055427965edc5b8cbb396cd6df150381245a31";

passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "/github/callback"
  },
  function(accessToken, refreshToken, profile, cb) {

      console.log(profile)

      return cb(null, profile);
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

router.use(passport.initialize());
router.use(passport.session());

router.get('/',
  passport.authenticate('github'));

router.get('/callback',
  passport.authenticate('github', { failureRedirect: '/error' }),
  function(req, res) {
    res.redirect('/github/success');
});

router.get('/success',(req,res) => {
  res.send('Success');
});

module.exports = router;