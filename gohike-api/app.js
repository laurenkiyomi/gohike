/**
 * @fileoverview This file holds the routing methods for the GoHike app API.
 */
const express = require("express"); // instantiate express
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
// Import routes
const authorization = require("./routes/authorization");
const posts = require("./routes/posts");
const trails = require("./routes/trails");
const user = require("./routes/user");

const app = express();
app.use(bodyParser.json({ limit: "500mb" }));
app.use(morgan("tiny"));
app.use(cors());

// Routes to use for respective paths
app.use("/authorization", authorization);
app.use("/posts", posts);
app.use("/trails", trails);
app.use("/user", user);

// Check server is working
app.get("/", (req, res) => {
  res.status(200).send({ ping: "pong" });
});

module.exports = app;
