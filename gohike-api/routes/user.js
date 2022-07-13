const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/:sessionToken', async (req, res) => {
    try {
        const sessionToken = req.params.sessionToken
        let userData = await User.getUserInfo(sessionToken)
        res.status(201).json({ user: userData })
    } catch {
        res.status(400).json({ msg: "Could not retrieve user info." })
    }
    
})

router.get('/posts/:sessionToken', async (req, res) => {
    try {
        const sessionToken = req.params.sessionToken
        let posts = await User.getUserPosts(sessionToken)
        res.status(201).json({ posts })
    } catch (err){
        console.log(err)
        res.status(400).json({ msg: "Could not retrieve user posts." })
    }
    
})

module.exports = router;