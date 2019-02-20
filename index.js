const google = require('googleapis').google;
const express = require('express');
const bodyparser = require('body-parser');
const cookieparser = require('cookie-parser');
const cors = require('cors');
const app = express();

const oauth2Client = new google.auth.OAuth2(
  "854164117444-qb5scahgdnmm95dcqkfs8k9j8afqga8q.apps.googleusercontent.com",
  "6rp9UyL-DOp8weiguoK5Yo_X",
  "http://localhost:4200/authRedirect"
);

oauth2Client.on('tokens', (tokens) => {
  	if (tokens.refresh_token) {
    	// store the refresh_token in my database!
  	  // console.log("Refresh Token:"+tokens.refresh_token);
  	}
  	// console.log("Access Token:"+tokens.access_token);
	return tokens;
});

async function getUserInfo(callback){
	const oauth2 = google.oauth2({
	  auth: oauth2Client,
	  version: 'v2'
	});
	await oauth2.userinfo.get((err, res) =>{
		if(err){
			console.log(err);
		}else{
			callback(res.data);
		}
	});
}

async function getPeopleInfo(callback){
	const peopleService = google.people({
		version: 'v1', 
		auth: oauth2Client
	});

	await peopleService.people.connections.list({
	    resourceName: 'people/me',
	    personFields: 'names,emailAddresses'
	  },(err, res) => {
	  	if(err){
	  		console.log(err);
	  	}else{
		    callback(res.data.connections);
		}
	});
}

// generate a url that asks permissions for Blogger and Google Calendar scopes
const scopes = [
  'https://www.googleapis.com/auth/contacts',
  'https://www.googleapis.com/auth/userinfo.profile'
];

const url = oauth2Client.generateAuthUrl({
  // 'online' (default) or 'offline' (gets refresh_token)
  access_type: 'offline',
  // If you only need one scope you can pass it as a string
  scope: scopes
});

app.use(bodyparser.json());

app.use(
	cors({ origin: [
  		"http://localhost:4200"
		]
	})
);

app.get('/',(req, res) => {
	res.send({ result: true, url:url });
});

app.get('/authRedirect', async (req, res) => {
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

app.get('/userdata', async(req, res) => {
	oauth2Client.setCredentials({
    	refresh_token: req.query.token
    });
	getUserInfo((result)=>{
		res.send(result);
	});	
});

app.get('/contacts',async (req, res) => {
    oauth2Client.setCredentials({
    	refresh_token: req.query.token
    });
	await getPeopleInfo((result)=>{
		res.send(result);
	});
});

const port = 3000;

app.listen(port,() => {
	console.log(`App listening at port ${port} ...`);
});