/**
 * @fileoverview This file contains the Posts routing methods for the GoHike app API. It handles creation of and interaction with posts by calling on an instance of the Posts class in the models directory.
 */
const express = require('express');
const router = express.Router();
const Posts = require('../models/posts');

/**
 * Post request for creating a new post and saving post to Parse
 */
router.post('/create', async (req, res) => {
    try {
        // Gets post info from req.body
        let sessionToken = req.body.sessionToken
        let hikeId = req.body.hikeId
        let caption = req.body.caption 
        let picture = req.body.picture 
        // Creates post by calling Posts method
        let newPost = await Posts.createPost(sessionToken, hikeId, 
            caption, picture )

        res.status(201).json( { msg: newPost.msg } )
    } catch (err) {
        console.log(err)
        res.status(400).json( { msg: "Failed to create new post" } )
    }
})

/**
 * Get request for getting all posts in the Parse database
 */
router.get('/', async (req, res) => {
    try {
        // Gets all posts by calling Posts method
        let posts = await Posts.getAllPosts()
        res.status(201).json( { posts } )
    } catch {
        res.status(400).json( { msg: "Failed to get posts" } )
    }
})

/**
 * Get request for getting the likes array of a post based on its postId
 */
router.get('/likes', async (req, res) => {
    try {
        let postId = req.body.postId

        // Gets likes by calling Posts method
        let likes = await Posts.getLikes(postId)
        res.status(201).json( { likes } )
    } catch (err) {
        console.log(err)
        res.status(400).json( { msg: "Failed to get post's likes" } )
    }

})

/**
 * Get request for getting posts from friends of the current user based on their 
 * session token
 */
router.get('/friends/:sessionToken', async (req, res) => {
    try {
        let sessionToken = req.params.sessionToken
        // Gets likes array by calling Posts method
        let posts = await Posts.getFriendPosts(sessionToken)
        res.status(201).json( { posts } )
    } catch {
        res.status(400).json( { msg: "Failed to get friends' posts" } )
    }
})

/**
 * Get request for getting information on a post based on its id
 */
router.get('/:postId', async (req, res) => {
    try {
        let postId = req.params.postId
        // Gets information on post by calling Posts method
        let post = await Posts.getPost(postId)
        res.status(201).json( { post } )
    } catch (err) {
        console.log(err)
        res.status(400).json( { msg: "Failed to get post by id" } )
    }
})

/**
 * Put request for liking a post
 */
router.put('/like', async (req, res) => {
    try {
        // Gets username of user who is liking the post
        let username = req.body.username
        let postId = req.body.postId

        // Likes post by calling Posts method
        let likedPost = await Posts.likePost(username, postId)
        res.status(201).json( { msg: likedPost.msg } )
    } catch (err) {
        console.log(err)
        res.status(400).json( { msg: "Failed to like post" } )
    }

})

/**
 * Put request for unliking a post
 */
router.put('/unlike', async (req, res) => {
    try {
        // Gets username of user who is unliking a post
        let username = req.body.username
        let postId = req.body.postId

        // Unlikes post by calling Posts method
        let unlikedPost = await Posts.unlikePost(username, postId)
        res.status(201).json( { msg: unlikedPost.msg } )
    } catch (err) {
        console.log(err)
        res.status(400).json( { msg: "Failed to like post" } )
    }

})

module.exports = router;