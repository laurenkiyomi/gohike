/**
 * @fileoverview This file is the Authorization model in the GoHike app API. It
 * is used to implement an Authorization class and is called by the the
 * Authorization routing methods.
 */
require("dotenv").config();
var Parse = require("parse/node");
Parse.initialize(
  process.env.APP_ID,
  process.env.JS_KEY,
  process.env.MASTER_KEY
);
Parse.serverURL = "https://parseapi.back4app.com/";

/**
 * This class handles creation, login, and logout of new users.
 */
class Authorization {
  constructor() {
    this.super();
  }

  /**
   * Creates a new User object and saves new user to Parse
   *
   * @param {String} firstname
   * @param {String} lastname
   * @param {Number} age
   * @param {String} username
   * @param {String} password
   * @param {String} email
   * @returns {String} User's session token returned by creating account
   */
  static async createNewUser(
    firstName,
    lastName,
    age,
    username,
    password,
    email
  ) {
    // Create empty Parse _User object
    let user = new Parse.User();

    // Set proper values for new user
    user.set("firstName", firstName);
    user.set("lastName", lastName);
    user.set("age", age);
    user.set("username", username);
    user.set("password", password);
    user.set("email", email);
    user.set("saved", []);
    user.set("completed", []);
    user.set("posts", []);

    // Save user and return session token
    let newUser = await user.signUp();
    return newUser.getSessionToken();
  }

  /**
   * Logs in a user with an existing account, which creates a Parse _Session
   *
   * @param {String} username
   * @param {String} password
   * @returns {Object} Contains logged in user's session token, first name,
   * and last name
   */
  static async loginUser(username, password) {
    // Log in user using Parse method
    const loginUser = await Parse.User.logIn(username, password);
    return {
      sessionToken: loginUser.getSessionToken(),
      firstName: loginUser.get("firstName"),
      lastName: loginUser.get("lastName"),
    };
  }

  /**
   * Logs out user by destroying their Parse _Session
   *
   * @param {String} sessionToken Corresponds to the session to destroy
   * @returns {Object} Contains message indicating successful logout
   */
  static async logoutUser(sessionToken) {
    // Get session by session token
    let query = new Parse.Query("_Session");
    query.equalTo("sessionToken", sessionToken);
    let sessionToDestroy = await query.first({ useMasterKey: true });

    // Destroy session
    sessionToDestroy.destroy({ useMasterKey: true });
    return { msg: "Logged Out" };
  }
}

module.exports = Authorization;
