const google = require('googleapis').google;

class GAuth{

	async getUserInfo(oauth2Client, callback){
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

	async getPeopleInfo(oauth2Client, callback){
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
}

module.exports = GAuth;