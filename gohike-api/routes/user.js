const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/saved-completed/:username', async (req, res) => {
    try {
        var username = req.params.username
        let savedCompleted = await User.getSavedAndCompleted(username)
        res.status(201).json( savedCompleted )
    } catch (err) {
        console.log(err)
        res.status(400).json( { msg: "Failed to get saved and completed hikes" } )
    }
})

router.get('/saved/:username', async (req, res) => {
    try {
        var username = req.params.username
        let saved = await User.getSaved(username)
        res.status(201).json( { saved } )
    } catch (err) {
        console.log(err)
        res.status(400).json( { msg: "Failed to get saved hikes" } )
    }
})

router.get('/completed/:username', async (req, res) => {
    try {
        var username = req.params.username
        let completed = await User.getCompleted(username)
        res.status(201).json( { completed } )
    } catch (err) {
        console.log(err)
        res.status(400).json( { msg: "Failed to get completed hikes" } )
    }
})

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

router.put('/profilePhoto', async (req, res) => {
    try {
        let sessionToken = req.body.sessionToken
        let picture = req.body.picture

        await User.changeProfilePicture(sessionToken, picture)
        res.status(201).json( { msg: "Changed profile photo" } )
    } catch {
        res.status(400).json( { msg: "Failed to change profile photo" } )
    }

})

router.put('/coverPhoto', async (req, res) => {
    try {
        let sessionToken = req.body.sessionToken
        let picture = req.body.picture

        await User.changeCoverPicture(sessionToken, picture)
        res.status(201).json( { msg: "Changed cover photo" } )
    } catch {
        res.status(400).json( { msg: "Failed to change cover photo" } )
    }
})

router.get('/view/:username', async (req, res) => {
    try {
        const username = req.params.username
        let userData = await User.getViewUserInfo(username)
        res.status(201).json({ user: userData })
    } catch {
        res.status(400).json({ msg: "Could not retrieve user info." })
    }
    
})

router.get('/view/posts/:username', async (req, res) => {
    try {
        const username = req.params.username
        let posts = await User.getViewUserPosts(username)
        res.status(201).json({ posts })
    } catch {
        res.status(400).json({ msg: "Could not retrieve user posts." })
    }
    
})

router.put('/addFriend', async (req, res) => {
    try {
        const sessionToken = req.body.sessionToken
        const username = req.body.username
        await User.sendFriendRequest(sessionToken, username)
        res.status(201).json({ msg: "Sent friend request"})
    } catch {
        res.status(400).json({ msg: "Could not send friend request." })
    }
    
})

router.put('/acceptFriend', async (req, res) => {
    try {
        const sessionToken = req.body.sessionToken
        const username = req.body.username
        await User.acceptFriendRequest(sessionToken, username)
        res.status(201).json({ msg: "Accepted friend request"})
    } catch {
        res.status(400).json({ msg: "Could not accept friend request." })
    } 
})

router.put('/declineFriend', async (req, res) => {
    try {
        const sessionToken = req.body.sessionToken
        const username = req.body.username
        await User.declineFriendRequest(sessionToken, username)
        res.status(201).json({ msg: "Declined friend request"})
    } catch {
        res.status(400).json({ msg: "Could not decline friend request." })
    } 
})

router.put('/save', async (req, res) => {
    try {
        let username = req.body.username
        let hikeId = req.body.hikeId

        let saved = await User.savePost(username, hikeId)
        res.status(201).json( { saved } )
    } catch (err) {
        console.log(err)
        res.status(400).json( { msg: "Failed to save hike" } )
    }

})

router.put('/unsave', async (req, res) => {
    try {
        let username = req.body.username
        let hikeId = req.body.hikeId

        let saved = await User.unsavePost(username, hikeId)
        res.status(201).json( { saved } )
    } catch (err) {
        console.log(err)
        res.status(400).json( { msg: "Failed to unsave hike" } )
    }

})

router.put('/complete', async (req, res) => {
    try {
        let username = req.body.username
        let hikeId = req.body.hikeId

        let completed = await User.completePost(username, hikeId)
        res.status(201).json( { completed } )
    } catch (err) {
        console.log(err)
        res.status(400).json( { msg: "Failed to complete hike" } )
    }
})

router.put('/uncomplete', async (req, res) => {
    try {
        let username = req.body.username
        let hikeId = req.body.hikeId

        let completed = await User.uncompletePost(username, hikeId)
        res.status(201).json( { completed } )
    } catch (err) {
        console.log(err)
        res.status(400).json( { msg: "Failed to uncomplete hike" } )
    }
})

module.exports = router;