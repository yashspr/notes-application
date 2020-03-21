const mongoose = require("mongoose");

const UserModel = mongoose.model("user");

module.exports = {
	dontAllowLoggedIn: function (req, res, next) {
		if (req.session.user_email) {
			res.end("Already Logged In");
		} else {
			next();
		}
	},

	allowLoggedIn: function (req, res, next) {
		if (req.session.user_email) {
			next();
		} else {
			res.end("Unauthorized");
		}
	},

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
