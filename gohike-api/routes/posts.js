const express = require('express');
const router = express.Router();
const Posts = require('../models/posts');

router.post('/create', async (req, res) => {
    try {
        let sessionToken = req.body.sessionToken
        let hikeId = req.body.hikeId
        let caption = req.body.caption 
        let picture = req.body.picture 
        let newPost = await Posts.createPost(sessionToken, hikeId, caption, picture )

        res.status(201).json( { msg: newPost.msg } )
    } catch (err) {
        console.log(err)
        res.status(400).json( { msg: "Failed to create new post" } )
    }
})

router.get('/', async (req, res) => {
    try {
        let posts = await Posts.getAllPosts()
        res.status(201).json( { posts } )
    } catch {
        res.status(400).json( { msg: "Failed to get posts" } )
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