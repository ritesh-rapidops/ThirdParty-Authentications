const google = require('googleapis').google;
const express = require('express');
const bodyparser = require('body-parser');
const cookieparser = require('cookie-parser');
const cors = require('cors');
const app = express();
const googleAuthRoutes = require('./googleAuth_routes');

app.use(bodyparser.json());

app.use(
	cors({ origin: [
  		"http://localhost:4200"
		]
	})
);

app.use('/google',googleAuthRoutes);

const port = 3000;

app.listen(port,() => {
	console.log(`App listening at port ${port} ...`);
});