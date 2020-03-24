const { google } = require("googleapis");
const googleConfig = require("../config/google_auth");

function constructClient(req, res, next) {
	if (req.user) {
		const client = new google.auth.OAuth2(
			googleConfig.client_id,
			googleConfig.client_secret,
			googleConfig.redirect_urls[0]
		);

		const tokens = req.user.tokens;

		const credentials = {
			access_token: tokens.access_token,
			refresh_token: tokens.refresh_token,
			expiry_date: tokens.expiry_date
		};

		client.credentials = credentials;
		req.client = client;
	}
	next();
}

function constructDriveClient(req, res, next) {
	if (req.user) {
		const client = req.client;
		const drive = google.drive({
			version: "v3",
			auth: client
		});
		req.drive = drive;
	}
	next();
}

module.exports = {
	constructClient,
	constructDriveClient
};
