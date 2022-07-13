const express = require('express');
const router = express.Router();
const Authorization = require('../models/authorization');
// require("dotenv").config();

// var Parse = require('parse/node');
// Parse.initialize(process.env.APP_ID, process.env.JS_KEY);
// Parse.serverURL = 'https://parseapi.back4app.com/'

router.post('/register', async (req, res) => {
    let infoUser = req.body;
    let firstName = infoUser.firstName
    let lastName = infoUser.lastName
    let age = infoUser.age
    let username = infoUser.username
    let password = infoUser.password
    let email = infoUser.email

    try {
        let sessionToken = await Authorization.createNewUser(firstName, lastName, age, username, password, email);
        res.status(201).json( { username: username, sessionToken, firstName, lastName } )
    }

    catch {
        res.status(400).json( { msg: "Failed to create new user" } )
    }
}) 

router.post('/login', async (req, res) => {
    let infoUser = req.body;
    let username = infoUser.username;
    let password = infoUser.password;
    
    try {
        let loginUser = await Authorization.loginUser(username, password)
        res.status(201).json( { username: username, sessionToken: loginUser.sessionToken, firstName: loginUser.firstName, lastName: loginUser.lastName } )
    } catch {
        res.status(400).json( { msg: "Failed to login user" } )
    }
})

router.post('/logout', async (req, res) => {
    try {
        let sessionToken = req.body.sessionToken       
        let logoutUser = await Authorization.logoutUser(sessionToken)
        
        res.status(201).json( { msg: logoutUser.msg } )
    } catch {
        res.status(400).json( { msg: "Failed to logout user" } )
    }
})

module.exports = router;