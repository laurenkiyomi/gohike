require("dotenv").config();
var Parse = require('parse/node');
const { use } = require("../routes/user");
Parse.initialize(process.env.APP_ID, process.env.JS_KEY, process.env.MASTER_KEY);
Parse.serverURL = 'https://parseapi.back4app.com/'

class User {
    constructor() {
        this.super();
    }

    static async getUserInfo(sessionToken) {
        // Get User pointer from sessionToken
        let query = new Parse.Query("_Session")
        query.equalTo("sessionToken", sessionToken)
        let session = await query.first({useMasterKey:true})

        // Get User object from sessionToken
        let query2 = new Parse.Query("_User")
        query2.equalTo("objectId", session.get("user").id)
        let user = await query2.first({useMasterKey:true})
        return user
    }

    static async getSavedAndCompleted(username) {
        // Get User object from username
        let query = new Parse.Query("_User")
        query.equalTo("username", username)
        let user = await query.first({useMasterKey:true})

        // Return saved and completed
        return { saved: user.get("saved"), completed: user.get("completed") }
    }

    static async getUserPosts(sessionToken) {
        // Get User id from sessionToken
        let query = new Parse.Query("_Session")
        query.equalTo("sessionToken", sessionToken)
        let session = await query.first({useMasterKey:true})
        let userId = session.get("user").id

        // Get user info
        let query2 = new Parse.Query("_User")
        query2.equalTo("objectId", userId)
        let user = await query2.first({useMasterKey:true})

        // Get all Post objects
        let query3 = new Parse.Query("Post")
        let posts = await query3.find({useMasterKey:true})
    
        // Create array with necessary info for each post
        let res = []
        for (let i = 0; i < posts.length; i++) {
            if (posts[i].get("user").id == userId) {
                res.push(posts[i].id)
            }
        }

        return res
    }

    static async changeProfilePicture(sessionToken, picture) {
        // Get User id from sessionToken
        let query = new Parse.Query("_Session")
        query.equalTo("sessionToken", sessionToken)
        let session = await query.first({useMasterKey:true})
        let userId = session.get("user").id

        // Get user info
        let query2 = new Parse.Query("_User")
        query2.equalTo("objectId", userId)
        let user = await query2.first({useMasterKey:true})

        // Set profile pic
        user.set("profilePic", picture)
        await user.save(null, {useMasterKey:true})
    }

    static async changeCoverPicture(sessionToken, picture) {
        // Get User id from sessionToken
        let query = new Parse.Query("_Session")
        query.equalTo("sessionToken", sessionToken)
        let session = await query.first({useMasterKey:true})
        let userId = session.get("user").id

        // Get user info
        let query2 = new Parse.Query("_User")
        query2.equalTo("objectId", userId)
        let user = await query2.first({useMasterKey:true})

        // Set profile pic
        user.set("coverPic", picture)
        await user.save(null, {useMasterKey:true})
    }

    static async getViewUserInfo(username) {
        // Get User object from username
        let query = new Parse.Query("_User")
        query.equalTo("username", username)
        let user = await query.first({useMasterKey:true})
        return user
    }

    static async getViewUserPosts(username) {
        // Get User info from username
        let query = new Parse.Query("_User")
        query.equalTo("username", username)
        let user = await query.first({useMasterKey:true})
        let userId = user.id
    
        // Get all Post objects
        let query2 = new Parse.Query("Post")
        let posts = await query2.find({useMasterKey:true})
    
        // Create array with necessary info for each post
        let res = []
        for (let i = 0; i < posts.length; i++) {
            if (posts[i].get("user").id == userId) {
                res.push(posts[i].id)
            }
        }

        return res
    }

    static async sendFriendRequest(sessionToken, username) {
        // Get User id from sessionToken
        let query = new Parse.Query("_Session")
        query.equalTo("sessionToken", sessionToken)
        let session = await query.first({useMasterKey:true})
        let userId = session.get("user").id

        // Get user info
        let query2 = new Parse.Query("_User")
        query2.equalTo("objectId", userId)
        let user = await query2.first({useMasterKey:true})

        // Add username to sentFriendRequests
        if (user.get("sentFriendRequests") == undefined) {
            user.set("sentFriendRequests", [username])
            await user.save(null, {useMasterKey:true})
        } else {
            let sent = user.get("sentFriendRequests")
            sent.push(username)
            user.set("sentFriendRequests", sent)
            await user.save(null, {useMasterKey:true})
        }

        // Get User object from username
        let query3 = new Parse.Query("_User")
        query3.equalTo("username", username)
        let user2 = await query3.first({useMasterKey:true})
        
        // Add user's username to incomingFriendRequests
        if (user2.get("incomingFriendRequests") == undefined) {
            user2.set("incomingFriendRequests", [user.get("username")])
            await user2.save(null, {useMasterKey:true})
        } else {
            let incoming = user2.get("incomingFriendRequests")
            incoming.push(user.get("username"))
            user2.set("incomingFriendRequests", incoming)
            await user2.save(null, {useMasterKey:true})
        }

        return "Sent friend request"
    }

    static async acceptFriendRequest(sessionToken, username) {
        // Get User id from sessionToken
        let query = new Parse.Query("_Session")
        query.equalTo("sessionToken", sessionToken)
        let session = await query.first({useMasterKey:true})
        let userId = session.get("user").id

        // Get user info
        let query2 = new Parse.Query("_User")
        query2.equalTo("objectId", userId)
        let user = await query2.first({useMasterKey:true})

        // Add username to friends
        if (user.get("friends") == undefined) {
            user.set("friends", [username])
            await user.save(null, {useMasterKey:true})
        } else {
            let friends = user.get("friends")
            friends.push(username)
            user.set("friends", friends)
            await user.save(null, {useMasterKey:true})
        }

        // Get User object from username
        let query3 = new Parse.Query("_User")
        query3.equalTo("username", username)
        let user2 = await query3.first({useMasterKey:true})
        
        // Add user's username to friends
        if (user2.get("friends") == undefined) {
            user2.set("friends", [user.get("username")])
            await user2.save(null, {useMasterKey:true})
        } else {
            let friends2 = user2.get("friends")
            friends2.push(user.get("username"))
            user2.set("friends", friends2)
            await user2.save(null, {useMasterKey:true})
        }

        // Remove username from incoming friend requests
        let incoming = user.get("incomingFriendRequests")
        let newIncoming = incoming.filter((value) => {
            return value != username
        })
        user.set("incomingFriendRequests", newIncoming)
        await user.save(null, {useMasterKey:true})

        // Remove user's username from user2's sent friend requests
        let sent = user2.get("sentFriendRequests")
        let newSent = sent.filter((value) => {
            return value != user.get("username")
        })
        user2.set("sentFriendRequests", newSent)
        await user2.save(null, {useMasterKey:true})

        return "Accepted friend request"
    }

    static async declineFriendRequest(sessionToken, username) {
        // Get User id from sessionToken
        let query = new Parse.Query("_Session")
        query.equalTo("sessionToken", sessionToken)
        let session = await query.first({useMasterKey:true})
        let userId = session.get("user").id

        // Get user info
        let query2 = new Parse.Query("_User")
        query2.equalTo("objectId", userId)
        let user = await query2.first({useMasterKey:true})

        // Get User object from username
        let query3 = new Parse.Query("_User")
        query3.equalTo("username", username)
        let user2 = await query3.first({useMasterKey:true})

        // Remove username from incoming friend requests
        let incoming = user.get("incomingFriendRequests")
        let newIncoming = incoming.filter((value) => {
            return value != username
        })
        user.set("incomingFriendRequests", newIncoming)
        await user.save(null, {useMasterKey:true})

        // Remove user's username from user2's sent friend requests
        let sent = user2.get("sentFriendRequests")
        let newSent = sent.filter((value) => {
            return value != user.get("username")
        })
        user2.set("sentFriendRequests", newSent)
        await user2.save(null, {useMasterKey:true})

        return "Declined friend request"
    }
    
    static async savePost(username, hikeId) {
        // Get User object from username
        let query = new Parse.Query("_User")
        query.equalTo("username", username)
        let user = await query.first({useMasterKey:true})
        let saved = user.get("saved")
        
        // Add hike to saved array
        if (saved == undefined || saved == null) {
            user.set("saved", [hikeId])
            await user.save(null, {useMasterKey:true})
            return [hikeId]
        } else {
            saved.push(hikeId)
            user.set("saved", saved)
            await user.save(null, {useMasterKey:true})
            return saved
        }
    }

    static async unsavePost(username, hikeId) {
        // Get User object from username
        let query = new Parse.Query("_User")
        query.equalTo("username", username)
        let user = await query.first({useMasterKey:true})
        let saved = user.get("saved")
        
        // Add hike to saved array if not hikeId
        let res = []
        for (let i = 0; i < saved.length; i++) {
            if (parseInt(saved[i]) != parseInt(hikeId)) {
                res.push(saved[i])
            }
        }

        user.set("saved", res)
            await user.save(null, {useMasterKey:true})
            
        return res
    }

    static async completePost(username, hikeId) {
        // Get User object from username
        let query = new Parse.Query("_User")
        query.equalTo("username", username)
        let user = await query.first({useMasterKey:true})
        let completed = user.get("completed")
        
        // Add hike to completed array
        if (completed == undefined || completed == null) {
            user.set("completed", [hikeId])
            await user.save(null, {useMasterKey:true})
            return [hikeId]
        } else {
            completed.push(hikeId)
            user.set("completed", completed)
            await user.save(null, {useMasterKey:true})
            return completed
        }
    }

    static async uncompletePost(username, hikeId) {
        // Get User object from username
        let query = new Parse.Query("_User")
        query.equalTo("username", username)
        let user = await query.first({useMasterKey:true})
        let completed = user.get("completed")
        
        // Add hike to completed array if not hikeId
        let res = []
        for (let i = 0; i < completed.length; i++) {
            if (parseInt(completed[i]) != parseInt(hikeId)) {
                res.push(completed[i])
            }
        }

        user.set("completed", res)
        await user.save(null, {useMasterKey:true})
            
        return res
    }


}

module.exports = User