const express = require('express');
const router = express.Router();
const Posts = require('../models/posts');

router.post('/create', async (req, res) => {
    try {
        let sessionToken = req.body.sessionToken
        let hikeId = req.body.hikeId
        let caption = req.body.caption  
        let newPost = await Posts.createPost(sessionToken, hikeId, caption )
        
        res.status(201).json( { msg: newPost.msg } )
    } catch (err) {
        console.log(err)
        res.status(400).json( { msg: "Failed to create new post" } )
    }
})

router.get('/getPost', async (req, res) => {
    try {
        let id = req.body.postId
        let pic = await Posts.getPost(id)
        res.status(201).json( { pic: pic } )
    } catch {
        res.status(400).json( { msg: "Failed to get post" } )
    }
})

router.put('/like', async (req, res) => {
    try {
        let sessionToken = req.body.sessionToken
        let postId = req.body.postId

        let likedPost = await Posts.likePost(sessionToken, postId)
        res.status(201).json( { msg: likedPost.msg } )
    } catch {
        res.status(400).json( { msg: "Failed to like post" } )
    }

})

module.exports = router;