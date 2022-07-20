require("dotenv").config();
var Parse = require('parse/node');
Parse.initialize(process.env.APP_ID, process.env.JS_KEY, process.env.MASTER_KEY);
Parse.serverURL = 'https://parseapi.back4app.com/'
const { parse } = require("path");
const { post } = require("../routes/authorization");

class Posts {
    constructor() {
        this.super();
    }

    static async createPost(sessionToken, hikeId, caption, picture) {
        // Get User object from sessionToken
        let query = new Parse.Query("_Session")
        query.equalTo("sessionToken", sessionToken)
        let session = await query.first({useMasterKey:true})
        let user = session.get("user")

        // Get Trail object from trailId
        let query2 = new Parse.Query("Trail")
        query2.equalTo("hikeId", hikeId)
        let trail = await query2.first({useMasterKey:true})

        // Get User object from username
        let query3 = new Parse.Query("_User")
        query3.equalTo("objectId", user.id)
        let userObject = await query3.first({useMasterKey:true})
              
        // Create Parse file from picture
        // const file = new Parse.File('image.jpeg', {base64: picture})
        // await file.save()

        let newPost = new Parse.Object("Post", { username: userObject.get("username"), user, hikeId, caption, trailName: trail.get("name"), trail, picture  })
        await newPost.save()

        return { msg: "Created new post" }
    }

    static async getFriendPosts(sessionToken) {
        // Get User pointer from sessionToken
        let query = new Parse.Query("_Session")
        query.equalTo("sessionToken", sessionToken)
        let session = await query.first({useMasterKey:true})
        let userId = session.get("user").id

        // Get User object's friends from user pointer
        let query4 = new Parse.Query("_User")
        query4.equalTo("objectId", userId)
        let user = await query4.first({useMasterKey:true})
        let friends = user.get("friends")

        // Return empty array if user has no friends
        if (friends == undefined || friends.length == 0) {
            return []
        }

        let posts =[]
        for (let i = 0; i < friends.length; i++) {
            let query3 = new Parse.Query("_User")
            query3.descending("createdAt")
            query3.equalTo("username", friends[i])
            let friend = await query3.first({useMasterKey:true})

            if (friend.get("posts") != null && friend.get("posts") != undefined) {
                posts = posts.concat(friend.get("posts"))
            }
        }

        return posts
    }
 
    static async getAllPosts() {
        // Get all Post objects
        let query = new Parse.Query("Post")
        query.descending("createdAt")
        let posts = await query.find({useMasterKey:true})

        let res = []
        for (let i = 0; i < posts.length; i++) {
            res.push(posts[i].id)
        }

        return res
    }

    static async getPost(postId) {
        let query = new Parse.Query("Post")
        query.equalTo("objectId", postId)
        let post = await query.first({useMasterKey:true})

        let likes
        if (post.get("likes") == undefined || post.get("likes") == null) {
            likes = []
        } else {
            likes = post.get("likes")
        }
     
        return ({ username: post.get("username"), trailName: post.get("trailName"), hikeId: post.get("hikeId"), caption: post.get("caption"), createdAt: post.get("createdAt"), picture: post.get("picture"), likes })
    }

    static async likePost(username, postId) {
        // Get Post object from postId
        let query = new Parse.Query("Post")
        query.equalTo("objectId", postId)
        let post = await query.first({useMasterKey:true})
        let likes = post.get("likes")
        
        // Add user to likes array
        if (likes == undefined || likes == null) {
            post.set("likes", [username])
            await post.save()
        } else {
            likes.push(username)
            post.set("likes", likes)
            await post.save();
        }

        return { msg: "Liked post" }
    }

    static async unlikePost(username, postId) {
        // Get Post object from postId
        let query = new Parse.Query("Post")
        query.equalTo("objectId", postId)
        let post = await query.first({useMasterKey:true})
        let likes = post.get("likes")
        
        // Remove user from likes array
        let res = []
        for (let i = 0; i < likes.length; i++) {
            if (likes[i] != username) {
                res.push(likes[i])
            }
        }
        
        // Set likes to res
        post.set("likes", res)
        await post.save();
        return { msg: "Unliked post" }
    }

    static async getLikes(postId) {
        // Get Post object from postId
        let query = new Parse.Query("Post")
        query.equalTo("objectId", postId)
        let post = await query.first({useMasterKey:true})
        let likes = post.get("likes")

        if (likes == undefined || likes == null) {
            return []
        } else {
            return likes
        }
    }
}

module.exports = Posts