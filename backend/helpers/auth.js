const mongoose = require("mongoose");

const UserModel = mongoose.model("user");

module.exports = {
	// To prevent logged in users from accessing general routes
	dontAllowLoggedIn: function (req, res, next) {
		if (req.session.user_email) {
			res.end("Already Logged In");
		} else {
			next();
		}
	},

	// To prevent access to protected routes from guest users
	allowLoggedIn: function (req, res, next) {
		if (req.session.user_email) {
			next();
		} else {
			res.end("Unauthorized");
		}
	},

	/* 
		To populate the user information from database(user details, tokens, etc).
		user_email which is saved in the session will be used as key to retrieve data from db
		and save as `user` object on `req`.
		This will be performed for each request made by a logged in user.
	*/
	getUserInfoFromDb: function (req, res, next) {
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
};
