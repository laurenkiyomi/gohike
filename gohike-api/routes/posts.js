const express = require('express');
const router = express.Router();
const Posts = require('../models/posts');

router.post('/create', async (req, res) => {
    try {
        let username = req.body.username
        let hikeId = req.body.hikeId
        let caption = req.body.caption  
        let newPost = await Posts.createPost(username, hikeId, caption)
        
        res.status(201).json( { msg: newPost.msg } )
    } catch (err){
        res.status(400).json( { msg:err } )
    }
})

module.exports = router;