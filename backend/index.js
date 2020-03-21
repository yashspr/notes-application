const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

mongoose.connect("mongodb://localhost/notes_application", {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

/* Running Mongoose Models */
require("./models/User");

const { getUserInfoFromDb } = require("./helpers/auth");

const app = express();

var session_config = {
	secret: "keyboard cat",
	resave: false,
	saveUninitialized: false,
	store: new MongoStore({ mongooseConnection: mongoose.connection })
};

if (app.get("env") === "production") {
	app.set("trust proxy", 1); // trust first proxy
	session_config.cookie.secure = true; // serve secure cookies
}

/* Loading Routes */
const authRoute = require("./routes/auth");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.use(session(session_config));

// populating the session object with user info if session is active.
app.use(getUserInfoFromDb);

app.use("/auth", authRoute);

app.listen(4000, () => console.log("Server started on port 4000"));
