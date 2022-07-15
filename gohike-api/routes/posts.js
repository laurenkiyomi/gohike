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

router.get('/likes', async (req, res) => {
    try {
        let postId = req.body.postId

        let likes = await Posts.getLikes(postId)
        res.status(201).json( { likes } )
    } catch (err) {
        console.log(err)
        res.status(400).json( { msg: "Failed to get post's likes" } )
    }

})

router.get('/friends/:sessionToken', async (req, res) => {
    try {
        let sessionToken = req.params.sessionToken
        let posts = await Posts.getFriendPosts(sessionToken)
        res.status(201).json( { posts } )
    } catch {
        res.status(400).json( { msg: "Failed to get friends' posts" } )
    }
})

router.get('/:postId', async (req, res) => {
    try {
        let postId = req.params.postId
        let post = await Posts.getPost(postId)
        res.status(201).json( { post } )
    } catch (err) {
        console.log(err)
        res.status(400).json( { msg: "Failed to get post by id" } )
    }
})

router.put('/like', async (req, res) => {
    try {
        let username = req.body.username
        let postId = req.body.postId

        let likedPost = await Posts.likePost(username, postId)
        res.status(201).json( { msg: likedPost.msg } )
    } catch (err) {
        console.log(err)
        res.status(400).json( { msg: "Failed to like post" } )
    }

})

router.put('/unlike', async (req, res) => {
    try {
        let username = req.body.username
        let postId = req.body.postId

        let unlikedPost = await Posts.unlikePost(username, postId)
        res.status(201).json( { msg: unlikedPost.msg } )
    } catch (err) {
        console.log(err)
        res.status(400).json( { msg: "Failed to like post" } )
    }

})

module.exports = router;