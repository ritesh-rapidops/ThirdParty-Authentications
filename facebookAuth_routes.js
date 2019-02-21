const express = require('express');
const fbAuth = require('./facebook_auth_controller');
const app = express();
const router = express.Router();
const passport = require('passport');


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

router.use(passport.initialize());
router.use(passport.session());

router.get('/',passport.authenticate('facebook', {scope:["email"]}));

router.get('/callback',passport.authenticate('facebook', 
	{ successRedirect: '/facebook/success', failureRedirect: '/facebook/failure'}));

router.get('/success', (req,res) => {
	res.send("Success");
});

router.get('/failure', (req,res) => {
	res.send("Failed");
});

module.exports = router;