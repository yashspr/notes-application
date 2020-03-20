const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let User = new Schema({
	name: String,
	email: String,
	tokens: {
		access_token: String,
		refresh_token: String,
		expiry_date: Number
	}
});

mongoose.model("user", User);
