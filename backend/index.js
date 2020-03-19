const express = require("express");
const morgan = require("morgan");

const app = express();

/* Loading Routes */
const authRoute = require("./routes/auth");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));

app.use("/auth", authRoute);

app.listen(4000, () => console.log("Server started on port 4000"));
