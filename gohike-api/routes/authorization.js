/**
 * @fileoverview This file contains the Authorization routing methods for the
 * GoHike app API. It handles authentication and authorization for creating
 * new users and logging in/out existing users by calling on an instance of the
 * Authorization class in the models directory.
 */
const express = require("express");
const router = express.Router();
const Authorization = require("../models/authorization");

/**
 * Post request for registering new user
 */
router.post("/register", async (req, res) => {
  // Gets user info from req.body
  let infoUser = req.body;
  let firstName = infoUser.firstName;
  let lastName = infoUser.lastName;
  let age = infoUser.age;
  let username = infoUser.username;
  let password = infoUser.password;
  let email = infoUser.email;
  let location = infoUser.location

  // Creates new user by calling Authorization methods
  try {
    let sessionToken = await Authorization.createNewUser(
      firstName,
      lastName,
      age,
      username,
      password,
      email,
      location
    );
    res
      .status(201)
      .json({ username: username, sessionToken, firstName, lastName });
  } catch {
    res.status(400).json({ msg: "Failed to create new user" });
  }
});

/**
 * Post request for logging in existing user
 */
router.post("/login", async (req, res) => {
  // Gets login info from req.body
  let infoUser = req.body;
  let username = infoUser.username;
  let password = infoUser.password;

  // Logs in user by calling Authorization methods
  try {
    let loginUser = await Authorization.loginUser(username, password);
    res
      .status(201)
      .json({
        username: username,
        sessionToken: loginUser.sessionToken,
        firstName: loginUser.firstName,
        lastName: loginUser.lastName,
        location: loginUser.location
      });
  } catch {
    res.status(400).json({ msg: "Failed to login user" });
  }
});

/**
 * Post request for logging out current user based on their session token
 */
router.post("/logout", async (req, res) => {
  try {
    // Gets session token in order to destroy corresponding session
    let sessionToken = req.body.sessionToken;
    // Destroys session by calling Authorization methods
    let logoutUser = await Authorization.logoutUser(sessionToken);

    res.status(201).json({ msg: logoutUser.msg });
  } catch {
    res.status(400).json({ msg: "Failed to logout user" });
  }
});

module.exports = router;
