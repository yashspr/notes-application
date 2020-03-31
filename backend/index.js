const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const cors = require('cors');

mongoose.connect("mongodb://localhost/notes_application", {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

// Running Mongoose Models
require("./models/User");

// Importing helper functions
const { getUserInfoFromDb, refreshAccessToken } = require("./middleware/auth");

const app = express();

app.use(cors({
	origin: 'http://localhost:8080',
	optionsSuccessStatus: 200,
	credentials: true
}));

app.set("view engine", "pug");
app.set("views", "backend/views");

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

// Loading Routes
const authRoute = require("./routes/auth");
const driveApiRoute = require("./routes/drive");

// Applying Middleware to Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.use(session(session_config));

// populating the session object with user info if session is active.
app.use(getUserInfoFromDb);
app.use(refreshAccessToken);

app.use("/auth", authRoute);
app.use("/drive", driveApiRoute);

app.post("/test", (req, res) => {
	console.log(req.body);
	console.log(req.body.length);
	res.end();
});

app.listen(4000, () => console.log("Server started on port 4000"));
