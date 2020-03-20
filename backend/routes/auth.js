const express = require("express");
const { google } = require("googleapis");
const mongoose = require("mongoose");
const axios = require("axios").default;

const UserModel = mongoose.model("user");
const router = express.Router();
const googleConfig = require("../config/google_auth");

// Create an oAuth2 client to authorize the API call
const client = new google.auth.OAuth2(
	googleConfig.client_id,
	googleConfig.client_secret,
	googleConfig.redirect_urls[0]
);

router.get("/login", function (req, res) {
	// First we need to check if we have stored the access token anywhere
	// We also need to store the access and refresh token in the database for future use
	// When request comes, we first check if a session is active
	// If not, we redirect the user to the google auth page.

	let authorizeUrl = client.generateAuthUrl({
		access_type: "offline",
		scope: googleConfig.scope
	});

	res.redirect(authorizeUrl);
});

router.get("/success", async (req, res) => {
	let code = req.query.code;
	if (!code || code == "") {
		res.end("Auth Failed");
	}

	const { tokens } = await client.getToken(code);
	console.log(tokens);

	let response = await axios.get(
		"https://www.googleapis.com/oauth2/v3/userinfo",
		{
			params: {
				access_token: tokens.access_token
			}
		}
	);

	let userEmail = response.data.email;

	let user = await UserModel.findOne({ email: userEmail });
	if (user) {
		// user is there in database, so we must use the existing access_tokens
		// But everytime the user logins, new tokens are generated which we must save
		console.log("user already in the database");
		console.log(user);
		let newTokens = {
			access_token: tokens.access_token,
			refresh_token: tokens.refresh_token,
			expiry_date: tokens.expiry_date
		};
		user.tokens = newTokens;
		try {
			await user.save();
			console.log("updated the tokens");
		} catch (e) {
			console.log("Failed to update tokens");
		}
	} else {
		const newUser = {
			email: response.data.email,
			name: response.data.name,
			tokens: {
				access_token: tokens.access_token,
				refresh_token: tokens.refresh_token,
				expiry_date: tokens.expiry_date
			}
		};

		try {
			let savedUserDoc = await new UserModel(newUser).save();
			console.log("saved user to db");
			console.log(savedUserDoc);
		} catch (e) {
			console.log("Couldn't save new user to database");
			console.log(e);
			res.end("Failed");
			// Make sure to send some error message to the user
		}
	}

	res.end("Success");
});

module.exports = router;
