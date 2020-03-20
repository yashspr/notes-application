const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");

const app = express();

mongoose.connect("mongodb://localhost/notes_application", {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

/* Running Mongoose Models */
require("./models/User");

/* Loading Routes */
const authRoute = require("./routes/auth");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));

app.use("/auth", authRoute);

app.listen(4000, () => console.log("Server started on port 4000"));
