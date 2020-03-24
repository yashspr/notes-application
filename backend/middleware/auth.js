const mongoose = require("mongoose");
const { google } = require("googleapis");

const googleConfig = require("../config/google_auth");

const UserModel = mongoose.model("user");

// To prevent logged in users from accessing general routes
function dontAllowLoggedIn(req, res, next) {
	if (req.session.user_email) {
		res.end("Already Logged In");
	} else {
		next();
	}
}

// To prevent access to protected routes from guest users
function allowLoggedIn(req, res, next) {
	if (req.session.user_email) {
		next();
	} else {
		res.end("Unauthorized");
	}
}

/* 
	To populate the user information from database(user details, tokens, etc).
	user_email which is saved in the session will be used as key to retrieve data from db
	and save as `user` object on `req`.
	This will be performed for each request made by a logged in user.
*/
function getUserInfoFromDb(req, res, next) {
	if (req.session.user_email) {
		// User session is active, so we much retrieve data from the db.
		UserModel.findOne({ email: req.session.user_email })
			.then(doc => {
				req.user = doc;
			})
			.catch(err => {
				console.log(
					"Unable to get userinfo from db. Session will be destroyed"
				);
				req.session.destroy(err => {
					console.log("session couldn't be destroyed");
					console.log(err);
				});
				console.log(err);
			})
			.finally(() => next());
	} else {
		next();
	}
}

function refreshAccessToken(req, res, next) {
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

		if (client.isTokenExpiring()) {
			console.log("Token is expiring is expired. Need to refresh it.");
			client
				.refreshToken(tokens.refresh_token)
				.then(function (response) {
					// console.log("Refreshed token response is: ");
					// console.log(response.tokens);
					let tokens = response.tokens;
					return saveTokensToDb(req, tokens);
				})
				.then(user => {
					console.log("Updated tokens");
				})
				.catch(err => {
					console.log("Error in updating tokens");
					console.log("Error refreshing tokens");
					console.log(err);
				})
				.finally(() => next());
			// res.end("Token was expired or going to expire. So refreshed it.");
		} else {
			console.log("Token is still valid");
			// res.end("Token is still valid");
			next();
		}
	}
	next();
}

function saveTokensToDb(req, new_tokens) {
	req.user.tokens = {
		refresh_token: req.user.tokens.refresh_token,
		access_token: new_tokens.access_token,
		expiry_date: new_tokens.expiry_date
	};

	return req.user.save();
}

module.exports = {
	dontAllowLoggedIn,
	allowLoggedIn,
	getUserInfoFromDb,
	refreshAccessToken
};
