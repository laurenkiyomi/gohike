require("dotenv").config();
var Parse = require('parse/node');
Parse.initialize(process.env.APP_ID, process.env.JS_KEY);
Parse.serverURL = 'https://parseapi.back4app.com/'

class Authorization {
    constructor() {
        this.super();
    }

    static async createNewUser(firstName, lastName, age, username, password, email, ) {
        let user = new Parse.User();

        user.set("firstName", firstName);
        user.set("lastName", lastName);
        user.set("age", age);
        user.set("username", username);
        user.set("password", password);
        user.set("email", email);

        let newUser = await user.signUp();
        return { id: newUser.id }
    }

    static async loginUser(username, password) {
        Parse.User.enableUnsafeCurrentUser()
        const loginUser = await Parse.User.logIn(username, password)

        return { id: loginUser.id }
    }

    static async logoutUser() {
        
        Parse.User.enableUnsafeCurrentUser()
        await Parse.User.logOut()
        return { msg: "Logged Out" }   
    }

    static getCurrUser() {
        Parse.User.enableUnsafeCurrentUser()
        let currUser = Parse.User.current()
        return currUser
    }
}

module.exports = Authorization