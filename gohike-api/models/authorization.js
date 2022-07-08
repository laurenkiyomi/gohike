require("dotenv").config();
var Parse = require('parse/node');
Parse.initialize(process.env.APP_ID, process.env.JS_KEY, process.env.MASTER_KEY);
Parse.serverURL = 'https://parseapi.back4app.com/'

class Authorization {
    constructor() {
        this.super();
    }

    static async createNewUser(firstName, lastName, age, username, password, email ) {
        let user = new Parse.User();

        user.set("firstName", firstName);
        user.set("lastName", lastName);
        user.set("age", age);
        user.set("username", username);
        user.set("password", password);
        user.set("email", email);

        let newUser = await user.signUp();
        return newUser.getSessionToken()
    }

    static async loginUser(username, password) {
        const loginUser = await Parse.User.logIn(username, password)
        return loginUser.getSessionToken()
    }

    static async logoutUser(sessionToken) {
        // Get session by session token
        let query = new Parse.Query("_Session")
        query.equalTo("sessionToken", sessionToken)
        let sessionToDestroy = await query.first({useMasterKey:true})
        console.log("hii")
        sessionToDestroy.destroy({useMasterKey:true})
        return { msg: "Logged Out" }   
    }
}

module.exports = Authorization