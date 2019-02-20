const express = require('express');
const GAuth = require('./google_auth_controller');
const google = require('googleapis').google;
const app = express();
const router = express.Router();

const gAuth = new GAuth();

const oauth2Client = new google.auth.OAuth2(
  "854164117444-qb5scahgdnmm95dcqkfs8k9j8afqga8q.apps.googleusercontent.com",
  "6rp9UyL-DOp8weiguoK5Yo_X",
  "http://localhost:4200/authRedirect"
);

oauth2Client.on('tokens', (tokens) => {
  	// if (tokens.refresh_token) {
    	
  	// }
	return tokens;
});

// generate a url that asks permissions for Blogger and Google Calendar scopes
const scopes = [
  'https://www.googleapis.com/auth/contacts',
  'https://www.googleapis.com/auth/userinfo.profile'
];

const url = oauth2Client.generateAuthUrl({
  // 'online' (default) or 'offline' (gets refresh_token)
  access_type: 'offline',
  prompt:'consent',
  // If you only need one scope you can pass it as a string
  scope: scopes
});

router.get('/',(req, res) => {
	res.send({ result: true, url:url });
});

router.get('/authRedirect', async (req, res) => {
	const {tokens} = await oauth2Client.getToken(req.query.code);
	await oauth2Client.setCredentials(tokens);
	let userData ={};
	let contactsData ={};
	res.send({
		result:true, 
		message: 'code set success', 
		tokens: tokens
	});	
});

router.get('/userdata', async(req, res) => {
	oauth2Client.setCredentials({
    	refresh_token: req.query.token
    });
	gAuth.getUserInfo(oauth2Client,(result)=>{
		res.send(result);
	});	
});

router.get('/contacts',async (req, res) => {
    oauth2Client.setCredentials({
    	refresh_token: req.query.token
    });
	gAuth.getPeopleInfo(oauth2Client,(result)=>{
		res.send(result);
	});
});

module.exports=router;