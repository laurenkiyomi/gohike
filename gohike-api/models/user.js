/**
 * @fileoverview This file is the User model in the GoHike app API. It is used 
 * to implement an User class and is called by the the User routing methods.
 */
require("dotenv").config();
var Parse = require('parse/node');
const { use } = require("../routes/user");
Parse.initialize(process.env.APP_ID, process.env.JS_KEY, process.env.MASTER_KEY)
Parse.serverURL = 'https://parseapi.back4app.com/'

/**
 * This class handles getting information about users in the Parse database, 
 * editing user information, user-to-user interactions, and user-to-post 
 * interactions.
 */
class User {
    constructor() {
        this.super();
    }

    /**
     * Gets information on a user based on their session token stored in 
     * local storage
     * 
     * @param {String} sessionToken Corresponds to the current user's session
     * @returns {Object} Contains information on user
     */
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

    /**
     * Get the hikes saved by a specified user
     * 
     * @param {String} username 
     * @returns {Array<Object>} Contains objects with the trail's name, id, 
     * type, summary, location, length, ascent, descent, condition status, high,
     * low, longitude, latitude, and picture
     */
    static async getSaved(username) {
        // Get User object from username
        let query = new Parse.Query("_User")
        query.equalTo("username", username)
        let user = await query.first({useMasterKey:true})

        // Get completed
        let saved = user.get("saved")

        if (saved == undefined || saved == null) {
            return []
        }

        // Push hike to savedRes if it is saved by the user
        let savedRes = []
        for (let i = 0; i < saved.length; i++) {
            let query2 = new Parse.Query("Trail")
            query2.equalTo("hikeId", saved[i])
            let addTrail = await query2.first({useMasterKey:true})

            // Get largest image available
            let img = ""
            if (addTrail.get("imgMedium") != "") {
                img = addTrail.get("imgMedium")
            } else if (addTrail.get("imgSmallMed") != "") {
                img = addTrail.get("imgSmallMed")
            } else if (addTrail.get("imgSmall") != "") {
                img = addTrail.get("imgSmall")
            } else if (addTrail.get("imgSqSmall") != "") {
                img = addTrail.get("imgSqSmall")
            }

            // Set important information for hike
            savedRes.push({ 
                id: addTrail.get("hikeId"), 
                name: addTrail.get("name"), 
                trail_type: addTrail.get("trail_type"), 
                summary: addTrail.get("summary"), 
                location: addTrail.get("location"), 
                length: addTrail.get("distance"), 
                ascent: addTrail.get("ascent"), 
                descent: addTrail.get("descent"), 
                conditionStatus: addTrail.get("conditionStatus"), 
                high: addTrail.get("high"), 
                low: addTrail.get("low"), 
                longitude: addTrail.get("longitude"), 
                latitude: addTrail.get("latitude"), 
                img
            })
        }

        return savedRes
    }

    /**
     * Get the hikes completed by a specified user
     * 
     * @param {String} username 
     * @returns {Array<Object>} Contains objects with the trail's name, id, 
     * type, summary, location, length, ascent, descent, condition status, high,
     * low, longitude, latitude, and picture
     */
    static async getCompleted(username) {
        // Get User object from username
        let query = new Parse.Query("_User")
        query.equalTo("username", username)
        let user = await query.first({useMasterKey:true})

        // Get completed
        let completed = user.get("completed")

        if (completed == undefined || completed == null) {
            return []
        }

        // Push hike to completedRes if it is saved by the user
        let completedRes = []
        for (let i = 0; i < completed.length; i++) {
            let query2 = new Parse.Query("Trail")
            query2.equalTo("hikeId", completed[i])
            let addTrail = await query2.first({useMasterKey:true})

            // Get largest image available
            let img = ""
            if (addTrail.get("imgMedium") != "") {
                img = addTrail.get("imgMedium")
            } else if (addTrail.get("imgSmallMed") != "") {
                img = addTrail.get("imgSmallMed")
            } else if (addTrail.get("imgSmall") != "") {
                img = addTrail.get("imgSmall")
            } else if (addTrail.get("imgSqSmall") != "") {
                img = addTrail.get("imgSqSmall")
            }

            // Set important information for hike
            completedRes.push({ 
                id: addTrail.get("hikeId"), 
                name: addTrail.get("name"), 
                trail_type: addTrail.get("trail_type"), 
                summary: addTrail.get("summary"), 
                location: addTrail.get("location"), 
                length: addTrail.get("distance"), 
                ascent: addTrail.get("ascent"), 
                descent: addTrail.get("descent"), 
                conditionStatus: addTrail.get("conditionStatus"), 
                high: addTrail.get("high"), 
                low: addTrail.get("low"), 
                longitude: addTrail.get("longitude"), 
                latitude: addTrail.get("latitude"), 
                img
            })
        }

        return completedRes
    }

    /**
     * Get all hikes saved and completed by a user
     * 
     * @param {String} username 
     * @returns {Object} Contains a saved array and completed array with the 
     * id's of saved and completed hikes respectively
     */
    static async getSavedAndCompleted(username) {
        // Get User object from username
        let query = new Parse.Query("_User")
        query.equalTo("username", username)
        let user = await query.first({useMasterKey:true})

        // Get saved and completed
        return { saved: user.get("saved"), completed: user.get("completed") }
    }

    /**
     * Get the posts made by a user
     * 
     * @param {String} sessionToken Corresponds to the current user
     * @returns {Array<Number>} Contains id's of posts created by current user
     */
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

    /**
     * Changes the profile picture of a user by editing corresponding Parse User
     * 
     * @param {String} sessionToken Corresponds to the current user
     * @param {String} picture URI of the picture to upload
     */
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

    /**
     * Changes cover picture of a user by editing the corresponding Parse User
     * 
     * @param {String} sessionToken Corresponds to the current user
     * @param {String} picture URI of the picture to upload
     */
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

    /**
     * Gets information on a user in order for the current user to view another 
     * user's profile
     * 
     * @param {String} username Corresponds to the user to get information on
     * @returns {Object} Contains information on corresponding user
     */
    static async getViewUserInfo(username) {
        // Get User object from username
        let query = new Parse.Query("_User")
        query.equalTo("username", username)
        let user = await query.first({useMasterKey:true})
        return user
    }

    /**
     * Gets the posts made by a specified user
     * 
     * @param {String} username Corresponds to the user whose posts are to get
     * @returns {Array<Number>} Contains id's of the posts created by 
     * corresponding user
     */
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

    /**
     * Sends a friend request from the current user to another user
     * 
     * @param {String} sessionToken Corresponds to the current user who's 
     * sending a friend request
     * @param {String} username Corresponds to user receiving the friend request
     * @returns {String} Message indicating success of sending friend request
     */
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

    /**
     * Accepts a friend request sent to the current user from another user
     * 
     * @param {String} sessionToken Corresponds to the current user accepting a
     * friend request
     * @param {String} username Corresponds to user who sent the friend request
     * @returns {String} Message indicating success of accepting friend request
     */
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

    /**
     * Declines a friend request sent to the current user from another user
     * 
     * @param {String} sessionToken Corresponds to the current user declining 
     * a friend request
     * @param {String} username Corresponds to user who sent the friend request
     * @returns {String} Message indicating success of declining friend request
     */
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
    
    /**
     * Adds a hike to the current user's saved array
     * 
     * @param {String} username Corresponds to the current user saving the hike
     * @param {Number} hikeId Id of the hike to save
     * @returns {Array<Number>} Contains the id's of the current user's saved 
     * hikes after addition of new hike
     */
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

    /**
     * Removes a hike from the current user's saved array
     * 
     * @param {String} username Corresponds to current user unsaving the hike
     * @param {Number} hikeId Id of the hike to unsave
     * @returns {Array<Number>} Contains the id's of the current user's saved 
     * hikes after removal of hike
     */
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

        // Set user's saved array to res and saves to Parse
        user.set("saved", res)
        await user.save(null, {useMasterKey:true})
            
        return res
    }

    /**
     * Adds a hike to the current user's completed array
     * 
     * @param {String} username Corresponds to current user completing the hike
     * @param {Number} hikeId Id of the hike to complete
     * @returns {Array<Number>} Contains the id's of the current user's 
     * completed hikes after addition of new hike
     */
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

    /**
     * Removes a hike from the current user's completed array
     * 
     * @param {String} username Corresponds to curr user uncompleting the hike
     * @param {Number} hikeId Id of the hike to complete
     * @returns {Array<Number>} Contains the id's of the current user's 
     * completed hikes after removal of hike
     */
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

        // Sets user's completed array to res and saves to Parse
        user.set("completed", res)
        await user.save(null, {useMasterKey:true})
            
        return res
    }


}

module.exports = User